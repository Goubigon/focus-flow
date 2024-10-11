import { keepAuthenticate } from '../client-api/auth_api.js';



/*
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
*/



async function getUserSessionData() {
    try {
        const response = await fetch('/user-data/getUserSessionData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            //console.log(JSON.stringify(result));
            return result;
        } else {
            console.error('Failed to retrieve answers.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


function generateGraph(duration, date) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: date,
            datasets: [{
                label: 'Total session time (seconds)',
                data: duration,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true // Fill the area under the line
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Day',
                        font: {
                            weight: 'bold'
                        }

                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Duration (seconds)',
                        font: {
                            weight: 'bold'
                        }

                    },
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

}



window.onload = async () => {
    keepAuthenticate()

    const sessionDataJson = await getUserSessionData();


    const sessionDataStr = JSON.stringify(sessionDataJson)

    console.log("sessionDateJson : " + sessionDataStr)

    const sessionDates = sessionDataJson.map(session => new Date(session.sessionDateGroup).toLocaleDateString());
    const sessionDurations = sessionDataJson.map(session => session.durationSum);

    console.log("sessionDates : " + sessionDates)
    console.log("Durations : " + sessionDurations)
    generateGraph(sessionDurations, sessionDates)
}