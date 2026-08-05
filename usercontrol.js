// =====================================
// API URL
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";



let editMode = false;
let editUsername = "";




// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded",()=>{


loadProfile();

loadUsers();



});





// =====================================
// PROFILE
// =====================================

function loadProfile(){


let name = localStorage.getItem("name");

let picture = localStorage.getItem("picture");



if(document.getElementById("userName"))

document.getElementById("userName").innerHTML =
name || "User";



if(picture)

document.getElementById("profileImg").src =
picture;


}







// =====================================
// PROFILE MENU
// =====================================


const profileBtn =
document.getElementById("profileBtn");


const profileMenu =
document.getElementById("profileMenu");



if(profileBtn){


profileBtn.onclick=function(e){


e.stopPropagation();


profileMenu.style.display =
profileMenu.style.display=="block"
?
"none"
:
"block";


}



}




document.addEventListener("click",()=>{


if(profileMenu)

profileMenu.style.display="none";


});






// =====================================
// BACK
// =====================================


document.getElementById("backBtn").onclick=function(){


window.location.href="dashboard.html";


};





// =====================================
// ACCOUNT
// =====================================


document.getElementById("accountBtn").onclick=function(){


window.location.href="my-account.html";


};







// =====================================
// LOGOUT
// =====================================


document.getElementById("logoutBtn").onclick=function(){


localStorage.clear();


window.location.href="login.html";


};








// =====================================
// LOAD USERS
// =====================================


function loadUsers(){


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


<button onclick="editUser('${user.username}',
'${user.password}',
'${user.name}',
'${user.role}',
'${user.status}',
'${user.picture}')">

Edit

</button>



<button onclick="deleteUser('${user.username}')">

Delete

</button>


</td>



</tr>


`;



});



})

.catch(err=>{


console.log(err);


});


}







// =====================================
// SHOW ADD FORM
// =====================================


document.getElementById("addUserBtn").onclick=function(){


document.getElementById("addForm").style.display="block";


editMode=false;


};






document.getElementById("cancelUser").onclick=function(){


document.getElementById("addForm").style.display="none";


clearForm();


};








// =====================================
// SAVE USER
// =====================================


document.getElementById("saveUser").onclick=function(){



let data={


username:
document.getElementById("username").value,


password:
document.getElementById("password").value,


name:
document.getElementById("name").value,


role:
document.getElementById("role").value,


status:
document.getElementById("status").value,


picture:
document.getElementById("picture").value



};





if(editMode){


data.action="update";

data.username=editUsername;



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


alert(result.message);


loadUsers();


clearForm();


document.getElementById("addForm").style.display="none";


});



};










// =====================================
// EDIT USER
// =====================================


function editUser(username,password,name,role,status,picture){



editMode=true;


editUsername=username;



document.getElementById("addForm").style.display="block";



document.getElementById("username").value=username;


document.getElementById("password").value=password;


document.getElementById("name").value=name;


document.getElementById("role").value=role;


document.getElementById("status").value=status;


document.getElementById("picture").value=picture;



}







// =====================================
// DELETE USER
// =====================================


function deleteUser(username){



if(!confirm("Delete this user?"))

return;



fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"delete",

username:username


})

})

.then(res=>res.json())


.then(result=>{


alert(result.message);


loadUsers();


});


}







// =====================================
// CLEAR FORM
// =====================================


function clearForm(){


document.getElementById("username").value="";

document.getElementById("password").value="";

document.getElementById("name").value="";

document.getElementById("picture").value="";


editMode=false;


}
