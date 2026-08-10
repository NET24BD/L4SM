"use strict";


// =====================================
// API URL
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";




// =====================================
// GLOBAL
// =====================================


let historyData = [];

let filterDataList = [];

let selectedIndex = null;

let currentPage = 1;

const perPage = 10;





// =====================================
// START
// =====================================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadProfile();

loadHistory();


});









// =====================================
// PROFILE
// =====================================


function loadProfile(){


let name =
localStorage.getItem("name")
||
localStorage.getItem("username")
||
"User";



let picture =
localStorage.getItem("picture")
||
"";



let userName =
document.getElementById(
"userName"
);


let userPhoto =
document.getElementById(
"userPhoto"
);




if(userName){

userName.innerText=name;

}





if(userPhoto){


if(picture){

userPhoto.src=picture;

}

else{


userPhoto.src=
"https://ui-avatars.com/api/?name="
+
encodeURIComponent(name);


}



userPhoto.onerror=()=>{

userPhoto.src=
"https://ui-avatars.com/api/?name="
+
encodeURIComponent(name);


};


}



}









// =====================================
// LOAD HISTORY
// =====================================


function loadHistory(){



fetch(
API_URL+
"?action=getHistory"
)



.then(res=>res.json())

.then(data=>{



console.log(data);



historyData =
data.data || [];



filterDataList =
[...historyData];



currentPage=1;



showTable();



})

.catch(err=>{


console.log(err);


alert(
"History Load Error"
);


});


}









// =====================================
// SHOW TABLE
// =====================================


function showTable(){



let table =
document.getElementById(
"historyTable"
);



if(!table)
return;



table.innerHTML="";



let start =
(currentPage-1)
*
perPage;



let end =
start + perPage;





filterDataList
.slice(start,end)
.forEach(
(item,index)=>{



let realIndex =
start+index;



let tr =
document.createElement("tr");




tr.innerHTML = `


<td>
${item.customerId || ""}
</td>


<td>
${item.problem || ""}
</td>


<td>
${item.reference || ""}
</td>


<td>
${item.date || ""}
</td>


<td>


<button 
class="view-btn"
onclick="openView(${realIndex})">


<i class="fa fa-eye"></i>

View


</button>


</td>


`;




table.appendChild(tr);



});



createPagination();



}









// =====================================
// PAGINATION
// =====================================


function createPagination(){


let box =
document.getElementById(
"pagination"
);


if(!box)
return;



box.innerHTML="";



let total =
Math.ceil(
filterDataList.length /
perPage
);



for(
let i=1;
i<=total;
i++
){


let btn =
document.createElement("button");


btn.innerText=i;



if(i===currentPage){

btn.classList.add(
"active"
);

}



btn.onclick=()=>{


currentPage=i;


showTable();


};



box.appendChild(btn);



}



}









// =====================================
// OPEN VIEW POPUP
// =====================================


function openView(index){



selectedIndex=index;



let data =
filterDataList[index];




document.getElementById(
"mCustomer"
).value =
data.customerId || "";



document.getElementById(
"mProblem"
).value =
data.problem || "";



document.getElementById(
"mReference"
).value =
data.reference || "";



document.getElementById(
"mDate"
).value =
data.date || "";



document.getElementById(
"mSupport"
).value =
data.support || "";



document.getElementById(
"mSupportWork"
).value =
data.supportWork || "";



document.getElementById(
"mCall"
).value =
data.call || "";



document.getElementById(
"mCallWork"
).value =
data.callWork || "";





document.getElementById(
"viewModal"
).style.display="flex";



}









// =====================================
// CLOSE POPUP
// =====================================


function closeModal(){


document.getElementById(
"viewModal"
).style.display="none";


}









// =====================================
// UPDATE HISTORY
// =====================================


function submitData(){



let old =
filterDataList[selectedIndex];





let sendData = {


action:
"updateHistory",



row:
old.row,



customerId:
mCustomer.value,



problem:
mProblem.value,



reference:
mReference.value,



date:
mDate.value,



support:
mSupport.value,



supportWork:
mSupportWork.value,



supportTime:
old.supportTime || "",



call:
mCall.value,



callWork:
mCallWork.value



};





fetch(
API_URL,
{


method:"POST",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},


body:
JSON.stringify(sendData)



}

)


.then(res=>res.json())


.then(data=>{


if(data.success){


alert(
"Updated Successfully"
);


closeModal();


loadHistory();


}

else{


alert(data.message);


}


});



}









// =====================================
// DELETE HISTORY
// =====================================


function deleteData(){



if(
selectedIndex===null
)
return;




if(
!confirm(
"Delete This History?"
)
)
return;






let row =
filterDataList[selectedIndex].row;






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
"deleteHistory",


row:
row


})



}

)


.then(res=>res.json())


.then(data=>{


if(data.success){


alert(
"Deleted Successfully"
);



closeModal();


loadHistory();


}


});



}









// =====================================
// FILTER
// =====================================


function toggleFilter(){


let box =
document.getElementById(
"filterBox"
);


box.classList.toggle(
"show"
);


}








function searchHistory(){



let text =
document.getElementById(
"search"
)
.value
.toLowerCase();



let from =
document.getElementById(
"fromDate"
).value;



let to =
document.getElementById(
"toDate"
).value;






filterDataList =
historyData.filter(item=>{


let matchText =


(
item.customerId+
item.problem+
item.reference
)
.toLowerCase()
.includes(text);



let matchDate=true;



if(from){

matchDate =
item.date >= from;


}



if(to && matchDate){


matchDate =
item.date <= to;


}




return matchText && matchDate;



});





currentPage=1;


showTable();



}









// =====================================
// BACK BUTTON
// =====================================


function goBack(){


history.back();


}









// =====================================
// PROFILE MENU
// =====================================


function toggleProfile(){



let menu =
document.getElementById(
"profileMenu"
);



menu.style.display =

menu.style.display==="block"

?

"none"

:

"block";



}









// =====================================
// MY ACCOUNT
// =====================================


function myAccount(){


location.href=
"my-account.html";


}









// =====================================
// LOGOUT
// =====================================


function logout(){


localStorage.clear();


sessionStorage.clear();


location.href=
"login.html";


}
