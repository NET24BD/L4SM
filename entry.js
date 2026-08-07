const scriptURL = "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



// ===============================
// DASHBOARD CHECK
// ===============================

let urlParams = new URLSearchParams(window.location.search);

let from = urlParams.get("from");


if(from !== "dashboard"){

    window.location.href = "dashboard.html";

}






// ===============================
// AUTO REFERENCE
// ===============================


window.onload=function(){


    let userId = localStorage.getItem("userId");


    if(userId){


        document.getElementById("reference").value=userId;


    }


};






// ===============================
// SUBMIT
// ===============================


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
document.getElementById("reference").value


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


alert("Entry Saved Successfully");



document
.getElementById("entryForm")
.reset();



document.getElementById("reference").value =
localStorage.getItem("userId");



})



.catch(error=>{


console.log(error);


alert("Save Error");


});



});
