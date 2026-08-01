// Card Redirect

function openPage(page){

window.location.href = page;

}




// Profile Dropdown

function toggleProfileMenu(){

let menu=document.getElementById("profileMenu");


if(menu.style.display==="block"){

menu.style.display="none";

}

else{

menu.style.display="block";

}


}




// Logout

function logout(){

localStorage.clear();

window.location.href="login.html";

}





// Load User Data

let username=localStorage.getItem("username");

let photo=localStorage.getItem("photo");



if(username){

document.getElementById("username").innerHTML=username;

}



if(photo){

document.getElementById("profileImg").src=photo;

}
