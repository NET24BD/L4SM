/* =====================================================
   USER CONTROL DASHBOARD
   PART 1
===================================================== */

// ===============================
// GOOGLE APPS SCRIPT API
// ===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

let users = [];
let editRow = null;


// ===============================
// PAGE LOAD
// ===============================

window.addEventListener("load", () => {

    loadUsers();
    sidebarToggle();

});


// ===============================
// SIDEBAR
// ===============================

function sidebarToggle() {

    const sidebar =
        document.getElementById("sidebar");

    const btn =
        document.getElementById("toggleSidebar");

    btn.onclick = () => {

        sidebar.classList.toggle("collapsed");

    };

}



// ===============================
// LOADING
// ===============================

function showLoading() {

    document
        .getElementById("loading")
        .classList
        .add("show");

}

function hideLoading() {

    document
        .getElementById("loading")
        .classList
        .remove("show");

}



// ===============================
// TOAST
// ===============================

function toast(message, error = false) {

    const t =
        document.getElementById("toast");

    t.innerHTML = message;

    if (error) {

        t.classList.add("error");

    } else {

        t.classList.remove("error");

    }

    t.classList.add("show");

    setTimeout(() => {

        t.classList.remove("show");

    }, 3000);

}



// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

    showLoading();

    try {

        const body =
            new URLSearchParams();

        body.append("action", "getUsers");

        const res =
            await fetch(API_URL, {

                method: "POST",

                body

            });

        const data =
            await res.json();

        if (data.success) {

            users = data.users;

            renderUsers();

            updateCards();

        } else {

            toast("Failed to Load Users", true);

        }

    }

    catch (err) {

        console.log(err);

        toast("Server Connection Failed", true);

    }

    hideLoading();

}



// ===============================
// DASHBOARD CARDS
// ===============================

function updateCards() {

    document.getElementById("totalUsers").innerHTML =
        users.length;

    document.getElementById("activeUsers").innerHTML =
        users.filter(x =>
            String(x.status).toLowerCase() === "active"
        ).length;

    document.getElementById("inactiveUsers").innerHTML =
        users.filter(x =>
            String(x.status).toLowerCase() !== "active"
        ).length;

    const dep =
        [...new Set(
            users.map(x => x.department)
        )];

    document.getElementById("departmentCount").innerHTML =
        dep.length;

}



// ===============================
// REFRESH BUTTON
// ===============================

document
    .getElementById("refreshBtn")
    .onclick = () => {

        loadUsers();

    };
/* =====================================================
   USER CONTROL DASHBOARD
   PART 2
===================================================== */


// ===============================
// RENDER USER TABLE
// ===============================

function renderUsers(list = users) {

    const tbody =
        document.getElementById("userTableBody");

    tbody.innerHTML = "";

    if (list.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="12" class="loading">

                No User Found

            </td>

        </tr>

        `;

        return;

    }


    list.forEach((user, index) => {

        const picture =
            user.picture && user.picture.trim() !== ""
            ? user.picture
            : "https://i.imgur.com/2DhmtJ4.png";


        const status =
            String(user.status).toLowerCase();


        tbody.innerHTML += `

<tr>

<td>${index + 1}</td>

<td>

<img src="${picture}"

onerror="this.src='https://i.imgur.com/2DhmtJ4.png'">

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

<td>${user.department}</td>

<td>${user.number}</td>

<td>${user.email}</td>

<td>${user.joinDate}</td>

<td>

<div class="action-buttons">

<button
class="edit-btn"

onclick="editUser(${user.row})">

<i class="fas fa-pen"></i>

</button>

<button
class="delete-btn"

onclick="deleteUserConfirm('${user.username}')">

<i class="fas fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}



// ===============================
// SEARCH USER
// ===============================

document
.getElementById("searchUser")
.addEventListener("keyup", function () {

    const keyword =
        this.value
        .toLowerCase()
        .trim();

    const result =
        users.filter(user =>

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

        );

    renderUsers(result);

});



// ===============================
// EDIT USER
// ===============================

function editUser(row){

    editRow = row;

    const user =
        users.find(u => u.row == row);

    if(!user){

        toast("User Not Found",true);

        return;

    }

    document
    .getElementById("modalTitle")
    .innerHTML = "Edit User";

    document
    .getElementById("row")
    .value = user.row;

    document
    .getElementById("username")
    .value = user.username;

    document
    .getElementById("password")
    .value = user.password;

    document
    .getElementById("name")
    .value = user.name;

    document
    .getElementById("role")
    .value = user.role;

    document
    .getElementById("status")
    .value = user.status;

    document
    .getElementById("picture")
    .value = user.picture;

    document
    .getElementById("address")
    .value = user.address;

    document
    .getElementById("number")
    .value = user.number;

    document
    .getElementById("email")
    .value = user.email;

    document
    .getElementById("department")
    .value = user.department;

    document
    .getElementById("joinDate")
    .value = convertDate(user.joinDate);

    document
    .getElementById("userModal")
    .classList
    .add("show");

}



// ===============================
// DATE FORMAT
// ===============================

function convertDate(date){

    if(!date) return "";

    const d = date.split("-");

    if(d.length !== 3) return "";

    return d[2]+"-"+d[1]+"-"+d[0];

}



// ===============================
// DELETE
// ===============================

function deleteUserConfirm(username){

    if(!confirm(
        "Delete this user?"
    )){

        return;

    }

    deleteUser(username);

}
/* =====================================================
   USER CONTROL DASHBOARD
   PART 3A
===================================================== */

// ===============================
// ELEMENTS
// ===============================

const userModal = document.getElementById("userModal");
const userForm = document.getElementById("userForm");

const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");


// ===============================
// OPEN MODAL
// ===============================

addUserBtn.onclick = () => {

    editRow = null;

    document.getElementById("modalTitle").innerHTML =
        "Add New User";

    userForm.reset();

    document.getElementById("row").value = "";

    userModal.classList.add("show");

};


// ===============================
// CLOSE MODAL
// ===============================

function hideModal() {

    userModal.classList.remove("show");

}

closeModal.onclick = hideModal;

cancelBtn.onclick = hideModal;


// Click outside

window.addEventListener("click", function (e) {

    if (e.target === userModal) {

        hideModal();

    }

});


// ===============================
// SAVE USER
// ===============================

userForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    showLoading();

    const body = new URLSearchParams();

    if (editRow == null) {

        body.append("action", "addUser");

    } else {

        body.append("action", "updateUser");
        body.append("row", editRow);

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

    try {

        const res = await fetch(API_URL, {

            method: "POST",

            body: body

        });

        const data = await res.json();

        if (data.success) {

            toast(data.message || "Saved Successfully");

            hideModal();

            loadUsers();

        } else {

            toast(data.message || "Failed", true);

        }

    } catch (err) {

        console.error(err);

        toast("Connection Failed", true);

    }

    hideLoading();

});
/* =====================================================
   USER CONTROL DASHBOARD
   PART 3B
===================================================== */

// ===============================
// DELETE USER
// ===============================

async function deleteUser(username){

    showLoading();

    try{

        const body = new URLSearchParams();

        body.append("action","deleteUser");
        body.append("username",username);

        const res = await fetch(API_URL,{
            method:"POST",
            body:body
        });

        const data = await res.json();

        if(data.success){

            toast(data.message || "User Deleted");

            loadUsers();

        }else{

            toast(data.message || "Delete Failed",true);

        }

    }catch(error){

        console.error(error);

        toast("Server Connection Failed",true);

    }

    hideLoading();

}



// ===============================
// ACCOUNT
// ===============================

async function loadAccount(username){

    if(!username) return;

    try{

        const body = new URLSearchParams();

        body.append("action","account");
        body.append("username",username);

        const res = await fetch(API_URL,{
            method:"POST",
            body:body
        });

        const data = await res.json();

        if(data.success){

            document.getElementById("profileName").innerHTML =
                data.name || "Administrator";

            document.getElementById("profileRole").innerHTML =
                data.role || "Admin";

            if(data.picture){

                document.getElementById("profileImage").src =
                    data.picture;

            }

        }

    }catch(err){

        console.log(err);

    }

}



// ===============================
// LOGOUT
// ===============================

function logout(){

    if(!confirm("Are you sure you want to logout?")){

        return;

    }

    localStorage.removeItem("username");

    window.location.href="login.html";

}



// ===============================
// LOGOUT BUTTON
// ===============================

document.querySelectorAll(".menu a").forEach(link=>{

    if(link.textContent.includes("Logout")){

        link.addEventListener("click",function(e){

            e.preventDefault();

            logout();

        });

    }

});



// ===============================
// SESSION CHECK
// ===============================

const loginUser =
    localStorage.getItem("username");

if(loginUser){

    loadAccount(loginUser);

}



// ===============================
// ESC KEY CLOSE MODAL
// ===============================

window.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        hideModal();

    }

});



// ===============================
// PREVENT DOUBLE SUBMIT
// ===============================

let saving = false;

userForm.addEventListener("submit",function(e){

    if(saving){

        e.preventDefault();

        return;

    }

    saving = true;

    setTimeout(()=>{

        saving = false;

    },1500);

});



// ===============================
// STARTUP
// ===============================

console.log("User Control Dashboard Ready");
