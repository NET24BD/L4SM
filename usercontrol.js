/* =========================================================
   LINK 4 USER CONTROL
   usercontrol.js
   FULL FINAL VERSION
========================================================= */


/* =========================================================
   API URL
========================================================= */

const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


/* =========================================================
   GLOBAL
========================================================= */

let users = [];

let editMode = false;

let oldUsername = "";

let loadingFrame = null;


/* =========================================================
   LOGIN CHECK
========================================================= */

const isLogin =
    localStorage.getItem("isLogin");

const role =
    localStorage.getItem("role");


if (
    isLogin !== "true" ||
    String(role).toLowerCase() !== "admin"
) {

    window.location.replace("login.html");

}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();

    setupProfileMenu();

    setupNavigation();

    setupSearch();

    setupUserButtons();

    setupModal();

    loadUsers();

});


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    const name =
        localStorage.getItem("name") || "User";

    const picture =
        localStorage.getItem("picture") || "";


    const userName =
        document.getElementById("userName");

    const profileImg =
        document.getElementById("profileImg");


    if (userName) {

        userName.textContent = name;

    }


    if (profileImg) {

        if (picture.trim() !== "") {

            profileImg.src = picture;

            profileImg.onerror = function () {

                this.src =
                    "https://via.placeholder.com/100?text=User";

            };

        }
        else {

            profileImg.src =
                "https://via.placeholder.com/100?text=User";

        }

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


        if (
            profileMenu.style.display === "block"
        ) {

            profileMenu.style.display = "none";

        }
        else {

            profileMenu.style.display = "block";

        }

    });


    document.addEventListener("click", function () {

        profileMenu.style.display = "none";

    });


    profileMenu.addEventListener("click", function (e) {

        e.stopPropagation();

    });

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {


    /* =========================
       BACK
    ========================= */

    const backBtn =
        document.getElementById("backBtn");


    if (backBtn) {

        backBtn.addEventListener("click", function () {

            window.location.href =
                "dashboard.html";

        });

    }


    /* =========================
       ACCOUNT
    ========================= */

    const accountBtn =
        document.getElementById("accountBtn");


    if (accountBtn) {

        accountBtn.addEventListener("click", function () {

            window.location.href =
                "my-account.html";

        });

    }


    /* =========================
       LOGOUT
    ========================= */

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            logoutUser();

        });

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.replace(
        "login.html"
    );

}


/* =========================================================
   BACK BUTTON PROTECTION
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        const login =
            localStorage.getItem("isLogin");

        const currentRole =
            localStorage.getItem("role");


        if (
            login !== "true" ||
            String(currentRole).toLowerCase() !== "admin"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById("searchUser");


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            if (value === "") {

                showUsers(users);

                return;

            }


            const result =
                users.filter(function (user) {

                    const username =
                        String(user.username || "")
                            .toLowerCase();

                    const name =
                        String(user.name || "")
                            .toLowerCase();

                    const role =
                        String(user.role || "")
                            .toLowerCase();

                    const status =
                        String(user.status || "")
                            .toLowerCase();


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


/* =========================================================
   ADD USER BUTTON
========================================================= */

function setupUserButtons() {

    const addUserBtn =
        document.getElementById("addUserBtn");


    if (!addUserBtn) {

        return;

    }


    addUserBtn.addEventListener(
        "click",
        function () {

            editMode = false;

            oldUsername = "";

            clearForm();


            const title =
                document.getElementById("formTitle");


            if (title) {

                title.textContent =
                    "Add User";

            }


            openModal();

        }
    );

}


/* =========================================================
   MODAL SETUP
========================================================= */

function setupModal() {

    const closeBtn =
        document.getElementById("closeModal");


    const cancelBtn =
        document.getElementById("cancelUser");


    const saveBtn =
        document.getElementById("saveUser");


    const modal =
        document.getElementById("userModal");


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeModal
        );

    }


    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            saveUser
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (e) {

                if (e.target === modal) {

                    closeModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                closeModal();

                closePopup();

            }

        }
    );

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal() {

    const modal =
        document.getElementById("userModal");


    if (modal) {

        modal.style.display = "flex";

    }

}


/* =========================================================
   CLOSE MODAL
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

    showLoading(
        "Loading Users..."
    );


    fetch(
        API_URL + "?action=users",
        {
            method: "GET",
            cache: "no-cache"
        }
    )


    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        return response.json();

    })


    .then(function (data) {

        hideLoading();


        if (Array.isArray(data)) {

            users = data;

            showUsers(users);

            return;

        }


        if (
            data &&
            data.success === false
        ) {

            users = [];

            showUsers([]);

            showPopup(
                "Error",
                data.message ||
                "User Load Failed",
                "error"
            );

            return;

        }


        throw new Error(
            "Invalid API Response"
        );

    })


    .catch(function (error) {

        console.error(
            "User Load Error:",
            error
        );


        hideLoading();


        showPopup(
            "Error",
            "User Load Failed",
            "error"
        );

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


    if (
        !data ||
        data.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="no-user"
                >

                    <i class="fa-solid fa-users-slash"></i>

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


        /* =========================
           STATUS
        ========================= */

        let statusClass =
            "status-inactive";


        const statusLower =
            status
                .trim()
                .toLowerCase();


        if (
            statusLower === "active"
        ) {

            statusClass =
                "status-active";

        }
        else if (
            statusLower === "block" ||
            statusLower === "blocked"
        ) {

            statusClass =
                "status-block";

        }


        /* =========================
           PICTURE
        ========================= */

        let pictureHTML = "";


        if (
            picture.trim() !== ""
        ) {

            pictureHTML = `

                <div class="user-picture">

                    <img

                        src="${escapeHTML(picture)}"

                        class="user-avatar"

                        alt="${escapeHTML(name)}"

                        onerror="imageError(this)"

                    >

                </div>

            `;

        }
        else {

            pictureHTML = createFallbackImage();

        }


        /* =========================
           FIND ORIGINAL INDEX
        ========================= */

        const index =
            users.indexOf(user);


        /* =========================
           ROW
        ========================= */

        table.innerHTML += `

            <tr>


                <!-- PICTURE -->

                <td class="picture-cell">

                    ${pictureHTML}

                </td>


                <!-- USERNAME -->

                <td class="username-cell">

                    ${escapeHTML(username)}

                </td>


                <!-- NAME -->

                <td class="name-cell">

                    ${escapeHTML(name)}

                </td>


                <!-- ROLE -->

                <td class="role-cell">

                    ${escapeHTML(role)}

                </td>


                <!-- STATUS -->

                <td class="status-cell">

                    <span
                        class="user-status ${statusClass}"
                    >

                        ${escapeHTML(status)}

                    </span>

                </td>


                <!-- ACTION -->

                <td class="action-cell">

                    <div class="action-buttons">


                        <button

                            type="button"

                            class="edit-btn"

                            onclick="editUserByIndex(${index})"

                        >

                            <i class="fa-solid fa-pen"></i>

                            Edit

                        </button>


                        <button

                            type="button"

                            class="delete-btn"

                            onclick="deleteUserByIndex(${index})"

                        >

                            <i class="fa-solid fa-trash"></i>

                            Delete

                        </button>


                    </div>

                </td>


            </tr>

        `;

    });

}


/* =========================================================
   EDIT USER BY INDEX
========================================================= */

function editUserByIndex(index) {

    if (
        index < 0 ||
        index >= users.length
    ) {

        return;

    }


    const user =
        users[index];


    editUser(

        user.username || "",

        user.password || "",

        user.name || "",

        user.role || "Admin",

        user.status || "Active",

        user.picture || ""

    );

}


/* =========================================================
   EDIT USER
========================================================= */

function editUser(
    username,
    password,
    name,
    role,
    status,
    picture
) {

    editMode = true;

    oldUsername = username;


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
        role || "Admin"
    );


    setValue(
        "status",
        status || "Active"
    );


    setValue(
        "picture",
        picture || ""
    );


    const title =
        document.getElementById("formTitle");


    if (title) {

        title.textContent =
            "Edit User";

    }


    updatePicturePreview(
        picture || ""
    );


    openModal();

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


    const role =
        getValue("role");


    const status =
        getValue("status");


    const picture =
        getValue("picture");


    /* =========================
       VALIDATION
    ========================= */

    if (!username) {

        showPopup(
            "Warning",
            "Username Required",
            "warning"
        );

        return;

    }


    if (!password) {

        showPopup(
            "Warning",
            "Password Required",
            "warning"
        );

        return;

    }


    if (!name) {

        showPopup(
            "Warning",
            "Name Required",
            "warning"
        );

        return;

    }


    /* =========================
       DATA
    ========================= */

    const data = {

        username:
            username,

        password:
            password,

        name:
            name,

        role:
            role,

        status:
            status,

        picture:
            picture

    };


    if (editMode) {

        data.action =
            "update";

        data.oldUsername =
            oldUsername;

    }
    else {

        data.action =
            "add";

    }


    /* =========================
       LOADING.HTML
    ========================= */

    showLoading(

        editMode
            ?
            "Updating User..."
            :
            "Creating User..."

    );


    /* =========================
       API
    ========================= */

    fetch(

        API_URL,

        {

            method:
                "POST",

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
                "HTTP Error"
            );

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
                        ?
                        "User Updated Successfully"
                        :
                        "User Added Successfully"
                ),
                "success"
            );


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

    });

}


/* =========================================================
   DELETE USER BY INDEX
========================================================= */

function deleteUserByIndex(index) {

    if (
        index < 0 ||
        index >= users.length
    ) {

        return;

    }


    const username =
        users[index].username || "";


    deleteUser(username);

}


/* =========================================================
   DELETE USER
========================================================= */

function deleteUser(username) {

    if (!username) {

        return;

    }


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


    fetch(

        API_URL,

        {

            method:
                "POST",

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

    )


    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "HTTP Error"
            );

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


/* =========================================================
   CLEAR FORM
========================================================= */

function clearForm() {

    setValue(
        "username",
        ""
    );


    setValue(
        "password",
        ""
    );


    setValue(
        "name",
        ""
    );


    setValue(
        "role",
        "Admin"
    );


    setValue(
        "status",
        "Active"
    );


    setValue(
        "picture",
        ""
    );


    updatePicturePreview("");

}


/* =========================================================
   PICTURE PREVIEW
========================================================= */

function updatePicturePreview(
    picture
) {

    const preview =
        document.getElementById(
            "picturePreview"
        );


    const previewImg =
        document.getElementById(
            "picturePreviewImg"
        );


    if (
        !preview ||
        !previewImg
    ) {

        return;

    }


    if (
        picture &&
        picture.trim() !== ""
    ) {

        preview.style.display =
            "flex";


        previewImg.src =
            picture;


        previewImg.onerror =
            function () {

                preview.style.display =
                    "none";

            };

    }
    else {

        preview.style.display =
            "none";


        previewImg.removeAttribute(
            "src"
        );

    }

}


/* =========================================================
   PICTURE INPUT PREVIEW
========================================================= */

document.addEventListener(
    "input",
    function (e) {

        if (
            e.target &&
            e.target.id === "picture"
        ) {

            updatePicturePreview(
                e.target.value.trim()
            );

        }

    }
);


/* =========================================================
   IMAGE ERROR
========================================================= */

function imageError(img) {

    if (!img) {

        return;

    }


    const parent =
        img.parentElement;


    if (!parent) {

        return;

    }


    parent.innerHTML = `

        <div class="user-avatar-fallback">

            <i class="fa-solid fa-user"></i>

        </div>

    `;

}


/* =========================================================
   FALLBACK PICTURE
========================================================= */

function createFallbackImage() {

    return `

        <div class="user-picture">

            <div class="user-avatar-fallback">

                <i class="fa-solid fa-user"></i>

            </div>

        </div>

    `;

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
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value || ""
    )

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


/* =========================================================
   LOADING.HTML
========================================================= */

function showLoading(
    message = "Loading..."
) {


    /* =========================
       IF ALREADY OPEN
    ========================= */

    if (loadingFrame) {

        const iframe =
            loadingFrame.querySelector(
                "iframe"
            );


        if (iframe) {

            iframe.src =
                "loding.html?message=" +
                encodeURIComponent(message);

        }


        return;

    }


    /* =========================
       OVERLAY
    ========================= */

    loadingFrame =
        document.createElement("div");


    loadingFrame.id =
        "externalLoadingScreen";


    loadingFrame.style.position =
        "fixed";


    loadingFrame.style.top =
        "0";


    loadingFrame.style.left =
        "0";


    loadingFrame.style.width =
        "100%";


    loadingFrame.style.height =
        "100%";


    loadingFrame.style.background =
        "rgba(255,255,255,0.92)";


    loadingFrame.style.display =
        "flex";


    loadingFrame.style.alignItems =
        "center";


    loadingFrame.style.justifyContent =
        "center";


    loadingFrame.style.zIndex =
        "999999";


    /* =========================
       IFRAME
    ========================= */

    const iframe =
        document.createElement("iframe");


    iframe.src =
        "loding.html?message=" +
        encodeURIComponent(message);


    iframe.style.width =
        "100%";


    iframe.style.height =
        "100%";


    iframe.style.border =
        "none";


    iframe.style.background =
        "transparent";


    loadingFrame.appendChild(
        iframe
    );


    document.body.appendChild(
        loadingFrame
    );

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    if (!loadingFrame) {

        return;

    }


    loadingFrame.remove();

    loadingFrame = null;

}


/* =========================================================
   POPUP
========================================================= */

function showPopup(
    title,
    msg,
    type = "success"
) {

    const popup =
        document.getElementById(
            "popupBox"
        );


    const popupTitle =
        document.getElementById(
            "popupTitle"
        );


    const popupMessage =
        document.getElementById(
            "popupMessage"
        );


    const icon =
        document.getElementById(
            "popupIcon"
        );


    if (popupTitle) {

        popupTitle.textContent =
            title || "";

    }


    if (popupMessage) {

        popupMessage.textContent =
            msg || "";

    }


    if (icon) {


        /* =========================
           SUCCESS
        ========================= */

        if (
            type === "success"
        ) {

            icon.className =
                "fa-solid fa-circle-check";

            icon.style.color =
                "#16a34a";

        }


        /* =========================
           ERROR
        ========================= */

        else if (
            type === "error"
        ) {

            icon.className =
                "fa-solid fa-circle-xmark";

            icon.style.color =
                "#dc2626";

        }


        /* =========================
           WARNING
        ========================= */

        else if (
            type === "warning"
        ) {

            icon.className =
                "fa-solid fa-triangle-exclamation";

            icon.style.color =
                "#f59e0b";

        }


        /* =========================
           LOGIN
        ========================= */

        else if (
            type === "login"
        ) {

            icon.className =
                "fa-solid fa-lock";

            icon.style.color =
                "#2563eb";

        }

    }


    if (popup) {

        popup.style.display =
            "flex";

    }

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
   POPUP OUTSIDE CLICK
========================================================= */

document.addEventListener(
    "click",
    function (e) {

        const popup =
            document.getElementById(
                "popupBox"
            );


        if (
            popup &&
            e.target === popup
        ) {

            closePopup();

        }

    }
);


/* =========================================================
   LOGOUT BACK PROTECTION
========================================================= */

window.addEventListener(
    "popstate",
    function () {

        const login =
            localStorage.getItem(
                "isLogin"
            );


        const currentRole =
            localStorage.getItem(
                "role"
            );


        if (
            login !== "true" ||
            String(currentRole).toLowerCase() !== "admin"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);
