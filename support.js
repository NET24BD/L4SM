// ===============================
// API URL
// ===============================


const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



let currentRow = "";

let loadingTimer;






// ===============================
// LOAD LOADING.HTML
// ===============================


fetch("loading.html")

.then(res=>res.text())

.then(data=>{


document.getElementById("loadingArea").innerHTML=data;


})

.catch(err=>{

console.log("Loading Error:",err);

});








// ===============================
// START
// ===============================


window.onload=function(){


let username =
localStorage.getItem("username");


if(username){

document.getElementById("username").innerHTML=username;

}




let picture =
localStorage.getItem("picture");



if(picture){

document.getElementById("profileImg").src=picture;

}




loadSupport();



};









// ===============================
// PROFILE
// ===============================



function toggleProfile(){


document
.getElementById("profileMenu")
.classList.toggle("show");


}





function myAccount(){


window.location.href="myaccount.html";


}





function logout(){


localStorage.clear();


window.location.href="index.html";


}





function goBack(){


window.location.href="dashboard.html";


}









// ===============================
// LOAD SUPPORT DATA
// ===============================


function loadSupport(){



showLoading("Loading Support...");



fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":

"text/plain;charset=utf-8"


},


body:JSON.stringify({


action:"getPendingSupport"


})


})



.then(res=>res.json())


.then(data=>{



let html="";




if(data.data){



data.data.forEach(item=>{



html+=`

<tr>

<td>${item.customerId || ""}</td>


<td>${item.problem || ""}</td>


<td>${item.reference || ""}</td>


<td>${item.date || ""}</td>


<td>


<button class="edit-btn"

onclick="editSupport('${item.row}')">


<i class="fa fa-edit"></i>

Edit


</button>


</td>


</tr>


`;



});



}



document
.getElementById("supportList")
.innerHTML=html;



hideLoading();



})



.catch(error=>{


console.log(error);


hideLoading();


showSuccess(
"Error",
"Server Error"
);



});



}









// ===============================
// OPEN EDIT
// ===============================


function editSupport(row){


currentRow=row;


showLoading("Loading Data...");



fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":

"text/plain;charset=utf-8"


},


body:JSON.stringify({


action:"getSingleSupport",


row:row


})


})



.then(res=>res.json())


.then(data=>{



document.getElementById("customerId").value =
data.customerId || "";



document.getElementById("problem").value =
data.problem || "";



document.getElementById("reference").value =
data.reference || "";



document.getElementById("date").value =
data.date || "";



document.getElementById("support").value =
data.support || "";



document.getElementById("supportWork").value =
data.supportWork || "";





hideLoading();



document
.getElementById("editModal")
.classList.add("show");



})



.catch(err=>{


console.log(err);


hideLoading();



});



}









// ===============================
// CLOSE EDIT
// ===============================


function closeEdit(){


document
.getElementById("editModal")
.classList.remove("show");


}









// ===============================
// UPDATE SUPPORT
// ===============================


function updateSupport(){


showLoading("Updating...");



fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":

"text/plain;charset=utf-8"


},


body:JSON.stringify({


action:"updateSupport",


row:currentRow,


customerId:
document.getElementById("customerId").value,


problem:
document.getElementById("problem").value,


reference:
document.getElementById("reference").value,


date:
document.getElementById("date").value,


support:
document.getElementById("support").value,


supportWork:
document.getElementById("supportWork").value



})


})



.then(res=>res.json())


.then(data=>{



hideLoading();



closeEdit();



showSuccess(

"Success",

"Support Updated Successfully"

);



loadSupport();



})



.catch(error=>{


hideLoading();


showSuccess(

"Error",

"Update Failed"

);



});



}









// ===============================
// DELETE OPEN
// ===============================


function openDelete(){



document
.getElementById("deleteModal")
.classList.add("show");



}







function closeDelete(){



document
.getElementById("deleteModal")
.classList.remove("show");



}








// ===============================
// DELETE SUPPORT
// ===============================


function deleteSupport(){



showLoading("Deleting...");



fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":

"text/plain;charset=utf-8"


},


body:JSON.stringify({


action:"deleteSupport",


row:currentRow


})


})



.then(res=>res.json())


.then(data=>{



hideLoading();


closeDelete();


closeEdit();



showSuccess(

"Deleted",

"Support Deleted Successfully"

);



loadSupport();



})



.catch(error=>{


hideLoading();



showSuccess(

"Error",

"Delete Failed"

);



});



}









// ===============================
// SUCCESS POPUP
// ===============================


function showSuccess(title,message){



document
.getElementById("successTitle")
.innerHTML=title;



document
.getElementById("successMessage")
.innerHTML=message;



document
.getElementById("successModal")
.classList.add("show");



}




function closeSuccess(){


document
.getElementById("successModal")
.classList.remove("show");


}









// ===============================
// LOADING CONTROL
// ===============================


function showLoading(text){



let box =
document.getElementById("loadingBox");



if(!box){

return;

}



box.style.display="block";



let txt =
document.getElementById("loadingText");



if(txt){

txt.innerHTML=text;

}



let count=0;



clearInterval(loadingTimer);



loadingTimer=setInterval(()=>{



if(count<100){


count++;



let p =
document.getElementById("percent");



let bar =
document.getElementById("progressBar");



if(p){

p.innerHTML=count+"%";

}



if(bar){

bar.style.width=count+"%";

}



}



},25);



}








function hideLoading(){



clearInterval(loadingTimer);



let box =
document.getElementById("loadingBox");



if(box){

box.style.display="none";

}



}
