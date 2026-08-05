// USER DATA LOAD


document.addEventListener("DOMContentLoaded",function(){



let name =
localStorage.getItem("name");


let picture =
localStorage.getItem("picture");




document.querySelectorAll("#username")
.forEach(function(el){

el.innerHTML =
name || "User";


});





let img =
document.getElementById("profileImg");



if(img && picture){


img.src=picture;


}



});







// SIDEBAR


function toggleSidebar(){


document
.getElementById("sidebar")
.classList.toggle("small");


}







// OPEN PAGE


function openPage(page){


window.location.href=page;


}







// PROFILE MENU


function toggleProfileMenu(){


let menu =
document.getElementById("profileMenu");


if(menu.style.display==="block"){

menu.style.display="none";

}

else{

menu.style.display="block";

}


}







function openMyAccount(){


window.location.href="my-account.html";


}








// LOGOUT


function logout(){


localStorage.clear();


window.location.href="login.html";


}
