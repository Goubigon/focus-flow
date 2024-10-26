
export async function createParams(mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAddCheck, mSubCheck, mMultCheck, mMaxAnswerCount) {
    try {
        const response = await fetch(`/session-data/createParams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mMinNumber: mMinNumber,
                mMaxNumber: mMaxNumber,
                mFloatNumber: mFloatNumber,
                mNumber: mNumber,

                mAdditionCheck: mAddCheck,
                mSubtractionCheck: mSubCheck,
                mMultiplicationCheck: mMultCheck,
                mMaxAnswerCount: mMaxAnswerCount,
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log("[Fetch createParams] : " + JSON.stringify(result))
            return result;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function createSession(paramID, sessionDate) {
    try {
        const response = await fetch(`/session-data/createSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paramID: paramID,
                sessionDate: sessionDate
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log("[Fetch createSession] : " + JSON.stringify(result))
            return result;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

