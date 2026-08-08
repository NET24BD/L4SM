/* =========================================================
   LINK 4 USER CONTROL
   USERCONTROL.JS
   DIRECT PROFILE PICTURE UPLOAD VERSION
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

let selectedPicture = null;

let existingPicture = "";


/* =========================================================
   LOGIN CHECK
========================================================= */

const isLogin =
    localStorage.getItem("isLogin");

const role =
    localStorage.getItem("role");


if (
    isLogin !== "true" ||
    role !== "Admin"
) {

    window.location.replace(
        "login.html"
    );

}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadUsers();

        setupEvents();

        setupPictureUpload();

    }
);


/* =========================================================
   SETUP ALL EVENTS
========================================================= */

function setupEvents() {


    /* ======================================
       PROFILE BUTTON
    ====================================== */

    const profileBtn =
        document.getElementById(
            "profileBtn"
        );


    if (profileBtn) {

        profileBtn.addEventListener(
            "click",
            function (e) {

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

            }
        );

    }


    /* ======================================
       CLOSE PROFILE MENU
    ====================================== */

    document.addEventListener(
        "click",
        function () {

            const menu =
                document.getElementById(
                    "profileMenu"
                );

            if (menu) {

                menu.style.display =
                    "none";

            }

        }
    );


    /* ======================================
       BACK BUTTON
    ====================================== */

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


    /* ======================================
       ACCOUNT BUTTON
    ====================================== */

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


    /* ======================================
       LOGOUT
    ====================================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                localStorage.clear();

                window.location.replace(
                    "login.html"
                );

            }
        );

    }


    /* ======================================
       SEARCH
    ====================================== */

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


                const result =
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


                showUsers(result);

            }
        );

    }


    /* ======================================
       ADD USER
    ====================================== */

    const addUserBtn =
        document.getElementById(
            "addUserBtn"
        );


    if (addUserBtn) {

        addUserBtn.addEventListener(
            "click",
            function () {

                editMode = false;

                oldUsername = "";

                selectedPicture = null;

                existingPicture = "";

                clearForm();

                setFormTitle(
                    "Add User"
                );

                resetPicturePreview();

                openModal();

            }
        );

    }


    /* ======================================
       CLOSE MODAL
    ====================================== */

    const closeModalBtn =
        document.getElementById(
            "closeModal"
        );


    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeModal
        );

    }


    /* ======================================
       CANCEL USER
    ====================================== */

    const cancelUser =
        document.getElementById(
            "cancelUser"
        );


    if (cancelUser) {

        cancelUser.addEventListener(
            "click",
            closeModal
        );

    }


    /* ======================================
       SAVE USER
    ====================================== */

    const saveUserBtn =
        document.getElementById(
            "saveUser"
        );


    if (saveUserBtn) {

        saveUserBtn.addEventListener(
            "click",
            saveUser
        );

    }


    /* ======================================
       POPUP CLOSE
    ====================================== */

    const popupClose =
        document.getElementById(
            "popupClose"
        );


    if (popupClose) {

        popupClose.addEventListener(
            "click",
            closePopup
        );

    }

}


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    const name =
        localStorage.getItem(
            "name"
        );


    const picture =
        localStorage.getItem(
            "picture"
        );


    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            name || "User";

    }


    const profileImg =
        document.getElementById(
            "profileImg"
        );


    if (
        profileImg &&
        picture
    ) {

        profileImg.src =
            picture;

    }

}


/* =========================================================
   PICTURE UPLOAD SETUP
========================================================= */

function setupPictureUpload() {

    const pictureFile =
        document.getElementById(
            "pictureFile"
        );


    if (!pictureFile) {

        return;

    }


    pictureFile.addEventListener(
        "change",
        function (event) {

            const file =
                event.target.files[0];


            if (!file) {

                selectedPicture =
                    null;

                return;

            }


            /* ==================================
               CHECK IMAGE
            ================================== */

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showPopup(
                    "Warning",
                    "Please select an image file.",
                    "warning"
                );

                pictureFile.value = "";

                selectedPicture =
                    null;

                return;

            }


            /* ==================================
               MAX SIZE
               5 MB
            ================================== */

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                showPopup(
                    "Warning",
                    "Picture size must be less than 5 MB.",
                    "warning"
                );

                pictureFile.value = "";

                selectedPicture =
                    null;

                return;

            }


            selectedPicture =
                file;


            /* ==================================
               PREVIEW
            ================================== */

            const reader =
                new FileReader();


            reader.onload =
                function (e) {

                    showPicturePreview(
                        e.target.result
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   SHOW PICTURE PREVIEW
========================================================= */

function showPicturePreview(
    src
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
        preview &&
        previewImg
    ) {

        previewImg.src =
            src;

        preview.style.display =
            "flex";

        return;

    }


    /* ======================================
       FALLBACK
    ====================================== */

    const profilePreview =
        document.querySelector(
            ".picture-preview"
        );


    const image =
        document.querySelector(
            ".picture-preview img"
        );


    if (
        profilePreview &&
        image
    ) {

        image.src =
            src;

        profilePreview.style.display =
            "flex";

    }

}


/* =========================================================
   RESET PICTURE PREVIEW
========================================================= */

function resetPicturePreview() {

    const pictureFile =
        document.getElementById(
            "pictureFile"
        );


    if (pictureFile) {

        pictureFile.value = "";

    }


    const preview =
        document.getElementById(
            "picturePreview"
        );


    const previewImg =
        document.getElementById(
            "picturePreviewImg"
        );


    if (preview) {

        preview.style.display =
            "none";

    }


    if (previewImg) {

        previewImg.src = "";

    }


    selectedPicture =
        null;

}


/* =========================================================
   SHOW EXISTING PICTURE
========================================================= */

function showExistingPicture(
    picture
) {

    existingPicture =
        picture || "";


    if (!picture) {

        resetPicturePreview();

        return;

    }


    showPicturePreview(
        picture
    );

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
        "?action=users"
    )

    .then(
        function (res) {

            if (!res.ok) {

                throw new Error(
                    "HTTP " +
                    res.status
                );

            }

            return res.json();

        }
    )

    .then(
        function (data) {

            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid API Response"
                );

            }


            users =
                data;


            showUsers(
                users
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "User Load Error:",
                error
            );


            showPopup(
                "Error",
                "User Load Failed",
                "error"
            );

        }
    )

    .finally(
        function () {

            hideLoading();

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


    if (!table) return;


    table.innerHTML = "";


    if (
        !Array.isArray(data) ||
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


    data.forEach(
        function (user) {

            const row =
                document.createElement(
                    "tr"
                );


            const picture =
                user.picture || "";


            let profileHTML = "";


            if (
                picture &&
                picture.trim() !== ""
            ) {

                profileHTML = `

                    <img
                        src="${escapeHTML(picture)}"
                        class="user-avatar"
                        alt="Profile"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >

                    <div
                        class="user-avatar-fallback"
                        style="display:none;"
                    >

                        <i class="fa-solid fa-user"></i>

                    </div>

                `;

            }

            else {

                profileHTML = `

                    <div class="user-avatar-fallback">

                        <i class="fa-solid fa-user"></i>

                    </div>

                `;

            }


            /* ==================================
               STATUS CLASS
            ================================== */

            let statusClass =
                "status-active";


            if (
                String(
                    user.status || ""
                )
                .toLowerCase()
                ===
                "block"
            ) {

                statusClass =
                    "status-block";

            }

            else if (
                String(
                    user.status || ""
                )
                .toLowerCase()
                ===
                "inactive"
            ) {

                statusClass =
                    "status-inactive";

            }


            /* ==================================
               CREATE CELLS
            ================================== */

            row.innerHTML = `

                <td class="picture-cell">

                    <div class="user-picture">

                        ${profileHTML}

                    </div>

                </td>


                <td class="username-cell">

                    ${escapeHTML(
                        user.username || ""
                    )}

                </td>


                <td class="name-cell">

                    ${escapeHTML(
                        user.name || ""
                    )}

                </td>


                <td class="role-cell">

                    ${escapeHTML(
                        user.role || ""
                    )}

                </td>


                <td class="status-cell">

                    <span
                        class="user-status ${statusClass}"
                    >

                        ${escapeHTML(
                            user.status || ""
                        )}

                    </span>

                </td>


                <td class="action-cell">

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="edit-btn"
                        >

                            <i class="fa-solid fa-pen"></i>

                            Edit

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Delete

                        </button>

                    </div>

                </td>

            `;


            /* ==================================
               EDIT BUTTON
            ================================== */

            const editBtn =
                row.querySelector(
                    ".edit-btn"
                );


            editBtn.addEventListener(
                "click",
                function () {

                    editUser(
                        user.username || "",
                        user.password || "",
                        user.name || "",
                        user.role || "",
                        user.status || "",
                        user.picture || ""
                    );

                }
            );


            /* ==================================
               DELETE BUTTON
            ================================== */

            const deleteBtn =
                row.querySelector(
                    ".delete-btn"
                );


            deleteBtn.addEventListener(
                "click",
                function () {

                    deleteUser(
                        user.username || ""
                    );

                }
            );


            table.appendChild(
                row
            );

        }
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

    editMode =
        true;


    oldUsername =
        username;


    existingPicture =
        picture || "";


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


    if (usernameInput)
        usernameInput.value =
            username;


    if (passwordInput)
        passwordInput.value =
            password;


    if (nameInput)
        nameInput.value =
            name;


    if (roleInput)
        roleInput.value =
            role;


    if (statusInput)
        statusInput.value =
            status;


    /* ==================================
       RESET NEW FILE
    ================================== */

    selectedPicture =
        null;


    const pictureFile =
        document.getElementById(
            "pictureFile"
        );


    if (pictureFile) {

        pictureFile.value = "";

    }


    /* ==================================
       SHOW EXISTING PICTURE
    ================================== */

    if (picture) {

        showExistingPicture(
            picture
        );

    }

    else {

        resetPicturePreview();

    }


    setFormTitle(
        "Edit User"
    );


    openModal();

}


/* =========================================================
   SAVE USER
========================================================= */

async function saveUser() {

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


    /* ==================================
       VALIDATION
    ================================== */

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


    /* ==================================
       BASE DATA
    ================================== */

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
            status

    };


    /* ==================================
       EDIT
    ================================== */

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


    /* ==================================
       PICTURE
    ================================== */

    showLoading(
        editMode
            ? "Updating User..."
            : "Creating User..."
    );


    try {

        if (selectedPicture) {

            const pictureData =
                await fileToBase64(
                    selectedPicture
                );


            data.pictureData =
                pictureData;


            data.pictureName =
                selectedPicture.name;


            data.pictureType =
                selectedPicture.type;

        }

        else if (
            editMode &&
            existingPicture
        ) {

            data.picture =
                existingPicture;

        }

        else {

            data.picture =
                "";

        }


        /* ==================================
           SEND TO GOOGLE APPS SCRIPT
        ================================== */

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            data
                        )

                }
            );


        const result =
            await response.json();


        hideLoading();


        /* ==================================
           RESULT
        ================================== */

        if (
            result.success
        ) {

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


            closeModal();


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

    catch (error) {

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


/* =========================================================
   DELETE USER
========================================================= */

function deleteUser(
    username
) {

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

    .then(
        function (res) {

            return res.json();

        }
    )

    .then(
        function (result) {

            hideLoading();


            if (
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

        }
    )

    .catch(
        function (error) {

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

        }
    );

}


/* =========================================================
   CLEAR FORM
========================================================= */

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


    if (username)
        username.value = "";


    if (password)
        password.value = "";


    if (name)
        name.value = "";


    if (role)
        role.value =
            "Admin";


    if (status)
        status.value =
            "Active";


    resetPicturePreview();

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


    selectedPicture =
        null;


    existingPicture =
        "";

}


/* =========================================================
   FORM TITLE
========================================================= */

function setFormTitle(
    title
) {

    const formTitle =
        document.getElementById(
            "formTitle"
        );


    if (formTitle) {

        formTitle.textContent =
            title;

    }

}


/* =========================================================
   GET INPUT VALUE
========================================================= */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}


/* =========================================================
   FILE TO BASE64
========================================================= */

function fileToBase64(
    file
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    const result =
                        reader.result;


                    /*
                     * Remove:
                     * data:image/jpeg;base64,
                     */

                    const base64 =
                        String(
                            result
                        )
                        .split(",")[1];


                    resolve(
                        base64
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Picture Read Failed"
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

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
   ESCAPE JAVASCRIPT
========================================================= */

function escapeJS(
    value
) {

    return String(
        value || ""
    )
    .replace(
        /\\/g,
        "\\\\"
    )
    .replace(
        /'/g,
        "\\'"
    )
    .replace(
        /"/g,
        '\\"'
    )
    .replace(
        /\r/g,
        "\\r"
    )
    .replace(
        /\n/g,
        "\\n"
    );

}


/* =========================================================
   LOADING
========================================================= */

function showLoading(
    message
) {

    const loading =
        document.getElementById(
            "loadingBox"
        );


    const loadingText =
        document.getElementById(
            "loadingText"
        );


    if (loading) {

        loading.style.display =
            "flex";

    }


    if (
        loadingText &&
        message
    ) {

        loadingText.textContent =
            message;

    }

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    const loading =
        document.getElementById(
            "loadingBox"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

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


    if (
        popupTitle
    ) {

        popupTitle.textContent =
            title;

    }


    if (
        popupMessage
    ) {

        popupMessage.textContent =
            msg;

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
   PREVENT BACK AFTER LOGOUT
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        if (
            localStorage.getItem(
                "isLogin"
            )
            !==
            "true"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);
