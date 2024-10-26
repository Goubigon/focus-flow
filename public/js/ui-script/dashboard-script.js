import { keepAuthenticate, callRoute, callLevelRoute } from '../client-api/user_api.js';
import { getCleanDateTime, convertSecondsToMinutesAndSeconds } from '../client-api/tools.js'

import {
    generateGraphByDate, generateDoubleLineGraphByDate,
    generateDoubleLineGraphByDateWithDuration, generateIsCorrectBarGraph
}
    from './dashboard-graphs.js'




let myChart = null;

const keyDataContainer = document.getElementById('key-data-container');

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

    const keyDataList = [
        { key: 'nbAttempts', value: sessionCount, subtext: 'Number of attempts' },
        { key: 'totTime', value:  convertSecondsToMinutesAndSeconds(sessionTotalDuration), subtext: 'Total time' },
        { key: 'avgTimeLevel', value: sessionAverageDuration + "s", subtext: 'Average time in this level' },
        { key: 'avgTimeAnswer', value: answerAverageDuration + "s", subtext: 'Average time of an answer' }
    ];

    generateKeyDataBoxes(keyDataList)


    myChart = generateDoubleLineGraphByDateWithDuration(correct, incorrect, duration, formattedSessionDates, 'Number of answers')
}


function generateKeyDataBoxes(keyDataList){
    keyDataContainer.innerHTML = '';

    keyDataList.forEach(item => {
        // Create the data box
        const box = document.createElement('div');
        box.classList.add('key-data-box');
        

        // Create the subtext element
        const subtext = document.createElement('div');
        subtext.classList.add('subtext');
        subtext.textContent = item.subtext;


        // Create the number element
        const number = document.createElement('div');
        number.classList.add('key-data');
        number.setAttribute('key-data', item.key);
        number.textContent = item.value;


        // Append number and subtext to the box
        box.appendChild(subtext);
        box.appendChild(number);

        // Append the box to the container
        keyDataContainer.appendChild(box);
    });
}


function setTabButtons() {
    const tabButtonList = document.querySelectorAll('.tab-button');

    tabButtonList.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            if (myChart !== null) { myChart.destroy(); }

            keyDataContainer.innerHTML = '';

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
                )
            })

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


document.getElementById('tab-button3').addEventListener('click', async () => {
    const userStats = await callRoute('/getUserStats')

    const keyDataList = [
        { key: 'totSessionTime', value: convertSecondsToMinutesAndSeconds(userStats.mTotalSessionTime), subtext: 'Time playing' },
        { key: 'logNumber', value: userStats.mLogNumber, subtext: 'Number of times logging in' },
        { key: 'lastSessionDate', value: getCleanDateTime(new Date(userStats.mLastSessionDate)), subtext: 'Last session date' }
    ];

    generateKeyDataBoxes(keyDataList)
})


window.onload = async () => {
    keepAuthenticate();
    setTabButtons();
    document.querySelector('.tab-button.active').click();
}