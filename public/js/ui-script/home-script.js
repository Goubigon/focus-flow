import { getUserInfo, keepAuthenticate } from '../client-api/auth_api.js';


window.onload = async function () {
    const userJson = await getUserInfo()
    document.getElementById('user-name').textContent = userJson.mUsername;

    await keepAuthenticate()
};