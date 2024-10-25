import { keepAuthenticate } from '../client-api/auth_api.js';
import { getCleanDateTime } from '../client-api/utils.js'


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
async function callLevelRoute(route, level) {
    try {
        const response = await fetch('/user-data/' + route + '/' + level, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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

function generateGraphByDate(duration, date, label, yText, chartType) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart !== null) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: chartType,
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


function generateDoubleLineGraphByDate(val1, val2, date, yText) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart !== null) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: date, // Labels for the bars
            datasets: [{
                label: 'Correct Answers',
                data: val1, // Data for correct answers
                backgroundColor: 'rgba(75, 192, 75, 0.2)', // Green for correct answers
                borderColor: 'rgba(75, 192, 75, 1)', // Dark green border for correct answers
                borderWidth: 1
            }, {
                label: 'Incorrect Answers',
                data: val2, // Data for incorrect answers
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red for incorrect answers
                borderColor: 'rgba(255, 99, 132, 1)', // Dark red border for incorrect answers
                borderWidth: 1
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


function generateDoubleLineGraphByDateWithDuration(val1, val2, duration, date, yText) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart !== null) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: date, // Labels for the bars
            datasets: [{
                label: 'Correct Answers',
                data: val1, // Data for correct answers
                backgroundColor: 'rgba(75, 192, 75, 0.2)', // Green for correct answers
                borderColor: 'rgba(75, 192, 75, 1)', // Dark green border for correct answers
                borderWidth: 5,
                yAxisID: 'y1',
            }, {
                label: 'Incorrect Answers',
                data: val2, // Data for incorrect answers
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red for incorrect answers
                borderColor: 'rgba(255, 99, 132, 1)', // Dark red border for incorrect answers
                borderWidth: 5,
                yAxisID: 'y1',
            }, {
                label: 'Duration (seconds)',
                data: duration, // Data for duration
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue for duration
                borderColor: 'rgba(54, 162, 235, 1)', // Dark blue border
                borderWidth: 1,
                yAxisID: 'y2',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            weight: 'bold'
                        }

                    }
                },
                y1: {
                    type: 'linear',
                    position: 'left', // Primary y-axis on the left
                    title: {
                        display: true,
                        text: yText,
                        font: {
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                },
                y2: {
                    type: 'linear',
                    position: 'right', // Secondary y-axis on the right
                    title: {
                        display: true,
                        text: 'Duration (seconds)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false, // Prevent grid lines from overlapping
                    },
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
    generateGraphByDate(sessionDurations, sessionDates, 'Total session time (seconds)', 'Duration (seconds)', 'line')
})



document.getElementById('sessionNumberByDateButton').addEventListener('click', async () => {
    h2Element.textContent = 'Number of session by day';

    const sessionDataJson = await callRoute('getUserSessionCount');
    console.log("sessionDataStr : " + JSON.stringify(sessionDataJson))

    const sessionDates = sessionDataJson.map(session => new Date(session.sessionDateGroup).toLocaleDateString());
    const sessionCount = sessionDataJson.map(session => session.sessionCount);
    console.log("sessionDates : " + sessionDates)
    console.log("sessionCount : " + sessionCount)
    generateGraphByDate(sessionCount, sessionDates, 'Number of session', 'Number of session', 'bar')
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

document.getElementById('resultsByDayButton').addEventListener('click', async () => {
    h2Element.textContent = 'Results by day';

    const resJson = await callRoute('getResultsByDay');
    console.log("sessionDataStr : " + JSON.stringify(resJson))

    const sessionDates = resJson.map(session => new Date(session.sessionDateGroup).toLocaleDateString());

    const correct = resJson.map(session => session.CorrectCount);
    const incorrect = resJson.map(session => session.IncorrectCount);


    console.log("sessionDates : " + sessionDates)
    console.log("correct : " + correct)
    console.log("incorrect : " + incorrect)

    generateDoubleLineGraphByDate(correct, incorrect, sessionDates, 'Number of answers')
})


async function displayLevelStats(level) {

    h2Element.textContent = 'Results for level ' + level;
    const resJson = await callLevelRoute('getResultByLevel', level)
    console.log("callLevelRoute : " + JSON.stringify(resJson))

    const sessionDates = resJson.resByLevel.map(session => session.mSessionDate);
    const formattedSessionDates = sessionDates.map(sessionDate => {
        const date = new Date(sessionDate);  // Ensure sessionDate is a valid Date object
        return getCleanDateTime(date);
    });


    const duration = resJson.resByLevel.map(session => session.mSessionDuration);

    const correct = resJson.resByLevel.map(session => session.CorrectCount);
    const incorrect = resJson.resByLevel.map(session => session.IncorrectCount);

    console.log("sessionDates : " + sessionDates)
    console.log("correct : " + correct)
    console.log("incorrect : " + incorrect)


    const sessionCount = resJson.sessionDetailsByLevel.map(session => session.sessionCount);
    const sessionTotalDuration = resJson.sessionDetailsByLevel.map(session => session.sessionTotalDuration);
    const sessionAverageDuration = resJson.sessionDetailsByLevel.map(session => session.sessionAverageDuration);
    const answerAverageDuration = resJson.avgAnswerDurationByLevel.map(session => session.answerAverageDuration);

    document.getElementById('kpi1').textContent = "Number of attempts  : " + sessionCount
    document.getElementById('kpi2').textContent = "Total time : " + sessionTotalDuration
    document.getElementById('kpi3').textContent = "Average time in this level : " + sessionAverageDuration
    document.getElementById('kpi4').textContent = "Average time of an answer  : " + answerAverageDuration

    generateDoubleLineGraphByDateWithDuration(correct, incorrect, duration, formattedSessionDates, 'Number of answers')
}

// for (let i = 1; i <= 3; i++) {
//     document.getElementById(`tab-button${i}`).addEventListener('click', () => {
//         if (myChart !== null) { myChart.destroy(); }

//         const buttons = document.querySelectorAll('button'); // Select all buttons

//         buttons.forEach(button => {
//             button.addEventListener('click', () => {
//                 // Remove the 'active' class from all buttons
//                 buttons.forEach(btn => btn.classList.remove('active'));

//                 // Add the 'active' class to the clicked button
//                 button.classList.add('active');
//             });
//         });


//         // for(let i = 1; i <= 4; i++){
//         //     document.getElementById(`kpi${i}`).textContent = '';

//         // }
//     })
// }


const tabButtonList = document.querySelectorAll('.tab-button');
tabButtonList.forEach(currentTabButton => {
    currentTabButton.addEventListener('click', () => {
        // Remove the 'active' class from all tabButtonList
        tabButtonList.forEach(tabButton => tabButton.classList.remove('active'));

        // Add the 'active' class to the clicked button
        currentTabButton.classList.add('active');
    });
});

const elButtonList = document.querySelectorAll('.element-button');
tabButtonList.forEach(currentElButton => {
    currentElButton.addEventListener('click', () => {
        // Remove the 'active' class from all tabButtonList
        tabButtonList.forEach(elButton => elButton.classList.remove('active'));

        // Add the 'active' class to the clicked button
        currentElButton.classList.add('active');
    });
});



document.getElementById('tab-button2').addEventListener('click', () => {
    for (let i = 1; i <= 5; i++) {
        const levelButton = document.getElementById(`level${i}Button`);

        levelButton.addEventListener('click', async () => {
            // for (let j = 1; j <= 5; j++) {
            //     document.getElementById(`level${j}Button`).classList.remove('active');
            // }
            // levelButton.classList.add('active');

            await displayLevelStats(i)
        });
    }

    document.getElementById(`level1Button`).click();
})




function setTabButtons() {
    const tabButtonList = document.querySelectorAll('.tab-button');

    tabButtonList.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            if (myChart !== null) { myChart.destroy(); }

            // Remove active to all .tab
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            // Remove active to all .tab-button 
            tabButtonList.forEach(button => button.classList.remove('active'));

            
            const elementButtons = document.querySelectorAll('.element-button')
            elementButtons.forEach(elButton => {
                elButton.addEventListener('click', () => {
                    // Remove active to all .element-button 
                    elementButtons.forEach(rButton => { rButton.classList.remove('active') })
                    // Set active to current clicked .element-button
                    elButton.classList.add('active')
                }
            )})



            // Determine tabName based on the button ID by extracting the number
            const tabName = `tab${tabButton.id.replace('tab-button', '')}`;

            // Activate the corresponding tab and clicked button
            document.getElementById(tabName).classList.add('active');
            tabButton.classList.add('active');
        });
    });

}


window.onload = async () => {
    keepAuthenticate();
    setTabButtons();
    document.querySelector('.tab-button.active').click();
    document.querySelector('.element-button.active').click();
}