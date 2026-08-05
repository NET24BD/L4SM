// =====================================
// DASHBOARD JS
// =====================================


// =====================================
// LOAD USER DATA
// =====================================

document.addEventListener("DOMContentLoaded",function(){



// Dashboard visited

localStorage.setItem(
    "dashboardAccess",
    "true"
);





let name =
localStorage.getItem("name");



let username =
localStorage.getItem("username");



let picture =
localStorage.getItem("picture");






// ===============================
// USER NAME SHOW
// ===============================


document
.querySelectorAll("#username")
.forEach(function(el){


    el.innerHTML =
    name || username || "User";


});








// ===============================
// PROFILE IMAGE
// ===============================


const profileImg =
document.getElementById("profileImg");




if(profileImg){



    if(
    picture &&
    picture.trim() !== ""
    ){


        profileImg.src =
        picture;


    }
    else{


        profileImg.src =
        "assets/profile.png";


    }





    profileImg.onerror=function(){


        this.src =
        "assets/profile.png";


    };



}



});









// =====================================
// PROFILE MENU TOGGLE
// =====================================


function toggleProfileMenu(){



const menu =
document.getElementById("profileMenu");



if(!menu)
return;




if(menu.style.display==="block"){


menu.style.display="none";


}
else{


menu.style.display="block";


}



}









// =====================================
// OPEN PAGE
// =====================================


function openPage(page){


window.location.href =
page;


}









// =====================================
// MY ACCOUNT
// =====================================


function openMyAccount(){


window.location.href =
"my-account.html";


}









// =====================================
// LOGOUT
// =====================================


function logout(){



localStorage.clear();


window.location.href =
"login.html";


}









// =====================================
// CLOSE PROFILE MENU
// =====================================


document.addEventListener(
"click",
function(e){



const profile =
document.querySelector(".profile");



const menu =
document.getElementById("profileMenu");





if(
profile &&
menu &&
!profile.contains(e.target)
){



menu.style.display =
"none";


}



});
