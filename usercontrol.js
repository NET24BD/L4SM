// Load User Profile

document.addEventListener("DOMContentLoaded",function(){


let name = localStorage.getItem("name");

let picture = localStorage.getItem("picture");



let userName = document.getElementById("userName");

let profileImg = document.getElementById("profileImg");



if(userName){

userName.innerHTML = name || "User";

}



if(profileImg && picture){

profileImg.src = picture;

}



});





// Profile Menu Open Close


document.addEventListener("DOMContentLoaded",function(){


const profile = document.getElementById("profile");

const menu = document.getElementById("profileMenu");



if(profile && menu){



profile.addEventListener("click",function(e){


e.stopPropagation();


if(menu.style.display === "block"){


menu.style.display="none";


}

else{


menu.style.display="block";


}



});




document.addEventListener("click",function(){


menu.style.display="none";


});



}



});







// Back Button


function goBack(){

window.location.href="dashboard.html";

}







// Open Page


function openPage(page){

window.location.href=page;

}






// Logout


function logout(){


localStorage.clear();


window.location.href="login.html";


}
