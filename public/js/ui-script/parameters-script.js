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
    const paramString = localStorage.getItem('parametersJson');
    if (paramString) {
        const paramJson = JSON.parse(paramString);
        console.log(paramJson);
        document.getElementById('minNumber').value = paramJson.mMinNumber;
        document.getElementById('maxNumber').value = paramJson.mMaxNumber;

        document.getElementById('additionCheck').checked = paramJson.mAdditionCheck;
        document.getElementById('subtractionCheck').checked = paramJson.mSubtractionCheck;
        document.getElementById('multiplicationCheck').checked = paramJson.mMultiplicationCheck;

        document.getElementById('maxAnswerCount').value = paramJson.mMaxAnswerCount;
    }
}


async function createParams(mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAddCheck, mSubCheck, mMultCheck, mMaxAnswerCount) {
    try {
        const response = await fetch(`/session-data/createParams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mMinNumber: mMinNumber,
                mMaxNumber: mMaxNumber,
                mFloatNumber: mFloatNumber,
                mNumber: mNumber,

                mAdditionCheck: mAddCheck,
                mSubtractionCheck: mSubCheck,
                mMultiplicationCheck: mMultCheck,
                mMaxAnswerCount: mMaxAnswerCount,
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log("[Fetch createParams] : " + JSON.stringify(result))
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
            console.log("[Fetch createSession] : " + JSON.stringify(result))
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

    // Prevents unsaved edits
    isFormSubmitted = true;
    isFormChanged = false;


    // Get the input values
    const mMinNumber = parseFloat(document.getElementById('minNumber').value);
    const mMaxNumber = parseFloat(document.getElementById('maxNumber').value);

    const mFloatNumber = 0;
    const mNumber = 2;

    const mAdditionCheck = document.getElementById('additionCheck').checked;
    const mSubtractionCheck = document.getElementById('subtractionCheck').checked;
    const mMultiplicationCheck = document.getElementById('multiplicationCheck').checked;

    const mMaxAnswerCount = parseFloat(document.getElementById('maxAnswerCount').value);

    // Clear previous error message
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';

    // Validate input
    //Min is lower or equal Max
    if (mMinNumber >= mMaxNumber) {
        errorMessage.textContent = "Min number must be less than max number.";
        errorMessage.style.color = 'red';
    }
    //at least one operation is selected
    else if ((mAdditionCheck || mSubtractionCheck || mMultiplicationCheck) == false) {
        errorMessage.textContent = "Must check at least one operation.";
        errorMessage.style.color = 'red';
    }
    //All parameters are correct
    else {
        errorMessage.textContent = "Successfully saved";
        errorMessage.style.color = 'green';

        const paramJson = await createParams(mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount)
        const sessionJson = await createSession(paramJson.mParametersIdentifier, getCurrentDateTime())

        //localStorage.setItem('parametersJson', JSON.stringify(paramJson));
        localStorage.setItem('mParametersIdentifier', sessionJson.mParametersIdentifier);
        window.location.href = 'exercise';
    }
});


function loadExercise(paramJson) {
}



const configForm = document.getElementById('configForm');
const levelsButton = document.getElementById('levelsButton');
const customButton = document.getElementById('customButton');
const levelButtonsContainer = document.getElementById('levelButtons');

// Show levels when the "Levels" button is clicked
levelsButton.addEventListener('click', () => {
    configForm.style.display = 'none'; // Hide the form
    levelButtonsContainer.style.display = 'block'; // Show level buttons
    levelButtonsContainer.innerHTML = ''; // Clear any existing buttons

    // Create level buttons dynamically
    for (let i = 1; i <= 5; i++) {
        const levelButton = document.createElement('button');
        levelButton.className = 'level-button';
        levelButton.innerText = `Level ${i}`;
        levelButton.addEventListener('click', async () => {
            alert(`You selected ${levelButton.innerText}`);
            // Create a session using the parameters 1 to 5 accordingly
            const sessionJson = await createSession(i, getCurrentDateTime())


        });
        levelButtonsContainer.appendChild(levelButton);
    }
});

// Show custom form when the "Custom" button is clicked
customButton.addEventListener('click', () => {
    levelButtonsContainer.style.display = 'none'; // Hide level buttons
    configForm.style.display = 'block'; // Show the form
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
