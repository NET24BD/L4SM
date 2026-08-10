// =====================================================
// L4SM PENDING CALL
// CALL.JS FINAL PART - 1
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================================
// GLOBAL
// =====================================================

let currentRow = null;

let callData = [];

let filteredCallData = [];

let oldCallData = null;

let isSubmitting = false;



// =====================================================
// PAGE START
// =====================================================

document.addEventListener(
"DOMContentLoaded",
function(){


    checkAuth();


    loadProfile();


    loadCall();


});



// =====================================================
// AUTH SECURITY
// =====================================================

function checkAuth(){


    const auth =
    localStorage.getItem("auth");


    if(auth !== "true"){


        window.location.replace(
            "login.html"
        );


        return false;

    }


    return true;


}



// =====================================================
// BACK BUTTON PROTECTION
// =====================================================

history.pushState(
null,
"",
location.href
);



window.addEventListener(
"popstate",
function(){


    if(!checkAuth()){

        return;

    }


    history.pushState(
    null,
    "",
    location.href
    );


});




// =====================================================
// PROFILE LOAD
// =====================================================

function loadProfile(){


    const username =
    localStorage.getItem(
        "username"
    );


    const picture =
    localStorage.getItem(
        "picture"
    );



    const nameBox =
    document.getElementById(
        "username"
    );


    const image =
    document.getElementById(
        "profileImg"
    );



    if(
        nameBox &&
        username
    ){

        nameBox.innerText =
        username;

    }



    if(
        image &&
        picture
    ){

        image.src =
        picture;

    }


}



// =====================================================
// PROFILE MENU
// =====================================================

function toggleProfile(){


    const menu =
    document.getElementById(
        "profileMenu"
    );


    if(!menu){

        return;

    }


    menu.classList.toggle(
        "show"
    );


}



// =====================================================
// CLOSE PROFILE
// =====================================================

document.addEventListener(
"click",
function(e){


    const profile =
    document.querySelector(
        ".profile"
    );


    const menu =
    document.getElementById(
        "profileMenu"
    );


    if(
        profile &&
        menu &&
        !profile.contains(
            e.target
        )
    ){

        menu.classList.remove(
            "show"
        );

    }


});



// =====================================================
// MY ACCOUNT
// =====================================================

function myAccount(){


    window.location.href =
    "myaccount.html";


}




// =====================================================
// LOGOUT
// =====================================================

function logout(){


    localStorage.removeItem(
        "auth"
    );


    localStorage.removeItem(
        "username"
    );


    localStorage.removeItem(
        "picture"
    );


    localStorage.removeItem(
        "role"
    );



    window.location.replace(
        "login.html"
    );


}



// =====================================================
// BACK
// =====================================================

function goBack(){


    window.location.replace(
        "dashboard.html"
    );


}




// =====================================================
// LOAD CALL DATA
// =====================================================

function loadCall(){


const list =
document.getElementById(
    "callList"
);



if(!list){

    return;

}



list.innerHTML = `

<tr>

<td colspan="7"
style="
text-align:center;
padding:30px;
">

<i class="fa fa-spinner fa-spin"></i>

Loading...

</td>

</tr>

`;



fetch(
API_URL,
{

method:"POST",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},


body:JSON.stringify({


action:
"getPendingCall",


username:
localStorage.getItem(
"username"
)


})


}

)



.then(
response =>
response.json()
)



.then(
data => {


console.log(
"CALL DATA",
data
);



if(
!data ||
data.success !== true
){


throw new Error(
data.message ||
"Failed loading"
);


}



callData =
Array.isArray(
data.data
)
?
data.data
:
[];



filteredCallData =
[
...callData
];



displayCall(
filteredCallData
);



}

)



.catch(
error => {


console.error(
error
);



list.innerHTML = `

<tr>

<td colspan="7"

style="
color:red;
text-align:center;
padding:30px;
">

Failed to load data

</td>

</tr>

`;



});


}



// =====================================================
// DISPLAY CALL TABLE
// =====================================================

function displayCall(data){


const list =
document.getElementById(
"callList"
);



if(!list){

return;

}



if(
!data ||
data.length===0
){


list.innerHTML = `

<tr>

<td colspan="7"

style="
text-align:center;
padding:30px;
">

No Pending Call

</td>

</tr>

`;

return;


}



let html="";



data.forEach(
item=>{


html += `

<tr>


<td>
${escapeHTML(
item.customerId
)}
</td>



<td>
${escapeHTML(
item.problem
)}
</td>



<td>
${escapeHTML(
item.reference
)}
</td>



<td>
${formatDate(
item.date
)}
</td>



<td>
${escapeHTML(
item.support
)}
</td>



<td>
${escapeHTML(
item.supportWork
)}
</td>



<td>

<button

class="edit-btn"

onclick="
editCall(${Number(item.row)})
"

>

<i class="fa fa-pen"></i>

Edit

</button>


</td>


</tr>

`;


});



list.innerHTML =
html;



}
// =====================================================
// CALL.JS FINAL PART - 2
// EDIT + SECURE UPDATE
// =====================================================



// =====================================================
// EDIT CALL
// =====================================================

function editCall(row){


currentRow =
Number(row);



const item =
callData.find(
function(data){


return Number(
data.row
)
===
currentRow;



});



if(!item){


showMessage(
"Error",
"Call data not found"
);


return;


}



// SAVE OLD DATA

oldCallData =
JSON.parse(
JSON.stringify(item)
);





setValue(
"customerId",
item.customerId
);



setValue(
"problem",
item.problem
);



setValue(
"reference",
item.reference
);



setValue(
"date",
convertDate(
item.date
)
);



setValue(
"support",
item.support
);



setValue(
"supportWork",
item.supportWork
);



setValue(
"call",
item.call
);



setValue(
"callWork",
item.callWork
);





const modal =
document.getElementById(
"editModal"
);



if(modal){


modal.classList.add(
"show"
);


}



}



// =====================================================
// SET VALUE
// =====================================================

function setValue(
id,
value
){


const el =
document.getElementById(
id
);



if(el){


el.value =
value || "";

}


}



// =====================================================
// GET VALUE
// =====================================================

function getValue(id){


const el =
document.getElementById(
id
);



if(!el){

return "";

}



return el.value.trim();


}




// =====================================================
// CLOSE EDIT
// =====================================================

function closeEdit(){


const modal =
document.getElementById(
"editModal"
);



if(modal){


modal.classList.remove(
"show"
);


}



currentRow =
null;



oldCallData =
null;



}



// =====================================================
// SECURE UPDATE CALL
// =====================================================

function updateCall(){



if(
!currentRow
){


showMessage(
"Error",
"Invalid row"
);


return;


}




if(isSubmitting){


return;


}



isSubmitting =
true;




const old =
oldCallData || {};




// ===============================
// OLD VALUE RETAIN SYSTEM
// ===============================


const data = {


customerId:

getValue(
"customerId"
)
||
old.customerId
||
"",



problem:

getValue(
"problem"
)
||
old.problem
||
"",



reference:

getValue(
"reference"
)
||
old.reference
||
"",



date:

getValue(
"date"
)
||
old.date
||
"",



support:

getValue(
"support"
)
||
old.support
||
"",



supportWork:

getValue(
"supportWork"
)
||
old.supportWork
||
"",



call:

getValue(
"call"
)
||
old.call
||
"",



callWork:

getValue(
"callWork"
)
||
old.callWork
||
""



};





const btn =
document.querySelector(
".submit-btn"
);



if(btn){


btn.disabled =
true;


btn.innerHTML =

'<i class="fa fa-spinner fa-spin"></i> Saving...';



}




fetch(
API_URL,
{


method:"POST",



headers:{


"Content-Type":
"text/plain;charset=utf-8"


},



body:
JSON.stringify({

action:
"updateCall",



row:
Number(
currentRow
),



username:

localStorage.getItem(
"username"
),



oldData:

oldCallData,



data:

data



})



}

)





.then(
response=>
response.json()
)



.then(
result=>{


console.log(
"UPDATE RESULT",
result
);




if(
result &&
result.success === true
){



closeEdit();



showMessage(
"Success",
"Call updated successfully"
);




loadCall();



}

else{


throw new Error(
result.message ||
"Update failed"
);


}



}

)




.catch(
error=>{


console.error(
error
);



showMessage(
"Error",
error.message
);



}



)



.finally(
()=>{


isSubmitting =
false;



if(btn){


btn.disabled =
false;



btn.innerHTML =

'<i class="fa fa-save"></i> Submit';


}



}

);



}





// =====================================================
// ESC CLOSE MODAL
// =====================================================

document.addEventListener(
"keydown",
function(e){


if(
e.key === "Escape"
){


closeEdit();


}



});
 // =====================================================
// CALL.JS FINAL PART - 3
// DELETE + FILTER + HELPERS
// =====================================================


// =====================================================
// DELETE CALL
// =====================================================

function deleteCall(){


if(!currentRow){


showMessage(
"Error",
"Select a call first"
);


return;


}



const confirmBox =
document.getElementById(
"confirmModal"
);



if(confirmBox){


confirmBox.classList.add(
"show"
);


return;


}



confirmDelete();


}





// =====================================================
// CONFIRM DELETE
// =====================================================

function confirmDelete(){



if(!currentRow){

return;

}



fetch(
API_URL,
{


method:"POST",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},



body:JSON.stringify({

action:
"deleteCall",


row:
Number(
currentRow
),


username:

localStorage.getItem(
"username"
)



})


}

)



.then(
res=>
res.json()
)



.then(
data=>{


if(
data &&
data.success === true
){



closeConfirm();



closeEdit();



showMessage(
"Deleted",
"Call deleted successfully"
);



loadCall();



}

else{


throw new Error(
data.message ||
"Delete failed"
);


}



}



)



.catch(
err=>{


showMessage(
"Error",
err.message
);



}



);



}



// =====================================================
// CLOSE CONFIRM
// =====================================================

function closeConfirm(){


const modal =
document.getElementById(
"confirmModal"
);



if(modal){


modal.classList.remove(
"show"
);


}


}



// =====================================================
// MESSAGE POPUP
// =====================================================

function showMessage(
title,
message
){


const modal =
document.getElementById(
"messageModal"
);



if(!modal){


alert(
message
);


return;


}



const titleBox =
document.getElementById(
"messageTitle"
);



const textBox =
document.getElementById(
"messageText"
);



if(titleBox){


titleBox.innerText =
title;


}



if(textBox){


textBox.innerText =
message;


}



modal.classList.add(
"show"
);



}



// =====================================================
// CLOSE MESSAGE
// =====================================================

function closeMessage(){


const modal =
document.getElementById(
"messageModal"
);



if(modal){


modal.classList.remove(
"show"
);


}


}





// =====================================================
// SEARCH CALL
// =====================================================

function searchCall(){


const input =
document.getElementById(
"searchCall"
);



if(!input){

return;

}



const value =
input.value
.trim()
.toLowerCase();



if(!value){


filteredCallData =
[
...callData
];


displayCall(
filteredCallData
);


return;


}



filteredCallData =
callData.filter(
function(item){



return (

String(
item.customerId || ""
)
.toLowerCase()
.includes(value)



||



String(
item.problem || ""
)
.toLowerCase()
.includes(value)



||



String(
item.reference || ""
)
.toLowerCase()
.includes(value)



||



String(
item.support || ""
)
.toLowerCase()
.includes(value)



||



String(
item.supportWork || ""
)
.toLowerCase()
.includes(value)



||



String(
item.call || ""
)
.toLowerCase()
.includes(value)



||



String(
item.callWork || ""
)
.toLowerCase()
.includes(value)



);



}

);



displayCall(
filteredCallData
);



}




// =====================================================
// RESET SEARCH
// =====================================================

function resetSearch(){


const input =
document.getElementById(
"searchCall"
);



if(input){


input.value =
"";


}



filteredCallData =
[
...callData
];



displayCall(
filteredCallData
);



}





// =====================================================
// DATE CONVERT
// =====================================================

function convertDate(date){


if(!date){

return "";

}



const d =
new Date(date);



if(
isNaN(
d.getTime()
)
){


return "";

}



return (

d.getFullYear()

+

"-"

+

String(
d.getMonth()+1
)
.padStart(
2,
"0"
)


+

"-"


+

String(
d.getDate()
)
.padStart(
2,
"0"
)


);



}





// =====================================================
// DATE DISPLAY
// =====================================================

function formatDate(date){


if(!date){

return "";

}



const d =
new Date(date);



if(
isNaN(
d.getTime()
)
){


return String(
date
);


}



const months=[

"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"

];



return (

String(
d.getDate()
)
.padStart(
2,
"0"
)

+

" "

+

months[
d.getMonth()
]

+

" "

+

d.getFullYear()

);



}





// =====================================================
// ESCAPE HTML SECURITY
// =====================================================

function escapeHTML(value){



if(
value === null ||
value === undefined
){


return "";

}



return String(value)


.replace(
/&/g,
"&amp;"
)


.replace(
/</g,
"&lt;"
)


.replace(
/>/g,
"&gt;"
)


.replace(
/"/g,
"&quot;"
)


.replace(
/'/g,
"&#039;"
);



}





// =====================================================
// REFRESH
// =====================================================

function refreshCall(){


loadCall();


}





// =====================================================
// CLICK OUTSIDE POPUP CLOSE
// =====================================================

document.addEventListener(
"click",
function(e){



const edit =
document.getElementById(
"editModal"
);



if(
edit &&
e.target === edit
){


closeEdit();


}




const confirm =
document.getElementById(
"confirmModal"
);



if(
confirm &&
e.target === confirm
){


closeConfirm();


}



const message =
document.getElementById(
"messageModal"
);



if(
message &&
e.target === message
){


closeMessage();


}




});
