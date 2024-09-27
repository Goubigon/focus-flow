

let authToken;
//Check data base
async function logUser(email, password) {
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

            authToken = result.accessToken
            console.log("auth : " + authToken);

            refreshToken = result.refreshToken
            console.log("refresh : " + refreshToken);
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }

    } catch (error) {
        console.error('Error logging in:', error);
    }
}


async function getNewToken() {
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
            console.log("new generated access token : "+ result.accessToken)
            authToken = result.accessToken;
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }

    } catch (error) {
        console.error('Error logging in:', error);
    }
}

async function getUserInfo(authToken) {
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

async function logoutUser(authToken) {
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


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await logUser(email, password);
    if(authToken){
        window.location.href = 'home';
    }
})

document.getElementById('refreshTokenButton').addEventListener('click', async (event) => {
    const response = await getNewToken();

})
document.getElementById('userInfoButton').addEventListener('click', async (event) => {
    console.log("trying to get user info with authToken: " + authToken);
    const response = await getUserInfo(authToken)
})
document.getElementById('logoutButton').addEventListener('click', async (event) => {
    const response = await logoutUser(authToken)
})