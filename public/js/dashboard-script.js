async function getAnswers() {
    try {
        const response = await fetch('/math-data/getAnswers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error('Failed to retrieve answers.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function countOperations() {
    try {
        const response = await fetch('/math-data/countOperations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result); 
        } else {
            console.error('Failed to retrieve answers.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function successByOperation(operation) {
    try {
        const response = await fetch(`/math-data/averageSbO/${operation}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result); 
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

document.getElementById('countOperations').addEventListener('click', async (event) =>{
    countOperations();
})

document.getElementById('plusAverageButton').addEventListener('click', async (event) =>{
    successByOperation("+");
})
document.getElementById('minusAverageButton').addEventListener('click', async (event) =>{
    successByOperation("-");
})
document.getElementById('timesAverageButton').addEventListener('click', async (event) =>{
    successByOperation("x");
})
