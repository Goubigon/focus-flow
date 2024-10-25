import { keepAuthenticate } from '../client-api/auth_api.js';
import { getCleanDateTime } from '../client-api/utils.js'

import { generateGraphByDate, generateDoubleLineGraphByDate,
    generateDoubleLineGraphByDateWithDuration, generateIsCorrectBarGraph } 
    from './dashboard-graphs.js'




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
    myChart = generateGraphByDate(sessionDurations, sessionDates, 'Total session time (seconds)', 'Duration (seconds)', 'line')
})



document.getElementById('sessionNumberByDateButton').addEventListener('click', async () => {
    h2Element.textContent = 'Number of session by day';

    const sessionDataJson = await callRoute('getUserSessionCount');
    console.log("sessionDataStr : " + JSON.stringify(sessionDataJson))

    const sessionDates = sessionDataJson.map(session => new Date(session.sessionDateGroup).toLocaleDateString());
    const sessionCount = sessionDataJson.map(session => session.sessionCount);
    console.log("sessionDates : " + sessionDates)
    console.log("sessionCount : " + sessionCount)
    myChart = generateGraphByDate(sessionCount, sessionDates, 'Number of session', 'Number of session', 'bar')
})



document.getElementById('lastSessionResultsButton').addEventListener('click', async () => {
    h2Element.textContent = 'Your latest results :';

    const resJson = await callRoute('getLatestResults');
    console.log("sessionDataStr : " + JSON.stringify(resJson))

    const correct = resJson.map(session => session.CorrectCount);
    const incorrect = resJson.map(session => session.IncorrectCount);
    console.log("correct : " + correct)
    console.log("incorrect : " + incorrect)
    myChart = generateIsCorrectBarGraph(correct, incorrect)
})


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

    myChart = generateDoubleLineGraphByDate(correct, incorrect, sessionDates, 'Number of answers')
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

    myChart = generateDoubleLineGraphByDateWithDuration(correct, incorrect, duration, formattedSessionDates, 'Number of answers')
}




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
                    if (myChart !== null) { myChart.destroy(); }
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


    // Prepare level buttons
    for (let i = 1; i <= 5; i++) {
        const levelButton = document.getElementById(`level${i}Button`);
        levelButton.addEventListener('click', async () => { 
            await displayLevelStats(i) 
        });
    }

}


document.getElementById('tab-button1').addEventListener('click', () => {
    document.getElementById('lastSessionResultsButton').click();
    document.getElementById(`lastSessionResultsButton`).classList.add('active');
})




document.getElementById('tab-button2').addEventListener('click', () => {
    document.getElementById(`level1Button`).click();
    document.getElementById(`level1Button`).classList.add('active');
})


window.onload = async () => {
    keepAuthenticate();
    setTabButtons();
    document.querySelector('.tab-button.active').click();
}