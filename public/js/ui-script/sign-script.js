import { logUser } from '../client-api/auth.js';


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

async function createUser(name, email, password) {
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


document.getElementById('signForm').addEventListener('submit', async (event) =>{
    event.preventDefault();

    if (validateForm()){
        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        createUser(name, email, password);
    }
})
