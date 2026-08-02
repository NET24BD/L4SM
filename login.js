// ================================
// AUTO ANIMATION CONTROL
// ================================


window.onload = function(){


    setTimeout(()=>{


        // Bag open

        document
        .getElementById("bag")
        .classList
        .add("open");



    },5500);



    setTimeout(()=>{


        // Portal show

        document
        .getElementById("portal")
        .classList
        .add("show");



    },6500);



};





// ================================
// GOOGLE SHEET LOGIN API
// ================================


const API_URL = 
"https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec";





function login(){



let username =
document.getElementById("username").value;



let password =
document.getElementById("password").value;




if(username=="" || password==""){


document.getElementById("msg")
.innerHTML="Enter Username & Password";


return;


}





// Fingerprint Scan Effect


document.querySelector(".fingerprint")
.innerHTML="🔍";






fetch(API_URL,{


method:"POST",


body:JSON.stringify({


username:username,


password:password



})



})



.then(response=>response.json())



.then(data=>{



if(data.success){



// Save User Data


localStorage.setItem(
"user",
JSON.stringify(data.user)
);





let role=data.user.role;





// =====================
// ROLE REDIRECT
// =====================



if(role=="admin"){


window.location.href="1d.html";


}



else if(role=="support"){


window.location.href="2S.html";


}



else if(role=="call"){


window.location.href="3C.html";


}



else if(role=="guest"){


window.location.href="G.html";


}



else{


document.getElementById("msg")
.innerHTML=
"Invalid Role";


}



}



else{


document.getElementById("msg")
.innerHTML=
data.message;


}



})



.catch(error=>{



console.log(error);



document.getElementById("msg")
.innerHTML=
"Server Error";


});



}
