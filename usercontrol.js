/* =====================================================
   USER CONTROL DASHBOARD
   FINAL JS
   PART-1
===================================================== */

//===============================
// GOOGLE APPS SCRIPT API
//===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

let users = [];
let editRow = null;
let saving = false;


//===============================
// PAGE LOAD
//===============================

window.addEventListener("load", () => {

    sidebarToggle();

    loadUsers();

    const loginUser =
        localStorage.getItem("username");

    if(loginUser){

        loadAccount(loginUser);

    }

});


//===============================
// SIDEBAR
//===============================

function sidebarToggle(){

    const sidebar =
        document.getElementById("sidebar");

    const btn =
        document.getElementById("toggleSidebar");

    if(!sidebar || !btn) return;

    btn.onclick = ()=>{

        sidebar.classList.toggle("collapsed");

    };

}



//===============================
// LOADING
//===============================

function showLoading(){

    const loading =
        document.getElementById("loading");

    if(loading){

        loading.classList.add("show");

    }

}

function hideLoading(){

    const loading =
        document.getElementById("loading");

    if(loading){

        loading.classList.remove("show");

    }

}



//===============================
// TOAST
//===============================

function toast(message,error=false){

    const t =
        document.getElementById("toast");

    if(!t){

        alert(message);

        return;

    }

    t.innerHTML = message;

    if(error){

        t.classList.add("error");

    }else{

        t.classList.remove("error");

    }

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

        const body =
            new URLSearchParams();

        body.append("action","getUsers");

        const res =
            await fetch(API_URL,{

                method:"POST",

                body

            });

        const data =
            await res.json();

        if(data.success){

            users =
                Array.isArray(data.users)
                ? data.users
                : [];

            renderUsers(users);

            updateCards();

        }else{

            toast(data.message || "Failed To Load Users",true);

        }

    }catch(err){

        console.error(err);

        toast("Server Connection Failed",true);

    }

    hideLoading();

}



//===============================
// DASHBOARD CARDS
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

    const dep =

        [...new Set(

            users.map(x=>x.department)

        )];

    document.getElementById("departmentCount").innerHTML =
        dep.length;

}



//===============================
// REFRESH
//===============================

const refreshBtn =
document.getElementById("refreshBtn");

if(refreshBtn){

    refreshBtn.onclick=()=>{

        loadUsers();

    };

}



//===============================
// SEARCH USER
//===============================

const searchInput =
document.getElementById("searchUser");

if(searchInput){

searchInput.addEventListener("keyup",function(){

    const keyword =
    this.value
    .toLowerCase()
    .trim();

    const result =
    users.filter(user=>{

        return(

            String(user.username)
            .toLowerCase()
            .includes(keyword)

            ||

            String(user.name)
            .toLowerCase()
            .includes(keyword)

            ||

            String(user.role)
            .toLowerCase()
            .includes(keyword)

            ||

            String(user.department)
            .toLowerCase()
            .includes(keyword)

            ||

            String(user.number)
            .toLowerCase()
            .includes(keyword)

            ||

            String(user.email)
            .toLowerCase()
            .includes(keyword)

        );

    });

    renderUsers(result);

});

}
/* =====================================================
   USER CONTROL DASHBOARD
   FINAL JS
   PART-2
===================================================== */


//===============================
// RENDER USER TABLE
//===============================

function renderUsers(list = users){

    const tbody =
    document.getElementById("userTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    if(list.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="12" class="loading">

                No User Found

            </td>

        </tr>

        `;

        return;

    }

    list.forEach((user,index)=>{

        const picture=

        user.picture && user.picture.trim()!=""

        ? user.picture

        : "https://i.imgur.com/2DhmtJ4.png";



        const status=

        String(user.status)

        .toLowerCase();



        tbody.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>

<img

src="${picture}"

onerror="this.src='https://i.imgur.com/2DhmtJ4.png'"

class="profile-img"

>

</td>

<td>${user.username}</td>

<td>${user.password}</td>

<td>${user.name}</td>

<td>${user.role}</td>

<td>

<span class="status ${status}">

${user.status}

</span>

</td>

<td>${user.department||""}</td>

<td>${user.number||""}</td>

<td>${user.email||""}</td>

<td>${user.joinDate||""}</td>

<td>

<div class="action-buttons">

<button

class="edit-btn"

title="Edit User"

onclick="editUser(${user.row})">

<i class="fas fa-pen"></i>

</button>

<button

class="delete-btn"

title="Delete User"

onclick="deleteUserConfirm(${user.row})">

<i class="fas fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}



//===============================
// EDIT USER
//===============================

function editUser(row){

    editRow=row;

    const user=

    users.find(x=>x.row==row);

    if(!user){

        toast("User Not Found",true);

        return;

    }

    document.getElementById("modalTitle").innerHTML=

    "Edit User";



    document.getElementById("row").value=user.row;

    document.getElementById("username").value=user.username;

    document.getElementById("password").value=user.password;

    document.getElementById("name").value=user.name;

    document.getElementById("role").value=user.role;

    document.getElementById("status").value=user.status;

    document.getElementById("picture").value=user.picture;

    document.getElementById("address").value=user.address;

    document.getElementById("number").value=user.number;

    document.getElementById("email").value=user.email;

    document.getElementById("department").value=user.department;

    document.getElementById("joinDate").value=

    convertDate(user.joinDate);



    if(document.getElementById("bloodGroup")){

        document.getElementById("bloodGroup").value=

        user.bloodGroup || "";

    }

    if(document.getElementById("profession")){

        document.getElementById("profession").value=

        user.profession || "";

    }

    document

    .getElementById("userModal")

    .classList

    .add("show");

}



//===============================
// DATE FORMAT
//===============================

function convertDate(date){

    if(!date) return "";

    const d=date.split("-");

    if(d.length!==3) return "";

    return d[2]+"-"+d[1]+"-"+d[0];

}



//===============================
// ADD USER
//===============================

const addUserBtn=

document.getElementById("addUserBtn");

if(addUserBtn){

addUserBtn.onclick=()=>{

    editRow=null;

    document

    .getElementById("modalTitle")

    .innerHTML="Add New User";

    document

    .getElementById("userForm")

    .reset();

    document

    .getElementById("row")

    .value="";

    document

    .getElementById("userModal")

    .classList

    .add("show");

};

}



//===============================
// DELETE CONFIRM
//===============================

function deleteUserConfirm(row){

    if(!confirm(

        "Delete this user?"

    )) return;

    deleteUser(row);

}
/* =====================================================
   USER CONTROL DASHBOARD
   FINAL JS
   PART-3
===================================================== */

//===============================
// ELEMENTS
//===============================

const userModal = document.getElementById("userModal");
const userForm = document.getElementById("userForm");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");


//===============================
// CLOSE MODAL
//===============================

function hideModal(){

    if(userModal){

        userModal.classList.remove("show");

    }

}

if(closeModal){

    closeModal.onclick = hideModal;

}

if(cancelBtn){

    cancelBtn.onclick = hideModal;

}

window.addEventListener("click",function(e){

    if(e.target===userModal){

        hideModal();

    }

});


//===============================
// SAVE USER
//===============================

userForm.addEventListener("submit",async function(e){

    e.preventDefault();

    if(saving) return;

    saving=true;

    showLoading();

    try{

        const body=new URLSearchParams();

        if(editRow==null){

            body.append("action","addUser");

        }else{

            body.append("action","updateUser");
            body.append("row",editRow);

        }

        body.append("username",
            document.getElementById("username").value.trim());

        body.append("password",
            document.getElementById("password").value.trim());

        body.append("name",
            document.getElementById("name").value.trim());

        body.append("role",
            document.getElementById("role").value);

        body.append("status",
            document.getElementById("status").value);

        body.append("picture",
            document.getElementById("picture").value.trim());

        body.append("address",
            document.getElementById("address").value.trim());

        body.append("number",
            document.getElementById("number").value.trim());

        body.append("email",
            document.getElementById("email").value.trim());

        body.append("department",
            document.getElementById("department").value.trim());

        body.append("joinDate",
            document.getElementById("joinDate").value);

        // Optional Fields

        if(document.getElementById("bloodGroup")){

            body.append(
                "bloodGroup",
                document.getElementById("bloodGroup").value
            );

        }

        if(document.getElementById("profession")){

            body.append(
                "profession",
                document.getElementById("profession").value
            );

        }

        const res=await fetch(API_URL,{

            method:"POST",

            body

        });

        const data=await res.json();

        if(data.success){

            toast(data.message || "Saved Successfully");

            hideModal();

            editRow=null;

            loadUsers();

        }else{

            toast(data.message || "Save Failed",true);

        }

    }catch(err){

        console.error(err);

        toast("Server Connection Failed",true);

    }

    saving=false;

    hideLoading();

});



//===============================
// DELETE USER
//===============================

async function deleteUser(row){

    showLoading();

    try{

        const body=new URLSearchParams();

        body.append("action","deleteUser");
        body.append("row",row);

        const res=await fetch(API_URL,{

            method:"POST",

            body

        });

        const data=await res.json();

        if(data.success){

            toast(data.message || "User Deleted");

            loadUsers();

        }else{

            toast(data.message || "Delete Failed",true);

        }

    }catch(err){

        console.error(err);

        toast("Server Connection Failed",true);

    }

    hideLoading();

}
