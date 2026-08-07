const scriptURL = "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



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
