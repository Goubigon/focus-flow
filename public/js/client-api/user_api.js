
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
            console.log("status : " + JSON.stringify(errorResult));
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
            window.location.href = '/logout'; 
            return true;
        } else {
            const errorData = await response.json();
            console.error('Error during logout:', errorData.message);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function keepAuthenticate() {
    try {
        const response = await fetch(`/user-data/keepAuthenticate`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json"
            },
        });

        if (response.ok) {
            console.log('kept auth');
            return true;
        } else {
            const errorData = await response.json();
            console.error('Error during logout:', errorData.message);
            window.location.href = '/logout'; 
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function alreadyConnected (){
    try {
        console.log("Checking if user is still connected")
        const response = await fetch('/user-data/keepAuthenticate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const result = await response.json();
            console.log("is user still connected : " + result.isAuth)
            if(result.isAuth) {window.location.href = '/home';}
            return result.isAuth;
        } else {
            console.error('Failed to retrieve answers.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function createUser(name, email, password) {
    try {
        const response = await fetch(`/user-data/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                name : name,
                email : email,
                password : password,
                role : "user"
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result); 
            await logUser(email, password);
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}




export async function getUserSessionData() {
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

export async function callRoute(route) {
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
export async function callLevelRoute(route, level) {
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
