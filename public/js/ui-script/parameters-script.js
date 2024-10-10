//script used by parameters.html
//handles form submission

import { keepAuthenticate } from '../client-api/auth_api.js';
import { getCurrentDateTime } from '../client-api/utils.js';


//boolean true if anything in the inputs of the form has changed
let isFormChanged = false;
let isFormSubmitted = false;

//get element containing all the inputs (4 numbers, 3 checkboxes)
const formElement = document.getElementById('configForm');

const inputList = formElement.querySelectorAll('input');
//add change listener on each inputList
inputList.forEach(currentInput => {
    currentInput.addEventListener('change', () => {
        isFormChanged = true;
    });
});


//when loading parameters windows
//loads last saved parameters if it exists
function loadExistingForm() {
    const formDataString = localStorage.getItem('formData');
    if (formDataString) {
        const formData = JSON.parse(formDataString);
        console.log(formData);
        document.getElementById('minNumber').value = formData.minNumber;
        document.getElementById('maxNumber').value = formData.maxNumber;

        document.getElementById('additionCheck').checked = formData.additionCheck;
        document.getElementById('subtractionCheck').checked = formData.subtractionCheck;
        document.getElementById('multiplicationCheck').checked = formData.multiplicationCheck;
    }
}


async function createParams(minNumber, maxNumber, floatNumber, nNumber, additionCheck, subtractionCheck, multiplicationCheck, maxAnswerCount) {
    try {
        const response = await fetch(`/session-data/createParams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                minNumber: minNumber,
                maxNumber: maxNumber,
                floatNumber: floatNumber,
                nNumber: nNumber,

                additionCheck: additionCheck,
                subtractionCheck: subtractionCheck,
                multiplicationCheck: multiplicationCheck,
                maxAnswerCount: maxAnswerCount,
            })
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function createSession(paramID, sessionDate) {
    try {
        const response = await fetch(`/session-data/createSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paramID: paramID,
                sessionDate: sessionDate
            })
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



formElement.addEventListener('submit', async (event) => {
    //default form submission makes submission reloads the page
    //so this prevents the page from reloading
    event.preventDefault();

    isFormSubmitted = true;
    isFormChanged = false;


    // Get the input values
    const minNumber = parseFloat(document.getElementById('minNumber').value);
    const maxNumber = parseFloat(document.getElementById('maxNumber').value);

    const floatNumber = 0;
    const nNumber = 2;


    const additionCheck = document.getElementById('additionCheck').checked;
    const subtractionCheck = document.getElementById('subtractionCheck').checked;
    const multiplicationCheck = document.getElementById('multiplicationCheck').checked;

    const maxAnswerCount = parseFloat(document.getElementById('maxAnswerCount').value);

    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error message
    errorMessage.textContent = '';

    // Validate input
    //Min is lower or equal Max
    if (minNumber >= maxNumber) {
        errorMessage.textContent = "Min number must be less than max number.";
        errorMessage.style.color = 'red';
    }
    //at least one operation is selected
    else if ((additionCheck || subtractionCheck || multiplicationCheck) == false) {
        errorMessage.textContent = "Must check at least one operation.";
        errorMessage.style.color = 'red';
    }
    //All parameters are correct
    else {
        errorMessage.textContent = "Successfully saved";
        errorMessage.style.color = 'green';

        const paramJson = await createParams(minNumber, maxNumber, floatNumber, nNumber, additionCheck, subtractionCheck, multiplicationCheck, maxAnswerCount)

        console.log(paramJson)

        const sessionJson = await createSession(paramJson.mParametersIdentifier, getCurrentDateTime())

        console.log(sessionJson)


        // Create JSON object
        const formData = {
            mSessionIdentifier : sessionJson.mSessionIdentifier,
            minNumber: minNumber,
            maxNumber: maxNumber,
            floatNumber: floatNumber,
            nNumber: nNumber,

            additionCheck: additionCheck,
            subtractionCheck: subtractionCheck,
            multiplicationCheck: multiplicationCheck,
            mMaxAnswerCount: maxAnswerCount
        };

        //null -> no placeholder function
        //4 -> number of spaces for indentation in result
        const jsonString = JSON.stringify(formData, null, 4); // Pretty print the JSON
        document.getElementById('jsonOutput').textContent = jsonString;

        localStorage.setItem('formData', JSON.stringify(formData));

        
        window.location.href = 'exercise';

    }
});

// When the windows page loads
// Call the function to generate last written parameters if it exists
window.onload = function () {
    keepAuthenticate();
    loadExistingForm();
};

// When leaving parameters page, if form has changed && is not submitted
// -> Pop-up message
window.addEventListener('beforeunload', (event) => {
    if (isFormChanged && !isFormSubmitted) {
        event.preventDefault();
        //deprecated but old browsers still need a message
        event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
});
