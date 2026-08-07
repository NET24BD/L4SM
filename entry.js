const scriptURL = "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



// ============================
// LOGIN CHECK
// ============================

let userId = localStorage.getItem("userId");


if(!userId){

    window.location.href = "login.html";

}



// ============================
// AUTO REFERENCE
// ============================

window.onload = function(){


    document.getElementById("reference").value = userId;


};





// ============================
// SUBMIT DATA
// ============================


document
.getElementById("entryForm")
.addEventListener("submit", function(e){


e.preventDefault();



let customerId =
document.getElementById("customerId").value;



let problem =
document.getElementById("problem").value;



let reference =
document.getElementById("reference").value;




let data = {


customerId: customerId,

problem: problem,

reference: reference


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


alert("✅ Entry Saved Successfully");



document
.getElementById("entryForm")
.reset();



// Reference আবার বসানো

document.getElementById("reference").value = userId;



})



.catch(error=>{


console.log(error);

alert("❌ Error Saving");


});



});
