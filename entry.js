// ==============================
// AUTO REFERENCE USER
// ==============================

document.addEventListener("DOMContentLoaded", function(){


    let username = localStorage.getItem("username");


    if(username){

        document.getElementById("reference").value = username;

    }
    else{

        document.getElementById("reference").value = "Unknown";

    }


});







// ==============================
// SUBMIT ENTRY
// ==============================

function submitEntry(){



    let customerId =
    document.getElementById("customerId").value.trim();



    let problem =
    document.getElementById("problem").value.trim();



    let reference =
    document.getElementById("reference").value;






    let msg =
    document.getElementById("msg");







    if(customerId === "" || problem === ""){


        msg.style.color="red";

        msg.innerText="Please fill all required fields";


        return;

    }







    let entryData = {


        customerId: customerId,

        problem: problem,

        reference: reference,

        date: new Date().toLocaleString()


    };







    console.log(entryData);






    // ==========================
    // GOOGLE SHEET API HERE
    // ==========================


    /*
    
    fetch("YOUR_GOOGLE_SCRIPT_URL",{

        method:"POST",

        body:JSON.stringify(entryData)

    })
    .then(res=>res.json())
    .then(data=>{

        console.log(data);

    });

    */








    msg.style.color="green";

    msg.innerText="Entry Saved Successfully";







    // CLEAR FORM


    document.getElementById("customerId").value="";

    document.getElementById("problem").value="";



}
