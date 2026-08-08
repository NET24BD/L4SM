/* =========================================================
   USER CONTROL JS
   FINAL
========================================================= */


/* =========================================================
   LOGIN CHECK
========================================================= */

const isLogin = localStorage.getItem("isLogin");
const role = localStorage.getItem("role");

if (isLogin !== "true" || role !== "Admin") {
    window.location.replace("login.html");
}


/* =========================================================
   API
========================================================= */

const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


/* =========================================================
   GLOBAL
========================================================= */

let users = [];
let editMode = false;
let oldUsername = "";
let deleteUsername = "";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();
    setupProfileMenu();
    setupButtons();
    setupSearch();
    setupDeletePopup();
    setupPicturePreview();

    loadUsers();

});


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    const name =
        localStorage.getItem("name") || "User";

    const picture =
        localStorage.getItem("picture");

    const userName =
        document.getElementById("userName");

    const profileImg =
        document.getElementById("profileImg");


    if (userName) {
        userName.textContent = name;
    }


    if (profileImg) {

        if (picture && picture.trim() !== "") {

            profileImg.src = picture;

        } else {

            profileImg.src = "profile.png";

        }

        profileImg.onerror = function () {

            this.onerror = null;
            this.src = "profile.png";

        };

    }

}


/* =========================================================
   PROFILE MENU
========================================================= */

function setupProfileMenu() {

    const profileBtn =
        document.getElementById("profileBtn");

    const profileMenu =
        document.getElementById("profileMenu");


    if (!profileBtn || !profileMenu) {
        return;
    }


    profileBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        profileMenu.style.display =
            profileMenu.style.display === "block"
                ? "none"
                : "block";

    });


    profileMenu.addEventListener("click", function (e) {

        e.stopPropagation();

    });


    document.addEventListener("click", function () {

        profileMenu.style.display = "none";

    });

}


/* =========================================================
   BUTTON SETUP
========================================================= */

function setupButtons() {

    const backBtn =
        document.getElementById("backBtn");

    const accountBtn =
        document.getElementById("accountBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const addUserBtn =
        document.getElementById("addUserBtn");

    const closeModalBtn =
        document.getElementById("closeModal");

    const cancelUserBtn =
        document.getElementById("cancelUser");

    const saveUserBtn =
        document.getElementById("saveUser");


    /* BACK */

    if (backBtn) {

        backBtn.addEventListener("click", function () {

            window.location.href =
                "dashboard.html";

        });

    }


    /* ACCOUNT */

    if (accountBtn) {

        accountBtn.addEventListener("click", function () {

            window.location.href =
                "my-account.html";

        });

    }


    /* LOGOUT */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.clear();

            window.location.replace(
                "login.html"
            );

        });

    }


    /* ADD USER */

    if (addUserBtn) {

        addUserBtn.addEventListener("click", function () {

            editMode = false;
            oldUsername = "";

            clearForm();

            const title =
                document.getElementById("formTitle");

            if (title) {
                title.textContent = "Add User";
            }

            openUserModal();

        });

    }


    /* CLOSE */

    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeModal
        );

    }


    /* CANCEL */

    if (cancelUserBtn) {

        cancelUserBtn.addEventListener(
            "click",
            closeModal
        );

    }


    /* SAVE */

    if (saveUserBtn) {

        saveUserBtn.addEventListener(
            "click",
            saveUser
        );

    }

}


/* =========================================================
   OPEN USER MODAL
========================================================= */

function openUserModal() {

    const modal =
        document.getElementById("userModal");

    if (modal) {
        modal.style.display = "flex";
    }

}


/* =========================================================
   CLOSE USER MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById("userModal");

    if (modal) {
        modal.style.display = "none";
    }

}


/* =========================================================
   LOAD USERS
========================================================= */

function loadUsers() {

    showLoading("Loading Users...");


    fetch(API_URL + "?action=users")

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Server Error");
            }

            return response.json();

        })

        .then(function (data) {

            if (Array.isArray(data)) {

                users = data;

                showUsers(users);

                return;

            }


            if (data && data.success === false) {

                throw new Error(
                    data.message || "User Load Failed"
                );

            }


            throw new Error(
                "Invalid User Data"
            );

        })

        .catch(function (error) {

            console.error(
                "User Load Error:",
                error
            );


            const table =
                document.getElementById("userTable");


            if (table) {

                table.innerHTML = `
                    <tr>
                        <td colspan="6">
                            User Load Failed
                        </td>
                    </tr>
                `;

            }


            showPopup(
                "Error",
                "User Load Failed",
                "error"
            );

        })

        .finally(function () {

            hideLoading();

        });

}


/* =========================================================
   SHOW USERS
========================================================= */

function showUsers(data) {

    const table =
        document.getElementById("userTable");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (!Array.isArray(data) || data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No User Found
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(function (user) {

        const username =
            safeValue(user.username);

        const password =
            safeValue(user.password);

        const name =
            safeValue(user.name);

        const userRole =
            safeValue(user.role);

        const status =
            safeValue(user.status);

        const picture =
            safeValue(user.picture);


        const row =
            document.createElement("tr");


        /* PICTURE */

        const pictureCell =
            document.createElement("td");


        const image =
            document.createElement("img");


        image.className = "user-photo";

        image.alt = "User";

        image.src =
            picture || "profile.png";


        image.onerror = function () {

            this.onerror = null;

            this.src = "profile.png";

        };


        pictureCell.appendChild(image);


        /* USERNAME */

        const usernameCell =
            document.createElement("td");

        usernameCell.textContent =
            username;


        /* NAME */

        const nameCell =
            document.createElement("td");

        nameCell.textContent =
            name;


        /* ROLE */

        const roleCell =
            document.createElement("td");

        roleCell.textContent =
            userRole;


        /* STATUS */

        const statusCell =
            document.createElement("td");

        statusCell.textContent =
            status;


        /* ACTION */

        const actionCell =
            document.createElement("td");


        /* EDIT BUTTON */

        const editBtn =
            document.createElement("button");

        editBtn.type = "button";

        editBtn.innerHTML =
            '<i class="fa-solid fa-pen"></i> Edit';


        editBtn.addEventListener(
            "click",
            function () {

                editUser(
                    username,
                    password,
                    name,
                    userRole,
                    status,
                    picture
                );

            }
        );


        /* DELETE BUTTON */

        const deleteBtn =
            document.createElement("button");

        deleteBtn.type = "button";

        deleteBtn.innerHTML =
            '<i class="fa-solid fa-trash"></i> Delete';


        deleteBtn.addEventListener(
            "click",
            function () {

                deleteUser(username);

            }
        );


        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);


        row.appendChild(pictureCell);
        row.appendChild(usernameCell);
        row.appendChild(nameCell);
        row.appendChild(roleCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);


        table.appendChild(row);

    });

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        document.getElementById("searchUser");


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            if (!value) {

                showUsers(users);

                return;

            }


            const result =
                users.filter(function (user) {

                    return (

                        safeValue(user.username)
                            .toLowerCase()
                            .includes(value)

                        ||

                        safeValue(user.name)
                            .toLowerCase()
                            .includes(value)

                        ||

                        safeValue(user.role)
                            .toLowerCase()
                            .includes(value)

                        ||

                        safeValue(user.status)
                            .toLowerCase()
                            .includes(value)

                    );

                });


            showUsers(result);

        }
    );

}


/* =========================================================
   SAVE USER
========================================================= */

function saveUser() {

    const username =
        getValue("username");

    const password =
        getValue("password");

    const name =
        getValue("name");

    const userRole =
        getValue("role");

    const status =
        getValue("status");

    const picture =
        getValue("picture");


    if (
        username === "" ||
        password === ""
    ) {

        showPopup(
            "Warning",
            "Username Password Required",
            "warning"
        );

        return;

    }


    const data = {

        username: username,

        password: password,

        name: name,

        role: userRole,

        status: status,

        picture: picture

    };


    if (editMode) {

        data.action = "update";

        data.oldUsername =
            oldUsername;

    } else {

        data.action = "add";

    }


    showLoading(
        editMode
            ? "Updating User..."
            : "Creating User..."
    );


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body:
            JSON.stringify(data)

    })

    .then(function (response) {

        if (!response.ok) {
            throw new Error("Server Error");
        }

        return response.json();

    })

    .then(function (result) {

        hideLoading();


        if (
            result &&
            result.success
        ) {

            closeModal();


            showPopup(
                "Success",
                result.message ||
                (
                    editMode
                        ? "User Updated Successfully"
                        : "User Added Successfully"
                ),
                "success"
            );


            loadUsers();

        } else {

            showPopup(
                "Error",
                result.message ||
                "Operation Failed",
                "error"
            );

        }

    })

    .catch(function (error) {

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

    });

}


/* =========================================================
   EDIT USER
========================================================= */

function editUser(
    username,
    password,
    name,
    userRole,
    status,
    picture
) {

    editMode = true;

    oldUsername =
        username;


    setValue(
        "username",
        username
    );

    setValue(
        "password",
        password
    );

    setValue(
        "name",
        name
    );

    setValue(
        "role",
        userRole
    );

    setValue(
        "status",
        status
    );

    setValue(
        "picture",
        picture || ""
    );


    const title =
        document.getElementById(
            "formTitle"
        );


    if (title) {
        title.textContent = "Edit User";
    }


    updatePicturePreview(
        picture
    );


    openUserModal();

}


/* =========================================================
   DELETE USER
========================================================= */

function deleteUser(username) {

    if (!username) {
        return;
    }


    deleteUsername =
        username;


    const message =
        document.getElementById(
            "deleteConfirmMessage"
        );


    if (message) {

        message.textContent =
            'Are you sure you want to delete "' +
            username +
            '"?';

    }


    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );


    if (modal) {

        modal.style.display = "flex";

    } else {

        /* Fallback if custom popup HTML is not added */

        deleteUsername =
            username;

        confirmDeleteUser();

    }

}


/* =========================================================
   DELETE POPUP SETUP
========================================================= */

function setupDeletePopup() {

    const cancelBtn =
        document.getElementById(
            "deleteCancelBtn"
        );

    const confirmBtn =
        document.getElementById(
            "deleteConfirmBtn"
        );

    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeDeleteConfirm
        );

    }


    if (confirmBtn) {

        confirmBtn.addEventListener(
            "click",
            confirmDeleteUser
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (e) {

                if (e.target === modal) {

                    closeDeleteConfirm();

                }

            }
        );

    }

}


/* =========================================================
   CLOSE DELETE POPUP
========================================================= */

function closeDeleteConfirm() {

    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );


    if (modal) {

        modal.style.display = "none";

    }


    deleteUsername = "";

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDeleteUser() {

    if (!deleteUsername) {
        return;
    }


    const username =
        deleteUsername;


    closeDeleteConfirm();


    showLoading(
        "Deleting User..."
    );


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body:
            JSON.stringify({

                action: "delete",

                username: username

            })

    })

    .then(function (response) {

        if (!response.ok) {
            throw new Error("Server Error");
        }

        return response.json();

    })

    .then(function (result) {

        hideLoading();


        if (
            result &&
            result.success
        ) {

            showPopup(
                "Success",
                result.message ||
                "User Deleted Successfully",
                "success"
            );


            loadUsers();

        } else {

            showPopup(
                "Error",
                result.message ||
                "Delete Failed",
                "error"
            );

        }

    })

    .catch(function (error) {

        console.error(
            "Delete Error:",
            error
        );


        hideLoading();


        showPopup(
            "Error",
            "Delete Failed",
            "error"
        );

    });

}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearForm() {

    setValue("username", "");
    setValue("password", "");
    setValue("name", "");
    setValue("role", "Admin");
    setValue("status", "Active");
    setValue("picture", "");


    updatePicturePreview("");

}


/* =========================================================
   PICTURE PREVIEW
========================================================= */

function setupPicturePreview() {

    const input =
        document.getElementById("picture");


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            updatePicturePreview(
                this.value.trim()
            );

        }
    );

}


function updatePicturePreview(url) {

    const preview =
        document.getElementById(
            "picturePreview"
        );

    const image =
        document.getElementById(
            "picturePreviewImg"
        );


    if (!preview || !image) {
        return;
    }


    if (
        url &&
        url.trim() !== ""
    ) {

        image.src = url;

        preview.style.display = "flex";


        image.onerror = function () {

            preview.style.display =
                "none";

        };

    } else {

        preview.style.display =
            "none";

        image.src = "";

    }

}


/* =========================================================
   SUCCESS / ERROR POPUP
========================================================= */

function showPopup(
    title,
    message,
    type = "success"
) {

    const popup =
        document.getElementById(
            "popupBox"
        );

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


    if (!popup) {
        return;
    }


    if (popupTitle) {
        popupTitle.textContent =
            title;
    }


    if (popupMessage) {
        popupMessage.textContent =
            message;
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


    popup.style.display =
        "flex";

}


/* =========================================================
   CLOSE POPUP
========================================================= */

function closePopup() {

    const popup =
        document.getElementById(
            "popupBox"
        );


    if (popup) {

        popup.style.display =
            "none";

    }

}


/* =========================================================
   LOADING SYSTEM
========================================================= */

function showLoading(
    text = "Loading..."
) {

    if (
        typeof window.showLoading ===
        "function"
    ) {

        window.showLoading(text);

        return;

    }


    /* Fallback loading */

    let loading =
        document.getElementById(
            "simpleLoading"
        );


    if (!loading) {

        loading =
            document.createElement("div");

        loading.id =
            "simpleLoading";


        loading.style.position =
            "fixed";

        loading.style.top = "0";
        loading.style.left = "0";

        loading.style.width = "100%";
        loading.style.height = "100%";

        loading.style.background =
            "rgba(0,0,0,.35)";

        loading.style.display =
            "flex";

        loading.style.alignItems =
            "center";

        loading.style.justifyContent =
            "center";

        loading.style.zIndex =
            "99999";


        loading.innerHTML = `
            <div style="
                background:white;
                padding:25px 35px;
                border-radius:15px;
                font-family:Arial,sans-serif;
                font-weight:600;
                color:#1e3a8a;
            ">
                ${text}
            </div>
        `;


        document.body.appendChild(
            loading
        );

    }


    loading.style.display =
        "flex";

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    if (
        typeof window.hideLoading ===
        "function"
    ) {

        window.hideLoading();

        return;

    }


    const loading =
        document.getElementById(
            "simpleLoading"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return String(
        element.value || ""
    ).trim();

}


/* =========================================================
   SET VALUE
========================================================= */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value || "";

    }

}


/* =========================================================
   SAFE VALUE
========================================================= */

function safeValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value);

}


/* =========================================================
   BLOCK BACK AFTER LOGOUT
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        if (
            localStorage.getItem(
                "isLogin"
            ) !== "true"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {

            closeDeleteConfirm();

            closeModal();

        }

    }
);
