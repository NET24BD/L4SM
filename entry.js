// ================================
// LOAD ENTRY POPUP
// ================================

fetch("entry.html")
.then(function(response){

    return response.text();

})
.then(function(html){

    document.getElementById("entryContainer").innerHTML = html;


})
.catch(function(error){

    console.log("Entry Error:", error);

});




// ================================
// OPEN ENTRY
// ================================

function openEntry(){


    let modal = document.getElementById("entryModal");


    if(!modal){

        alert("Entry popup not loaded");

        return;

    }



    let user = document.getElementById("headerName").innerText;


    document.getElementById("reference").value = user;



    modal.style.display = "flex";


}






// ================================
// CLOSE ENTRY
// ================================

function closeEntry(){


    let modal = document.getElementById("entryModal");


    if(modal){

        modal.style.display = "none";

    }


}






// ================================
// OUTSIDE CLICK CLOSE
// ================================

window.addEventListener("click",function(e){


    let modal = document.getElementById("entryModal");


    if(e.target === modal){

        closeEntry();

    }


});





// ================================
// ESC CLOSE
// ================================

document.addEventListener("keydown",function(e){


    if(e.key==="Escape"){

        closeEntry();

    }


});






// ================================
// SUBMIT
// ================================

document.addEventListener("click",function(e){


if(e.target.id==="submitEntry"){


let customerId =
document.getElementById("customerId").value;


let problem =
document.getElementById("problem").value;



if(customerId==="" || problem===""){


alert("Please fill all fields");

return;


}



alert("Entry Saved Successfully");



closeEntry();


}



});
