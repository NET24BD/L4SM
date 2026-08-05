// =====================================
// DASHBOARD LOAD
// =====================================


document.addEventListener("DOMContentLoaded",function(){



let name =
localStorage.getItem("name");



let picture =
localStorage.getItem("picture");





// HEADER NAME

let headerName =
document.getElementById("headerName");


if(headerName){

headerName.innerHTML =
name || "User";

}





// WELCOME NAME

let welcomeName =
document.getElementById("welcomeName");


if(welcomeName){

welcomeName.innerHTML =
name || "User";

}






// PROFILE IMAGE


let img =
document.getElementById("profileImg");



if(img && picture){


img.src = picture;


}




});









// SIDEBAR


function toggleSidebar(){


let sidebar =
document.getElementById("sidebar");


sidebar.classList.toggle("small");


}







// PAGE OPEN


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
