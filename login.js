// =================================
// GOOGLE SHEET LOGIN SYSTEM
// =================================


const WEB_APP_URL = 
"https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";



// Login Form

document
.getElementById("loginForm")
.addEventListener("submit", login);





async function login(e){


    e.preventDefault();



    let username =
    document.getElementById("username").value.trim();



    let password =
    document.getElementById("password").value.trim();



    let message =
    document.getElementById("message");



    let btn =
    document.getElementById("loginBtn");




    if(username==="" || password===""){


        message.innerHTML =
        "Please enter Username and Password";


        message.style.color="red";

        return;

    }




    btn.innerHTML="Checking...";

    btn.disabled=true;





    try{



        let response = await fetch(WEB_APP_URL,{


            method:"POST",


            headers:{


                "Content-Type":
                "text/plain;charset=utf-8"


            },


            body:JSON.stringify({


                action:"login",


                username:username,


                password:password


            })


        });






        let data = await response.json();





        console.log(data);





        if(data.success){





            // SAVE LOGIN DATA


            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );



            localStorage.setItem(
                "loggedIn",
                "true"
            );



            localStorage.setItem(
                "username",
                data.name
            );



            localStorage.setItem(
                "photo",
                data.picture || "profile.png"
            );







            message.innerHTML =
            "Login Successful";


            message.style.color="green";







            setTimeout(()=>{





                // ROLE REDIRECT



                if(data.role==="admin"){


                    window.location.href="1d.html";


                }



                else if(data.role==="support"){


                    window.location.href="support.html";


                }




                else if(data.role==="call"){


                    window.location.href="call.html";


                }




                else if(data.role==="manager"){


                    window.location.href="manager.html";


                }




                else{


                    window.location.href="dashboard.html";


                }





            },700);






        }

        else{



            message.innerHTML =
            data.message;


            message.style.color="red";



        }






    }

    catch(error){



        console.log(error);



        message.innerHTML =
        "Server Connection Failed";


        message.style.color="red";



    }





    finally{



        btn.innerHTML="LOGIN";

        btn.disabled=false;



    }





}
