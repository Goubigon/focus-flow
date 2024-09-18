let correctResult;  // Global variable to store the correct answer
let startTime; //starting time when questions are loaded



const exSubmitButton = document.getElementById('exSubmitButton');

//TODO rename to left & right values
let value1 = 0
let value2 = 0
let operation = ""
let formDataString = ""

//generates the numbers and the operation on exercise.html
function generateExercise() {
    //get the form (localStorage) from parameters.html
    //store in string for now to make sure there is something
    formDataString = localStorage.getItem('formData');

    if (formDataString) {
        //parse the form in json
        const formData = JSON.parse(formDataString);
        console.log(formData);

        //values between min and max
        value1 = Math.floor(Math.random() * (formData.maxNumber - formData.minNumber + 1)) + formData.minNumber;
        value2 = Math.floor(Math.random() * (formData.maxNumber - formData.minNumber + 1)) + formData.minNumber;


        //adding () if negative
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


        //adding the selected operations to a list
        let operations = [];
        if (formData.additionCheck) { operations.push("+"); }
        if (formData.subtractionCheck) { operations.push("-"); }
        if (formData.multiplicationCheck) { operations.push("x"); }

        //select a random operation from the list
        const randomIndex = Math.floor(Math.random() * operations.length);
        operation = operations[randomIndex];
        document.getElementById('randomOperation').textContent = operation;

        // Calculate the correct answer based on the operation
        if (operation === "+") {
            correctResult = value1 + value2;
        } else if (operation === "-") {
            correctResult = value1 - value2;
        } else if (operation === "x") {
            correctResult = value1 * value2;
        }

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

// When pressing Submit or Enter.key
exSubmitButton.addEventListener('click', async (event) => {
    //get user's answer
    const userAnswer = parseFloat(document.getElementById('userAnswer').value);
    //display feedback to user
    const feedbackElement = document.getElementById('feedback');

    // Calculate time taken
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

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


        console.log(value1)
        console.log(operation)
        console.log(value2)
        console.log(correctResult)
        console.log(userAnswer)
        console.log(userAnswer == correctResult)

        console.log(timeTaken)
        console.log("Done in db")

        if (formDataString) {
            //parse the form in json
            const formData = JSON.parse(formDataString);
            console.log(formData.minNumber);
            console.log(formData.maxNumber);
            console.log(formData.floatNumber);
            console.log(formData.nNumber);
            console.log(formData.additionCheck);
            console.log(formData.subtractionCheck);
            console.log(formData.multiplicationCheck);
        }

        //createAnswer("bb1", "vv2");
    }
});

async function createAnswer(v1, v2){
    try {
        const response = await fetch('/data/createLine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name : v1, value : v2 }),
        });
    
        if (response.ok) {
            const result = await response.json();
            console.log('My line has been created:', result);
        } else {
            console.error('Failed to create line.');
        }
    } catch (error) {
        console.error('Error:', error);
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
    generateExercise();
    setupEnterKeyListener();  // Add this line to set up the Enter key listener
};