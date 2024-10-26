import { alreadyConnected, createUser } from '../client-api/auth_api.js';


function validateForm() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Reset error message
    errorMessage.textContent = '';
    errorMessage.style.color = 'red';

    // Validate username length
    if (username.length < 3) {
      errorMessage.innerHTML = 'Username must be at least 3 characters long.';
      return false;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      errorMessage.innerHTML = 'Please enter a valid email address.';
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      errorMessage.innerHTML = 'Password must be at least 6 characters long.';
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      errorMessage.innerHTML = 'Passwords do not match.';
      return false;
    }

    return true; // Allow form submission if all validations pass
}

document.getElementById('signForm').addEventListener('submit', async (event) =>{
    event.preventDefault();

    if (validateForm()){
        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        createUser(name, email, password);
    }
})

window.onload = async () => {
    await alreadyConnected()
}