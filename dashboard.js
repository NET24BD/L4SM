// =====================================
// L4SM DASHBOARD JS
// =====================================



document.addEventListener("DOMContentLoaded", function(){



// ===============================
// LOAD USER DATA
// ===============================


let name = localStorage.getItem("name");

let username = localStorage.getItem("username");

let picture = localStorage.getItem("picture");





// যদি name না থাকে username দেখাবে

let displayName = name || username || "User";






// Header Name

let headerName =
document.getElementById("headerName");


if(headerName){

headerName.innerText = displayName;

}






// Welcome Name

let welcomeName =
document.getElementById("welcomeName");


if(welcomeName){

welcomeName.innerText = displayName;

}







// Profile Image

let profileImg =
document.getElementById("profileImg");



if(profileImg && picture){


profileImg.src = picture;


}








// ===============================
// LOGOUT BUTTON
// ===============================


let logoutBtn =
document.getElementById("logoutBtn");



if(logoutBtn){



logoutBtn.addEventListener("click",function(e){



e.stopPropagation();




localStorage.removeItem("isLogin");

localStorage.removeItem("username");

localStorage.removeItem("name");

localStorage.removeItem("role");

localStorage.removeItem("picture");




window.location.href="login.html";



});



}



});









// ===============================
// SIDEBAR TOGGLE
// ===============================


function toggleSidebar(){



let sidebar =
document.getElementById("sidebar");



if(sidebar){


sidebar.classList.toggle("small");


}



}









// ===============================
// PAGE OPEN
// ===============================


function openPage(page){


window.location.href = page;


}









// ===============================
// PROFILE MENU
// ===============================


function toggleProfileMenu(){



let menu =
document.getElementById("profileMenu");



if(!menu){

return;

}




if(menu.style.display==="block"){


menu.style.display="none";


}
else{


menu.style.display="block";


}



}









// ===============================
// MY ACCOUNT
// ===============================


function openMyAccount(){


window.location.href="my-account.html";


}








// ===============================
// CLOSE PROFILE MENU OUTSIDE
// ===============================


document.addEventListener("click",function(e){



let profile =
document.querySelector(".profile");



let menu =
document.getElementById("profileMenu");




if(profile && menu){



if(!profile.contains(e.target)){


menu.style.display="none";


}



}



});
