// ===============================
// LOGIN CHECK
// ===============================

const isLogin = localStorage.getItem("isLogin");
const role = localStorage.getItem("role");

if (isLogin !== "true" || role !== "Admin") {

    window.location.replace("login.html");

}
const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


let users = [];

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


document.getElementById("profileBtn").onclick=function(e){


e.stopPropagation();


let menu =
document.getElementById("profileMenu");



menu.style.display =
menu.style.display==="block"
?
"none"
:
"block";


};





document.addEventListener("click",()=>{


let menu =
document.getElementById("profileMenu");


if(menu){

menu.style.display="none";

}


});









// ===============================
// BACK BUTTON
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


document.getElementById("logoutBtn").onclick = function () {

    localStorage.clear();

    window.location.replace("login.html");

};











// ===============================
// LOAD USERS
// ===============================


function loadUsers(){



showLoading("Loading Users...");




fetch(API_URL+"?action=users")

.then(res=>res.json())


.then(data=>{


users=data;


showUsers(users);


})


.catch(error=>{


console.log(error);


showPopup(
"Error",
"User Load Failed"
);


})



.finally(()=>{


hideLoading();


});



}









// ===============================
// SHOW USERS
// ===============================


function showUsers(data){



let table =
document.getElementById("userTable");



table.innerHTML="";





if(data.length===0){


table.innerHTML=`

<tr>

<td colspan="6">

No User Found

</td>

</tr>

`;

return;


}







data.forEach(user=>{



table.innerHTML +=`


<tr>



<td>


<img class="user-photo"
src="${user.picture || 'profile.png'}">


</td>





<td>

${user.username}

</td>





<td>

${user.name}

</td>





<td>

${user.role}

</td>





<td>

${user.status}

</td>






<td>



<button onclick="editUser(
'${user.username}',
'${user.password}',
'${user.name}',
'${user.role}',
'${user.status}',
'${user.picture}'
)">

Edit

</button>





<button onclick="deleteUser('${user.username}')">

Delete

</button>



</td>



</tr>


`;



});



}









// ===============================
// SEARCH
// ===============================


document.getElementById("searchUser")
.addEventListener("keyup",function(){



let value =
this.value.toLowerCase();



let result =
users.filter(user=>{


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



showUsers(result);



});









// ===============================
// OPEN ADD USER
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
// CLOSE MODAL
// ===============================


document.getElementById("closeModal").onclick=function(){


closeModal();


};





document.getElementById("cancelUser").onclick=function(){


closeModal();


};





function closeModal(){


document.getElementById("userModal").style.display=
"none";


}









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
"Username Password Required"
);


return;


}







if(editMode){


data.action="update";


data.oldUsername=oldUsername;


}

else{


data.action="add";


}






showLoading(
editMode ?
"Updating User..."
:
"Creating User..."
);








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



hideLoading();





showPopup(

result.success?
"Success"
:
"Error",

result.message

);






if(result.success){


closeModal();


loadUsers();


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





document.getElementById("username").value=username;


document.getElementById("password").value=password;


document.getElementById("name").value=name;


document.getElementById("role").value=role;


document.getElementById("status").value=status;


document.getElementById("picture").value=picture || "";




document.getElementById("formTitle").innerHTML=
"Edit User";



document.getElementById("userModal").style.display=
"flex";


}









// ===============================
// DELETE USER
// ===============================


function deleteUser(username){



if(!confirm("Delete this user?")){


return;


}






showLoading("Deleting User...");





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



.then(result=>{


hideLoading();



showPopup(

result.success?
"Success"
:
"Error",

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
// POPUP
// ===============================



function showPopup(title, msg, type = "success") {

    const icon = document.getElementById("popupIcon");

    document.getElementById("popupTitle").innerHTML = title;
    document.getElementById("popupMessage").innerHTML = msg;

    if (type === "success") {
        icon.className = "fa-solid fa-circle-check";
        icon.style.color = "#16a34a";
    }

    if (type === "error") {
        icon.className = "fa-solid fa-circle-xmark";
        icon.style.color = "#dc2626";
    }

    if (type === "warning") {
        icon.className = "fa-solid fa-triangle-exclamation";
        icon.style.color = "#f59e0b";
    }

    if (type === "login") {
        icon.className = "fa-solid fa-lock";
        icon.style.color = "#2563eb";
    }

    document.getElementById("popupBox").style.display = "flex";
}





function closePopup(){


document.getElementById("popupBox").style.display=
"none";


}

// ===============================
// BLOCK BACK BUTTON AFTER LOGOUT
// ===============================

window.addEventListener("pageshow", function () {

    if (localStorage.getItem("isLogin") !== "true") {

        window.location.replace("login.html");

    }

});
