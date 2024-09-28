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

async function countOperation(operation) {
    try {
        const response = await fetch(`/math-data/countOperation/${operation}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
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
                'Content-Type': 'text/plain',
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

async function medianTimeByOperation(operation) {
    try {
        const response = await fetch(`/math-data/medianTbO/${operation}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
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

document.getElementById('countOperation').addEventListener('click', async (event) =>{
    countOperation("+");
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


document.getElementById('plusMedianButton').addEventListener('click', async (event) =>{
    medianTimeByOperation("+");
})
document.getElementById('minusMedianButton').addEventListener('click', async (event) =>{
    medianTimeByOperation("-");
})
document.getElementById('timesMedianButton').addEventListener('click', async (event) =>{
    medianTimeByOperation("x");
})
