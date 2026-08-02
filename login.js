
// Bag click করলে Login Portal বের হবে

function openBag(){


document
.getElementById("loginBox")
.classList
.add("show");


}




// Google Sheet API URL

const API_URL =
"https://script.google.com/macros/s/YOUR_URL/exec";




function login(){


let username =
document.getElementById("username").value;


let password =
document.getElementById("password").value;



fetch(API_URL,{

method:"POST",

body:JSON.stringify({

username,
password

})


})


.then(res=>res.json())


.then(data=>{


if(data.success){


localStorage.setItem(
"user",
JSON.stringify(data.user)
);



let role=data.user.role;



if(role=="admin"){

location.href="1d.html";

}

else if(role=="support"){

location.href="2S.html";

}


else if(role=="call"){

location.href="3C.html";

}


else if(role=="guest"){

location.href="G.html";

}


}


else{


document.getElementById("msg")
.innerHTML=data.message;


}


})

.catch(()=>{


document.getElementById("msg")
.innerHTML="Server Error";


});


}
