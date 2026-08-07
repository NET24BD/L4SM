// ===============================
// GOOGLE APPS SCRIPT URL
// ===============================

const scriptURL = "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";




// ===============================
// AUTO REFERENCE LOAD
// ===============================

window.addEventListener("load", function(){


    let userId = localStorage.getItem("userId");


    if(userId){

        document.getElementById("reference").value = userId;

    }
    else{

        document.getElementById("reference").value = "";

    }


});







// ===============================
// FORM SUBMIT
// ===============================

document
.getElementById("entryForm")
.addEventListener("submit", function(e){


    e.preventDefault();




    let customerId =
    document.getElementById("customerId").value.trim();




    let problem =
    document.getElementById("problem").value.trim();




    let reference =
    document.getElementById("reference").value.trim();





    if(customerId === "" || problem === ""){


        alert("Please fill Customer ID and Problem");

        return;

    }







    let data = {


        customerId: customerId,

        problem: problem,

        reference: reference


    };







    fetch(scriptURL, {


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

        let userId =
        localStorage.getItem("userId");



        if(userId){

            document.getElementById("reference").value = userId;

        }



    })



    .catch(error=>{


        console.log(error);


        alert("❌ Entry Save Failed");


    });



});
