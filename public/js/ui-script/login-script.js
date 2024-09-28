


import { logUser, refreshingToken, getUserInfo, logoutUser } from '../client-api/auth.js';



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