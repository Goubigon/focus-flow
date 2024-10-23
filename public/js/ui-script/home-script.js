import { getUserInfo, keepAuthenticate } from '../client-api/auth_api.js';


window.onload = async function () {
    await keepAuthenticate()
    
    const userJson = await getUserInfo()
    document.getElementById('user-name').textContent = userJson.mUsername;

};