import {
    getCurrentDateTime, displayNumber, clearAnswers,
    loadParameters, randomNumber, loadOperationList,
    randomOperation, getCorrectResult, createAnswer
} from '../client-api/utils.js';

import { keepAuthenticate } from '../client-api/auth.js';

let correctResult;  // Global variable to store the correct answer
let startTime; //starting time when questions are loaded

//TODO rename to left & right values
let value1 = 0;
let value2 = 0;
let operationList = [];
let operation = "";
let formData;


const exSubmitButton = document.getElementById('exSubmitButton');


//generates the numbers and the operation on exercise.html
function generateExercise() {

    //values between min and max
    value1 = randomNumber(formData.minNumber, formData.maxNumber);
    value2 = randomNumber(formData.minNumber, formData.maxNumber);

    displayNumber('value1', value1);
    displayNumber('value2', value2);

    operation = randomOperation(operationList)
    //select a random operation from the list
    document.getElementById('randomOperation').textContent = operation;

    // Calculate the correct answer based on the operation
    correctResult = getCorrectResult(value1, value2, operation);

    clearAnswers()

    // Start the timer by recording the current time
    startTime = new Date();
}




// When pressing Submit or Enter.key
exSubmitButton.addEventListener('click', async (event) => {
    //get user's answer
    const userAnswer = parseFloat(document.getElementById('userAnswer').value);

    // Calculate time taken
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

    handleSubmission(userAnswer, timeTaken)
});


function handleSubmission(userAnswer, timeTaken) {
    //display feedback to user
    const feedbackElement = document.getElementById('feedback');

    if (isNaN(userAnswer)) {
        feedbackElement.textContent = "Please enter a valid number.";
        feedbackElement.style.color = 'orange';  // Set color for invalid input
    } else {
        if (userAnswer === correctResult) {
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.style.color = 'green';  // Set color for correct answer
            setTimeout(generateExercise, 1000);
            document.getElementById('timeTaken').textContent = `Time taken: ${timeTaken.toFixed(2)} seconds`;
        } else {
            feedbackElement.textContent = `Incorrect. The correct answer was ${correctResult}.`;
            feedbackElement.style.color = 'red';  // Set color for incorrect answer
            setTimeout(generateExercise, 4000);
            document.getElementById('timeTaken').textContent = `Time taken: ${timeTaken.toFixed(2)} seconds`;
        }

        createAnswer(value1, operation, value2,
            correctResult, userAnswer, userAnswer == correctResult,
            timeTaken, getCurrentDateTime(),
            formData.minNumber, formData.maxNumber, formData.floatNumber, formData.nNumber,
            formData.additionCheck, formData.subtractionCheck, formData.multiplicationCheck
        )
    }
}

//Pressing the 'Enter' key also submit the answer
function setupEnterKeyListener() {
    const inputField = document.getElementById('userAnswer');
    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            exSubmitButton.click();
        }
    });
}


// When the windows page loads
// Call the function to generate random numbers 
window.onload = function () {
    keepAuthenticate()
    formData = loadParameters();
    operationList = loadOperationList(formData);
    generateExercise();
    setupEnterKeyListener();  // Add this line to set up the Enter key listener
};