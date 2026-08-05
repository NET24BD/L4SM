const API_URL = 
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");



loginForm.addEventListener("submit", function(e){

    e.preventDefault();


    const username = document
    .getElementById("username")
    .value
    .trim();


    const password = document
    .getElementById("password")
    .value
    .trim();



    if(username === "" || password === ""){

        message.style.color = "red";
        message.innerHTML = "Enter Username and Password";

        return;

    }



    loginBtn.disabled = true;
    loginBtn.innerHTML = "CHECKING...";



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


    .then(response=>response.json())


    .then(data=>{


        console.log(data);



        if(data.success === true){



            // Save User Data

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

            message.innerHTML="Login Successful";




            // Role Based Redirect

            setTimeout(()=>{


                let role = data.role;


                if(role === "Admin"){

                    window.location.href="dashboard.html";

                }


                else if(role === "Support"){

                    window.location.href="support.html";

                }


                else if(role === "Caller"){

                    window.location.href="call.html";

                }


                else if(role === "Manager"){

                    window.location.href="manager.html";

                }


                else if(role === "Guest"){

                    window.location.href="guest.html";

                }


                else{

                    window.location.href="guest.html";

                }



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

        message.innerHTML="Server Connection Error";


    })


    .finally(()=>{


        loginBtn.disabled=false;

        loginBtn.innerHTML="LOGIN";


    });



});





// Password Show / Hide

const togglePassword = document.getElementById("togglePassword");


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
