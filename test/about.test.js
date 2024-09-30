const { expect } = require('chai');
const request = require('supertest');
const app = require('../config/sc-express'); // Import your Express app

describe('GET /about', () => {
    it('should return the About page message', async () => {
        const response = await request(app).get('/about');

        expect(response.status).to.equal(200); // Check that the status code is 200
        expect(response.text).to.equal('This is the About page'); // Check the response body
    });
});