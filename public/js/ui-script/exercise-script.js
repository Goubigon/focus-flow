import {
    getCurrentDateTime,
    loadFromLocalStorage,
    askGenerateQuestions, insertAllAnswers
} from '../client-api/utils.js';

import { keepAuthenticate } from '../client-api/auth_api.js';


let startTime; //starting time when questions are loaded

let localStorageParametersJson;
let questionJsonList;

let currentLine = 0;
let numberOfLines;

const linesContainerElement = document.getElementById('linesContainer');
const answerInputTextArea = document.getElementById('answer-input');
const errorMessageElement = document.getElementById('errorMessage');



function generateExerciseDiv(questionJsonList) {
    for (let i = 0; i < questionJsonList.length; i++) {
        const item = questionJsonList[i];
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line';
        lineDiv.tabIndex = 0; // Make it focusable
        lineDiv.id = `line${i}`;
        lineDiv.textContent = item.leftOperation + ' ' + item.mathOperation + ' ' + item.rightOperation + ' = ';
        linesContainerElement.appendChild(lineDiv);
    }
}



//Adds the answer, isCorrect, qTime and qDate into the json
//Return isCorrect
function handleResult(userAnswer, questionJsonList) {
    questionJsonList[currentLine].qAnswer = userAnswer;
    questionJsonList[currentLine].isCorrect = (userAnswer == questionJsonList[currentLine].qResult);

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

    questionJsonList[currentLine].qTime = timeTaken;
    questionJsonList[currentLine].qDate = getCurrentDateTime();

    startTime = new Date();

    return userAnswer == questionJsonList[currentLine].qResult;
}

// Event listener for answering a line (using Enter key)
answerInputTextArea.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        let minusCount = (answerInputTextArea.value.match(/-/g) || []).length;
        let dotCount = (answerInputTextArea.value.match(/\./g) || []).length;
        if (minusCount > 1 || (minusCount === 1 && answerInputTextArea.value.indexOf('-') !== 0) || dotCount > 1) {
            errorMessageElement.textContent = 'Invalid input! Only one "-" and one "." allowed.';
            errorMessageElement.style.visibility = 'visible';
        }
        else {
            let answerValueFloat = parseFloat(answerInputTextArea.value)

            if (!isNaN(parseFloat(answerValueFloat)) && answerValueFloat !== '') {

                // Remove unnecessary leading zeros and trailing zeros
                answerInputTextArea.value = answerInputTextArea.value.replace(/^0+(?=\d)/, ''); // Remove leading zeros
                answerInputTextArea.value = answerInputTextArea.value.replace(/(\.\d*?[1-9])0+$/, '$1'); // Remove trailing zeros after decimal point
                answerInputTextArea.value = answerInputTextArea.value.replace(/(\.0+)$/, '.'); // Remove .0

                //Write the answer in div
                const currentLineDiv = document.getElementById(`line${currentLine}`);
                currentLineDiv.textContent += answerValueFloat;

                if (handleResult(answerValueFloat, questionJsonList)) { linesContainerElement.children[currentLine].classList.add('isCorrect'); }
                else { linesContainerElement.children[currentLine].classList.add('isIncorrect'); }
                linesContainerElement.children[currentLine].classList.remove('current');

                linesContainerElement.children[currentLine].scrollIntoView({ behavior: 'smooth', block: 'start' });
                currentLine++;

                if (currentLine == numberOfLines) {
                    questionJsonList.forEach((item) => {
                        item.mSessionIdentifier = localStorageParametersJson.mSessionIdentifier;
                    });
                    insertAllAnswers(questionJsonList)
                    setTimeout(() => { window.location.href = '/dashboard' }, 500);
                    
                } else {
                    linesContainerElement.children[currentLine].classList.add('current');

                }
            }
        }
        answerInputTextArea.value = '';
        answerInputTextArea.focus();
    }
});


answerInputTextArea.addEventListener('input', function (e) {
    const errorMessage = document.getElementById('errorMessage');
    let value = e.target.value;

    // Remove any character that is not a digit, '.', or '-' 
    value = value.replace(/[^0-9.-]/g, '');
    
    errorMessageElement.innerHTML = '';

    e.target.value = value;
});




window.onload = async () => {
    keepAuthenticate()
    
    const mParametersIdentifier = loadFromLocalStorage('mParametersIdentifier');
    questionJsonList = await askGenerateQuestions(mParametersIdentifier)
    console.log("[exercise onload] question list: " + JSON.stringify(questionJsonList))

    generateExerciseDiv(questionJsonList)

    numberOfLines = questionJsonList.length;
    answerInputTextArea.focus()
    linesContainerElement.children[currentLine].classList.add('current');
    startTime = new Date();
};
