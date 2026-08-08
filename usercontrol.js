/* =========================================================
   LINK 4 USER CONTROL
   USERCONTROL.JS
   FINAL VERSION
========================================================= */


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
   LOGIN / ADMIN PROTECTION
========================================================= */

(function () {

    const isLogin =
        localStorage.getItem("isLogin");

    const role =
        String(
            localStorage.getItem("role") || ""
        ).toLowerCase();


    if (
        isLogin !== "true" ||
        role !== "admin"
    ) {

        window.location.replace(
            "login.html"
        );

    }

})();


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        setupProfileMenu();

        setupNavigation();

        setupSearch();

        setupUserButtons();

        setupModal();

        createDeletePopup();

        loadUsers();

    }
);


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    const name =
        localStorage.getItem("name") ||
        "User";

    const picture =
        localStorage.getItem("picture") ||
        "";


    const userName =
        document.getElementById(
            "userName"
        );


    const profileImg =
        document.getElementById(
            "profileImg"
        );


    if (userName) {

        userName.textContent =
            name;

    }


    if (profileImg) {

        if (
            picture &&
            picture.trim() !== ""
        ) {

            profileImg.src =
                picture;

        }
        else {

            profileImg.src =
                "profile.png";

        }


        profileImg.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "profile.png";

            };

    }

}


/* =========================================================
   PROFILE MENU
========================================================= */

function setupProfileMenu() {

    const profileBtn =
        document.getElementById(
            "profileBtn"
        );


    const profileMenu =
        document.getElementById(
            "profileMenu"
        );


    if (
        !profileBtn ||
        !profileMenu
    ) {

        return;

    }


    profileBtn.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();


            profileMenu.style.display =
                profileMenu.style.display === "block"
                    ? "none"
                    : "block";

        }
    );


    profileMenu.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        function () {

            profileMenu.style.display =
                "none";

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    /* BACK */

    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    /* ACCOUNT */

    const accountBtn =
        document.getElementById(
            "accountBtn"
        );


    if (accountBtn) {

        accountBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "my-account.html";

            }
        );

    }


    /* LOGOUT */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logoutUser
        );

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
   PAGE BACK PROTECTION
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        const isLogin =
            localStorage.getItem(
                "isLogin"
            );


        const role =
            String(
                localStorage.getItem(
                    "role"
                ) || ""
            ).toLowerCase();


        if (
            isLogin !== "true" ||
            role !== "admin"
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
        document.getElementById(
            "searchUser"
        );


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
                users.filter(
                    function (user) {

                        const username =
                            String(
                                user.username ||
                                ""
                            ).toLowerCase();


                        const name =
                            String(
                                user.name ||
                                ""
                            ).toLowerCase();


                        const role =
                            String(
                                user.role ||
                                ""
                            ).toLowerCase();


                        const status =
                            String(
                                user.status ||
                                ""
                            ).toLowerCase();


                        return (

                            username.includes(
                                value
                            )

                            ||

                            name.includes(
                                value
                            )

                            ||

                            role.includes(
                                value
                            )

                            ||

                            status.includes(
                                value
                            )

                        );

                    }
                );


            showUsers(result);

        }
    );

}


/* =========================================================
   ADD USER BUTTON
========================================================= */

function setupUserButtons() {

    const addUserBtn =
        document.getElementById(
            "addUserBtn"
        );


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
                document.getElementById(
                    "formTitle"
                );


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
        document.getElementById(
            "closeModal"
        );


    const cancelBtn =
        document.getElementById(
            "cancelUser"
        );


    const saveBtn =
        document.getElementById(
            "saveUser"
        );


    const modal =
        document.getElementById(
            "userModal"
        );


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

                if (
                    e.target === modal
                ) {

                    closeModal();

                }

            }
        );

    }

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal() {

    const modal =
        document.getElementById(
            "userModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "userModal"
        );


    if (modal) {

        modal.style.display =
            "none";

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
        API_URL +
        "?action=users&t=" +
        Date.now(),
        {
            method: "GET",
            cache: "no-store"
        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP Error " +
                    response.status
                );

            }


            return response.json();

        }
    )

    .then(
        function (data) {

            hideLoading();


            /*
             * Code.gs যদি directly
             * ARRAY return করে
             */

            if (
                Array.isArray(data)
            ) {

                users =
                    data;

                showUsers(
                    users
                );

                return;

            }


            /*
             * যদি API object return করে
             */

            if (
                data &&
                Array.isArray(
                    data.data
                )
            ) {

                users =
                    data.data;

                showUsers(
                    users
                );

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

        }
    )

    .catch(
        function (error) {

            console.error(
                "USER LOAD ERROR:",
                error
            );


            hideLoading();


            users = [];

            showUsers([]);


            showPopup(
                "Error",
                "User Load Failed",
                "error"
            );

        }
    );

}


/* =========================================================
   SHOW USERS
========================================================= */

function showUsers(data) {

    const table =
        document.getElementById(
            "userTable"
        );


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

                    <i
                        class="fa-solid fa-users-slash"
                    ></i>

                    No User Found

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(
        function (user) {


            const username =
                String(
                    user.username || ""
                );


            const name =
                String(
                    user.name || ""
                );


            const userRole =
                String(
                    user.role || ""
                );


            const status =
                String(
                    user.status || ""
                );


            /*
             * Picture URL শুধু table/list
             * এর user picture-এর জন্য।
             *
             * Edit popup-এ preview নেই।
             */

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
                statusLower ===
                "active"
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
               USER IMAGE
            ========================= */

            let pictureHTML;


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

                pictureHTML =
                    createFallbackImage();

            }


            /*
             * IMPORTANT:
             *
             * users.indexOf(user)
             * ব্যবহার করা হচ্ছে যাতে search
             * করার পরেও correct user edit/delete হয়।
             */

            const index =
                users.indexOf(user);


            /* =========================
               TABLE
            ========================= */

            table.innerHTML += `

                <tr>

                    <td class="picture-cell">

                        ${pictureHTML}

                    </td>


                    <td class="username-cell">

                        ${escapeHTML(
                            username
                        )}

                    </td>


                    <td class="name-cell">

                        ${escapeHTML(
                            name
                        )}

                    </td>


                    <td class="role-cell">

                        ${escapeHTML(
                            userRole
                        )}

                    </td>


                    <td class="status-cell">

                        <span
                            class="user-status ${statusClass}"
                        >

                            ${escapeHTML(
                                status
                            )}

                        </span>

                    </td>


                    <td class="action-cell">

                        <div
                            class="action-buttons"
                        >

                            <button
                                type="button"
                                class="edit-btn"
                                onclick="editUserByIndex(${index})"
                            >

                                <i
                                    class="fa-solid fa-pen"
                                ></i>

                                Edit

                            </button>


                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteUserByIndex(${index})"
                            >

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                                Delete

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }
    );

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
   NO PICTURE PREVIEW
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
        userRole || "Admin"
    );


    setValue(
        "status",
        status || "Active"
    );


    /*
     * Picture URL থাকবে।
     *
     * কিন্তু কোনো image preview
     * দেখানো হবে না।
     */

    setValue(
        "picture",
        picture || ""
    );


    const title =
        document.getElementById(
            "formTitle"
        );


    if (title) {

        title.textContent =
            "Edit User";

    }


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


    const userRole =
        getValue("role");


    const status =
        getValue("status");


    /*
     * Picture URL
     */

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
            userRole,

        status:
            status,

        /*
         * Picture URL API-তে যাবে
         */

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


    showLoading(
        editMode
            ? "Updating User..."
            : "Creating User..."
    );


    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body:
                JSON.stringify(
                    data
                )

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP Error " +
                    response.status
                );

            }


            return response.json();

        }
    )

    .then(
        function (result) {

            hideLoading();


            if (
                result &&
                result.success === true
            ) {

                closeModal();


                showPopup(
                    "Success",
                    result.message ||
                    "User Saved Successfully",
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

        }
    )

    .catch(
        function (error) {

            console.error(
                "SAVE USER ERROR:",
                error
            );


            hideLoading();


            showPopup(
                "Error",
                "Server Error",
                "error"
            );

        }
    );

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


    const user =
        users[index];


    deleteUsername =
        String(
            user.username || ""
        );


    if (!deleteUsername) {

        return;

    }


    showDeletePopup(
        deleteUsername
    );

}


/* =========================================================
   CREATE CUSTOM DELETE POPUP
========================================================= */

function createDeletePopup() {

    if (
        document.getElementById(
            "customDeletePopup"
        )
    ) {

        return;

    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "customDeletePopup";


    popup.innerHTML = `

        <div
            class="custom-delete-overlay"
        >

            <div
                class="custom-delete-box"
            >

                <div
                    class="custom-delete-icon"
                >

                    <i
                        class="fa-solid fa-trash"
                    ></i>

                </div>


                <h3>
                    Delete User?
                </h3>


                <p
                    id="customDeleteMessage"
                >
                    Are you sure?
                </p>


                <div
                    class="custom-delete-buttons"
                >

                    <button
                        type="button"
                        id="customDeleteCancel"
                    >

                        Cancel

                    </button>


                    <button
                        type="button"
                        id="customDeleteConfirm"
                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    const cancel =
        document.getElementById(
            "customDeleteCancel"
        );


    const confirmBtn =
        document.getElementById(
            "customDeleteConfirm"
        );


    const overlay =
        popup.querySelector(
            ".custom-delete-overlay"
        );


    cancel.addEventListener(
        "click",
        closeDeletePopup
    );


    confirmBtn.addEventListener(
        "click",
        confirmDelete
    );


    overlay.addEventListener(
        "click",
        function (e) {

            if (
                e.target === overlay
            ) {

                closeDeletePopup();

            }

        }
    );


    /* =========================
       POPUP CSS
    ========================= */

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "customDeletePopupStyle";


    style.textContent = `

        #customDeletePopup {
            display: none;
        }


        .custom-delete-overlay {

            position: fixed;

            inset: 0;

            background:
                rgba(0,0,0,.45);

            display: flex;

            align-items: center;

            justify-content: center;

            z-index: 10000;

        }


        .custom-delete-box {

            width: 340px;

            max-width: 90%;

            background: #ffffff;

            border-radius: 20px;

            padding: 28px;

            text-align: center;

            box-shadow:
                0 20px 60px
                rgba(0,0,0,.30);

            animation:
                deletePopupIn
                .2s ease;

        }


        .custom-delete-icon {

            width: 65px;

            height: 65px;

            margin:
                0 auto 15px;

            border-radius: 50%;

            background:
                #fee2e2;

            display: flex;

            align-items: center;

            justify-content: center;

        }


        .custom-delete-icon i {

            font-size: 28px;

            color: #dc2626;

        }


        .custom-delete-box h3 {

            margin: 0 0 8px;

            font-size: 20px;

            color: #1f2937;

        }


        .custom-delete-box p {

            margin: 0;

            color: #64748b;

            font-size: 14px;

            line-height: 1.5;

            word-break: break-word;

        }


        .custom-delete-buttons {

            display: flex;

            gap: 10px;

            margin-top: 22px;

        }


        .custom-delete-buttons button {

            flex: 1;

            border: none;

            padding: 11px 15px;

            border-radius: 10px;

            font-size: 14px;

            font-weight: 600;

            cursor: pointer;

        }


        #customDeleteCancel {

            background:
                #e5e7eb;

            color:
                #374151;

        }


        #customDeleteCancel:hover {

            background:
                #d1d5db;

        }


        #customDeleteConfirm {

            background:
                #dc2626;

            color:
                white;

        }


        #customDeleteConfirm:hover {

            background:
                #b91c1c;

        }


        @keyframes deletePopupIn {

            from {

                opacity: 0;

                transform:
                    scale(.92);

            }

            to {

                opacity: 1;

                transform:
                    scale(1);

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   SHOW DELETE POPUP
========================================================= */

function showDeletePopup(
    username
) {

    const popup =
        document.getElementById(
            "customDeletePopup"
        );


    const message =
        document.getElementById(
            "customDeleteMessage"
        );


    if (!popup) {

        return;

    }


    if (message) {

        message.textContent =
            'Are you sure you want to delete "' +
            username +
            '"?';

    }


    popup.style.display =
        "block";

}


/* =========================================================
   CLOSE DELETE POPUP
========================================================= */

function closeDeletePopup() {

    const popup =
        document.getElementById(
            "customDeletePopup"
        );


    if (popup) {

        popup.style.display =
            "none";

    }


    deleteUsername = "";

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDelete() {

    if (!deleteUsername) {

        return;

    }


    const username =
        deleteUsername;


    closeDeletePopup();


    showLoading(
        "Deleting User..."
    );


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

                    action:
                        "delete",

                    username:
                        username

                })

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP Error " +
                    response.status
                );

            }


            return response.json();

        }
    )

    .then(
        function (result) {

            hideLoading();


            if (
                result &&
                result.success === true
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

        }
    )

    .catch(
        function (error) {

            console.error(
                "DELETE ERROR:",
                error
            );


            hideLoading();


            showPopup(
                "Error",
                "Delete Failed",
                "error"
            );

        }
    );

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


    /*
     * Picture URL থাকবে।
     * শুধু input clear হবে।
     */

    setValue(
        "picture",
        ""
    );

}


/* =========================================================
   CUSTOM POPUP
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

        if (
            type === "success"
        ) {

            icon.className =
                "fa-solid fa-circle-check";

            icon.style.color =
                "#16a34a";

        }

        else if (
            type === "error"
        ) {

            icon.className =
                "fa-solid fa-circle-xmark";

            icon.style.color =
                "#dc2626";

        }

        else if (
            type === "warning"
        ) {

            icon.className =
                "fa-solid fa-triangle-exclamation";

            icon.style.color =
                "#f59e0b";

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
   LOADING
========================================================= */

function showLoading(
    text = "Loading..."
) {

    let loading =
        document.getElementById(
            "simpleLoading"
        );


    if (!loading) {

        loading =
            document.createElement(
                "div"
            );


        loading.id =
            "simpleLoading";


        loading.style.cssText = `

            position:fixed;

            inset:0;

            background:
                rgba(0,0,0,.35);

            display:flex;

            align-items:center;

            justify-content:center;

            z-index:99999;

        `;


        loading.innerHTML = `

            <div
                style="
                    background:white;
                    padding:25px 35px;
                    border-radius:16px;
                    box-shadow:
                        0 15px 40px
                        rgba(0,0,0,.25);
                    font-family:
                        Arial,sans-serif;
                    color:#1e3a8a;
                    font-weight:600;
                "
            >

                <i
                    class="fa-solid fa-spinner fa-spin"
                    style="
                        margin-right:8px;
                    "
                ></i>


                <span
                    id="simpleLoadingText"
                >
                    ${escapeHTML(text)}
                </span>

            </div>

        `;


        document.body.appendChild(
            loading
        );

    }
    else {

        const textElement =
            document.getElementById(
                "simpleLoadingText"
            );


        if (textElement) {

            textElement.textContent =
                text;

        }

    }


    loading.style.display =
        "flex";

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

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
   ESCAPE HTML
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
   IMAGE ERROR
========================================================= */

function imageError(img) {

    if (!img) {

        return;

    }


    img.onerror = null;


    img.src =
        "profile.png";

}


/* =========================================================
   FALLBACK USER IMAGE
========================================================= */

function createFallbackImage() {

    return `

        <div
            class="user-picture"
        >

            <img
                src="profile.png"
                class="user-avatar"
                alt="User"
                onerror="
                    this.style.display='none'
                "
            >

        </div>

    `;

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Escape"
        ) {

            closeModal();

            closePopup();

            closeDeletePopup();

        }

    }
);
