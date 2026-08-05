const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



const form=document.getElementById("loginForm");

const message=document.getElementById("message");

const button=document.getElementById("loginBtn");



form.addEventListener("submit",function(e){


e.preventDefault();



let username=
document.getElementById("username").value.trim();



let password=
document.getElementById("password").value.trim();




button.innerHTML="CHECKING...";

button.disabled=true;




fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"text/plain;charset=utf-8"

},


body:JSON.stringify({

username:username,

password:password

})


})


.then(res=>res.json())


.then(data=>{


console.log(data);



if(data.success){



localStorage.setItem("isLogin","true");

localStorage.setItem("username",data.username);

localStorage.setItem("name",data.name);

localStorage.setItem("role",data.role);

localStorage.setItem("picture",data.picture);



message.style.color="green";

message.innerHTML="Login Success";



setTimeout(()=>{


window.location.href="dashboard.html";


},1000);



}

else{


message.style.color="red";

message.innerHTML=data.message;


}


})


.catch(err=>{


console.log(err);


message.style.color="red";

message.innerHTML="Server Connection Error";


})


.finally(()=>{


button.disabled=false;

button.innerHTML="LOGIN";


});


});





// Password Show Hide


document
.getElementById("togglePassword")
.onclick=function(){


let pass=document.getElementById("password");


if(pass.type==="password"){


pass.type="text";

this.innerHTML='<i class="fa-solid fa-eye-slash"></i>';


}

else{


pass.type="password";

this.innerHTML='<i class="fa-solid fa-eye"></i>';


}


};
