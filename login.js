const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



const loginForm =
document.getElementById("loginForm");


const message =
document.getElementById("message");


const loginBtn =
document.getElementById("loginBtn");





// =================================
// LOGIN
// =================================


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


loginBtn.innerHTML =
"CHECKING...";









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



console.log(
"LOGIN RESPONSE:",
data
);






if(data.success === true){





// ===============================
// SAVE LOGIN DATA
// ===============================


localStorage.setItem(
"auth",
"true"
);

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



// Session Timer Start

localStorage.setItem(
"lastActivity",
Date.now()
);









message.style.color="green";


message.innerHTML =
"Login Successful";







// ===============================
// ROLE REDIRECT
// ===============================


setTimeout(function(){



let role =
data.role;





if(role==="Admin"){


window.location.href =
"dashboard.html";


}





else if(role==="Support"){


window.location.href =
"std.html";


}





else if(role==="Caller"){


window.location.href =
"call.html";


}





else if(role==="Manager"){


window.location.href =
"manager.html";


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


loginBtn.innerHTML =
"LOGIN";



});



});









// =================================
// PASSWORD SHOW / HIDE
// =================================


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
