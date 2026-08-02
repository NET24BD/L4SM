// ===============================
// LOGIN CHECK
// ===============================


let userData = localStorage.getItem("user");


if(!userData){

    window.location.replace("login.html");

}




// ===============================
// LOAD USER DATA
// ===============================


let user = JSON.parse(userData);



if(user){


    // Username Show

    let usernameElements = document.querySelectorAll("#username");


    usernameElements.forEach(function(el){

        el.innerHTML = user.name || user.username;

    });



    // Profile Image

    if(user.picture){

        document.getElementById("profileImg").src = user.picture;

    }


}




// ===============================
// PREVENT BACK AFTER LOGOUT
// ===============================


history.pushState(null,null,location.href);


window.onpopstate=function(){

    history.go(1);

};




// ===============================
// CARD REDIRECT
// ===============================


function openPage(page){

    window.location.href = page;

}





// ===============================
// PROFILE DROPDOWN
// ===============================


function toggleProfileMenu(){


    let menu=document.getElementById("profileMenu");


    if(menu.style.display==="block"){

        menu.style.display="none";

    }

    else{

        menu.style.display="block";

    }


}





// ===============================
// LOGOUT
// ===============================


function logout(){


    localStorage.removeItem("user");

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("username");

    localStorage.removeItem("photo");


    window.location.replace("login.html");


}





// ===============================
// AUTO LOGOUT AFTER 10 MINUTES
// ===============================


let logoutTime = 10 * 60 * 1000;


let timer;



function resetTimer(){


    clearTimeout(timer);


    timer=setTimeout(()=>{


        alert(
        "10 minutes inactive. You have been logged out."
        );


        logout();


    },logoutTime);


}




// ===============================
// USER ACTIVITY CHECK
// ===============================


window.onload = resetTimer;


document.onmousemove = resetTimer;

document.onkeypress = resetTimer;

document.onclick = resetTimer;

document.onscroll = resetTimer;
