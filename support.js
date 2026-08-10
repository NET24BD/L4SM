// =====================================================
// SUPPORT.JS - FULL FINAL
// =====================================================

"use strict";


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================================
// GLOBAL
// =====================================================

let currentRow = null;

let supportData = [];

let confirmCallback = null;


// =====================================================
// AUTH
// =====================================================

(function () {

    function checkAuth() {

        const auth =
            localStorage.getItem("auth");

        if (auth !== "true") {

            window.location.replace(
                "login.html"
            );

            return false;
        }

        return true;
    }


    if (!checkAuth()) {
        return;
    }


    history.pushState(
        null,
        "",
        location.href
    );


    window.addEventListener(
        "popstate",
        function () {

            if (!checkAuth()) {
                return;
            }

            history.pushState(
                null,
                "",
                location.href
            );

        }
    );


    window.addEventListener(
        "pageshow",
        function (event) {

            if (!checkAuth()) {
                return;
            }

            if (event.persisted) {

                window.location.reload();

            }

        }
    );

})();


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupPopupIds();

        loadProfile();

        loadSupport();

        setupSearch();

        setupOutsideClick();

        setupEscape();

    }
);


// =====================================================
// POPUP IDS
// =====================================================

function setupPopupIds() {

    const edit =
        document.querySelector(
            ".popup"
        );


    if (
        edit &&
        !edit.id
    ) {

        edit.id =
            "editModal";

    }


    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (
        popups[0] &&
        !popups[0].id
    ) {

        popups[0].id =
            "confirmPopup";

    }


    if (
        popups[1] &&
        !popups[1].id
    ) {

        popups[1].id =
            "successPopup";

    }


    if (
        popups[2] &&
        !popups[2].id
    ) {

        popups[2].id =
            "errorPopup";

    }

}


// =====================================================
// PROFILE
// =====================================================

function loadProfile() {

    const username =
        localStorage.getItem(
            "username"
        );


    const name =
        localStorage.getItem(
            "name"
        );


    const picture =
        localStorage.getItem(
            "picture"
        );


    const user =
        document.getElementById(
            "username"
        );


    const image =
        document.getElementById(
            "profileImg"
        );


    if (user) {

        user.textContent =
            username ||
            name ||
            "User";

    }


    if (
        image &&
        picture &&
        picture.trim() !== ""
    ) {

        image.src =
            picture;

    }


    if (image) {

        image.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "assets/profile.png";

            };

    }

}


// =====================================================
// PROFILE TOGGLE
// =====================================================

function toggleProfile() {

    const menu =
        document.getElementById(
            "profileMenu"
        );


    if (!menu) {
        return;
    }


    menu.classList.toggle(
        "show"
    );

}


// =====================================================
// MY ACCOUNT
// =====================================================

function myAccount() {

    window.location.href =
        "myaccount.html";

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem("auth");

    localStorage.removeItem("isLogin");

    localStorage.removeItem("username");

    localStorage.removeItem("name");

    localStorage.removeItem("picture");

    localStorage.removeItem("role");

    localStorage.removeItem("lastActivity");


    window.location.replace(
        "login.html"
    );

}


// =====================================================
// BACK
// =====================================================

function goBack() {

    window.location.replace(
        "dashboard.html"
    );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const search =
        document.getElementById(
            "supportSearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        searchSupport
    );

}


function searchSupport() {

    const search =
        document.getElementById(
            "supportSearch"
        );


    if (!search) {
        return;
    }


    const keyword =
        search.value
            .trim()
            .toLowerCase();


    if (!keyword) {

        renderSupport(
            supportData
        );

        return;

    }


    const result =
        supportData.filter(
            function (item) {

                const customerId =
                    String(
                        item.customerId || ""
                    ).toLowerCase();


                const problem =
                    String(
                        item.problem || ""
                    ).toLowerCase();


                const reference =
                    String(
                        item.reference || ""
                    ).toLowerCase();


                const date =
                    String(
                        item.date || ""
                    ).toLowerCase();


                const formattedDate =
                    formatDate(
                        item.date
                    ).toLowerCase();


                return (

                    customerId.includes(
                        keyword
                    )

                    ||

                    problem.includes(
                        keyword
                    )

                    ||

                    reference.includes(
                        keyword
                    )

                    ||

                    date.includes(
                        keyword
                    )

                    ||

                    formattedDate.includes(
                        keyword
                    )

                );

            }
        );


    renderSupport(
        result
    );

}


// =====================================================
// LOAD DATA
// =====================================================

function loadSupport() {

    const list =
        document.getElementById(
            "supportList"
        );


    if (list) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-cell"
                >

                    <i class="fa fa-spinner fa-spin"></i>

                    Loading...

                </td>

            </tr>

        `;

    }


    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body: JSON.stringify({

                action:
                    "getPendingSupport"

            })

        }
    )

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        data => {

            console.log(
                "SUPPORT RESPONSE:",
                data
            );


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(
                    data?.message ||
                    "Unable to load support."
                );

            }


            supportData =
                Array.isArray(
                    data.data
                )
                    ? data.data
                    : [];


            renderSupport(
                supportData
            );

        }
    )

    .catch(
        error => {

            console.error(
                "LOAD ERROR:",
                error
            );


            if (list) {

                list.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            style="
                                text-align:center;
                                padding:40px;
                                color:#dc2626;
                                font-weight:600;
                            "
                        >

                            <i class="fa fa-circle-exclamation"></i>

                            Failed to load data

                        </td>

                    </tr>

                `;

            }

        }
    );

}


// =====================================================
// RENDER
// =====================================================

function renderSupport(data) {

    const list =
        document.getElementById(
            "supportList"
        );


    if (!list) {
        return;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#64748b;
                    "
                >

                    <i class="fa fa-inbox"></i>

                    No Pending Support

                </td>

            </tr>

        `;

        return;

    }


    let html = "";


    data.forEach(
        function (item) {

            html += `

                <tr>

                    <td>
                        ${escapeHTML(
                            item.customerId
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.problem
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.reference
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            item.date
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editSupport(${Number(item.row)})"
                        >

                            <i class="fa fa-pen"></i>

                            Edit

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    list.innerHTML =
        html;

}


// =====================================================
// EDIT
// =====================================================

function editSupport(row) {

    currentRow =
        Number(row);


    const item =
        supportData.find(
            function (record) {

                return Number(
                    record.row
                ) === currentRow;

            }
        );


    if (!item) {

        showErrorPopup(
            "Support record not found.",
            "Error"
        );

        currentRow = null;

        return;

    }


    setValue(
        "customerId",
        item.customerId
    );


    setValue(
        "problem",
        item.problem
    );


    setValue(
        "reference",
        item.reference
    );


    setValue(
        "date",
        convertDate(
            item.date
        )
    );


    setValue(
        "support",
        item.support
    );


    setValue(
        "supportWork",
        item.supportWork
    );


    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

    }

}


// =====================================================
// SET / GET
// =====================================================

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value == null
                ? ""
                : value;

    }

}


function getValue(id) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return "";
    }


    return element.value.trim();

}


// =====================================================
// CLOSE EDIT
// =====================================================

function closeEdit() {

    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );


    currentRow =
        null;

}


// =====================================================
// SUBMIT
// =====================================================

function updateSupport() {

    if (!currentRow) {

        showErrorPopup(
            "Please select a support record.",
            "Error"
        );

        return;

    }


    const support =
        getValue(
            "support"
        );


    const supportWork =
        getValue(
            "supportWork"
        );


    if (!support) {

        showErrorPopup(
            "Please enter Support.",
            "Required"
        );

        return;

    }


    if (!supportWork) {

        showErrorPopup(
            "Please enter Support Work.",
            "Required"
        );

        return;

    }


    const button =
        document.querySelector(
            "#editModal .submit-btn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    }


    const row =
        Number(currentRow);


    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body: JSON.stringify({

                action:
                    "moveToCall",

                row:
                    row,

                customerId:
                    getValue(
                        "customerId"
                    ),

                problem:
                    getValue(
                        "problem"
                    ),

                reference:
                    getValue(
                        "reference"
                    ),

                date:
                    getValue(
                        "date"
                    ),

                support:
                    support,

                supportWork:
                    supportWork

            })

        }
    )

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        data => {

            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(
                    data?.message ||
                    "Support submit failed."
                );

            }


            supportData =
                supportData.filter(
                    function (item) {

                        return Number(
                            item.row
                        ) !== row;

                    }
                );


            renderSupport(
                supportData
            );


            closeEdit();


            showSuccessPopup(
                "Support completed and moved to Call successfully.",
                "Support Completed"
            );

        }
    )

    .catch(
        error => {

            console.error(
                "SUBMIT ERROR:",
                error
            );


            showErrorPopup(
                error.message ||
                "Support submit failed.",
                "Submit Failed"
            );

        }
    )

    .finally(
        function () {

            if (button) {

                button.disabled =
                    false;

                button.innerHTML =
                    '<i class="fa fa-paper-plane"></i> Submit';

            }

        }
    );

}


// =====================================================
// DELETE
// =====================================================

function deleteSupport() {

    if (!currentRow) {

        showErrorPopup(
            "Please select a support record first.",
            "Delete Error"
        );

        return;

    }


    showConfirmPopup(

        "Are you sure you want to permanently delete this support?",

        function () {

            performDeleteSupport();

        },

        "Confirm Delete"

    );

}


// =====================================================
// ACTUAL DELETE
// =====================================================

function performDeleteSupport() {

    const row =
        Number(currentRow);


    if (
        !row ||
        row <= 1
    ) {

        showErrorPopup(
            "Invalid support row.",
            "Delete Error"
        );

        return;

    }


    const button =
        document.getElementById(
            "confirmActionBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Deleting...';

    }


    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body: JSON.stringify({

                action:
                    "deleteSupport",

                row:
                    row

            })

        }
    )

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        data => {

            console.log(
                "DELETE:",
                data
            );


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(
                    data?.message ||
                    "Delete failed."
                );

            }


            supportData =
                supportData.filter(
                    function (item) {

                        return Number(
                            item.row
                        ) !== row;

                    }
                );


            renderSupport(
                supportData
            );


            closeConfirmPopup();

            closeEdit();


            currentRow =
                null;


            showSuccessPopup(
                "Support deleted successfully.",
                "Deleted Successfully"
            );

        }
    )

    .catch(
        error => {

            console.error(
                "DELETE ERROR:",
                error
            );


            showErrorPopup(
                error.message ||
                "Unable to delete support.",
                "Delete Failed"
            );

        }
    )

    .finally(
        function () {

            if (button) {

                button.disabled =
                    false;

                button.innerHTML =
                    '<i class="fa fa-trash"></i> Delete';

            }

        }
    );

}


// =====================================================
// CONFIRM POPUP
// =====================================================

function showConfirmPopup(
    message,
    callback,
    title
) {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


    if (!popup) {

        if (
            window.confirm(
                message
            )
        ) {

            if (
                typeof callback ===
                "function"
            ) {

                callback();

            }

        }

        return;

    }


    const titleElement =
        document.getElementById(
            "confirmTitle"
        );


    const messageElement =
        document.getElementById(
            "confirmMessage"
        );


    const button =
        document.getElementById(
            "confirmActionBtn"
        );


    if (titleElement) {

        titleElement.textContent =
            title ||
            "Confirm Delete";

    }


    if (messageElement) {

        messageElement.textContent =
            message ||
            "Are you sure?";

    }


    confirmCallback =
        callback;


    if (button) {

        button.disabled =
            false;

        button.innerHTML =
            '<i class="fa fa-trash"></i> Delete';


        button.onclick =
            function () {

                if (
                    typeof confirmCallback ===
                    "function"
                ) {

                    confirmCallback();

                }

            };

    }


    popup.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );

}


// =====================================================
// CLOSE CONFIRM
// =====================================================

function closeConfirmPopup() {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }


    confirmCallback =
        null;


    document.body.classList.remove(
        "modal-open"
    );

}


// =====================================================
// SUCCESS
// =====================================================

function showSuccessPopup(
    message,
    title
) {

    const popup =
        document.getElementById(
            "successPopup"
        );


    if (!popup) {
        return;
    }


    const titleElement =
        document.getElementById(
            "successTitle"
        );


    const messageElement =
        document.getElementById(
            "successMessage"
        );


    if (titleElement) {

        titleElement.textContent =
            title ||
            "Success";

    }


    if (messageElement) {

        messageElement.textContent =
            message ||
            "Operation completed successfully.";

    }


    popup.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );

}


// =====================================================
// CLOSE SUCCESS
// =====================================================

function closeSuccessPopup() {

    const popup =
        document.getElementById(
            "successPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


// =====================================================
// ERROR
// =====================================================

function showErrorPopup(
    message,
    title
) {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    if (!popup) {

        alert(
            message ||
            "Something went wrong."
        );

        return;

    }


    const titleElement =
        document.getElementById(
            "errorTitle"
        );


    const messageElement =
        document.getElementById(
            "errorMessage"
        );


    if (titleElement) {

        titleElement.textContent =
            title ||
            "Error";

    }


    if (messageElement) {

        messageElement.textContent =
            message ||
            "Something went wrong.";

    }


    popup.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );

}


// =====================================================
// CLOSE ERROR
// =====================================================

function closeErrorPopup() {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


// =====================================================
// DATE INPUT
// =====================================================

function convertDate(date) {

    if (!date) {
        return "";
    }


    const text =
        String(date).trim();


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        return text;

    }


    const slash =
        text.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );


    if (slash) {

        return (
            slash[3] +
            "-" +
            slash[2] +
            "-" +
            slash[1]
        );

    }


    const d =
        new Date(date);


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return "";

    }


    return (

        d.getFullYear() +
        "-" +
        String(
            d.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        )

    );

}


// =====================================================
// DATE DISPLAY
// =====================================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const text =
        String(date).trim();


    const match =
        text.match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );


    if (match) {

        const months = [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"

        ];


        return (
            match[3] +
            " " +
            months[
                Number(match[2]) - 1
            ] +
            " " +
            match[1]
        );

    }


    const d =
        new Date(date);


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return text;

    }


    const months = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    return (
        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        ) +
        " " +
        months[
            d.getMonth()
        ] +
        " " +
        d.getFullYear()
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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


// =====================================================
// OUTSIDE CLICK
// =====================================================

function setupOutsideClick() {

    document.addEventListener(
        "click",
        function (event) {

            // Profile
            const profile =
                document.querySelector(
                    ".profile"
                );


            const menu =
                document.getElementById(
                    "profileMenu"
                );


            if (
                profile &&
                menu &&
                !profile.contains(
                    event.target
                )
            ) {

                menu.classList.remove(
                    "show"
                );

            }


            // Edit modal
            const edit =
                document.getElementById(
                    "editModal"
                );


            if (
                edit &&
                event.target === edit
            ) {

                closeEdit();

            }


            // Confirm
            const confirmPopup =
                document.getElementById(
                    "confirmPopup"
                );


            if (
                confirmPopup &&
                event.target ===
                    confirmPopup
            ) {

                closeConfirmPopup();

            }


            // Success
            const successPopup =
                document.getElementById(
                    "successPopup"
                );


            if (
                successPopup &&
                event.target ===
                    successPopup
            ) {

                closeSuccessPopup();

            }


            // Error
            const errorPopup =
                document.getElementById(
                    "errorPopup"
                );


            if (
                errorPopup &&
                event.target ===
                    errorPopup
            ) {

                closeErrorPopup();

            }

        }
    );

}


// =====================================================
// ESC KEY
// =====================================================

function setupEscape() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeConfirmPopup();

            closeSuccessPopup();

            closeErrorPopup();

            closeEdit();

        }
    );

}
