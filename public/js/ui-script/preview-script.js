import { alreadyConnected } from '../client-api/user_api.js';

window.onload = async () => {
    await alreadyConnected()
}