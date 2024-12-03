import { getCleanDateTime, loadFromLocalStorage } from '../client-api/tools.js';
import { keepAuthenticate } from '../client-api/user_api.js';

import { askGenerateQuestions, insertAllAnswers, askGenerateExperimentalQuestions } from '../client-api/math_api.js';

import { askPredict } from '../client-api/model_api.js';



let startTime; //starting time when questions are loaded

let mSessionIdentifier;
let mParametersIdentifier;
let questionJsonList;

let currentLine = 0;
let numberOfLines;

let totalDuration = 0;

const linesContainerElement = document.getElementById('linesContainer');



function generateExerciseDiv(questionJsonList) {
    for (let i = 0; i < questionJsonList.length; i++) {
        const item = questionJsonList[i];
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line';
        lineDiv.tabIndex = 0; // Make it focusable
        lineDiv.id = `line${i}`;

        const operationsSpan = document.createElement('span');
        operationsSpan.textContent = `${item.leftOperation} ${item.mathOperation} ${item.rightOperation} = `;
        lineDiv.appendChild(operationsSpan);

        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        //answerDiv.textContent = '____ (Duration: __ seconds)';
        lineDiv.appendChild(answerDiv);

        linesContainerElement.appendChild(lineDiv);
    }
}



//Adds the answer, isCorrect, qTime and qDate into the json
//Return isCorrect
function handleResult(userAnswer, currentQuestion) {
    currentQuestion.qAnswer = userAnswer;
    currentQuestion.isCorrect = (userAnswer == currentQuestion.qResult);

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    currentQuestion.qTime = timeTaken;
    currentQuestion.qDate = getCleanDateTime(new Date());
    totalDuration += timeTaken;

    handleViewResult(currentQuestion.qAnswer, currentQuestion.qResult, currentQuestion.qTime);

    startTime = new Date();
    return currentQuestion.isCorrect;
}

function handleViewResult(userAnswer, actualResult, duration) {
    //Write the answer in div
    const currentLineDiv = document.getElementById(`line${currentLine}`);
    const operationsSpan = currentLineDiv.querySelector('span');
    operationsSpan.textContent += userAnswer;

    const answerDiv = currentLineDiv.querySelector('div');
    answerDiv.textContent = 'Correct answer : ' + actualResult + ' | Time taken : ' + duration + 's';

}

// Check if number is correct
function inputIsCorrect(answerValue) {
    let minusCount = (answerValue.match(/-/g) || []).length;
    let dotCount = (answerValue.match(/\./g) || []).length;
    if (minusCount > 1 || (minusCount === 1 && answerValue.indexOf('-') !== 0) || dotCount > 1 || isNaN(parseFloat(answerValue))) {
        errorMessageElement.textContent = 'Invalid input! Only one "-" and one "." allowed.';
        errorMessageElement.style.visibility = 'visible';
        return false;
    }
    return true;
}

function formattedValue(answerValue) {
    // Remove unnecessary leading zeros and trailing zeros
    answerValue = answerValue.replace(/^0+(?=\d)/, ''); // Remove leading zeros
    answerValue = answerValue.replace(/(\.\d*?[1-9])0+$/, '$1'); // Remove trailing zeros after decimal point
    answerValue = answerValue.replace(/(\.0+)$/, '.'); // Remove .0
    return answerValue
}

function handleEndOfSession() {
    // Insert the sessionIdentifier to each items of the json
    questionJsonList.forEach((item) => {
        item.mSessionIdentifier = mSessionIdentifier;;
    });

    // Make each answer div visible
    const answerDivs = linesContainerElement.querySelectorAll('.answer');
    answerDivs.forEach(answerDiv => {
        answerDiv.style.visibility = 'visible';
        answerDiv.style.opacity = '1';
    });

    //Show Dashboard button
    document.getElementById('dashboardButton').style.visibility = 'visible';

    //Allow scrolling on the container
    linesContainerElement.style.overflowY = 'auto';

    //Show total duration message
    const totalDurationMessage = document.getElementById('totalDurationMessage');
    totalDurationMessage.style.display = 'block'; // Change to 'block' to make it visible
    totalDurationMessage.textContent = 'Total duration : ' + Number(totalDuration.toFixed(3)) + 's';

}


let prediction;

// Predict number
document.getElementById('predict').addEventListener('click', async () => {
    const dataURL = canvas.toDataURL('image/png');
    prediction = await askPredict(dataURL);
    console.log(prediction)
    
    
    if (inputIsCorrect(prediction)) {
        let currentQuestion = questionJsonList[currentLine]
        if (handleResult(prediction, currentQuestion)) { linesContainerElement.children[currentLine].classList.add('isCorrect'); }
        else { linesContainerElement.children[currentLine].classList.add('isIncorrect'); }

        linesContainerElement.children[currentLine].classList.remove('current');
        linesContainerElement.children[currentLine].scrollIntoView({ behavior: 'smooth', block: 'start' });

        currentLine++;

        if (currentLine == numberOfLines) {
            handleEndOfSession();
        } else {
            linesContainerElement.children[currentLine].classList.add('current');
        }

    }
});



await keepAuthenticate();


questionJsonList = await askGenerateExperimentalQuestions()

console.log("[exercise onload] question list: " + JSON.stringify(questionJsonList))

generateExerciseDiv(questionJsonList)

numberOfLines = questionJsonList.length;
linesContainerElement.children[currentLine].classList.add('current');
startTime = new Date();