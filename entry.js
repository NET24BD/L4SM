const scriptURL = "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



// ===============================
// AUTO LOAD USER REFERENCE
// ===============================

window.addEventListener("load", function(){

    let userId = localStorage.getItem("userId");


    if(userId && userId !== ""){

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


        alert("Please Fill All Required Fields");

        return;

    }





    let formData = {


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


        body:JSON.stringify(formData)


    })



    .then(()=>{


        alert("✅ Entry Successfully Added");



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


        alert("❌ Data Save Failed");


    });



});
