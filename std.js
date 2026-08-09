// =====================================
// S.JS - FULL FINAL
// PENDING SUPPORT
// =====================================

"use strict";


// =====================================
// CONFIG
// =====================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";

let currentRow = null;

let supportData = [];

let confirmCallback = null;


// =====================================
// PAGE PROTECTION
// =====================================

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


    // Initial authentication
    if (!checkAuth()) {
        return;
    }


    // Prevent going back after logout
    history.pushState(
        null,
        "",
        location.href
    );


    window.addEventListener(
        "popstate",
        function () {

            if (
                localStorage.getItem("auth")
                !== "true"
            ) {

                window.location.replace(
                    "login.html"
                );

                return;
            }

            history.pushState(
                null,
                "",
                location.href
            );

        }
    );


    // Browser cache protection
    window.addEventListener(
        "pageshow",
        function (event) {

            if (
                localStorage.getItem("auth")
                !== "true"
            ) {

                window.location.replace(
                    "login.html"
                );

                return;
            }


            if (event.persisted) {

                window.location.reload();

            }

        }
    );


})();


// =====================================
// DOM READY
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadSupport();


        const search =
            document.getElementById(
                "supportSearch"
            );


        if (search) {

            search.addEventListener(
                "input",
                searchSupport
            );

        }

    }
);


// =====================================
// PROFILE
// =====================================

function loadProfile() {

    const username =
        localStorage.getItem(
            "username"
        );


    const picture =
        localStorage.getItem(
            "picture"
        );


    const usernameElement =
        document.getElementById(
            "username"
        );


    const profileImg =
        document.getElementById(
            "profileImg"
        );


    if (
        usernameElement &&
        username
    ) {

        usernameElement.textContent =
            username;

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
                "assets/profile.png";

        }


        profileImg.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "assets/profile.png";

            };

    }

}


// =====================================
// PROFILE MENU
// =====================================

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


// =====================================
// MY ACCOUNT
// =====================================

function myAccount() {

    window.location.href =
        "myaccount.html";

}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem(
        "auth"
    );

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "picture"
    );

    localStorage.removeItem(
        "role"
    );


    sessionStorage.clear();


    window.location.replace(
        "login.html"
    );

}


// =====================================
// BACK BUTTON
// =====================================

function goBack() {

    /*
       প্রথমে আগের page-এ যাবে।
       dashboard.html-এ সরাসরি পাঠানো হবে না।
    */

    if (
        window.history.length > 1
    ) {

        window.history.back();

        return;

    }


    // কোনো history না থাকলে fallback
    window.location.replace(
        "dashboard.html"
    );

}


// =====================================
// LOAD SUPPORT
// =====================================

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
                "SUPPORT DATA:",
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
                error
            );


            if (list) {

                list.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            style="
                                text-align:center;
                                padding:35px;
                                color:#ef4444;
                            "
                        >

                            Failed to load data

                        </td>

                    </tr>

                `;

            }

        }
    );

}


// =====================================
// RENDER SUPPORT
// =====================================

function renderSupport(data) {

    const list =
        document.getElementById(
            "supportList"
        );


    if (!list) {
        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >

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


// =====================================
// SEARCH
// =====================================

function searchSupport() {

    const input =
        document.getElementById(
            "supportSearch"
        );


    if (!input) {
        return;
    }


    const keyword =
        input.value
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
                        item.customerId ||
                        ""
                    ).toLowerCase();


                const problem =
                    String(
                        item.problem ||
                        ""
                    ).toLowerCase();


                const reference =
                    String(
                        item.reference ||
                        ""
                    ).toLowerCase();


                const date =
                    String(
                        item.date ||
                        ""
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


    if (
        result.length === 0
    ) {

        const list =
            document.getElementById(
                "supportList"
            );


        if (list) {

            list.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:35px;
                            color:#64748b;
                        "
                    >

                        No matching support found

                    </td>

                </tr>

            `;

        }

        return;

    }


    renderSupport(
        result
    );

}


// =====================================
// EDIT SUPPORT
// =====================================

function editSupport(row) {

    currentRow =
        Number(row);


    const item =
        supportData.find(
            function (support) {

                return Number(
                    support.row
                ) === currentRow;

            }
        );


    if (!item) {

        showErrorPopup(
            "Support record not found.",
            "Error"
        );

        currentRow =
            null;

        return;

    }


    // =================================
    // CUSTOMER ID - READ ONLY
    // =================================

    setValue(
        "customerId",
        item.customerId
    );


    // =================================
    // PROBLEM - READ ONLY
    // =================================

    setValue(
        "problem",
        item.problem
    );


    // =================================
    // REFERENCE - READ ONLY
    // =================================

    setValue(
        "reference",
        item.reference
    );


    // =================================
    // DATE - READ ONLY
    // =================================

    setValue(
        "date",
        convertDate(
            item.date
        )
    );


    // =================================
    // SUPPORT
    // =================================

    setValue(
        "support",
        item.support
    );


    // =================================
    // SUPPORT WORK
    // =================================

    setValue(
        "supportWork",
        item.supportWork
    );


    // Make fixed fields readonly
    makeReadOnlyFields();


    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


// =====================================
// READ ONLY FIELDS
// =====================================

function makeReadOnlyFields() {

    const customerId =
        document.getElementById(
            "customerId"
        );


    const problem =
        document.getElementById(
            "problem"
        );


    const reference =
        document.getElementById(
            "reference"
        );


    const date =
        document.getElementById(
            "date"
        );


    if (customerId) {

        customerId.readOnly =
            true;

    }


    if (problem) {

        problem.readOnly =
            true;

    }


    if (reference) {

        reference.readOnly =
            true;

    }


    if (date) {

        date.readOnly =
            true;

    }

}


// =====================================
// SET VALUE
// =====================================

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
            value || "";

    }

}


// =====================================
// GET VALUE
// =====================================

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


// =====================================
// CLOSE EDIT
// =====================================

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


    currentRow =
        null;

}


// =====================================
// SUBMIT SUPPORT
// SUPPORT → CALL
// =====================================

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
                    Number(
                        currentRow
                    ),

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

            console.log(
                "MOVE TO CALL:",
                data
            );


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
                        ) !== Number(
                            currentRow
                        );

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


// =====================================
// DELETE FUNCTION REMOVED
// =====================================


// =====================================
// CONFIRM POPUP
// =====================================

function showConfirmPopup(
    message,
    callback,
    title
) {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


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


    if (!popup) {
        return;
    }


    if (titleElement) {

        titleElement.textContent =
            title ||
            "Confirm";

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
            '<i class="fa fa-check"></i> Confirm';


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

}


// =====================================
// CLOSE CONFIRM POPUP
// =====================================

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

}


// =====================================
// SUCCESS POPUP
// =====================================

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

}


// =====================================
// CLOSE SUCCESS
// =====================================

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

}


// =====================================
// ERROR POPUP
// =====================================

function showErrorPopup(
    message,
    title
) {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    if (!popup) {
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

}


// =====================================
// CLOSE ERROR
// =====================================

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

}


// =====================================
// DATE FOR INPUT
// =====================================

function convertDate(date) {

    if (!date) {
        return "";
    }


    const text =
        String(date);


    // Already YYYY-MM-DD

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        return text;

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


// =====================================
// DATE DISPLAY
// =====================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const d =
        new Date(date);


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return String(
            date
        );

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
        )

        +

        " "

        +

        months[
            d.getMonth()
        ]

        +

        " "

        +

        d.getFullYear()

    );

}


// =====================================
// ESCAPE HTML
// =====================================

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


// =====================================
// PROFILE OUTSIDE CLICK
// =====================================

document.addEventListener(
    "click",
    function (event) {

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

    }
);


// =====================================
// EDIT MODAL OUTSIDE CLICK
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "editModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeEdit();

        }

    }
);


// =====================================
// CUSTOM POPUP OUTSIDE CLICK
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const confirmPopup =
            document.getElementById(
                "confirmPopup"
            );


        const successPopup =
            document.getElementById(
                "successPopup"
            );


        const errorPopup =
            document.getElementById(
                "errorPopup"
            );


        if (
            confirmPopup &&
            event.target ===
                confirmPopup
        ) {

            closeConfirmPopup();

        }


        if (
            successPopup &&
            event.target ===
                successPopup
        ) {

            closeSuccessPopup();

        }


        if (
            errorPopup &&
            event.target ===
                errorPopup
        ) {

            closeErrorPopup();

        }

    }
);


// =====================================
// ESC KEY
// =====================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeConfirmPopup();

        closeSuccessPopup();

        closeErrorPopup();


        const modal =
            document.getElementById(
                "editModal"
            );


        if (
            modal &&
            modal.classList.contains(
                "show"
            )
        ) {

            closeEdit();

        }

    }
);
