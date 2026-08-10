"use strict";


// ============================
// GLOBAL VARIABLE
// ============================

let selectedRow = null;





// ============================
// BACK BUTTON
// ============================

function goBack(){

    window.history.back();

}







// ============================
// FILTER SHOW / HIDE
// ============================

function toggleFilter(){

    let filter =
    document.getElementById("filterBox");


    filter.classList.toggle("show");


}







// ============================
// PROFILE MENU
// ============================

function toggleProfileMenu(){


    let menu =
    document.getElementById("profileMenu");


    if(menu.style.display === "block"){

        menu.style.display="none";

    }

    else{

        menu.style.display="block";

    }


}






// CLOSE PROFILE OUTSIDE CLICK

document.addEventListener(
"click",
function(e){


    let profile =
    document.querySelector(".profile");


    let menu =
    document.getElementById("profileMenu");



    if(
        profile &&
        !profile.contains(e.target)
    ){

        menu.style.display="none";

    }


});








// ============================
// LOGOUT
// ============================


function logout(){


    let confirmLogout =
    confirm(
        "Are you sure you want to logout?"
    );


    if(confirmLogout){


        localStorage.clear();

        sessionStorage.clear();



        window.location.href =
        "login.html";


    }


}








// ============================
// OPEN VIEW POPUP
// ============================


function openModal(button){


    selectedRow =
    button.closest("tr");



    let data =
    selectedRow.children;



    document.getElementById("mCustomer").value =
    data[0].innerText.trim();



    document.getElementById("mProblem").value =
    data[1].innerText.trim();



    document.getElementById("mReference").value =
    data[2].innerText.trim();



    document.getElementById("mDate").value =
    data[3].innerText.trim();





    document.getElementById("mSupport").value =
    selectedRow.dataset.support || "";



    document.getElementById("mSupportWork").value =
    selectedRow.dataset.supportWork || "";



    document.getElementById("mCall").value =
    selectedRow.dataset.call || "";



    document.getElementById("mCallWork").value =
    selectedRow.dataset.callWork || "";





    document.getElementById("viewModal")
    .style.display="flex";


}







// ============================
// CLOSE POPUP
// ============================


function closeModal(){


    document.getElementById("viewModal")
    .style.display="none";


    selectedRow=null;


}






// CLOSE CLICK OUTSIDE

window.onclick=function(e){


    let modal =
    document.getElementById("viewModal");



    if(e.target === modal){


        closeModal();


    }


}








// ============================
// SUBMIT UPDATE
// ============================


function submitData(){


    if(!selectedRow){

        return;

    }




    selectedRow.children[0].innerText =
    document.getElementById("mCustomer").value;



    selectedRow.children[1].innerText =
    document.getElementById("mProblem").value;



    selectedRow.children[2].innerText =
    document.getElementById("mReference").value;



    selectedRow.children[3].innerText =
    document.getElementById("mDate").value;







    selectedRow.dataset.support =
    document.getElementById("mSupport").value;



    selectedRow.dataset.supportWork =
    document.getElementById("mSupportWork").value;



    selectedRow.dataset.call =
    document.getElementById("mCall").value;



    selectedRow.dataset.callWork =
    document.getElementById("mCallWork").value;





    alert(
        "History Updated Successfully"
    );



    closeModal();


}








// ============================
// DELETE TABLE ROW
// ============================


function deleteRow(button){


    let row =
    button.closest("tr");



    if(
        confirm(
        "Delete this history?"
        )
    ){


        row.remove();


    }


}








// ============================
// DELETE FROM POPUP
// ============================


function deleteData(){



    if(!selectedRow){

        return;

    }



    if(
        confirm(
        "Delete this history?"
        )
    ){


        selectedRow.remove();


        closeModal();


    }


}








// ============================
// FILTER FUNCTION
// ============================


function filterData(){



    let fromDate =
    document.getElementById("fromDate")
    .value;



    let toDate =
    document.getElementById("toDate")
    .value;




    let search =
    document.getElementById("search")
    .value
    .toLowerCase();







    document
    .querySelectorAll("#historyTable tr")
    .forEach(row=>{


        let date =
        row.children[3]
        .innerText;



        let parts =
        date.split("-");



        let rowDate =
        new Date(
            parts[2],
            parts[1]-1,
            parts[0]
        );



        let show=true;






        if(fromDate){


            show =
            rowDate >=
            new Date(fromDate);


        }






        if(
            toDate &&
            show
        ){


            show =
            rowDate <=
            new Date(toDate);


        }







        if(
            search &&
            show
        ){


            show =
            row.innerText
            .toLowerCase()
            .includes(search);


        }







        row.style.display =
        show
        ?
        ""
        :
        "none";



    });



}








// ============================
// RESET FILTER
// ============================


function resetFilter(){



    document.getElementById("fromDate")
    .value="";



    document.getElementById("toDate")
    .value="";



    document.getElementById("search")
    .value="";







    document
    .querySelectorAll("#historyTable tr")
    .forEach(row=>{


        row.style.display="";


    });


}








// ============================
// ESC CLOSE POPUP
// ============================


document.addEventListener(
"keydown",
function(e){


    if(e.key==="Escape"){


        closeModal();


    }


});
