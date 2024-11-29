import { logUser } from '../client-api/user_api.js';
   

document.getElementById("guestButton").addEventListener('click', async () =>{
    console.log("pressed guestButton")
    await logUser("guest@guest.guest", "123456789");
})


console.log("Load logbar script ");