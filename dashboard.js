// ===============================
// LOGIN CHECK
// ===============================

if(localStorage.getItem("loggedIn") !== "true"){

    window.location.replace("login.html");

}



// ===============================
// PREVENT BACK AFTER LOGOUT
// ===============================

history.pushState(null, null, location.href);

window.onpopstate = function(){

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
// LOGOUT FUNCTION
// ===============================

function logout(){

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("photo");


    window.location.replace("login.html");

}





// ===============================
// USER DATA LOAD
// ===============================


let username=localStorage.getItem("username");

let photo=localStorage.getItem("photo");



if(username){

document.getElementById("username").innerHTML=username;

}



if(photo){

document.getElementById("profileImg").src=photo;

}





// ===============================
// AUTO LOGOUT AFTER 10 MINUTES
// ===============================


let logoutTime = 10 * 60 * 1000; //10 minutes

let timer;



function resetTimer(){


clearTimeout(timer);



timer=setTimeout(()=>{


alert("10 minutes inactive. You have been logged out.");

logout();



}, logoutTime);


}




// User activity detect


window.onload = resetTimer;


document.onmousemove = resetTimer;

document.onkeypress = resetTimer;

document.onclick = resetTimer;

document.onscroll = resetTimer;
