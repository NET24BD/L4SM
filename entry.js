const scriptURL = "YOUR_WEB_APP_URL";



// Load User ID Automatically

window.onload=function(){


let user =
localStorage.getItem("userId");



if(user){

document.getElementById("reference").value=user;

}


};





document
.getElementById("entryForm")
.addEventListener("submit",function(e){


e.preventDefault();



let customerId =
document.getElementById("customerId").value;



let problem =
document.getElementById("problem").value;



let reference =
document.getElementById("reference").value;





let data={


customerId:customerId,

problem:problem,

reference:reference


};





fetch(scriptURL,{


method:"POST",


headers:{


"Content-Type":"application/json"

},


body:JSON.stringify(data)


})



.then(response=>response.text())



.then(result=>{


alert("Entry Saved Successfully");


document
.getElementById("entryForm")
.reset();



// Reference আবার বসানো

let user =
localStorage.getItem("userId");


if(user){

document.getElementById("reference").value=user;

}



})



.catch(error=>{


alert("Error Saving Data");


console.log(error);


});


});
