// =====================================
// SUPPORT.JS FINAL
// PART-1
// =====================================


// =====================================
// PAGE PROTECTION
// =====================================

(function(){

"use strict";


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



if(!checkAuth()){

    return;

}



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



window.addEventListener(
"pageshow",
function(event){


    if(!checkAuth()){

        return;

    }


    if(event.persisted){

        window.location.reload();

    }


});



window.logout=function(){


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


};


})();




// =====================================
// CONFIG
// =====================================


const API_URL =

"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



let currentRow = null;

let supportData = [];

let confirmCallback = null;



// =====================================
// PAGE LOAD
// =====================================


document.addEventListener(
"DOMContentLoaded",
function(){


    loadProfile();


    loadSupport();



    const search =
    document.getElementById(
        "supportSearch"
    );


    if(search){


        search.addEventListener(
            "input",
            searchSupport
        );


    }



});






// =====================================
// PROFILE
// =====================================


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



const img =
document.getElementById(
    "profileImg"
);




if(nameBox && username){


    nameBox.textContent =
    username;


}



if(img && picture){


    img.src =
    picture;


}



}






// =====================================
// PROFILE MENU
// =====================================


function toggleProfile(){


const menu =
document.getElementById(
    "profileMenu"
);



if(menu){


    menu.classList.toggle(
        "show"
    );


}



}







// =====================================
// MY ACCOUNT
// =====================================


function myAccount(){


window.location.href =
"myaccount.html";


}







// =====================================
// BACK
// =====================================


function goBack(){


window.location.replace(
    "dashboard.html"
);


}






// =====================================
// LOAD SUPPORT
// =====================================


function loadSupport(){


const list =
document.getElementById(
    "supportList"
);



if(list){


list.innerHTML = `


<tr>

<td colspan="5"
class="loading-cell">


<i class="fa fa-spinner fa-spin"></i>

Loading...


</td>

</tr>


`;


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
"getPendingSupport"

})


}

)

.then(
res=>res.json()
)


.then(
data=>{


console.log(
"SUPPORT:",
data
);



if(!data.success){


throw new Error(
data.message
);


}




supportData =
Array.isArray(data.data)
?
data.data
:
[];




renderSupport(
supportData
);



}

)


.catch(
err=>{


console.error(
err
);



if(list){


list.innerHTML = `


<tr>

<td colspan="5"
style="
text-align:center;
padding:30px;
color:red;
">


Failed To Load Data


</td>


</tr>


`;



}



}

);



}








// =====================================
// RENDER SUPPORT
// =====================================


function renderSupport(data){


const list =
document.getElementById(
"supportList"
);



if(!list){

return;

}



if(!data.length){


list.innerHTML = `


<tr>

<td colspan="5"
style="
text-align:center;
padding:30px;
">


No Pending Support


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


<button

class="edit-btn"

onclick="editSupport(${item.row})"

>

<i class="fa fa-pen"></i>

Edit


</button>


</td>



</tr>


`;



}

);



list.innerHTML =
html;



}






// =====================================
// SEARCH
// =====================================


function searchSupport(){


const input =
document.getElementById(
"supportSearch"
);



if(!input){

return;

}



const key =
input.value
.toLowerCase()
.trim();




if(!key){


renderSupport(
supportData
);


return;


}




const result =
supportData.filter(
item=>{


return (

String(item.customerId)
.toLowerCase()
.includes(key)


||


String(item.problem)
.toLowerCase()
.includes(key)


||


String(item.reference)
.toLowerCase()
.includes(key)


||


String(item.date)
.toLowerCase()
.includes(key)


);



}

);




renderSupport(
result
);



}
// =====================================
// SUPPORT.JS FINAL
// PART-2
// =====================================



// =====================================
// EDIT SUPPORT
// =====================================


function editSupport(row){


currentRow =
Number(row);



const item =
supportData.find(
x =>
Number(x.row)
===
currentRow
);



if(!item){


showErrorPopup(
"Support record not found",
"Error"
);


return;


}



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
convertDate(item.date)
);



setValue(
"support",
item.support
);



setValue(
"supportWork",
item.supportWork
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





// =====================================
// SET VALUE
// =====================================


function setValue(id,value){


const el =
document.getElementById(id);



if(el){

el.value =
value || "";

}


}







// =====================================
// GET VALUE
// =====================================


function getValue(id){


const el =
document.getElementById(id);



if(!el){

return "";

}



return el.value.trim();


}






// =====================================
// CLOSE EDIT
// =====================================


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



currentRow=null;



}








// =====================================
// UPDATE SUPPORT
// SAME ROW UPDATE
// =====================================


function updateSupport(){


if(!currentRow){


showErrorPopup(
"Select support first",
"Error"
);


return;


}





const btn =
document.querySelector(
"#editModal .submit-btn"
);



if(btn){

btn.disabled=true;

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


body:JSON.stringify({


action:
"updateSupport",



row:
Number(currentRow),



customerId:
getValue("customerId"),



problem:
getValue("problem"),



reference:
getValue("reference"),



date:
getValue("date"),



support:
getValue("support"),



supportWork:
getValue("supportWork"),



supportTime:
getValue("supportTime")



})


}

)

.then(
res=>res.json()
)

.then(
data=>{


console.log(
"UPDATE:",
data
);



if(!data.success){

throw new Error(
data.message
);

}





showSuccessPopup(
"Support updated successfully",
"Updated"
);



closeEdit();



loadSupport();



}

)


.catch(
err=>{


showErrorPopup(
err.message,
"Update Failed"
);



}

)


.finally(
()=>{


if(btn){

btn.disabled=false;


btn.innerHTML =
'<i class="fa fa-save"></i> Save';

}


}

);



}









// =====================================
// DELETE SUPPORT
// =====================================


function deleteSupport(){



if(!currentRow){


showErrorPopup(
"Select support first",
"Delete Error"
);


return;


}



showConfirmPopup(

"Delete this support?",


function(){

performDeleteSupport();

},


"Confirm Delete"


);



}








function performDeleteSupport(){



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
"deleteSupport",



row:
Number(currentRow)



})


}

)

.then(
res=>res.json()
)

.then(
data=>{


if(!data.success){

throw new Error(
data.message
);

}



showSuccessPopup(
"Support deleted",
"Deleted"
);



closeEdit();


loadSupport();


}

)


.catch(
err=>{


showErrorPopup(
err.message,
"Delete Failed"
);



}

);



}








// =====================================
// CONFIRM POPUP
// =====================================


function showConfirmPopup(
message,
callback,
title
){


const popup =
document.getElementById(
"confirmPopup"
);



if(!popup){

return;

}



document.getElementById(
"confirmTitle"
).textContent =
title || "Confirm";



document.getElementById(
"confirmMessage"
).textContent =
message;



confirmCallback =
callback;



const btn =
document.getElementById(
"confirmActionBtn"
);



if(btn){


btn.onclick=function(){


if(
typeof confirmCallback
===
"function"
){


confirmCallback();


}



closeConfirmPopup();



};


}



popup.classList.add(
"show"
);



}





function closeConfirmPopup(){


const popup =
document.getElementById(
"confirmPopup"
);



if(popup){

popup.classList.remove(
"show"
);

}



confirmCallback=null;



}








// =====================================
// SUCCESS POPUP
// =====================================


function showSuccessPopup(
message,
title
){



const popup =
document.getElementById(
"successPopup"
);



if(!popup){

return;

}



document.getElementById(
"successTitle"
).textContent =
title || "Success";



document.getElementById(
"successMessage"
).textContent =
message;



popup.classList.add(
"show"
);



}






function closeSuccessPopup(){


const popup =
document.getElementById(
"successPopup"
);



if(popup){

popup.classList.remove(
"show"
);

}



}








// =====================================
// ERROR POPUP
// =====================================


function showErrorPopup(
message,
title
){


const popup =
document.getElementById(
"errorPopup"
);



if(!popup){

alert(message);

return;

}



document.getElementById(
"errorTitle"
).textContent =
title || "Error";



document.getElementById(
"errorMessage"
).textContent =
message;



popup.classList.add(
"show"
);



}






function closeErrorPopup(){


const popup =
document.getElementById(
"errorPopup"
);



if(popup){

popup.classList.remove(
"show"
);

}


}









// =====================================
// DATE CONVERT
// =====================================


function convertDate(date){


if(!date){

return "";

}



let d =
new Date(date);



if(
isNaN(d)
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
.padStart(2,"0")


+

"-"

+

String(
d.getDate()
)
.padStart(2,"0")


);


}







// =====================================
// DATE FORMAT
// =====================================


function formatDate(date){


if(!date){

return "";

}



let d =
new Date(date);



if(
isNaN(d)
){

return date;

}



return (

String(
d.getDate()
)
.padStart(2,"0")

+

"-"

+

String(
d.getMonth()+1
)
.padStart(2,"0")

+

"-"

+

d.getFullYear()

);



}








// =====================================
// ESCAPE HTML
// =====================================


function escapeHTML(value){


if(value===null || value===undefined){

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








// =====================================
// OUTSIDE CLICK
// =====================================


document.addEventListener(
"click",
function(e){


const modal =
document.getElementById(
"editModal"
);



if(
modal &&
e.target===modal
){

closeEdit();

}



}

);








// =====================================
// ESC KEY
// =====================================


document.addEventListener(
"keydown",
function(e){


if(e.key==="Escape"){


closeEdit();

closeConfirmPopup();

closeSuccessPopup();

closeErrorPopup();



}


}

);
