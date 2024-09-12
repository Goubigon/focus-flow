document.getElementById('configForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the input values
    const minNumber = parseFloat(document.getElementById('minNumber').value);
    const maxNumber = parseFloat(document.getElementById('maxNumber').value);
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error message
    errorMessage.textContent = '';

    // Validate input
    if (minNumber >= maxNumber) {
        errorMessage.textContent = "Min number must be less than max number.";
    } else {
        alert(`Min Number: ${minNumber}, Max Number: ${maxNumber}`);
        // You can add logic here to store the values or perform other actions.
    }
});