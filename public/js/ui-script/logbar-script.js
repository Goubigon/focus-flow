import { logUser } from '../client-api/auth_api.js';
   

document.getElementById("guestButton").addEventListener('click', async () =>{
    console.log("pressed guestButton")
    await logUser("guest@guest.guest", "123456789");
})


window.onload = () => {
    console.log("Load logbar script ");
}