export function getCleanDateTime(pDate) {
    const year = pDate.getFullYear();
    const month = String(pDate.getMonth() + 1).padStart(2, '0');
    const day = String(pDate.getDate()).padStart(2, '0');
    const hours = String(pDate.getHours()).padStart(2, '0');
    const minutes = String(pDate.getMinutes()).padStart(2, '0');
    const seconds = String(pDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export function convertSecondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

export function loadFromLocalStorage(itemName) {
    const paramString = localStorage.getItem(itemName);
    if (paramString) {
        console.log('Loaded From local storage [' + itemName + '] : ', paramString);
        return paramString;
    } else {
        console.log('No data found in localStorage.');
        return null;
    }
}

export async function createAnswer(mSessionIdentifier, leftOperation, mathOperation, rightOperation,
    qResult, qAnswer, isCorrect,
    qTime, qDate) {
    try {
        const response = await fetch('/math-data/createAnswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mSessionIdentifier: mSessionIdentifier,
                leftOperation: leftOperation,
                mathOperation: mathOperation,
                rightOperation: rightOperation,
                qResult: qResult,
                qAnswer: qAnswer,
                isCorrect: isCorrect,
                qTime: qTime,
                qDate: qDate
            })
        });
        if (response.ok) {
            const result = await response.json();
            console.log('My line has been created:', result);
        } else {
            console.error('Failed to create line.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

}




export async function askGenerateQuestions(mParametersIdentifier) {
    try {
        //console.log("API parametersJson : " + JSON.stringify(parametersJson))
        
        const response = await fetch('/math-data/generateQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({mParametersIdentifier : mParametersIdentifier})
        });

        if (response.ok) {
            const result = await response.json();
            console.log('List of questions:', result);
            return result;
        } else {
            console.error('Failed to create line.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function insertAllAnswers(questionJsonList) {
    try {
        const response = await fetch('/math-data/insertAllAnswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionJsonList)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('List of questions:', result);
            return result;
        } else {
            console.error('Failed to create line.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}