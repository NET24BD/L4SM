"use strict";


// ================================
// USER LOAD
// ================================

function loadUser(){

    let user = null;


    try{

        user = JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );

    }
    catch(e){

        user = null;

    }



    if(!user){

        user = {

            username:
            localStorage.getItem(
                "username"
            ) || "User",


            name:
            localStorage.getItem(
                "name"
            ) || "User",


            picture:
            localStorage.getItem(
                "picture"
            ) || "assets/profile.png"

        };

    }



    let name =
    user.name ||
    user.username ||
    "User";


    let picture =
    user.profileImage ||
    user.picture ||
    "assets/profile.png";



    const username =
    document.getElementById(
        "username"
    );


    const profileImg =
    document.getElementById(
        "profileImg"
    );



    if(username){

        username.innerHTML =
        name;

    }



    if(profileImg){

        profileImg.src =
        picture;


        profileImg.onerror =
        function(){

            this.src =
            "assets/profile.png";

        };

    }


}




// ================================
// PROFILE MENU
// ================================


function toggleProfile(){

    document
    .getElementById(
        "profileMenu"
    )
    .classList.toggle(
        "show"
    );

}




// ================================
// LOGOUT
// ================================


function logout(){

    localStorage.removeItem(
        "auth"
    );

    localStorage.removeItem(
        "isLogin"
    );

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "name"
    );

    localStorage.removeItem(
        "picture"
    );


    location.href =
    "login.html";

}




// ================================
// BACK
// ================================


function goBack(){

    location.href =
    "dashboard.html";

}



// ================================
// HISTORY DATA
// ================================


let historyData = [];

let currentPage = 1;

let perPage = 10;

let editIndex = null;



// Demo data remove kore
// Google Sheet API data bosano jabe


historyData = [

{

customerId:"ABMB020",

problem:"ONU Problem",

reference:"Shemanto",

date:"2026-08-01",

support:"Shemanto",

supportWork:"ONU Change"

},


{

customerId:"ABMB021",

problem:"Internet Slow",

reference:"Rahim",

date:"2026-08-02",

support:"Rahim",

supportWork:"Line Check"

}

];



let filteredData =
[...historyData];




// ================================
// LOAD TABLE
// ================================


function loadTable(){


const tbody =
document.getElementById(
"historyList"
);



tbody.innerHTML="";



let start =
(currentPage-1)
*
perPage;


let end =
start + perPage;



let data =
filteredData.slice(
start,
end
);



if(data.length===0){


tbody.innerHTML=

`
<tr>
<td colspan="5">
No Data Found
</td>
</tr>

`;


return;

}




data.forEach(
(item,index)=>{


let realIndex =
historyData.indexOf(
item
);



tbody.innerHTML +=


`

<tr>

<td>
${item.customerId}
</td>


<td>
${item.problem}
</td>


<td>
${item.reference}
</td>


<td>
${item.date}
</td>



<td>

<button
class="view-btn"
onclick="openEdit(${realIndex})">

<i class="fa fa-eye"></i>

View

</button>


</td>


</tr>

`;



});


createPagination();



}



// ================================
// SEARCH + DATE FILTER
// ================================


function filterData(){


let search =
document.getElementById(
"historySearch"
).value
.toLowerCase();



let from =
document.getElementById(
"fromDate"
).value;


let to =
document.getElementById(
"toDate"
).value;



filteredData =
historyData.filter(
item=>{


let text =

item.customerId+
item.problem+
item.reference

.toLowerCase();



let searchOK =
text.includes(
search
);



let dateOK=true;



if(from){

dateOK =
item.date >= from;

}



if(to){

dateOK =
dateOK &&
item.date <= to;

}



return (
searchOK &&
dateOK
);



});



currentPage=1;

loadTable();


}




// ================================
// PAGINATION
// ================================


function createPagination(){


let box =
document.getElementById(
"pagination"
);


if(!box)return;


box.innerHTML="";



let pages =
Math.ceil(
filteredData.length /
perPage
);



for(
let i=1;
i<=pages;
i++
){


box.innerHTML +=

`

<button
onclick="changePage(${i})"
class="
${i===currentPage?
'active-page':''}
">

${i}

</button>

`;


}



}




function changePage(page){

currentPage =
page;

loadTable();

}




// ================================
// EDIT POPUP
// ================================


function openEdit(index){


editIndex=index;


let item =
historyData[index];



document.getElementById(
"customerId"
).value =
item.customerId;


document.getElementById(
"problem"
).value =
item.problem;


document.getElementById(
"reference"
).value =
item.reference;


document.getElementById(
"date"
).value =
item.date;


document.getElementById(
"support"
).value =
item.support;


document.getElementById(
"supportWork"
).value =
item.supportWork;



document
.querySelector(
".popup"
)
.classList.add(
"show"
);



}




function closeEdit(){


document
.querySelector(
".popup"
)
.classList.remove(
"show"
);


}




// ================================
// UPDATE
// ================================


function updateSupport(){



historyData[editIndex]={


customerId:

document.getElementById(
"customerId"
).value,


problem:

document.getElementById(
"problem"
).value,


reference:

document.getElementById(
"reference"
).value,


date:

document.getElementById(
"date"
).value,


support:

document.getElementById(
"support"
).value,


supportWork:

document.getElementById(
"supportWork"
).value



};



closeEdit();


showSuccess(
"Updated Successfully"
);


filterData();


}




// ================================
// DELETE
// ================================


function deleteSupport(){


document
.querySelector(
".custom-popup"
)
.classList.add(
"show"
);


}




function confirmDelete(){



historyData.splice(
editIndex,
1
);


closeConfirmPopup();


closeEdit();


showSuccess(
"Deleted Successfully"
);


filterData();



}



function closeConfirmPopup(){

document
.querySelector(
".custom-popup"
)
.classList.remove(
"show"
);


}




// ================================
// SUCCESS POPUP
// ================================


function showSuccess(msg){


let popup =
document.querySelector(
".success-popup"
);



if(popup){

popup.classList.add(
"show"
);


document.getElementById(
"successMessage"
).innerHTML =
msg;


}

}




function closeSuccessPopup(){

document
.querySelector(
".success-popup"
)
.classList.remove(
"show"
);


}





// ================================
// START
// ================================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadUser();

loadTable();



document
.getElementById(
"historySearch"
)
.addEventListener(
"input",
filterData
);



document
.getElementById(
"fromDate"
)
.addEventListener(
"change",
filterData
);



document
.getElementById(
"toDate"
)
.addEventListener(
"change",
filterData
);



});
