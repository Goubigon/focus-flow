

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

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
            console.log(result.accessToken);
            console.log(result.refreshToken);
        } else {
            document.getElementById('errorMessage').innerHTML = result.message;
        }

    } catch (error) {
        console.error('Error logging in:', error);
    }
}



document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await logUser(email, password);

})