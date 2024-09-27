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
            window.location.href = '/home';
        } else {
            const errorResult = await response.json();
            document.getElementById('errorMessage').innerHTML = errorResult.message;
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
        } else {
            const errorResult = await response.json();
            console.log("error : " + errorResult.message);
            document.getElementById('errorMessage').innerHTML = errorResult.message;
        }

    } catch (error) {
        console.error('Error logging in:', error);
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
            //should be a user json
            const result = await response.json();
            return result;
        } else {
            const errorResult = await response.json();
            console.log("Error: " + errorResult.message);

            if (response.status === 401 || response.status === 403) {
                window.location.href = '/logout'; 
            } else {
                document.getElementById('errorMessage').innerHTML = errorResult.message;
            }
        }
    } catch (error) {
        console.error('Error:', error);
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
        } else {
            const errorData = await response.json();
            console.error('Error during logout:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

