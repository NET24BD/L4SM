/* =====================================================
   LINK4 USER CONTROL DASHBOARD
   FINAL JS CONNECTED WITH GOOGLE SHEET API
===================================================== */


//===============================
// API
//===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";


let users = [];
let editRow = null;
let saving = false;



//===============================
// PAGE LOAD
//===============================

window.addEventListener("load",()=>{


    sidebarToggle();


    loadUsers();


    const username =
    localStorage.getItem("username");


    if(username){

        loadAccount(username);

    }


});




//===============================
// SIDEBAR
//===============================

function sidebarToggle(){


    const btn =
    document.getElementById("toggleSidebar");


    const sidebar =
    document.getElementById("sidebar");


    if(btn && sidebar){


        btn.onclick=()=>{

            sidebar.classList.toggle("collapsed");

        };


    }

}




//===============================
// LOADING
//===============================

function showLoading(){

    const x =
    document.getElementById("loading");


    if(x)
    x.classList.add("show");

}



function hideLoading(){

    const x =
    document.getElementById("loading");


    if(x)
    x.classList.remove("show");

}





//===============================
// TOAST
//===============================

function toast(msg,error=false){


    const t =
    document.getElementById("toast");


    if(!t){

        alert(msg);

        return;

    }


    t.innerHTML=msg;


    if(error)

        t.classList.add("error");

    else

        t.classList.remove("error");



    t.classList.add("show");



    setTimeout(()=>{

        t.classList.remove("show");

    },3000);


}





//===============================
// LOAD USERS
//===============================

async function loadUsers(){


showLoading();


try{


    let body =
    new URLSearchParams();


    body.append(
        "action",
        "getUsers"
    );



    let res =
    await fetch(API_URL,{

        method:"POST",

        body

    });



    let data =
    await res.json();



    if(data.success){


        users =
        data.users || [];



        renderUsers(users);


        updateCards();


    }
    else{


        toast(
        data.message ||
        "Load Failed",
        true
        );


    }



}
catch(err){


    console.log(err);


    toast(
    "Server Connection Failed",
    true
    );


}



hideLoading();


}






//===============================
// DASHBOARD COUNT
//===============================

function updateCards(){


document.getElementById("totalUsers").innerHTML =
users.length;



document.getElementById("activeUsers").innerHTML =

users.filter(x=>

String(x.status)
.toLowerCase()=="active"

).length;



document.getElementById("inactiveUsers").innerHTML =

users.filter(x=>

String(x.status)
.toLowerCase()!="active"

).length;



let dep =
[
...new Set(

users.map(x=>x.department)

.filter(Boolean)

)

];



document.getElementById("departmentCount").innerHTML =
dep.length;



}





//===============================
// SEARCH
//===============================

const searchUser =
document.getElementById("searchUser");



if(searchUser){


searchUser.addEventListener("keyup",()=>{


let key =
searchUser.value
.toLowerCase()
.trim();



let result =
users.filter(u=>{


return (

String(u.username)
.toLowerCase()
.includes(key)


||

String(u.name)
.toLowerCase()
.includes(key)


||

String(u.role)
.toLowerCase()
.includes(key)


||

String(u.department)
.toLowerCase()
.includes(key)


||

String(u.number)
.toLowerCase()
.includes(key)


);


});



renderUsers(result);



});


}







//===============================
// RENDER TABLE
//===============================

function renderUsers(list){


const tbody =
document.getElementById("userTableBody");



if(!tbody)return;



tbody.innerHTML="";



if(list.length==0){


tbody.innerHTML=`

<tr>
<td colspan="12">
No User Found
</td>
</tr>

`;

return;


}




list.forEach((u,i)=>{


let img =
u.picture ||
"https://i.imgur.com/2DhmtJ4.png";



let status =
String(u.status)
.toLowerCase();



tbody.innerHTML+=`


<tr>

<td>${i+1}</td>


<td>
<img class="profile-img"
src="${img}"
onerror="this.src='https://i.imgur.com/2DhmtJ4.png'">
</td>


<td>${u.username}</td>


<td>********</td>


<td>${u.name}</td>


<td>${u.role}</td>


<td>

<span class="status ${status}">
${u.status}
</span>

</td>


<td>${u.department||""}</td>


<td>${u.number||""}</td>


<td>${u.email||""}</td>


<td>${u.joinDate||""}</td>


<td>

<button onclick="editUser(${u.row})">
<i class="fa fa-edit"></i>
</button>


<button onclick="deleteUserConfirm(${u.row})">
<i class="fa fa-trash"></i>
</button>


</td>


</tr>


`;



});


}





//===============================
// LOAD ACCOUNT PROFILE
//===============================


async function loadAccount(username){


let body =
new URLSearchParams();


body.append(
"action",
"account"
);


body.append(
"username",
username
);



try{


let res =
await fetch(API_URL,{

method:"POST",

body

});


let data =
await res.json();



if(data.success){


document.getElementById("profileName").innerHTML =
data.name;



document.getElementById("profileRole").innerHTML =
data.role;



document.getElementById("profileImage").src =

data.picture ||

"https://i.imgur.com/2DhmtJ4.png";



}



}catch(e){


console.log(e);


}



}







//===============================
// ADD USER BUTTON
//===============================


document.getElementById("addUserBtn")
?.addEventListener("click",()=>{


editRow=null;


document.getElementById("userForm").reset();


document.getElementById("modalTitle").innerHTML =
"Add New User";


document.getElementById("userModal")
.classList.add("show");


});







//===============================
// EDIT USER
//===============================

function editUser(row){


editRow=row;



let u =
users.find(x=>x.row==row);



if(!u)return;



username.value=u.username;
password.value=u.password;
name.value=u.name;
role.value=u.role;
status.value=u.status;
picture.value=u.picture;
address.value=u.address;
number.value=u.number;
email.value=u.email;
department.value=u.department;
profession.value=u.profession;
bloodGroup.value=u.bloodGroup;



joinDate.value =
convertDate(u.joinDate);



modalTitle.innerHTML =
"Edit User";



userModal.classList.add("show");



}





//===============================
// DATE
//===============================

function convertDate(d){


if(!d)return "";


let x=d.split("-");


return x[2]+"-"+x[1]+"-"+x[0];


}





//===============================
// SAVE USER
//===============================

userForm.addEventListener("submit",async e=>{


e.preventDefault();


if(saving)return;


saving=true;


showLoading();



let body =
new URLSearchParams();



body.append(
"action",
editRow?
"updateUser":
"addUser"
);



if(editRow)

body.append(
"row",
editRow
);



[
"username",
"password",
"name",
"role",
"status",
"picture",
"address",
"number",
"email",
"department",
"joinDate",
"bloodGroup",
"profession"

].forEach(id=>{


let el =
document.getElementById(id);


if(el)

body.append(
id,
el.value
);


});




try{


let res =
await fetch(API_URL,{

method:"POST",

body

});



let data =
await res.json();



toast(
data.message,
!data.success
);



if(data.success){


userModal.classList.remove("show");


loadUsers();


}



}catch(e){


toast(
"Save Failed",
true
);


}



saving=false;


hideLoading();



});






//===============================
// DELETE
//===============================


function deleteUserConfirm(row){


if(confirm("Delete this user?")){


deleteUser(row);


}


}



async function deleteUser(row){


let body =
new URLSearchParams();


body.append(
"action",
"deleteUser"
);


body.append(
"row",
row
);



let res =
await fetch(API_URL,{

method:"POST",

body

});



let data =
await res.json();



toast(
data.message,
!data.success
);



if(data.success)

loadUsers();



}





//===============================
// MODAL CLOSE
//===============================

function closeModal(){


document.getElementById("userModal")
.classList.remove("show");


}


document.getElementById("closeModal")
?.addEventListener("click",closeModal);



document.getElementById("cancelBtn")
?.addEventListener("click",closeModal);





//===============================
// REFRESH
//===============================

document.getElementById("refreshBtn")
?.addEventListener("click",loadUsers);
