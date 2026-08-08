// =====================================
// NEW ENTRY JS
// =====================================


// =====================================
// GOOGLE APPS SCRIPT API
// =====================================

const ENTRY_API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================
// BACK TO DASHBOARD
// =====================================

function goBack(){

    window.location.href = "dashboard.html";

}


// =====================================
// AUTO REFERENCE
// =====================================

document.addEventListener("DOMContentLoaded", function(){

    const referenceInput =
        document.getElementById("reference");

    if(!referenceInput){
        return;
    }

    const username =
        localStorage.getItem("username");

    const name =
        localStorage.getItem("name");

    referenceInput.value =
        username || name || "Unknown";

});


// =====================================
// SUBMIT NEW ENTRY
// =====================================

function submitEntry(){

    const customerInput =
        document.getElementById("customerId");

    const problemInput =
        document.getElementById("problem");

    const referenceInput =
        document.getElementById("reference");

    const msg =
        document.getElementById("msg");


    if(!customerInput || !problemInput || !referenceInput){
        return;
    }


    const customerId =
        customerInput.value.trim();

    const problem =
        problemInput.value.trim();

    const reference =
        referenceInput.value.trim();


    // =================================
    // VALIDATION
    // =================================

    if(customerId === ""){

        showEntryMessage(
            "Please enter Customer ID",
            "error"
        );

        customerInput.focus();

        return;

    }


    if(problem === ""){

        showEntryMessage(
            "Please write customer problem",
            "error"
        );

        problemInput.focus();

        return;

    }


    // =================================
    // LOADING MESSAGE
    // =================================

    showEntryMessage(
        "Saving Entry...",
        "loading"
    );


    // =================================
    // DISABLE SUBMIT BUTTON
    // =================================

    const submitButton =
        document.querySelector(".submit-btn");


    if(submitButton){

        submitButton.disabled = true;

        submitButton.style.opacity = "0.7";

        submitButton.style.cursor =
            "not-allowed";

    }


    // =================================
    // SEND DATA
    // =================================

    fetch(ENTRY_API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            action: "newEntry",

            customerId: customerId,

            problem: problem,

            reference: reference

        })

    })

    .then(function(response){

        if(!response.ok){

            throw new Error(
                "HTTP Error " + response.status
            );

        }

        return response.json();

    })

    .then(function(data){

        console.log(
            "New Entry Response:",
            data
        );


        // =================================
        // SUCCESS
        // =================================

        if(
            data.status === "success" ||
            data.success === true
        ){

            showEntryMessage(
                data.message ||
                "Entry Saved Successfully ✔",
                "success"
            );


            // Clear fields

            customerInput.value = "";

            problemInput.value = "";


            // Reference আবার set করা

            const username =
                localStorage.getItem("username");

            const name =
                localStorage.getItem("name");

            referenceInput.value =
                username || name || "Unknown";


        }

        else{

            showEntryMessage(

                data.message ||
                "Entry Save Failed",

                "error"

            );

        }

    })

    .catch(function(error){

        console.error(
            "New Entry Error:",
            error
        );


        showEntryMessage(
            "Server Error. Please try again.",
            "error"
        );

    })

    .finally(function(){

        // =================================
        // ENABLE SUBMIT BUTTON
        // =================================

        if(submitButton){

            submitButton.disabled = false;

            submitButton.style.opacity = "1";

            submitButton.style.cursor =
                "pointer";

        }

    });

}


// =====================================
// MESSAGE SYSTEM
// =====================================

function showEntryMessage(message, type){

    const msg =
        document.getElementById("msg");


    if(!msg){
        return;
    }


    msg.innerText = message;


    // SUCCESS

    if(type === "success"){

        msg.style.color = "#16a34a";

    }


    // ERROR

    else if(type === "error"){

        msg.style.color = "#dc2626";

    }


    // LOADING

    else if(type === "loading"){

        msg.style.color = "#2563eb";

    }


    else{

        msg.style.color = "#334155";

    }

}


// =====================================
// ENTER KEY SUPPORT
// =====================================

document.addEventListener(
    "keydown",
    function(event){

        if(event.key !== "Enter"){
            return;
        }


        // Textarea-তে Enter চাপলে submit করবে না

        if(
            event.target &&
            event.target.tagName === "TEXTAREA"
        ){

            return;

        }


        const customerInput =
            document.getElementById("customerId");

        const problemInput =
            document.getElementById("problem");


        if(
            document.activeElement ===
            customerInput ||

            document.activeElement ===
            problemInput
        ){

            event.preventDefault();

            submitEntry();

        }

    }
);


// =====================================
// PAGE SECURITY
// =====================================

window.addEventListener(
    "pageshow",
    function(){

        const isLogin =
            localStorage.getItem("isLogin");

        if(isLogin !== "true"){

            window.location.replace(
                "login.html"
            );

        }

    }
);


// =====================================
// ENTRY JS READY
// =====================================

console.log(
    "Entry System Ready"
);
