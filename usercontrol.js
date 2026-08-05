const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



let editMode = false;
let oldUsername = "";




// ===============================
// PAGE LOAD
// ===============================


document.addEventListener("DOMContentLoaded",()=>{


loadProfile();

loadUsers();


});







// ===============================
// PROFILE
// ===============================


function loadProfile(){


let name =
localStorage.getItem("name");


let picture =
localStorage.getItem("picture");



document.getElementById("userName").innerHTML =
name || "User";



if(picture){

document.getElementById("profileImg").src =
picture;

}


}








// ===============================
// PROFILE MENU
// ===============================


const profileBtn =
document.getElementById("profileBtn");


const profileMenu =
document.getElementById("profileMenu");



profileBtn.onclick=function(e){


e.stopPropagation();


profileMenu.style.display =
profileMenu.style.display=="block"
?
"none"
:
"block";


};



document.addEventListener("click",()=>{


profileMenu.style.display="none";


});







// ===============================
// BACK
// ===============================


document.getElementById("backBtn").onclick=function(){


window.location.href="dashboard.html";


};








// ===============================
// ACCOUNT
// ===============================


document.getElementById("accountBtn").onclick=function(){


window.location.href="my-account.html";


};








// ===============================
// LOGOUT
// ===============================


document.getElementById("logoutBtn").onclick=function(){


localStorage.clear();


window.location.href="login.html";


};









// ===============================
// LOAD USERS
// ===============================


function loadUsers(){



showLoading("Loading Users...");



fetch(API_URL+"?action=users")

.then(res=>res.json())


.then(users=>{



let table =
document.getElementById("userTable");



table.innerHTML="";



users.forEach(user=>{


table.innerHTML += `


<tr>


<td>


<img class="user-photo"
src="${user.picture || 'profile.png'}">


</td>



<td>${user.username}</td>


<td>${user.name}</td>


<td>${user.role}</td>


<td>${user.status}</td>



<td>


<button class="action-btn edit"
onclick="editUser(
'${user.username}',
'${user.password}',
'${user.name}',
'${user.role}',
'${user.status}',
'${user.picture}'
)">

Edit

</button>




<button class="action-btn delete"
onclick="deleteUser('${user.username}')">

Delete

</button>



</td>



</tr>



`;



});



})


.catch(()=>{


showPopup(
"Error",
"Cannot load users"
);


})


.finally(()=>{


hideLoading();


});



}








// ===============================
// ADD BUTTON
// ===============================


document.getElementById("addUserBtn").onclick=function(){



editMode=false;


clearForm();



document.getElementById("formTitle").innerHTML=
"Add User";



document.getElementById("userModal").style.display=
"flex";


};









// ===============================
// CANCEL
// ===============================


document.getElementById("cancelUser").onclick=function(){



document.getElementById("userModal").style.display=
"none";


};











// ===============================
// SAVE USER
// ===============================


document.getElementById("saveUser").onclick=function(){



let data={



username:
document.getElementById("username").value.trim(),



password:
document.getElementById("password").value.trim(),



name:
document.getElementById("name").value.trim(),



role:
document.getElementById("role").value,



status:
document.getElementById("status").value,



picture:
document.getElementById("picture").value.trim()



};





if(data.username=="" || data.password==""){


showPopup(
"Warning",
"Username and Password Required"
);


return;


}






showLoading(
editMode ?
"Updating User..." :
"Creating User..."
);






if(editMode){


data.action="update";


data.oldUsername=oldUsername;


}

else{


data.action="add";


}






fetch(API_URL,{


method:"POST",


body:JSON.stringify(data)



})



.then(res=>res.json())



.then(result=>{



hideLoading();



showPopup(
result.success ? "Success" : "Error",
result.message
);



if(result.success){


document.getElementById("userModal").style.display=
"none";


loadUsers();


clearForm();


}



})



.catch(()=>{


hideLoading();


showPopup(
"Error",
"Server Error"
);


});




};









// ===============================
// EDIT USER
// ===============================


function editUser(
username,
password,
name,
role,
status,
picture
){



editMode=true;


oldUsername=username;



document.getElementById("formTitle").innerHTML=
"Edit User";



document.getElementById("username").value=username;


document.getElementById("password").value=password;


document.getElementById("name").value=name;


document.getElementById("role").value=role;


document.getElementById("status").value=status;


document.getElementById("picture").value=picture;



document.getElementById("userModal").style.display=
"flex";


}









// ===============================
// DELETE USER
// ===============================


function deleteUser(username){



if(!confirm("Delete this user?"))

return;




showLoading("Deleting User...");






fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"delete",

username:username


})

})



.then(res=>res.json())



.then(result=>{


hideLoading();



showPopup(
result.success ? "Deleted" : "Error",
result.message
);



if(result.success){

loadUsers();

}



})



.catch(()=>{


hideLoading();


showPopup(
"Error",
"Delete Failed"
);


});



}









// ===============================
// CLEAR FORM
// ===============================


function clearForm(){


document.getElementById("username").value="";


document.getElementById("password").value="";


document.getElementById("name").value="";


document.getElementById("role").value="Admin";


document.getElementById("status").value="Active";


document.getElementById("picture").value="";


}








// ===============================
// LOADING
// ===============================


function showLoading(text){


document.getElementById("loadingText").innerHTML=text;


document.getElementById("loadingBox").style.display=
"block";


}



function hideLoading(){


document.getElementById("loadingBox").style.display=
"none";


}









// ===============================
// POPUP
// ===============================


function showPopup(title,message){


document.getElementById("popupTitle").innerHTML=
title;


document.getElementById("popupMessage").innerHTML=
message;



document.getElementById("popupBox").style.display=
"flex";


}



function closePopup(){


document.getElementById("popupBox").style.display=
"none";


}
