const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



// ===============================
// PAGE LOAD
// ===============================


document.addEventListener("DOMContentLoaded",()=>{


loadAccount();


});







// ===============================
// LOAD ACCOUNT
// ===============================


function loadAccount(){


let name =
localStorage.getItem("name");


let role =
localStorage.getItem("role");


let picture =
localStorage.getItem("picture");





document.getElementById("userName").innerHTML =
name || "User";



document.getElementById("userRole").innerHTML =
role || "Guest";





if(picture){


document.getElementById("profileImg").src =
picture;


}



}









// ===============================
// BACK BUTTON
// ===============================


document.getElementById("backBtn").onclick=function(){


history.back();


};









// ===============================
// CHANGE PASSWORD
// ===============================


document.getElementById("changePasswordBtn")
.onclick=function(){



let oldPassword =
document.getElementById("oldPassword").value.trim();



let newPassword =
document.getElementById("newPassword").value.trim();



let confirmPassword =
document.getElementById("confirmPassword").value.trim();





if(oldPassword==="" || newPassword==="" || confirmPassword===""){


showPopup(
"Warning",
"All fields are required"
);


return;


}





if(newPassword !== confirmPassword){


showPopup(
"Warning",
"New password not match"
);


return;


}






let username =
localStorage.getItem("username");





let data={


action:"changePassword",


username:username,


oldPassword:oldPassword,


newPassword:newPassword



};






showLoading("Updating Password...");







fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},


body:JSON.stringify(data)



})





.then(res=>res.json())



.then(result=>{



hideLoading();





showPopup(

result.success?
"Success"
:
"Error",

result.message

);






if(result.success){



document.getElementById("oldPassword").value="";

document.getElementById("newPassword").value="";

document.getElementById("confirmPassword").value="";



}



})





.catch(error=>{



console.log(error);



hideLoading();



showPopup(
"Error",
"Server Connection Error"
);



});




};









// ===============================
// POPUP
// ===============================


function showPopup(title,message){



document.getElementById("popupTitle").innerHTML =
title;



document.getElementById("popupMessage").innerHTML =
message;



document.getElementById("popupBox").style.display =
"flex";


}






function closePopup(){


document.getElementById("popupBox").style.display =
"none";


}
