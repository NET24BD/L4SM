const scriptURL = "YOUR_GOOGLE_APPS_SCRIPT_URL";



// Auto Reference Load

window.onload = function(){


    let userId = localStorage.getItem("userId");


    if(userId){

        document.getElementById("reference").value = userId;

    }

    else{

        document.getElementById("reference").value = "Unknown";

    }


};






// Form Submit


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


mode:"no-cors",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify(data)



})



.then(()=>{


alert("✅ Entry Added Successfully");


document
.getElementById("entryForm")
.reset();


// Reference আবার বসাবে

document.getElementById("reference").value =
localStorage.getItem("userId");



})



.catch(error=>{


alert(
"❌ Error : "+error
);


});



});
