const { expect } = require('chai');
const request = require('supertest');
const app = require('../config/sc-express'); // Import your Express app

describe('GET /login', () => {
    it('should serve the login.html file', async () => {
        const response = await request(app).get('/login');

        //console.log(response.text); // Log the actual HTML response

        expect(response.status).to.equal(200); // Check that the status code is 200
        expect(response.text).to.include('<h2>Login</h2>'); // Check for heading
        expect(response.text).to.include('id="loginForm"'); // Check for form ID
        expect(response.text).to.include('<button id="loginButton" type="submit">Login</button>'); // Check for submit button
    });
});