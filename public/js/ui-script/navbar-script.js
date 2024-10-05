import { logoutUser } from '../client-api/auth_api.js';


document.getElementById("logoutButton").addEventListener('click', async () =>{
    console.log("pressed logoutButton")
    const response = await logoutUser()
    console.log(response ? "success logout" : "fail logout");
})

window.onload = () => {
    console.log("Load navbar logout script ");
}