"use strict";



let selectedRow = null;

let currentPage = 1;

const perPage = 10;






// =============================
// PAGE LOAD
// =============================


document.addEventListener(
"DOMContentLoaded",
function(){


loadProfile();


createPagination();


showPage(1);



});








// =============================
// PROFILE LOAD
// =============================


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




let nameBox =
document.getElementById("userName");



let photoBox =
document.getElementById("userPhoto");





if(nameBox){

nameBox.innerText = name;

}






if(photoBox){



if(
picture &&
picture !== "null" &&
picture !== "undefined"
){


photoBox.src = picture;


}

else{


photoBox.src =
"https://ui-avatars.com/api/?name="
+
encodeURIComponent(name)
+
"&background=064e3b&color=ffffff";


}





photoBox.onerror=function(){


this.src =
"https://ui-avatars.com/api/?name="
+
encodeURIComponent(name)
+
"&background=064e3b&color=ffffff";


};



}




}










// =============================
// BACK BUTTON
// =============================


function goBack(){


window.history.back();


}










// =============================
// PROFILE MENU
// =============================


function toggleProfile(){


let menu =
document.getElementById(
"profileMenu"
);



if(
menu.style.display === "block"
){


menu.style.display="none";


}

else{


menu.style.display="block";


}



}











// =============================
// LOGOUT
// =============================


function logout(){



if(
confirm("Logout?")
){


localStorage.clear();

sessionStorage.clear();


window.location.href =
"login.html";


}



}









// =============================
// FILTER SHOW HIDE
// =============================


function toggleFilter(){



document
.getElementById("filterBox")
.classList
.toggle("show");



}











// =============================
// FILTER DATA
// =============================


function filterData(){



let from =
document.getElementById(
"fromDate"
).value;



let to =
document.getElementById(
"toDate"
).value;




let search =
document
.getElementById("search")
.value
.toLowerCase();





let rows =
document.querySelectorAll(
"#historyTable tr"
);






rows.forEach(function(row){



let text =
row.innerText.toLowerCase();



let date =
row.children[3]
.innerText;





let show = true;





if(
search &&
!text.includes(search)
){


show=false;


}







if(from){



let rowDate =
new Date(
date.split("-").reverse().join("-")
);



if(
rowDate <
new Date(from)
){


show=false;


}



}






if(to){



let rowDate =
new Date(
date.split("-").reverse().join("-")
);



if(
rowDate >
new Date(to)
){


show=false;


}



}






row.style.display =
show ? "" : "none";



});



}









// =============================
// RESET FILTER
// =============================


function resetFilter(){



document.getElementById(
"fromDate"
).value="";



document.getElementById(
"toDate"
).value="";



document.getElementById(
"search"
).value="";



let rows =
document.querySelectorAll(
"#historyTable tr"
);



rows.forEach(function(row){


row.style.display="";


});



}









// =============================
// PAGINATION
// =============================


function showPage(page){


let rows =
document.querySelectorAll(
"#historyTable tr"
);



let start =
(page-1)*perPage;



let end =
start+perPage;





rows.forEach(function(row,index){



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


}








function createPagination(){



let rows =
document.querySelectorAll(
"#historyTable tr"
);



let total =
Math.ceil(
rows.length/perPage
);



let box =
document.getElementById(
"pagination"
);



if(!box)return;



box.innerHTML="";





for(
let i=1;
i<=total;
i++
){



let btn =
document.createElement(
"button"
);



btn.innerText=i;




btn.onclick=function(){


showPage(i);


};




box.appendChild(btn);



}



}









// =============================
// VIEW POPUP
// =============================


function openModal(btn){



selectedRow =
btn.closest("tr");



let data =
selectedRow.children;





document.getElementById(
"mCustomer"
).value =
data[0].innerText;




document.getElementById(
"mProblem"
).value =
data[1].innerText;




document.getElementById(
"mReference"
).value =
data[2].innerText;




document.getElementById(
"mDate"
).value =
data[3].innerText;





document.getElementById(
"viewModal"
).style.display =
"flex";



}









// =============================
// CLOSE POPUP
// =============================


function closeModal(){


document.getElementById(
"viewModal"
).style.display =
"none";


}









// =============================
// SUBMIT UPDATE
// =============================


function submitData(){



if(!selectedRow)
return;





let data =
selectedRow.children;





data[0].innerText =
document.getElementById(
"mCustomer"
).value;




data[1].innerText =
document.getElementById(
"mProblem"
).value;




data[2].innerText =
document.getElementById(
"mReference"
).value;




data[3].innerText =
document.getElementById(
"mDate"
).value;





alert(
"Updated Successfully"
);




closeModal();



}









// =============================
// DELETE ROW
// =============================


function deleteRow(btn){



let row =
btn.closest("tr");



if(
confirm("Delete this history?")
){



row.remove();



createPagination();



showPage(1);



}



}









// =============================
// DELETE FROM POPUP
// =============================


function deleteData(){



if(selectedRow){



selectedRow.remove();



closeModal();



createPagination();



showPage(1);



}



}
