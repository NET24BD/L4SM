// ===============================
// Load Profile
// ===============================


document.addEventListener("DOMContentLoaded",()=>{


let name = localStorage.getItem("name");

let picture = localStorage.getItem("picture");



document.getElementById("userName").innerHTML =
name || "User";



if(picture){

document.getElementById("profileImg").src = picture;

}



});







// ===============================
// Profile Menu
// ===============================


const profile =
document.getElementById("profile");


const menu =
document.getElementById("profileMenu");



profile.onclick=function(e){

e.stopPropagation();

menu.classList.toggle("show");

};



document.onclick=function(){

menu.classList.remove("show");

};







// ===============================
// Navigation
// ===============================


function goBack(){

window.location.href="dashboard.html";

}



function openPage(page){

window.location.href=page;

}



function logout(){

localStorage.clear();

window.location.href="login.html";

}




// ===============================
// Add User
// ===============================


function addUser(){

alert("Add User Page Coming Soon");

}
