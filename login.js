/* ==========================================
   LOGIN SYSTEM JS
   Google Sheet API Connection
========================================== */


const API_URL = "https://script.google.com/macros/s/AKfycbxV8eXKDB0HIuUfCPqMn-DH0icDIWv95diK_wgDs_M/dev";


/* ==========================
   LOGIN FUNCTION
========================== */

function loginUser(){

    let username = document
        .getElementById("username")
        .value
        .trim();

    let password = document
        .getElementById("password")
        .value
        .trim();


    if(username === "" || password === ""){

        alert("Username and Password required!");
        return;

    }


    let btn = document.getElementById("loginBtn");

    if(btn){
        btn.innerHTML = "Checking...";
        btn.disabled = true;
    }



    fetch(API_URL,{
        method:"POST",

        body:JSON.stringify({

            action:"login",
            username:username,
            password:password

        })

    })


    .then(res=>res.json())


    .then(data=>{


        if(btn){

            btn.innerHTML="Login";
            btn.disabled=false;

        }



        if(data.success){


            // Save Login Data

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );



            localStorage.setItem(
                "login",
                "true"
            );



            let role = data.user.role;



            // Role Based Dashboard


            if(role==="admin"){

                window.location.href="admin.html";

            }


            else if(role==="support"){

                window.location.href="support.html";

            }


            else if(role==="call"){

                window.location.href="call.html";

            }


            else if(role==="manager"){

                window.location.href="manager.html";

            }


            else if(role==="guest"){

                window.location.href="guest.html";

            }


            else{

                window.location.href="dashboard.html";

            }


        }


        else{


            alert(data.message || "Login Failed");


        }



    })


    .catch(error=>{


        console.log(error);

        alert(
          "Server connection error!"
        );


        if(btn){

            btn.innerHTML="Login";
            btn.disabled=false;

        }


    });



}



/* ==========================
   ENTER BUTTON LOGIN
========================== */


document.addEventListener(
"keypress",
function(e){

    if(e.key==="Enter"){

        loginUser();

    }

});



/* ==========================
   LOGOUT FUNCTION
========================== */


function logout(){


    localStorage.removeItem("user");

    localStorage.removeItem("login");


    window.location.href="index.html";


}



/* ==========================
   CHECK LOGIN
========================== */


function checkLogin(){


    let login =
    localStorage.getItem("login");


    if(login!=="true"){

        window.location.href="index.html";

    }


}
