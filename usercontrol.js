// ============================
// LOAD PROFILE
// ============================


document.addEventListener("DOMContentLoaded",function(){


let name = localStorage.getItem("name");

let picture = localStorage.getItem("picture");



document.getElementById("userName").innerHTML =
name || "User";



if(picture && picture!=""){

document.getElementById("profileImg").src = picture;

}



});





// ============================
// PROFILE MENU
// ============================


let profileBtn =
document.getElementById("profileBtn");


let profileMenu =
document.getElementById("profileMenu");



profileBtn.addEventListener("click",function(e){


e.stopPropagation();


if(profileMenu.style.display=="block"){


profileMenu.style.display="none";


}

else{


profileMenu.style.display="block";


}


});





document.addEventListener("click",function(){


profileMenu.style.display="none";


});





// ============================
// BACK BUTTON
// ============================


document.getElementById("backBtn")
.onclick=function(){


window.location.href="dashboard.html";


};





// ============================
// MY ACCOUNT
// ============================


document.getElementById("accountBtn")
.onclick=function(e){


e.stopPropagation();


window.location.href="my-account.html";


};





// ============================
// LOGOUT
// ============================


document.getElementById("logoutBtn")
.onclick=function(){


localStorage.clear();


window.location.href="login.html";


};





// ============================
// ADD USER
// ============================


document.getElementById("addUserBtn")
.onclick=function(){


alert("Add User Coming Soon");


};
