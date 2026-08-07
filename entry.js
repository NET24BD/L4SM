const scriptURL = "YOUR_GOOGLE_APPS_SCRIPT_URL";



// ============================
// DASHBOARD CHECK
// ============================

let access = sessionStorage.getItem("fromDashboard");


if(access !== "yes"){

    window.location.href = "dashboard.html";

}



// ============================
// AUTO REFERENCE
// ============================


window.onload=function(){


let userId = localStorage.getItem("userId");


if(userId){

document.getElementById("reference").value = userId;

}


};






// ============================
// SUBMIT DATA
// ============================


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


alert("✅ Entry Saved Successfully");


document
.getElementById("entryForm")
.reset();



let userId =
localStorage.getItem("userId");


document.getElementById("reference").value=userId;



})



.catch(error=>{


console.log(error);

alert("❌ Save Failed");


});



});
