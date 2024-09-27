


import { logUser, getNewToken, getUserInfo, logoutUser } from './auth.js';

let authToken;

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("Pressed Login Button")

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authToken = await logUser(email, password);
    console.log("Auth Token : " + authToken)
    
    if (authToken) {
        //window.location.href = 'home';
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