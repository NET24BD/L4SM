/* ==========================================
   USER CONTROL JS
   FINAL PART 1
========================================== */


/* ==========================================
   LOGIN CHECK
========================================== */

const isLogin = localStorage.getItem("isLogin");
const role = localStorage.getItem("role");

if (isLogin !== "true" || role !== "Admin") {
    window.location.replace("login.html");
}


/* ==========================================
   GOOGLE APPS SCRIPT API
========================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


/* ==========================================
   GLOBAL VARIABLES
========================================== */

let users = [];

let editMode = false;

let oldUsername = "";


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();

    loadUsers();

});


/* ==========================================
   PROFILE
========================================== */

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


/* ==========================================
   PROFILE MENU
========================================== */

const profileBtn =
    document.getElementById("profileBtn");

const profileMenu =
    document.getElementById("profileMenu");


if (profileBtn) {

    profileBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        if (!profileMenu) return;

        profileMenu.style.display =
            profileMenu.style.display === "block"
                ? "none"
                : "block";

    });

}


document.addEventListener("click", function () {

    if (profileMenu) {

        profileMenu.style.display = "none";

    }

});


/* ==========================================
   BACK BUTTON
========================================== */

const backBtn =
    document.getElementById("backBtn");


if (backBtn) {

    backBtn.addEventListener("click", function () {

        window.location.href =
            "dashboard.html";

    });

}


/* ==========================================
   ACCOUNT BUTTON
========================================== */

const accountBtn =
    document.getElementById("accountBtn");


if (accountBtn) {

    accountBtn.addEventListener("click", function () {

        window.location.href =
            "my-account.html";

    });

}


/* ==========================================
   LOGOUT
========================================== */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        /*
         * Clear all login information
         */

        localStorage.clear();


        /*
         * Prevent browser back access
         */

        window.location.replace(
            "login.html"
        );

    });

}


/* ==========================================
   LOAD USERS
========================================== */

function loadUsers() {

    showLoading("Loading Users...");


    fetch(
        API_URL + "?action=users",
        {
            method: "GET",
            cache: "no-store"
        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server response error"
            );

        }

        return response.json();

    })

    .then(function (data) {

        /*
         * Make sure data is an array
         */

        if (Array.isArray(data)) {

            users = data;

        }

        else if (
            data &&
            Array.isArray(data.users)
        ) {

            users = data.users;

        }

        else {

            users = [];

        }


        showUsers(users);

    })

    .catch(function (error) {

        console.error(
            "User Load Error:",
            error
        );


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


/* ==========================================
   SHOW USERS
========================================== */

function showUsers(data) {

    const table =
        document.getElementById("userTable");


    if (!table) return;


    table.innerHTML = "";


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center;">
                    No User Found
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(function (user) {

        const username =
            user.username || "";

        const password =
            user.password || "";

        const name =
            user.name || "";

        const role =
            user.role || "";

        const status =
            user.status || "";

        const picture =
            user.picture || "";


        const row =
            document.createElement("tr");


        row.innerHTML = `

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
                <span class="status ${status.toLowerCase()}">
                    ${escapeHTML(status)}
                </span>
            </td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editUser(
                        '${escapeJS(username)}',
                        '${escapeJS(password)}',
                        '${escapeJS(name)}',
                        '${escapeJS(role)}',
                        '${escapeJS(status)}',
                        '${escapeJS(picture)}'
                    )">

                    <i class="fa-solid fa-pen"></i>
                    Edit

                </button>
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteUser(
                        '${escapeJS(username)}'
                    )">

                    <i class="fa-solid fa-trash"></i>
                    Delete

                </button>
            </td>

        `;


        table.appendChild(row);

    });

}


/* ==========================================
   HTML SECURITY
========================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   JAVASCRIPT STRING SECURITY
========================================== */

function escapeJS(value) {

    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");

}
/* ==========================================
   USER CONTROL JS
   FINAL PART 2
========================================== */


/* ==========================================
   SEARCH USER
========================================== */

const searchUser =
    document.getElementById("searchUser");


if (searchUser) {

    searchUser.addEventListener(
        "keyup",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            /*
             * Show all users when search is empty
             */

            if (value === "") {

                showUsers(users);

                return;

            }


            /*
             * Filter users
             */

            const result =
                users.filter(function (user) {

                    const username =
                        String(
                            user.username || ""
                        ).toLowerCase();

                    const name =
                        String(
                            user.name || ""
                        ).toLowerCase();

                    const role =
                        String(
                            user.role || ""
                        ).toLowerCase();

                    const status =
                        String(
                            user.status || ""
                        ).toLowerCase();


                    return (

                        username.includes(value) ||

                        name.includes(value) ||

                        role.includes(value) ||

                        status.includes(value)

                    );

                });


            showUsers(result);

        }
    );

}


/* ==========================================
   ADD USER BUTTON
========================================== */

const addUserBtn =
    document.getElementById("addUserBtn");


if (addUserBtn) {

    addUserBtn.addEventListener(
        "click",
        function () {

            /*
             * New User Mode
             */

            editMode = false;

            oldUsername = "";


            /*
             * Clear previous data
             */

            clearForm();


            /*
             * Change modal title
             */

            const formTitle =
                document.getElementById("formTitle");


            if (formTitle) {

                formTitle.textContent =
                    "Add User";

            }


            /*
             * Show modal
             */

            const userModal =
                document.getElementById("userModal");


            if (userModal) {

                userModal.style.display =
                    "flex";

            }

        }
    );

}


/* ==========================================
   CLOSE MODAL BUTTON
========================================== */

const closeModalBtn =
    document.getElementById("closeModal");


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        function () {

            closeModal();

        }
    );

}


/* ==========================================
   CANCEL USER BUTTON
========================================== */

const cancelUser =
    document.getElementById("cancelUser");


if (cancelUser) {

    cancelUser.addEventListener(
        "click",
        function () {

            closeModal();

        }
    );

}


/* ==========================================
   CLOSE MODAL FUNCTION
========================================== */

function closeModal() {

    const userModal =
        document.getElementById("userModal");


    if (userModal) {

        userModal.style.display =
            "none";

    }


    /*
     * Reset edit mode
     */

    editMode = false;

    oldUsername = "";

}


/* ==========================================
   CLOSE MODAL WHEN CLICK OUTSIDE
========================================== */

const userModal =
    document.getElementById("userModal");


if (userModal) {

    userModal.addEventListener(
        "click",
        function (e) {

            /*
             * Only close when clicking
             * the modal background
             */

            if (e.target === userModal) {

                closeModal();

            }

        }
    );

}


/* ==========================================
   SAVE / UPDATE USER
========================================== */

const saveUser =
    document.getElementById("saveUser");


if (saveUser) {

    saveUser.addEventListener(
        "click",
        function () {


            /* ==============================
               GET FORM DATA
            ============================== */

            const usernameInput =
                document.getElementById("username");

            const passwordInput =
                document.getElementById("password");

            const nameInput =
                document.getElementById("name");

            const roleInput =
                document.getElementById("role");

            const statusInput =
                document.getElementById("status");

            const pictureInput =
                document.getElementById("picture");


            const data = {

                username:
                    usernameInput
                        ? usernameInput.value.trim()
                        : "",

                password:
                    passwordInput
                        ? passwordInput.value.trim()
                        : "",

                name:
                    nameInput
                        ? nameInput.value.trim()
                        : "",

                role:
                    roleInput
                        ? roleInput.value
                        : "Admin",

                status:
                    statusInput
                        ? statusInput.value
                        : "Active",

                picture:
                    pictureInput
                        ? pictureInput.value.trim()
                        : ""

            };


            /* ==============================
               VALIDATION
            ============================== */

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


            if (!data.name) {

                showPopup(
                    "Warning",
                    "Name Required",
                    "warning"
                );

                return;

            }


            if (!data.role) {

                showPopup(
                    "Warning",
                    "Role Required",
                    "warning"
                );

                return;

            }


            /* ==============================
               CHECK DUPLICATE USERNAME
            ============================== */

            if (!editMode) {

                const duplicate =
                    users.some(function (user) {

                        return String(
                            user.username || ""
                        ).toLowerCase()
                        ===
                        data.username.toLowerCase();

                    });


                if (duplicate) {

                    showPopup(
                        "Warning",
                        "This Username Already Exists",
                        "warning"
                    );

                    return;

                }

            }


            /* ==============================
               ADD / UPDATE ACTION
            ============================== */

            if (editMode) {

                data.action = "update";

                data.oldUsername =
                    oldUsername;

            }

            else {

                data.action = "add";

            }


            /* ==============================
               LOADING
            ============================== */

            showLoading(
                editMode
                    ? "Updating User..."
                    : "Creating User..."
            );


            /*
             * Disable button
             * while saving
             */

            saveUser.disabled = true;


            /* ==============================
               SEND TO GOOGLE APPS SCRIPT
            ============================== */

            fetch(
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
            )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Server Error"
                    );

                }

                return response.json();

            })

            .then(function (result) {


                hideLoading();


                if (result.success) {


                    showPopup(
                        "Success",
                        result.message ||
                        (
                            editMode
                                ? "User Updated Successfully"
                                : "User Created Successfully"
                        ),
                        "success"
                    );


                    /*
                     * Close modal
                     */

                    closeModal();


                    /*
                     * Reload users
                     */

                    loadUsers();

                }

                else {

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

            })

            .finally(function () {

                /*
                 * Enable button again
                 */

                saveUser.disabled = false;

            });

        }
    );

}


/* ==========================================
   EDIT USER
========================================== */

function editUser(
    username,
    password,
    name,
    role,
    status,
    picture
) {


    /* ==============================
       EDIT MODE
    ============================== */

    editMode = true;

    oldUsername = username;


    /* ==============================
       FILL FORM
    ============================== */

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const nameInput =
        document.getElementById("name");

    const roleInput =
        document.getElementById("role");

    const statusInput =
        document.getElementById("status");

    const pictureInput =
        document.getElementById("picture");


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
            role || "Admin";

    }


    if (statusInput) {

        statusInput.value =
            status || "Active";

    }


    if (pictureInput) {

        pictureInput.value =
            picture || "";

    }


    /* ==============================
       CHANGE TITLE
    ============================== */

    const formTitle =
        document.getElementById("formTitle");


    if (formTitle) {

        formTitle.textContent =
            "Edit User";

    }


    /* ==============================
       OPEN MODAL
    ============================== */

    const userModal =
        document.getElementById("userModal");


    if (userModal) {

        userModal.style.display =
            "flex";

    }

}


/* ==========================================
   DELETE USER
========================================== */

function deleteUser(username) {


    if (!username) {

        showPopup(
            "Error",
            "Username Not Found",
            "error"
        );

        return;

    }


    /* ==============================
       CONFIRM DELETE
    ============================== */

    const confirmed =
        confirm(
            "Are you sure you want to delete this user?"
        );


    if (!confirmed) {

        return;

    }


    /* ==============================
       LOADING
    ============================== */

    showLoading(
        "Deleting User..."
    );


    /* ==============================
       SEND DELETE REQUEST
    ============================== */

    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body:
                JSON.stringify({

                    action: "delete",

                    username:
                        username

                })

        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server Error"
            );

        }

        return response.json();

    })

    .then(function (result) {


        hideLoading();


        if (result.success) {


            showPopup(
                "Success",
                result.message ||
                "User Deleted Successfully",
                "success"
            );


            /*
             * Reload user list
             */

            loadUsers();

        }

        else {

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
            "Delete User Error:",
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


/* ==========================================
   CLEAR FORM
========================================== */

function clearForm() {

    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");

    const name =
        document.getElementById("name");

    const role =
        document.getElementById("role");

    const status =
        document.getElementById("status");

    const picture =
        document.getElementById("picture");


    if (username) {

        username.value = "";

    }


    if (password) {

        password.value = "";

    }


    if (name) {

        name.value = "";

    }


    if (role) {

        role.value = "Admin";

    }


    if (status) {

        status.value = "Active";

    }


    if (picture) {

        picture.value = "";

    }

}
/* ==========================================
   USER CONTROL JS
   FINAL PART 3
========================================== */


/* ==========================================
   POPUP SYSTEM
========================================== */

function showPopup(
    title,
    msg,
    type = "success"
) {

    const popupBox =
        document.getElementById("popupBox");

    const popupTitle =
        document.getElementById("popupTitle");

    const popupMessage =
        document.getElementById("popupMessage");

    const popupIcon =
        document.getElementById("popupIcon");


    /*
     * Check popup elements
     */

    if (!popupBox) {

        console.error(
            "popupBox not found"
        );

        return;

    }


    /*
     * Set title
     */

    if (popupTitle) {

        popupTitle.textContent =
            title || "Message";

    }


    /*
     * Set message
     */

    if (popupMessage) {

        popupMessage.textContent =
            msg || "";

    }


    /*
     * Set icon
     */

    if (popupIcon) {


        /* Remove previous classes */

        popupIcon.className = "";


        /*
         * Success
         */

        if (type === "success") {

            popupIcon.className =
                "fa-solid fa-circle-check";

            popupIcon.style.color =
                "#16a34a";

        }


        /*
         * Error
         */

        else if (type === "error") {

            popupIcon.className =
                "fa-solid fa-circle-xmark";

            popupIcon.style.color =
                "#dc2626";

        }


        /*
         * Warning
         */

        else if (type === "warning") {

            popupIcon.className =
                "fa-solid fa-triangle-exclamation";

            popupIcon.style.color =
                "#f59e0b";

        }


        /*
         * Login
         */

        else if (type === "login") {

            popupIcon.className =
                "fa-solid fa-lock";

            popupIcon.style.color =
                "#2563eb";

        }


        /*
         * Default
         */

        else {

            popupIcon.className =
                "fa-solid fa-circle-info";

            popupIcon.style.color =
                "#2563eb";

        }

    }


    /*
     * Show popup
     */

    popupBox.style.display =
        "flex";

}


/* ==========================================
   CLOSE POPUP
========================================== */

function closePopup() {

    const popupBox =
        document.getElementById("popupBox");


    if (popupBox) {

        popupBox.style.display =
            "none";

    }

}


/* ==========================================
   POPUP CLOSE BUTTON
========================================== */

const popupClose =
    document.getElementById("popupClose");


if (popupClose) {

    popupClose.addEventListener(
        "click",
        function () {

            closePopup();

        }
    );

}


/* ==========================================
   POPUP OK BUTTON
========================================== */

const popupOk =
    document.getElementById("popupOk");


if (popupOk) {

    popupOk.addEventListener(
        "click",
        function () {

            closePopup();

        }
    );

}


/* ==========================================
   CLOSE POPUP OUTSIDE
========================================== */

const popupBox =
    document.getElementById("popupBox");


if (popupBox) {

    popupBox.addEventListener(
        "click",
        function (e) {

            /*
             * Only close when clicking
             * popup background
             */

            if (e.target === popupBox) {

                closePopup();

            }

        }
    );

}


/* ==========================================
   LOADING SYSTEM
========================================== */

function showLoading(message = "Loading...") {

    const loading =
        document.getElementById("loadingBox");

    const loadingText =
        document.getElementById("loadingText");


    /*
     * If loading element does not exist,
     * do nothing
     */

    if (!loading) {

        return;

    }


    /*
     * Set loading message
     */

    if (loadingText) {

        loadingText.textContent =
            message;

    }


    /*
     * Show loading
     */

    loading.style.display =
        "flex";

}


/* ==========================================
   HIDE LOADING
========================================== */

function hideLoading() {

    const loading =
        document.getElementById("loadingBox");


    if (loading) {

        loading.style.display =
            "none";

    }

}


/* ==========================================
   PREVENT BACK AFTER LOGOUT
========================================== */

window.addEventListener(
    "pageshow",
    function () {


        /*
         * Check login status
         */

        const loggedIn =
            localStorage.getItem(
                "isLogin"
            );


        const currentRole =
            localStorage.getItem(
                "role"
            );


        /*
         * If user is logged out,
         * send them to login page
         */

        if (
            loggedIn !== "true" ||
            currentRole !== "Admin"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


/* ==========================================
   HISTORY SECURITY
========================================== */

if (
    localStorage.getItem("isLogin") !== "true"
) {

    window.location.replace(
        "login.html"
    );

}


/* ==========================================
   PREVENT BROWSER CACHE
========================================== */

window.addEventListener(
    "load",
    function () {

        /*
         * Replace current history entry
         * so browser back cannot easily
         * return to protected page
         */

        if (
            localStorage.getItem("isLogin") !== "true"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


/* ==========================================
   TAB VISIBILITY SECURITY
========================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            const loggedIn =
                localStorage.getItem(
                    "isLogin"
                );


            const currentRole =
                localStorage.getItem(
                    "role"
                );


            if (
                loggedIn !== "true" ||
                currentRole !== "Admin"
            ) {

                window.location.replace(
                    "login.html"
                );

            }

        }

    }
);


/* ==========================================
   FINAL LOGIN GUARD
========================================== */

(function () {

    const loggedIn =
        localStorage.getItem(
            "isLogin"
        );

    const currentRole =
        localStorage.getItem(
            "role"
        );


    if (
        loggedIn !== "true" ||
        currentRole !== "Admin"
    ) {

        window.location.replace(
            "login.html"
        );

    }

})();
