import { getCleanDateTime, loadFromLocalStorage } from '../client-api/tools.js';
import { keepAuthenticate } from '../client-api/user_api.js';

import { askGenerateExperimentalQuestions } from '../client-api/math_api.js';

import { askPredict } from '../client-api/model_api.js';



let startTime; //starting time when questions are loaded

let mSessionIdentifier;
let questionJsonList;

let currentLine = 0;
let numberOfLines;

let totalDuration = 0;

const linesContainerElement = document.getElementById('linesContainer');


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Start drawing
canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

// Drawing on canvas
canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        ctx.lineWidth = 10;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    drawing = false;
});



function prepareTextContent(item) {
    //Add () to negative numbers
    const fLOpe = item.leftOperation < 0 ? `(${item.leftOperation})` : `${item.leftOperation}`;
    const fROpe = item.rightOperation < 0 ? `(${item.rightOperation})` : `${item.rightOperation}`;

    return `${fLOpe} ${item.mathOperation} ${fROpe} = `;
}


function generateExerciseDiv(questionJsonList) {
    for (let i = 0; i < questionJsonList.length; i++) {
        const item = questionJsonList[i];
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line';
        lineDiv.tabIndex = 0; // Make it focusable
        lineDiv.id = `line${i}`;

        const operationsSpan = document.createElement('span');

        operationsSpan.textContent = prepareTextContent(item);
        lineDiv.appendChild(operationsSpan);

        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
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


// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// Predict number
document.getElementById('predict').addEventListener('click', async () => {
    const dataURL = canvas.toDataURL('image/png');
    prediction = await askPredict(dataURL);
    console.log(prediction)

    let currentQuestion = questionJsonList[currentLine]
    if (handleResult(prediction, currentQuestion)) { linesContainerElement.children[currentLine].classList.add('isCorrect'); }
    else { linesContainerElement.children[currentLine].classList.add('isIncorrect'); }

    linesContainerElement.children[currentLine].classList.remove('current');
    linesContainerElement.children[currentLine].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentLine++;

    if (currentLine == numberOfLines) {
        handleEndOfSession();
    } else {
        linesContainerElement.children[currentLine].classList.add('current');
    }
    
});



await keepAuthenticate();


questionJsonList = await askGenerateExperimentalQuestions()

console.log("[exercise onload] question list: " + JSON.stringify(questionJsonList))

generateExerciseDiv(questionJsonList)

numberOfLines = questionJsonList.length;
linesContainerElement.children[currentLine].classList.add('current');
startTime = new Date();