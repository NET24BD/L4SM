"use strict";


// ===============================
// USER DATA LOAD
// ===============================


window.addEventListener("load",function(){


    let name =
    localStorage.getItem("name");


    let username =
    localStorage.getItem("username");


    let role =
    localStorage.getItem("role");


    let photo =
    localStorage.getItem("photo");



    if(name){

        document.getElementById("userName").innerText =
        name;

    }
    else if(username){

        document.getElementById("userName").innerText =
        username;

    }



    if(role){

        document.getElementById("userRole").innerText =
        role;

    }



    if(photo){

        document.getElementById("userPhoto").src =
        photo;

    }



    createPagination();

    showPage(1);


});






// ===============================
// GLOBAL
// ===============================


let selectedRow = null;


let currentPage = 1;


let rowsPerPage = 10;









// ===============================
// BACK BUTTON
// ===============================


function goBack(){

    history.back();

}









// ===============================
// FILTER SHOW HIDE
// ===============================


function toggleFilter(){


    document
    .getElementById("filterBox")
    .classList.toggle("show");


}









// ===============================
// PROFILE MENU
// ===============================


function toggleProfile(){


    let menu =
    document.getElementById("profileMenu");



    if(menu.style.display==="block"){


        menu.style.display="none";


    }
    else{


        menu.style.display="block";


    }


}







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









// ===============================
// LOGOUT
// ===============================


function logout(){


    let ok =
    confirm(
    "Are you sure you want to logout?"
    );


    if(ok){


        localStorage.clear();

        sessionStorage.clear();


        location.href="login.html";


    }


}









// ===============================
// OPEN POPUP
// ===============================


function openModal(btn){



    selectedRow =
    btn.closest("tr");



    let data =
    selectedRow.children;



    document.getElementById("mCustomer").value =
    data[0].innerText;



    document.getElementById("mProblem").value =
    data[1].innerText;



    document.getElementById("mReference").value =
    data[2].innerText;



    document.getElementById("mDate").value =
    data[3].innerText;




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








// ===============================
// CLOSE POPUP
// ===============================


function closeModal(){


    document.getElementById("viewModal")
    .style.display="none";


    selectedRow=null;


}








// ===============================
// SUBMIT UPDATE
// ===============================


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
    "Updated Successfully"
    );



    closeModal();


}









// ===============================
// DELETE ROW
// ===============================


function deleteRow(btn){


    let row =
    btn.closest("tr");



    if(
        confirm(
        "Delete this history?"
        )
    ){


        row.remove();


        createPagination();


    }


}








function deleteData(){


    if(selectedRow){


        if(
        confirm(
        "Delete this history?"
        )
        ){


            selectedRow.remove();


            closeModal();


            createPagination();


        }


    }


}









// ===============================
// FILTER
// ===============================


function filterData(){


    let from =
    document.getElementById("fromDate").value;


    let to =
    document.getElementById("toDate").value;


    let search =
    document.getElementById("search")
    .value
    .toLowerCase();





    document
    .querySelectorAll("#historyTable tr")
    .forEach(row=>{



        let text =
        row.innerText.toLowerCase();



        let date =
        row.children[3]
        .innerText
        .split("-");



        let rowDate =
        new Date(
        date[2],
        date[1]-1,
        date[0]
        );



        let show=true;




        if(from){


            show =
            rowDate >=
            new Date(from);


        }



        if(to && show){


            show =
            rowDate <=
            new Date(to);


        }



        if(search && show){


            show =
            text.includes(search);


        }



        row.style.display =
        show ? "" : "none";



    });


}








function resetFilter(){


    document.getElementById("fromDate").value="";


    document.getElementById("toDate").value="";


    document.getElementById("search").value="";



    document
    .querySelectorAll("#historyTable tr")
    .forEach(row=>{


        row.style.display="";


    });


}









// ===============================
// PAGINATION
// ===============================


function showPage(page){


    let rows =
    document.querySelectorAll(
    "#historyTable tr"
    );



    let start =
    (page-1)*rowsPerPage;


    let end =
    start+rowsPerPage;




    rows.forEach((row,index)=>{


        if(
        index>=start &&
        index<end
        ){

            row.style.display="";


        }
        else{


            row.style.display="none";


        }


    });



    currentPage=page;



    createPagination();



}









function createPagination(){


    let rows =
    document.querySelectorAll(
    "#historyTable tr"
    );



    let total =
    Math.ceil(
    rows.length/rowsPerPage
    );



    let box =
    document.getElementById("pagination");



    if(!box){

        return;

    }



    box.innerHTML="";




    for(
    let i=1;
    i<=total;
    i++
    ){



        let btn =
        document.createElement("button");



        btn.innerText=i;



        btn.onclick=function(){

            showPage(i);

        };



        box.appendChild(btn);



    }



}








// ===============================
// ESC CLOSE
// ===============================


document.addEventListener(
"keydown",
function(e){


    if(e.key==="Escape"){


        closeModal();


    }


});
