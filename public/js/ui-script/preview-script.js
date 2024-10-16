import { alreadyConnected } from '../client-api/auth_api.js';

window.onload = async () => {
    await alreadyConnected()
}