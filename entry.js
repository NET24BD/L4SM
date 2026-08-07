const scriptURL = "আপনার_APPS_SCRIPT_URL";



// Login Check

let loginStatus = localStorage.getItem("loginStatus");


if(loginStatus !== "true"){

    window.location.href="login.html";

}




// User ID

let userId = localStorage.getItem("userId");



window.onload=function(){


document.getElementById("reference").value = userId;


};





// Submit

document
.getElementById("entryForm")
.addEventListener("submit",function(e){


e.preventDefault();



let data={


customerId:
document.getElementById("customerId").value,


problem:
document.getElementById("problem").value,


reference:
userId


};




fetch(scriptURL,{


method:"POST",


mode:"no-cors",


headers:{

"Content-Type":"application/json"

},


body:JSON.stringify(data)


})

.then(()=>{


alert("Entry Saved");


document
.getElementById("entryForm")
.reset();


document.getElementById("reference").value=userId;


});



});
