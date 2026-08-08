```javascript
// ======================================================
// USER CONTROL - usercontrol.js
// ======================================================


// ======================================================
// LOGIN CHECK
// ======================================================

const isLogin = localStorage.getItem("isLogin");
const currentRole = localStorage.getItem("role");

if (isLogin !== "true" || currentRole !== "Admin") {
    window.location.replace("login.html");
}


// ======================================================
// API URL
// ======================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let users = [];
let editMode = false;
let oldUsername = "";


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();
    setupEvents();
    loadUsers();

});


// ======================================================
// PROFILE
// ======================================================

function loadProfile() {

    const name =
        localStorage.getItem("name");

    const picture =
        localStorage.getItem("picture");


    const userName =
        document.getElementById("userName");

    const profileImg =
        document.getElementById("profileImg");


    if (userName) {
        userName.textContent =
            name || "User";
    }


    if (profileImg && picture) {
        profileImg.src = picture;
    }

}


// ======================================================
// SETUP EVENTS
// ======================================================

function setupEvents() {


    // ==================================================
    // PROFILE BUTTON
    // ==================================================

    const profileBtn =
        document.getElementById("profileBtn");


    if (profileBtn) {

        profileBtn.onclick = function (e) {

            e.stopPropagation();


            const menu =
                document.getElementById(
                    "profileMenu"
                );


            if (!menu) return;


            menu.style.display =
                menu.style.display === "block"
                    ? "none"
                    : "block";

        };

    }


    // ==================================================
    // CLOSE PROFILE MENU
    // ==================================================

    document.addEventListener("click", function () {

        const menu =
            document.getElementById(
                "profileMenu"
            );


        if (menu) {

            menu.style.display =
                "none";

        }

    });


    // ==================================================
    // BACK BUTTON
    // ==================================================

    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (backBtn) {

        backBtn.onclick = function () {

            window.location.href =
                "dashboard.html";

        };

    }


    // ==================================================
    // ACCOUNT BUTTON
    // ==================================================

    const accountBtn =
        document.getElementById(
            "accountBtn"
        );


    if (accountBtn) {

        accountBtn.onclick = function () {

            window.location.href =
                "my-account.html";

        };

    }


    // ==================================================
    // LOGOUT
    // ==================================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.onclick = function () {

            localStorage.clear();

            window.location.replace(
                "login.html"
            );

        };

    }


    // ==================================================
    // SEARCH USER
    // ==================================================

    const searchUser =
        document.getElementById(
            "searchUser"
        );


    if (searchUser) {

        searchUser.addEventListener(
            "input",
            function () {

                const value =
                    this.value
                        .toLowerCase()
                        .trim();


                const filteredUsers =
                    users.filter(
                        function (user) {

                            return (

                                String(
                                    user.username || ""
                                )
                                .toLowerCase()
                                .includes(value)

                                ||

                                String(
                                    user.name || ""
                                )
                                .toLowerCase()
                                .includes(value)

                                ||

                                String(
                                    user.role || ""
                                )
                                .toLowerCase()
                                .includes(value)

                                ||

                                String(
                                    user.status || ""
                                )
                                .toLowerCase()
                                .includes(value)

                            );

                        }
                    );


                showUsers(
                    filteredUsers
                );

            }
        );

    }


    // ==================================================
    // ADD USER BUTTON
    // ==================================================

    const addUserBtn =
        document.getElementById(
            "addUserBtn"
        );


    if (addUserBtn) {

        addUserBtn.onclick = function () {

            editMode = false;
            oldUsername = "";


            clearForm();


            const formTitle =
                document.getElementById(
                    "formTitle"
                );


            const modal =
                document.getElementById(
                    "userModal"
                );


            if (formTitle) {

                formTitle.textContent =
                    "Add User";

            }


            if (modal) {

                modal.style.display =
                    "flex";

            }

        };

    }


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const closeModalBtn =
        document.getElementById(
            "closeModal"
        );


    if (closeModalBtn) {

        closeModalBtn.onclick =
            closeModal;

    }


    // ==================================================
    // CANCEL USER
    // ==================================================

    const cancelUser =
        document.getElementById(
            "cancelUser"
        );


    if (cancelUser) {

        cancelUser.onclick =
            closeModal;

    }


    // ==================================================
    // SAVE USER
    // ==================================================

    const saveUser =
        document.getElementById(
            "saveUser"
        );


    if (saveUser) {

        saveUser.onclick =
            saveUserData;

    }

}


// ======================================================
// LOAD USERS
// ======================================================

async function loadUsers() {

    showLoading(
        "Loading Users..."
    );


    try {

        const response =
            await fetch(
                API_URL +
                "?action=users&t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Users API Response:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                data.message ||
                "Invalid users response"
            );

        }


        users = data;

        showUsers(users);


    } catch (error) {

        console.error(
            "Load Users Error:",
            error
        );


        showPopup(
            "Error",
            "User Load Failed",
            "error"
        );


    } finally {

        hideLoading();

    }

}


// ======================================================
// SHOW USERS
// ======================================================

function showUsers(data) {

    const table =
        document.getElementById(
            "userTable"
        );


    if (!table) {

        console.error(
            "Element #userTable not found"
        );

        return;

    }


    table.innerHTML = "";


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No User Found
                </td>

            </tr>

        `;

        return;

    }


    data.forEach(function (user) {


        const username =
            String(
                user.username || ""
            );


        const password =
            String(
                user.password || ""
            );


        const name =
            String(
                user.name || ""
            );


        const role =
            String(
                user.role || ""
            );


        const status =
            String(
                user.status || ""
            );


        const picture =
            String(
                user.picture || ""
            );


        table.innerHTML += `

            <tr>

                <td>
                    ${escapeHTML(username)}
                </td>


                <td>
                    ${escapeHTML(name)}
                </td>


                <td>
                    ${escapeHTML(role)}
                </td>


                <td>

                    <span
                        class="status-badge
                        ${status.toLowerCase() === "active"
                            ? "active"
                            : "inactive"}"
                    >
                        ${escapeHTML(status)}
                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        onclick='editUser(
                            ${JSON.stringify(username)},
                            ${JSON.stringify(password)},
                            ${JSON.stringify(name)},
                            ${JSON.stringify(role)},
                            ${JSON.stringify(status)},
                            ${JSON.stringify(picture)}
                        )'
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onclick='deleteUser(
                            ${JSON.stringify(username)}
                        )'
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// ======================================================
// SAVE USER
// ======================================================

async function saveUserData() {


    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const nameInput =
        document.getElementById(
            "name"
        );


    const roleInput =
        document.getElementById(
            "role"
        );


    const statusInput =
        document.getElementById(
            "status"
        );


    const pictureInput =
        document.getElementById(
            "picture"
        );


    if (
        !usernameInput ||
        !passwordInput ||
        !nameInput ||
        !roleInput ||
        !statusInput ||
        !pictureInput
    ) {

        showPopup(
            "Error",
            "User form element missing",
            "error"
        );

        return;

    }


    const data = {

        username:
            usernameInput.value.trim(),

        password:
            passwordInput.value.trim(),

        name:
            nameInput.value.trim(),

        role:
            roleInput.value,

        status:
            statusInput.value,

        picture:
            pictureInput.value.trim()

    };


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!data.username) {

        showPopup(
            "Warning",
            "Username Required",
            "warning"
        );

        return;

    }


    if (!data.password) {

        showPopup(
            "Warning",
            "Password Required",
            "warning"
        );

        return;

    }


    // ==================================================
    // ACTION
    // ==================================================

    if (editMode) {

        data.action =
            "update";

        data.oldUsername =
            oldUsername;

    } else {

        data.action =
            "add";

    }


    showLoading(
        editMode
            ? "Updating User..."
            : "Creating User..."
    );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "Save User Response:",
            result
        );


        hideLoading();


        showPopup(

            result.success
                ? "Success"
                : "Error",

            result.message ||
                "Operation completed",

            result.success
                ? "success"
                : "error"

        );


        if (result.success) {

            closeModal();

            await loadUsers();

        }


    } catch (error) {

        console.error(
            "Save User Error:",
            error
        );


        hideLoading();


        showPopup(
            "Error",
            "Server Error",
            "error"
        );

    }

}


// ======================================================
// EDIT USER
// ======================================================

function editUser(
    username,
    password,
    name,
    role,
    status,
    picture
) {


    editMode = true;

    oldUsername =
        username;


    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const nameInput =
        document.getElementById(
            "name"
        );


    const roleInput =
        document.getElementById(
            "role"
        );


    const statusInput =
        document.getElementById(
            "status"
        );


    const pictureInput =
        document.getElementById(
            "picture"
        );


    if (usernameInput) {

        usernameInput.value =
            username || "";

    }


    if (passwordInput) {

        passwordInput.value =
            password || "";

    }


    if (nameInput) {

        nameInput.value =
            name || "";

    }


    if (roleInput) {

        roleInput.value =
            role || "User";

    }


    if (statusInput) {

        statusInput.value =
            status || "Active";

    }


    if (pictureInput) {

        pictureInput.value =
            picture || "";

    }


    const formTitle =
        document.getElementById(
            "formTitle"
        );


    const modal =
        document.getElementById(
            "userModal"
        );


    if (formTitle) {

        formTitle.textContent =
            "Edit User";

    }


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// ======================================================
// DELETE USER
// ======================================================

async function deleteUser(username) {


    if (
        !confirm(
            "Delete this user?"
        )
    ) {

        return;

    }


    showLoading(
        "Deleting User..."
    );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            action:
                                "delete",

                            username:
                                username

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "Delete Response:",
            result
        );


        hideLoading();


        showPopup(

            result.success
                ? "Success"
                : "Error",

            result.message ||
                "Delete completed",

            result.success
                ? "success"
                : "error"

        );


        if (result.success) {

            await loadUsers();

        }


    } catch (error) {

        console.error(
            "Delete User Error:",
            error
        );


        hideLoading();


        showPopup(
            "Error",
            "Delete Failed",
            "error"
        );

    }

}


// ======================================================
// CLEAR FORM
// ======================================================

function clearForm() {


    const username =
        document.getElementById(
            "username"
        );


    const password =
        document.getElementById(
            "password"
        );


    const name =
        document.getElementById(
            "name"
        );


    const role =
        document.getElementById(
            "role"
        );


    const status =
        document.getElementById(
            "status"
        );


    const picture =
        document.getElementById(
            "picture"
        );


    if (username)
        username.value = "";


    if (password)
        password.value = "";


    if (name)
        name.value = "";


    if (role)
        role.value = "User";


    if (status)
        status.value = "Active";


    if (picture)
        picture.value = "";

}


// ======================================================
// POPUP
// ======================================================

function showPopup(
    title,
    msg,
    type = "success"
) {


    const icon =
        document.getElementById(
            "popupIcon"
        );


    const popupTitle =
        document.getElementById(
            "popupTitle"
        );


    const popupMessage =
        document.getElementById(
            "popupMessage"
        );


    const popupBox =
        document.getElementById(
            "popupBox"
        );


    if (popupTitle) {

        popupTitle.textContent =
            title;

    }


    if (popupMessage) {

        popupMessage.textContent =
            msg;

    }


    if (icon) {


        if (type === "success") {

            icon.className =
                "fa-solid fa-circle-check";

            icon.style.color =
                "#16a34a";

        }


        else if (type === "error") {

            icon.className =
                "fa-solid fa-circle-xmark";

            icon.style.color =
                "#dc2626";

        }


        else if (type === "warning") {

            icon.className =
                "fa-solid fa-triangle-exclamation";

            icon.style.color =
                "#f59e0b";

        }


        else if (type === "login") {

            icon.className =
                "fa-solid fa-lock";

            icon.style.color =
                "#2563eb";

        }

    }


    if (popupBox) {

        popupBox.style.display =
            "flex";

    }

}


// ======================================================
// CLOSE POPUP
// ======================================================

function closePopup() {

    const popupBox =
        document.getElementById(
            "popupBox"
        );


    if (popupBox) {

        popupBox.style.display =
            "none";

    }

}


// ======================================================
// LOADING
// ======================================================

function showLoading(
    message = "Loading..."
) {


    const loading =
        document.getElementById(
            "loading"
        );


    const loadingText =
        document.getElementById(
            "loadingText"
        );


    if (loading) {

        loading.style.display =
            "flex";

    }


    if (loadingText) {

        loadingText.textContent =
            message;

    }

}


function hideLoading() {


    const loading =
        document.getElementById(
            "loading"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// PAGE CACHE / LOGIN PROTECTION
// ======================================================

window.addEventListener(
    "pageshow",
    function () {

        const login =
            localStorage.getItem(
                "isLogin"
            );


        const role =
            localStorage.getItem(
                "role"
            );


        if (
            login !== "true" ||
            role !== "Admin"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);
```
