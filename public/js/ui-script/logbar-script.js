document.getElementById("loginButton").addEventListener('click', async () =>{
    console.log("pressed login")
    const response = await logoutUser()
    console.log(response ? "success logout" : "fail logout");
})

window.onload = () => {
    console.log("Load navbar logout script ");
}