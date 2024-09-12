let correctAnswer;  // Global variable to store the correct answer
const delayTime = 1000; // Delay time in milliseconds (e.g., 3000ms = 3 seconds)
const incorrectDelayTime = 4000;
let isCorrect;
let startTime; //starting time when questions are loaded


//generates the numbers, the operation
function generateExercise() {

    const formDataString = localStorage.getItem('formData');
    console.log(Math.floor(Math.random()*10)+1)

    if (formDataString) {
        const formData = JSON.parse(formDataString);

        // Now you can use formData in this script
        console.log(formData);

        console.log('Successfully parsed data json');

        const value1 = Math.floor(Math.random() * (formData.maxNumber - formData.minNumber + 1)) + formData.minNumber; 
        const value2 = Math.floor(Math.random() * (formData.maxNumber - formData.minNumber + 1)) + formData.minNumber;


        if (value1 < 0) {
            document.getElementById('value1').textContent = `(${value1})`;
        } else {
            document.getElementById('value1').textContent = value1;
        }

        if (value2 < 0) {
            document.getElementById('value2').textContent = `(${value2})`;
        } else {
            document.getElementById('value2').textContent = value2;
        }

        

        //document.getElementById('value1').textContent = value1;
        //document.getElementById('value2').textContent = value2;

        const operations = ["+", "-", "x"];
        const randomIndex = Math.floor(Math.random() * operations.length);
        const operation = operations[randomIndex];
        document.getElementById('randomOperation').textContent = operation;

        // Calculate the correct answer based on the operation
        if (operation === "+") {
            correctAnswer = value1 + value2;
        } else if (operation === "-") {
            correctAnswer = value1 - value2;
        } else if (operation === "x") {
            correctAnswer = value1 * value2;
        }

        // Example usage
        // alert(`Min Number: ${formData.minNumber}, Max Number: ${formData.maxNumber}, Enable Feature: ${formData.enableFeature}`);
    } else {
        console.log('No form data found in localStorage.');
    }






    clearAnswers()

    // Start the timer by recording the current time
    startTime = new Date();
}


// Clear previous feedback and user input
function clearAnswers() {
    document.getElementById('feedback').textContent = '';
    document.getElementById('userAnswer').value = '';

    document.getElementById('timeTaken').textContent = '';
}

function submitAnswer() {
    const userAnswer = parseFloat(document.getElementById('userAnswer').value);

    let feedbackMessage = ''; //displayed message (correct/incorrect)
    const feedbackElement = document.getElementById('feedback');

    if (isNaN(userAnswer)) {
        feedbackMessage = "Please enter a valid number.";
        feedbackElement.style.color = 'orange';  // Set color for invalid input
    } else if (userAnswer === correctAnswer) {
        feedbackMessage = "Correct! Well done!";
        feedbackElement.style.color = 'green';  // Set color for correct answer
        isCorrect = true;
    } else {
        feedbackMessage = `Incorrect. The correct answer was ${correctAnswer}.`;
        feedbackElement.style.color = 'red';  // Set color for incorrect answer
        isCorrect = false;
    }

    feedbackElement.textContent = feedbackMessage;

    // Calculate time taken
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    //round to 2nd number
    document.getElementById('timeTaken').textContent = `Time taken: ${timeTaken.toFixed(2)} seconds`;


    // Generate a new question after a delay
    // incorrect answers will let a longer timer
    setTimeout(generateExercise, isCorrect ? delayTime : incorrectDelayTime);
}

//Pressing the 'Enter' key also submit the answer
function setupEnterKeyListener() {
    const inputField = document.getElementById('userAnswer');
    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            submitAnswer();
        }
    });
}

// Call the function to generate random numbers when the page loads
window.onload = function () {
    generateExercise();
    setupEnterKeyListener();  // Add this line to set up the Enter key listener
};