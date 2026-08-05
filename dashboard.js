// ===============================
// Login Check
// ===============================

if(localStorage.getItem("isLogin") !== "true"){

    window.location.href="login.html";

}




// ===============================
// Load User Information
// ===============================

document.addEventListener("DOMContentLoaded",function(){



const name =
localStorage.getItem("name");


const username =
localStorage.getItem("username");


const picture =
localStorage.getItem("picture");




// Username Show

document.querySelectorAll("#username")
.forEach(function(el){


    el.innerHTML =
    name || username || "User";


});







// Profile Image

const profileImg =
document.getElementById("profileImg");



if(profileImg){



    if(picture && picture.trim() !== ""){


        profileImg.src = picture;



    }
    else{


        profileImg.src =
        "assets/profile.png";


    }



    // Image Error Backup

    profileImg.onerror=function(){


        this.src =
        "assets/profile.png";


    };



}



});









// ===============================
// Profile Menu
// ===============================


function toggleProfileMenu(){



const menu =
document.getElementById("profileMenu");



if(!menu) return;



if(menu.style.display==="block"){


menu.style.display="none";


}
else{


menu.style.display="block";


}



}









// ===============================
// Open Page
// ===============================


function openPage(page){


window.location.href=page;


}









// ===============================
// Logout
// ===============================


function logout(){



localStorage.clear();


window.location.href="login.html";


}









// ===============================
// Close Menu
// ===============================


document.addEventListener("click",function(e){



const profile =
document.querySelector(".profile");


const menu =
document.getElementById("profileMenu");



if(profile && menu){



if(!profile.contains(e.target)){


menu.style.display="none";


}



}



});
