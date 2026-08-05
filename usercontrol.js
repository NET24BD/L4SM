
// Google Apps Script Web App URL

const API_URL =
"https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";




// Load Users

function loadUsers(){


fetch(API_URL+"?action=users")


.then(res=>res.json())


.then(users=>{


let html="";


users.forEach(user=>{


html += `

<tr>


<td>

<img src="${user.picture || ''}">

</td>


<td>${user.username}</td>

<td>${user.name}</td>

<td>${user.role}</td>

<td>${user.status}</td>


<td>


<button class="edit-btn"
onclick='editUser(${JSON.stringify(user)})'>

Edit

</button>



<button class="delete-btn"
onclick="deleteUser('${user.username}')">

Delete

</button>



</td>


</tr>

`;



});



document.getElementById("userList").innerHTML=html;



});


}







// Add User

function addUser(){


let data={


action:"add",

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




fetch(API_URL,{

method:"POST",

body:JSON.stringify(data)

})


.then(res=>res.json())


.then(result=>{


alert(result.message);


loadUsers();


});


}







// Delete User


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








// Edit User

function editUser(user){


document.getElementById("username").value=user.username;

document.getElementById("name").value=user.name;

document.getElementById("role").value=user.role;

document.getElementById("status").value=user.status;

document.getElementById("picture").value=user.picture;


document.getElementById("password").value="";


}




window.onload=function(){

loadUsers();

};
