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

async function callRoute(route) {
    try {
        const response = await fetch('/user-data/' + route, {
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


let myChart = null;

function generateBarGraphByDate(duration, date, label, yText) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart !== null) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: date,
            datasets: [{
                label: label,
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
                        text: yText,
                        font: {
                            weight: 'bold'
                        }

                    },
                    beginAtZero: true,

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



function generateIsCorrectBarGraph(correct, incorrect) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart !== null) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Correct', 'Incorrect'], // Labels for the bars
            datasets: [{
                data: [correct, incorrect], // Data for the bars
                backgroundColor: [
                    'rgba(75, 192, 75, 0.2)', // Green for Correct
                    'rgba(255, 99, 132, 0.2)' // Red for Incorrect
                ],
                borderColor: [
                    'rgba(75, 192, 75, 1)', // Dark green border for Correct
                    'rgba(255, 99, 132, 1)' // Dark red border for Incorrect
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Answers'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of answers'
                    },
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            return `${tooltipItem.raw} answers`;
                        }
                    }
                }
            }
        }
    });



}

const loadGraphButton = document.getElementById('sessionDurationByDateButton');
const h2Element = document.getElementById('titleOfGraph');

loadGraphButton.addEventListener('click', async () => {
    h2Element.textContent = 'Play time duration by day';

    const sessionDataJson = await callRoute('getUserSessionData');
    console.log("sessionDataStr : " + JSON.stringify(sessionDataJson))

    const sessionDates = sessionDataJson.map(session => new Date(session.sessionDateGroup).toLocaleDateString());
    const sessionDurations = sessionDataJson.map(session => session.durationSum);
    console.log("sessionDates : " + sessionDates)
    console.log("Durations : " + sessionDurations)
    generateBarGraphByDate(sessionDurations, sessionDates, 'Total session time (seconds)', 'Duration (seconds)')
})



document.getElementById('sessionNumberByDateButton').addEventListener('click', async () => {
    h2Element.textContent = 'Number of session by day';

    const sessionDataJson = await callRoute('getUserSessionCount');
    console.log("sessionDataStr : " + JSON.stringify(sessionDataJson))

    const sessionDates = sessionDataJson.map(session => new Date(session.sessionDateGroup).toLocaleDateString());
    const sessionCount = sessionDataJson.map(session => session.sessionCount);
    console.log("sessionDates : " + sessionDates)
    console.log("sessionCount : " + sessionCount)
    generateBarGraphByDate(sessionCount, sessionDates, 'Number of session', 'Number of session')
})



document.getElementById('lastSessionResultsButton').addEventListener('click', async () => {
    displayLatest()
})


async function displayLatest() {
    h2Element.textContent = 'Your latest results :';

    const resJson = await callRoute('getLatestResults');
    console.log("sessionDataStr : " + JSON.stringify(resJson))

    const correct = resJson.map(session => session.CorrectCount);
    const incorrect = resJson.map(session => session.IncorrectCount);
    console.log("correct : " + correct)
    console.log("incorrect : " + incorrect)
    generateIsCorrectBarGraph(correct, incorrect)

}



window.onload = async () => {
    keepAuthenticate()
    displayLatest()
}