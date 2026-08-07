// =====================================
// LOAD ENTRY POPUP HTML
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    fetch("entry.html")
        .then(response => response.text())
        .then(data => {

            document.getElementById("entryContainer").innerHTML = data;

        })
        .catch(error => {

            console.log("Entry Load Error:", error);

        });

});




// =====================================
// OPEN ENTRY POPUP
// =====================================

function openEntry() {


    let modal = document.getElementById("entryModal");


    if (!modal) {

        console.log("Entry popup not loaded yet");

        return;

    }



    let user =
    document.getElementById("headerName").innerText;



    document.getElementById("reference").value = user;



    modal.classList.add("show");


}






// =====================================
// CLOSE ENTRY POPUP
// =====================================

function closeEntry() {


    let modal =
    document.getElementById("entryModal");



    if (modal) {

        modal.classList.remove("show");

    }


}







// =====================================
// CLOSE WHEN CLICK OUTSIDE
// =====================================

document.addEventListener("click", function (e) {


    let modal =
    document.getElementById("entryModal");



    if (modal && e.target === modal) {

        closeEntry();

    }


});







// =====================================
// ESC KEY CLOSE
// =====================================

document.addEventListener("keydown", function (e) {


    if (e.key === "Escape") {

        closeEntry();

    }


});







// =====================================
// SUBMIT ENTRY
// =====================================

document.addEventListener("click", function (e) {


    if (e.target.id === "submitEntry") {



        let customerId =
        document.getElementById("customerId").value.trim();



        let problem =
        document.getElementById("problem").value.trim();



        let reference =
        document.getElementById("reference").value;






        if (customerId === "" || problem === "") {


            alert("Please fill all required fields");

            return;


        }







        let entryData = {


            customerId: customerId,

            problem: problem,

            reference: reference,


            date: new Date().toLocaleString()


        };






        console.log("New Entry:", entryData);






        alert("Entry Created Successfully");







        // CLEAR FORM


        document.getElementById("customerId").value = "";

        document.getElementById("problem").value = "";







        closeEntry();




    }


});
