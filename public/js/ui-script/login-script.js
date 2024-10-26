


import { logUser, alreadyConnected } from '../client-api/auth_api.js';


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("Pressed Login Button")

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const isLogged = await logUser(email, password);
})

window.onload = async () => {
    await alreadyConnected()
}