import { logUser, alreadyConnected } from '../client-api/user_api.js';


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("Pressed Login Button")

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await logUser(email, password);
})

window.onload = async () => {
    await alreadyConnected()
}