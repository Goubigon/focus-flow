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
        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            return true;
        } else {
            const errorResult = await response.json();
            document.getElementById('errorMessage').innerHTML = errorResult.message;
            return false;
        }

    } catch (error) {
        console.error('Error logging in:', error);
    }
}



export async function refreshingToken() {
    try {
        const response = await fetch('/user-data/RefreshingToken', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Token Refreshed");
            console.log(result.message)
            return true;
        } else {
            const errorResult = await response.json();
            document.getElementById('errorMessage').innerHTML = errorResult.message;
            return false;
        }

    } catch (error) {
        console.error('Error logging in:', error);
        return false;
    }
}

export async function getUserInfo() {
    try {

        const response = await fetch(`/user-data/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json"
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return true;
        } else {            
            const errorResult = await response.json();
            document.getElementById('errorMessage').innerHTML = errorResult.message;
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export async function logoutUser() {
    try {
        const response = await fetch(`/user-data/logout`, {
            method: 'DELETE',

            headers: {
                'Content-Type': "application/json"
            },

        });

        if (response.ok) {
            console.log('Logout successful, cookie cleared.');
            return true;
        } else {
            const errorData = await response.json();
            console.error('Error during logout:', errorData.message);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

