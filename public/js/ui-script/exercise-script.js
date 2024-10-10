import {
    getCurrentDateTime, displayNumber, clearAnswers,
    loadParamsFromLocalStorage, randomNumber, loadOperationList,
    randomOperation, getCorrectResult, createAnswer, askGenerateQuestions, insertAllAnswers
} from '../client-api/utils.js';


import { keepAuthenticate } from '../client-api/auth_api.js';


let correctResult;  // Global variable to store the correct answer
let startTime; //starting time when questions are loaded

let leftValue = 0;
let rightValue = 0;
let operationList = [];
let operation = "";
let localStorageParametersJson;
let questionJsonList;

let numberOfLines; // Variable to dictate how many lines to display

const linesContainerElement = document.getElementById('linesContainer');
const answerInputTextArea = document.getElementById('answer-input');
let currentLine = 0;



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
        //Write the answer in div
        const currentLineDiv = document.getElementById(`line${currentLine}`);
        currentLineDiv.textContent += answerInputTextArea.value;

        if( handleResult(answerInputTextArea.value, questionJsonList))
            {linesContainerElement.children[currentLine].classList.add('isCorrect');}
        else{linesContainerElement.children[currentLine].classList.add('isIncorrect');}
        linesContainerElement.children[currentLine].classList.remove('current');

        linesContainerElement.children[currentLine].scrollIntoView({ behavior: 'smooth', block: 'start' });
        currentLine++;

        if (currentLine == numberOfLines) {
            questionJsonList.forEach((item) => {
                item.mSessionIdentifier = localStorageParametersJson.mSessionIdentifier;
            });
            
            console.log("**** FINISHED ****")
            console.log(questionJsonList)

            insertAllAnswers(questionJsonList)
        }else{
            linesContainerElement.children[currentLine].classList.add('current');

        }
        answerInputTextArea.value = '';
        answerInputTextArea.focus();        
    }
});


window.onload = async () => {
    localStorageParametersJson = loadParamsFromLocalStorage();

    
    console.log("localStorageParametersJson : " + JSON.stringify(localStorageParametersJson))
    questionJsonList = await askGenerateQuestions(localStorageParametersJson)

    console.log("FRONT questionJsonList : " + JSON.stringify(questionJsonList))
    generateExerciseDiv(questionJsonList)

    numberOfLines = localStorageParametersJson.mMaxAnswerCount;
    answerInputTextArea.focus()
    linesContainerElement.children[currentLine].classList.add('current');
    startTime = new Date();

};
