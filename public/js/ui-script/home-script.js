import { getUserInfo } from '../client-api/auth.js';


window.onload = async function () {
    const userJson = await getUserInfo()
    
    document.getElementById('user-name').textContent = userJson.mUsername;
};