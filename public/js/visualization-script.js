async function getAnswers() {
    try {
        const response = await fetch('/math-data/getAnswers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json(); // Parse the JSON response
            console.log(result); // Log the result to the console
        } else {
            console.error('Failed to retrieve answers.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('getAnswersButton').addEventListener('click', async (event) =>{

    getAnswers();
})
