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
