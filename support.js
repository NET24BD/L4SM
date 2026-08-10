// =====================================================
// SUPPORT.JS - FINAL
// Works with the HTML provided by you
// =====================================================

"use strict";

// =====================================================
// CONFIG
// =====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";

let currentRow = null;
let supportData = [];
let confirmCallback = null;


// =====================================================
// PAGE AUTH
// =====================================================

(function () {

    const auth = localStorage.getItem("auth");

    if (auth !== "true") {

        window.location.replace("login.html");

        return;

    }

})();


// =====================================================
// INITIALIZE POPUP IDs
// =====================================================

function initializePopups() {

    const customPopups =
        document.querySelectorAll(".custom-popup");

    customPopups.forEach(function (popup) {

        const title =
            popup.querySelector("h3");

        if (!title) {
            return;
        }

        if (title.id === "confirmTitle") {

            popup.id = "confirmPopup";

        }

        else if (title.id === "successTitle") {

            popup.id = "successPopup";

        }

        else if (title.id === "errorTitle") {

            popup.id = "errorPopup";

        }

    });


    // =============================================
    // FIND EDIT POPUP
    // =============================================

    const customerInput =
        document.getElementById("customerId");

    if (customerInput) {

        const popup =
            customerInput.closest(".popup");

        if (popup) {

            popup.id = "editModal";

        }

    }

}


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePopups();

        loadProfile();

        loadSupport();

        setupSearch();

    }
);


// =====================================================
// PROFILE
// =====================================================

function loadProfile() {

    const username =
        localStorage.getItem("username");

    const picture =
        localStorage.getItem("picture");


    const usernameElement =
        document.getElementById("username");

    const profileImg =
        document.getElementById("profileImg");


    if (
        usernameElement &&
        username
    ) {

        usernameElement.textContent =
            username;

    }


    if (
        profileImg &&
        picture &&
        picture.trim() !== ""
    ) {

        profileImg.src = picture;

        profileImg.onerror = function () {

            this.src =
                "assets/profile.png";

        };

    }

}


// =====================================================
// PROFILE MENU
// =====================================================

window.toggleProfile = function () {

    const menu =
        document.getElementById("profileMenu");

    if (!menu) {
        return;
    }

    menu.classList.toggle("show");

};


// =====================================================
// MY ACCOUNT
// =====================================================

window.myAccount = function () {

    window.location.href =
        "myaccount.html";

};


// =====================================================
// LOGOUT
// =====================================================

window.logout = function () {

    localStorage.removeItem("auth");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("picture");
    localStorage.removeItem("role");
    localStorage.removeItem("lastActivity");

    window.location.replace("login.html");

};


// =====================================================
// BACK
// =====================================================

window.goBack = function () {

    window.location.replace(
        "dashboard.html"
    );

};


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


// =====================================================
// LOAD SUPPORT
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

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server connection error."
            );

        }

        return response.json();

    })

    .then(function (data) {

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
                "Unable to load support data."
            );

        }


        supportData =
            Array.isArray(data.data)
                ? data.data
                : [];


        renderSupport(
            supportData
        );

    })

    .catch(function (error) {

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
                            padding:35px;
                            color:#ef4444;
                        "
                    >

                        <i class="fa fa-circle-exclamation"></i>

                        ${escapeHTML(
                            error.message ||
                            "Failed to load data."
                        )}

                    </td>

                </tr>

            `;

        }

    });

}


// =====================================================
// RENDER TABLE
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
                        padding:35px;
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


    data.forEach(function (item) {

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

    });


    list.innerHTML =
        html;

}


// =====================================================
// SEARCH SUPPORT
// =====================================================

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

                    customerId.includes(keyword) ||

                    problem.includes(keyword) ||

                    reference.includes(keyword) ||

                    date.includes(keyword) ||

                    formattedDate.includes(keyword)

                );

            }
        );


    if (result.length === 0) {

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

                        <i class="fa fa-magnifying-glass"></i>

                        No matching support found

                    </td>

                </tr>

            `;

        }

        return;

    }


    renderSupport(result);

}


// =====================================================
// EDIT SUPPORT
// =====================================================

window.editSupport = function (row) {

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
        convertDate(item.date)
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

    }

};


// =====================================================
// SET VALUE
// =====================================================

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";

    }

}


// =====================================================
// GET VALUE
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value.trim();

}


// =====================================================
// CLOSE EDIT
// =====================================================

window.closeEdit = function () {

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

};


// =====================================================
// UPDATE / MOVE TO CALL
// =====================================================

window.updateSupport = function () {

    if (!currentRow) {

        showErrorPopup(
            "Please select a support record.",
            "Error"
        );

        return;

    }


    const support =
        getValue("support");

    const supportWork =
        getValue("supportWork");


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
                    Number(currentRow),

                customerId:
                    getValue("customerId"),

                problem:
                    getValue("problem"),

                reference:
                    getValue("reference"),

                date:
                    getValue("date"),

                support:
                    support,

                supportWork:
                    supportWork

            })

        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server error."
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log(
            "SUBMIT RESPONSE:",
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

    })

    .catch(function (error) {

        console.error(
            "SUBMIT ERROR:",
            error
        );


        showErrorPopup(
            error.message ||
            "Support submit failed.",
            "Submit Failed"
        );

    })

    .finally(function () {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                '<i class="fa fa-paper-plane"></i> Submit';

        }

    });

};


// =====================================================
// DELETE SUPPORT
// =====================================================

window.deleteSupport = function () {

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

};


// =====================================================
// PERFORM DELETE
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

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server error."
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log(
            "DELETE RESPONSE:",
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

    })

    .catch(function (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        closeConfirmPopup();


        showErrorPopup(
            error.message ||
            "Unable to delete support.",
            "Delete Failed"
        );

    })

    .finally(function () {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                '<i class="fa fa-trash"></i> Delete';

        }

    });

}


// =====================================================
// CONFIRM POPUP
// =====================================================

function showConfirmPopup(
    message,
    callback,
    title
) {

    initializePopups();


    const popup =
        document.getElementById(
            "confirmPopup"
        );


    if (!popup) {

        alert(
            message
        );

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
            title || "Confirm Delete";

    }


    if (messageElement) {

        messageElement.textContent =
            message || "Are you sure?";

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

}


// =====================================================
// CLOSE CONFIRM
// =====================================================

window.closeConfirmPopup = function () {

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

};


// =====================================================
// SUCCESS POPUP
// =====================================================

function showSuccessPopup(
    message,
    title
) {

    initializePopups();


    const popup =
        document.getElementById(
            "successPopup"
        );


    if (!popup) {

        alert(
            message
        );

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
            title || "Success";

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


// =====================================================
// CLOSE SUCCESS
// =====================================================

window.closeSuccessPopup = function () {

    const popup =
        document.getElementById(
            "successPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }

};


// =====================================================
// ERROR POPUP
// =====================================================

function showErrorPopup(
    message,
    title
) {

    initializePopups();


    const popup =
        document.getElementById(
            "errorPopup"
        );


    if (!popup) {

        alert(
            message
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
            title || "Error";

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


// =====================================================
// CLOSE ERROR
// =====================================================

window.closeErrorPopup = function () {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }

};


// =====================================================
// DATE CONVERT
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
        ).padStart(2, "0") +

        "-" +

        String(
            d.getDate()
        ).padStart(2, "0")

    );

}


// =====================================================
// DATE DISPLAY
// =====================================================

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

        return String(date);

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
        ).padStart(2, "0") +

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
// PROFILE OUTSIDE CLICK
// =====================================================

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


// =====================================================
// EDIT MODAL OUTSIDE CLICK
// =====================================================

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


// =====================================================
// POPUP OUTSIDE CLICK
// =====================================================

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
            event.target === confirmPopup
        ) {

            closeConfirmPopup();

        }


        if (
            successPopup &&
            event.target === successPopup
        ) {

            closeSuccessPopup();

        }


        if (
            errorPopup &&
            event.target === errorPopup
        ) {

            closeErrorPopup();

        }

    }
);


// =====================================================
// ESC KEY
// =====================================================

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

        closeEdit();

    }
);
