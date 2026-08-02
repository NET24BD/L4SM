const API_URL =
"https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec";




// Enter Button Login

function enterLogin(event){

    if(event.key === "Enter"){

        login();

    }

}





function login(){



let username =
document.getElementById("username").value.trim();



let password =
document.getElementById("password").value.trim();





if(username=="" || password==""){


document.getElementById("msg").innerHTML =
"Enter Username & Password";


return;


}




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



// Save User

localStorage.setItem(

"user",

JSON.stringify(data.user)

);





let role=data.user.role;





// Redirect Dashboard



switch(role){



case "admin":

window.location.href="1d.html";

break;



case "support":

window.location.href="2S.html";

break;



case "call":

window.location.href="3C.html";

break;



case "guest":

window.location.href="G.html";

break;



default:


document.getElementById("msg").innerHTML =
"Invalid Role";


}



}



else{


document.getElementById("msg").innerHTML =
data.message;


}



})



.catch(error=>{


console.log(error);


document.getElementById("msg").innerHTML =
"Server Error";


});



}
