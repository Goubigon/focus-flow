


import { logUser, refreshingToken, getUserInfo, logoutUser } from '../client-api/auth_api.js';



async function alreadyConnected (){
    try {
        const response = await fetch('/user-data/keepAuthenticate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const result = await response.json();
            return result.isAuth;
        } else {
            console.error('Failed to retrieve answers.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
 
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("Pressed Login Button")

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const isLogged = await logUser(email, password);
})

document.getElementById('refreshTokenButton').addEventListener('click', async (event) => {
    const response = await refreshingToken();

})
document.getElementById('userInfoButton').addEventListener('click', async (event) => {
    const userJson = await getUserInfo()
    console.log("userJson : " + userJson.mUsername)
})
document.getElementById('logoutButton').addEventListener('click', async (event) => {
    const response = await logoutUser()
})

window.onload = async () => {
    if(alreadyConnected()){window.location.href = '/home';} 
}