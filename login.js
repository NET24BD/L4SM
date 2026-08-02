const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";


document.getElementById("loginForm").addEventListener("submit", function(e){

    e.preventDefault();


    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    let message = document.getElementById("message");
    let btn = document.getElementById("loginBtn");


    if(username === "" || password === ""){

        message.innerHTML = "Enter Username & Password";
        message.style.color="red";
        return;

    }


    btn.innerHTML="Checking...";
    btn.disabled=true;



    fetch(WEB_APP_URL,{

        method:"POST",

        body: JSON.stringify({

            action:"login",

            username:username,

            password:password

        })

    })

    .then(res=>res.json())

    .then(data=>{


        if(data.success){


            sessionStorage.setItem(
                "user",
                JSON.stringify(data)
            );


            message.innerHTML="Login Successful";
            message.style.color="green";



            setTimeout(()=>{


                if(data.role=="admin"){

                    window.location.href="admin.html";

                }

                else if(data.role=="support"){

                    window.location.href="support.html";

                }

                else if(data.role=="call"){

                    window.location.href="call.html";

                }

                else{

                    window.location.href="dashboard.html";

                }


            },500);



        }

        else{


            message.innerHTML=data.message;
            message.style.color="red";


        }



    })


    .catch(error=>{


        console.log(error);

        message.innerHTML="Server Connection Failed";
        message.style.color="red";


    })


    .finally(()=>{

        btn.innerHTML="LOGIN";
        btn.disabled=false;

    });



});
