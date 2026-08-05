const API_URL = "https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");


loginForm.addEventListener("submit", function(e){

    e.preventDefault();


    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();


    if(username === "" || password === ""){

        message.style.color = "red";
        message.innerHTML = "Enter username and password";
        return;

    }


    loginBtn.disabled = true;
    loginBtn.innerHTML = "CHECKING...";


    fetch(API_URL, {

        method: "POST",

        headers:{
            "Content-Type":"text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            username: username,
            password: password

        })

    })


    .then(response => response.json())


    .then(data => {


        console.log(data);


        if(data.success === true){


            localStorage.setItem("isLogin","true");

            localStorage.setItem("username",data.username);

            localStorage.setItem("name",data.name);

            localStorage.setItem("role",data.role);

            localStorage.setItem("picture",data.picture);



            message.style.color="green";
            message.innerHTML="Login Successful";


            setTimeout(function(){

                window.location.href="dashboard.html";

            },1000);



        }

        else{


            message.style.color="red";
            message.innerHTML=data.message;


        }


    })


    .catch(error=>{


        console.log(error);


        message.style.color="red";
        message.innerHTML="Server Error";


    })


    .finally(()=>{

        loginBtn.disabled=false;
        loginBtn.innerHTML="LOGIN";

    });



});
