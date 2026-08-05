// =====================================
// L4SM USER CONTROL JS
// =====================================


const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



let users = [];

let editMode = false;

let oldUsername = "";





// =====================================
// PAGE LOAD
// =====================================


document.addEventListener("DOMContentLoaded",function(){


loadUsers();


loadProfile();



});









// =====================================
// PROFILE LOAD
// =====================================


function loadProfile(){



let name =
localStorage.getItem("name");


let picture =
localStorage.getItem("picture");





document.querySelectorAll("#username")
.forEach(function(el){


el.innerHTML =
name || "User";


});





let img =
document.getElementById("profileImg");



if(img){


if(picture){

img.src=picture;


}



img.onerror=function(){

this.src="assets/profile.png";


};



}



}









// =====================================
// LOAD USERS
// =====================================


function loadUsers(){



showLoading();



fetch(API_URL+"?action=users")

.then(res=>res.json())

.then(data=>{



users=data;


displayUsers(users);



})

.catch(err=>{


showPopup(
"Failed to load users",
"red"
);


})

.finally(()=>{


hideLoading();


});



}









// =====================================
// DISPLAY USERS
// =====================================


function displayUsers(data){



const table =
document.getElementById("userTable");



table.innerHTML="";






if(data.length===0){


table.innerHTML=
`
<tr>
<td colspan="6">
No User Found
</td>
</tr>
`;

return;


}








data.forEach(function(user){





table.innerHTML +=
`

<tr>


<td>

<img src="${user.picture || 'assets/profile.png'}"
onerror="this.src='assets/profile.png'">

</td>



<td>${user.username}</td>


<td>${user.name}</td>


<td>${user.role}</td>


<td>${user.status}</td>



<td>



<button onclick="editUser('${user.username}')">

<i class="fa-solid fa-pen"></i>

</button>




<button onclick="deleteUser('${user.username}')">

<i class="fa-solid fa-trash"></i>

</button>



</td>



</tr>

`;




});



}









// =====================================
// SEARCH
// =====================================


document
.getElementById("searchInput")
.addEventListener("keyup",function(){



let value =
this.value.toLowerCase();





let filter =
users.filter(function(user){



return (

user.username.toLowerCase()
.includes(value)

||

user.name.toLowerCase()
.includes(value)

||

user.role.toLowerCase()
.includes(value)


);



});




displayUsers(filter);



});









// =====================================
// OPEN ADD USER
// =====================================


function openAddUser(){



editMode=false;


oldUsername="";



document.getElementById("formTitle")
.innerHTML="Add User";



clearForm();



document.getElementById("userModal")
.style.display="flex";



}









// =====================================
// EDIT USER
// =====================================


function editUser(username){



let user =
users.find(u=>u.username===username);



if(!user)
return;




editMode=true;


oldUsername=user.username;





document.getElementById("formTitle")
.innerHTML="Edit User";





document.getElementById("formUsername")
.value=user.username;


document.getElementById("formPassword")
.value=user.password;


document.getElementById("formName")
.value=user.name;


document.getElementById("formRole")
.value=user.role;


document.getElementById("formStatus")
.value=user.status;


document.getElementById("formPicture")
.value=user.picture;





document.getElementById("userModal")
.style.display="flex";



}









// =====================================
// SAVE USER
// =====================================


function saveUser(){



let data={



action:
editMode ? "update":"add",




username:
document.getElementById("formUsername").value.trim(),




password:
document.getElementById("formPassword").value.trim(),




name:
document.getElementById("formName").value.trim(),




role:
document.getElementById("formRole").value,




status:
document.getElementById("formStatus").value,




picture:
document.getElementById("formPicture").value.trim()



};





if(editMode){


data.oldUsername =
oldUsername;


}







showLoading();





fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":
"text/plain;charset=utf-8"

},


body:JSON.stringify(data)


})



.then(res=>res.json())

.then(result=>{



if(result.success){



showPopup(
result.message,
"green"
);



closeModal();


loadUsers();


}

else{


showPopup(
result.message,
"red"
);



}



})

.catch(()=>{


showPopup(
"Server Error",
"red"
);


})

.finally(()=>{


hideLoading();


});



}









// =====================================
// DELETE USER
// =====================================


function deleteUser(username){



if(!confirm(
"Delete this user?"
))

return;





showLoading();




fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":
"text/plain;charset=utf-8"

},


body:JSON.stringify({

action:"delete",

username:username


})


})



.then(res=>res.json())

.then(data=>{



showPopup(
data.message,
data.success ? "green":"red"
);



loadUsers();



})

.finally(()=>{


hideLoading();


});



}









// =====================================
// MODAL
// =====================================


function closeModal(){



document.getElementById("userModal")
.style.display="none";


clearForm();



}







function clearForm(){



document.getElementById("formUsername").value="";

document.getElementById("formPassword").value="";

document.getElementById("formName").value="";

document.getElementById("formRole").value="Admin";

document.getElementById("formStatus").value="Active";

document.getElementById("formPicture").value="";



}









// =====================================
// LOADING
// =====================================


function showLoading(){


document.getElementById("loadingBox")
.style.display="flex";


}



function hideLoading(){


document.getElementById("loadingBox")
.style.display="none";


}









// =====================================
// POPUP
// =====================================


function showPopup(message,color="green"){



let popup =
document.getElementById("popup");



popup.innerHTML=message;


popup.style.background=color;


popup.style.display="block";




setTimeout(()=>{


popup.style.display="none";


},2500);



}









// =====================================
// PROFILE MENU
// =====================================


function toggleProfileMenu(){


let menu =
document.getElementById("profileMenu");



if(menu.style.display==="block"){


menu.style.display="none";


}
else{


menu.style.display="block";


}



}









function openMyAccount(){


window.location.href="my-account.html";


}









function logout(){


localStorage.clear();


window.location.href="login.html";


}
