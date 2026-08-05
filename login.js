const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



const loginForm =
document.getElementById("loginForm");


const message =
document.getElementById("message");


const loginBtn =
document.getElementById("loginBtn");




// ===============================
// LOGIN
// ===============================


loginForm.addEventListener("submit",function(e){


e.preventDefault();




let username =
document.getElementById("username")
.value
.trim();



let password =
document.getElementById("password")
.value
.trim();





if(username==="" || password===""){


message.style.color="red";

message.innerHTML =
"Enter Username and Password";


return;


}





loginBtn.disabled=true;

loginBtn.innerHTML="CHECKING...";





fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},



body:JSON.stringify({


action:"login",


username:username,


password:String(password)



})



})





.then(response=>response.json())





.then(data=>{



console.log("LOGIN RESPONSE:",data);






if(data.success===true){



localStorage.setItem(
"isLogin",
"true"
);



localStorage.setItem(
"username",
data.username
);



localStorage.setItem(
"name",
data.name
);



localStorage.setItem(
"role",
data.role
);



localStorage.setItem(
"picture",
data.picture || ""
);






message.style.color="green";


message.innerHTML =
"Login Successful";






setTimeout(()=>{



let role =
data.role;



switch(role){



case "Admin":

window.location.href="dashboard.html";

break;




case "Support":

window.location.href="support.html";

break;





case "Caller":

window.location.href="call.html";

break;





case "Manager":

window.location.href="manager.html";

break;





case "Guest":

window.location.href="guest.html";

break;





default:

window.location.href="guest.html";



}





},800);





}

else{


message.style.color="red";


message.innerHTML =
data.message || "Login Failed";



}





})





.catch(error=>{


console.log(error);



message.style.color="red";


message.innerHTML =
"Server Connection Error";



})





.finally(()=>{


loginBtn.disabled=false;


loginBtn.innerHTML="LOGIN";


});



});









// ===============================
// SHOW / HIDE PASSWORD
// ===============================


const togglePassword =
document.getElementById("togglePassword");




if(togglePassword){



togglePassword.onclick=function(){



const password =
document.getElementById("password");





if(password.type==="password"){



password.type="text";


togglePassword.innerHTML =
'<i class="fa-solid fa-eye-slash"></i>';



}

else{


password.type="password";


togglePassword.innerHTML =
'<i class="fa-solid fa-eye"></i>';



}



};



}
