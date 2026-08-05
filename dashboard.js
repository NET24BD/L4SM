// =====================================
// L4SM DASHBOARD JS
// =====================================



// =====================================
// LOAD USER INFORMATION
// =====================================


document.addEventListener("DOMContentLoaded", function(){



// Dashboard access mark

localStorage.setItem(
    "dashboardAccess",
    "true"
);






// Get User Data


const name =
localStorage.getItem("name");


const username =
localStorage.getItem("username");


const picture =
localStorage.getItem("picture");







// ===============================
// SHOW USER NAME
// ===============================


document
.querySelectorAll("#username")
.forEach(function(element){


    element.innerHTML =
    name || username || "User";


});








// ===============================
// SHOW PROFILE IMAGE
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






    // If image not load

    profileImg.onerror=function(){


        this.src =
        "assets/profile.png";


    };



}



});









// =====================================
// PROFILE MENU
// =====================================


function toggleProfileMenu(){



const menu =
document.getElementById("profileMenu");



if(!menu){

return;

}




if(menu.style.display === "block"){


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
// CLOSE MENU OUTSIDE CLICK
// =====================================


document.addEventListener(
"click",
function(event){



const profile =
document.querySelector(".profile");



const menu =
document.getElementById("profileMenu");






if(
profile &&
menu &&
!profile.contains(event.target)

){


menu.style.display="none";


}



});
