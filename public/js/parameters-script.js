document.getElementById('configForm').addEventListener('submit', function (event) {
    //default form submission makes submition reloads the page
    //so this prevents the page from reloading
    event.preventDefault();


    // Get the input values
    const minNumber = parseFloat(document.getElementById('minNumber').value);
    const maxNumber = parseFloat(document.getElementById('maxNumber').value);

    const floatNumber = 0;
    const nNumber = 2;


    const additionCheck = document.getElementById('additionCheck').checked;
    const substractionCheck = document.getElementById('substractionCheck').checked;
    const multiplicationCheck = document.getElementById('multiplicationCheck').checked;




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
    else if ((additionCheck||substractionCheck||multiplicationCheck) == false){
        errorMessage.textContent = "Must check at least one operation.";
        errorMessage.style.color = 'red';
    }
    //All parameters are correct
    else {
        errorMessage.textContent = "Successfully saved";
        errorMessage.style.color = 'green';


        // Create JSON object
        const formData = {
            minNumber: minNumber,
            maxNumber: maxNumber,
            floatNumber: floatNumber,

            additionCheck: additionCheck,
            substractionCheck: substractionCheck,
            multiplicationCheck: multiplicationCheck,
        };



        //null -> no placeholder function
        //4 -> number of spaces for indentation in result
        const jsonString = JSON.stringify(formData, null, 4); // Pretty print the JSON
        document.getElementById('jsonOutput').textContent = jsonString;


        localStorage.setItem('formData', JSON.stringify(formData));
        window.location.href = 'exercise';


    }
});