//Check data base
export async function logUser(email, password) {
    try {
        const response = await fetch('/user-data/logUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        //contains message, access token, refresh token
        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
            return result.authToken;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }

    } catch (error) {
        console.error('Error logging in:', error);
    }
}



export async function getNewToken() {
    try {
        const response = await fetch('/user-data/token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Token Refreshed");
            console.log(result.message)
            console.log("new generated access token : " + result.authToken)
            return result.authToken;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }

    } catch (error) {
        console.error('Error logging in:', error);
    }
}

export async function getUserInfo(authToken) {
    try {
        const response = await fetch(`/user-data/getUser`, {
            method: 'GET',

            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${authToken}`
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

export async function logoutUser(authToken) {
    try {
        const response = await fetch(`/user-data/logout`, {
            method: 'DELETE',

            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${authToken}`
            },

        });

        if (response.ok) {
            console.log('Logout successful, cookie cleared.');
        } else {
            const errorData = await response.json();
            console.error('Error during logout:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
