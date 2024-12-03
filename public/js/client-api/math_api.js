

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
            body: JSON.stringify({ mParametersIdentifier: mParametersIdentifier })
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
export async function askGenerateExperimentalQuestions() {
    try {
        const response = await fetch('/math-data/generateExperimentalQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty body
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