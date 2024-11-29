import { logoutUser } from '../client-api/user_api.js';


    
document.getElementById("logoutButton").addEventListener('click', async () =>{
    console.log("pressed logoutButton")
    const response = await logoutUser()
    console.log(response ? "success logout" : "fail logout");
})


console.log("Load navbar logout script ");