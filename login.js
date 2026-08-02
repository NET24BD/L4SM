// ================================
// eSupport Login System
// ================================

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const msg = document.getElementById("message");

form.addEventListener("submit", login);

async function login(e){

    e.preventDefault();

    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();

    if(username==="" || password===""){
        showMessage("Please enter Username & Password","red");
        return;
    }

    btn.disabled=true;
    btn.innerHTML="Logging in...";

    try{

        const res=await fetch(WEB_APP_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                action:"login",
                username:username,
                password:password
            })
        });

        const data=await res.json();

        if(data.success){

            // Save Login Session
            sessionStorage.setItem("user",JSON.stringify(data));

            showMessage("Login Successful","green");

            setTimeout(()=>{

                switch(data.role){

                    case "admin":
                        location.href="admin.html";
                        break;

                    case "support":
                        location.href="support.html";
                        break;

                    case "call":
                        location.href="call.html";
                        break;

                    case "manager":
                        location.href="manager.html";
                        break;

                    default:
                        location.href="dashboard.html";
                        break;

                }

            },500);

        }else{

            showMessage(data.message,"red");

        }

    }catch(err){

        console.error(err);

        showMessage("Server Connection Failed","red");

    }

    btn.disabled=false;
    btn.innerHTML="LOGIN";

}

function showMessage(text,color){

    msg.innerHTML=text;
    msg.style.color=color;

}
