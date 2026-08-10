// ============================================================
// HISTORY.JS - FINAL
// L4SM SUPPORT SYSTEM
// Google Sheet History Connection
// ============================================================

"use strict";

// ============================================================
// CONFIG
// ============================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let historyData = [];

let filteredHistory = [];

let currentRow = null;

let currentPage = 1;

const recordsPerPage = 10;


// ============================================================
// PAGE AUTH PROTECTION
// ============================================================

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


    window.logout = function () {

        localStorage.removeItem("auth");
        localStorage.removeItem("username");
        localStorage.removeItem("picture");
        localStorage.removeItem("role");

        window.location.replace(
            "login.html"
        );

    };

})();


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadHistory();

        setupSearch();

        setupDateFilters();

    }
);


// ============================================================
// PROFILE
// ============================================================

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


    if (
        profileImg &&
        picture
    ) {

        profileImg.src =
            picture;

    }

}


// ============================================================
// PROFILE MENU
// ============================================================

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


// ============================================================
// MY ACCOUNT
// ============================================================

function myAccount() {

    window.location.href =
        "myaccount.html";

}


// ============================================================
// BACK
// ============================================================

function goBack() {

    window.location.replace(
        "dashboard.html"
    );

}


// ============================================================
// FILTER TOGGLE
// ============================================================

function toggleHistoryFilter() {

    const filter =
        document.getElementById(
            "historyFilter"
        );


    const button =
        document.getElementById(
            "historyFilterBtn"
        );


    if (!filter) {

        return;

    }


    filter.classList.toggle(
        "show"
    );


    if (button) {

        button.classList.toggle(
            "active"
        );

    }

}


// ============================================================
// LOAD HISTORY FROM GOOGLE SHEET
// ============================================================

function loadHistory() {

    const list =
        document.getElementById(
            "historyList"
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
                    "getHistory"

            })

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "HISTORY DATA:",
                data
            );


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(
                    data?.message ||
                    "Unable to load history."
                );

            }


            historyData =
                Array.isArray(
                    data.data
                )
                    ? data.data
                    : [];


            filteredHistory =
                [...historyData];


            currentPage = 1;


            renderHistory();

        }
    )

    .catch(
        function (error) {

            console.error(
                "HISTORY LOAD ERROR:",
                error
            );


            historyData = [];

            filteredHistory = [];


            if (list) {

                list.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            style="
                                text-align:center;
                                padding:40px;
                                color:#ef4444;
                            "
                        >

                            <i
                                class="fa fa-circle-exclamation"
                                style="margin-right:8px;"
                            ></i>

                            Failed to load history

                        </td>

                    </tr>

                `;

            }


            updateRecordLabel();

        }
    );

}


// ============================================================
// RENDER HISTORY
// ============================================================

function renderHistory() {

    const list =
        document.getElementById(
            "historyList"
        );


    if (!list) {

        return;

    }


    if (
        !filteredHistory ||
        filteredHistory.length === 0
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

                    <i
                        class="fa fa-clock-rotate-left"
                        style="
                            display:block;
                            font-size:30px;
                            margin-bottom:10px;
                            opacity:.5;
                        "
                    ></i>

                    No History Records Found

                </td>

            </tr>

        `;


        renderPagination();

        updateRecordLabel();

        return;

    }


    const start =
        (currentPage - 1) *
        recordsPerPage;


    const end =
        start +
        recordsPerPage;


    const pageData =
        filteredHistory.slice(
            start,
            end
        );


    let html = "";


    pageData.forEach(
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
                        ${formatDisplayDate(
                            item.date
                        )}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editHistory(${Number(item.row)})"
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


    renderPagination();

    updateRecordLabel();

}


// ============================================================
// RECORD LABEL
// ============================================================

function updateRecordLabel() {

    const label =
        document.querySelector(
            ".record-label"
        );


    if (!label) {

        return;

    }


    const count =
        filteredHistory.length;


    label.innerHTML = `

        <i class="fa fa-database"></i>

        ${count} Records

    `;

}


// ============================================================
// SEARCH SETUP
// ============================================================

function setupSearch() {

    const search =
        document.getElementById(
            "historySearch"
        );


    if (!search) {

        return;

    }


    search.addEventListener(
        "input",
        applyHistoryFilters
    );

}


// ============================================================
// DATE FILTER SETUP
// ============================================================

function setupDateFilters() {

    const fromDate =
        document.getElementById(
            "fromDate"
        );


    const toDate =
        document.getElementById(
            "toDate"
        );


    if (fromDate) {

        fromDate.addEventListener(
            "change",
            applyHistoryFilters
        );

    }


    if (toDate) {

        toDate.addEventListener(
            "change",
            applyHistoryFilters
        );

    }

}


// ============================================================
// SEARCH + DATE FILTER
// ============================================================

function applyHistoryFilters() {

    const searchInput =
        document.getElementById(
            "historySearch"
        );


    const fromInput =
        document.getElementById(
            "fromDate"
        );


    const toInput =
        document.getElementById(
            "toDate"
        );


    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const fromDate =
        fromInput
            ? fromInput.value
            : "";


    const toDate =
        toInput
            ? toInput.value
            : "";


    filteredHistory =
        historyData.filter(
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


                const support =
                    String(
                        item.support || ""
                    ).toLowerCase();


                const supportWork =
                    String(
                        item.supportWork || ""
                    ).toLowerCase();


                const supportTime =
                    String(
                        item.supportTime || ""
                    ).toLowerCase();


                const call =
                    String(
                        item.call || ""
                    ).toLowerCase();


                const callWork =
                    String(
                        item.callWork || ""
                    ).toLowerCase();


                const dateText =
                    String(
                        item.date || ""
                    ).toLowerCase();


                const formattedDate =
                    formatDisplayDate(
                        item.date
                    ).toLowerCase();


                const searchMatch =

                    !keyword

                    ||

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

                    support.includes(
                        keyword
                    )

                    ||

                    supportWork.includes(
                        keyword
                    )

                    ||

                    supportTime.includes(
                        keyword
                    )

                    ||

                    call.includes(
                        keyword
                    )

                    ||

                    callWork.includes(
                        keyword
                    )

                    ||

                    dateText.includes(
                        keyword
                    )

                    ||

                    formattedDate.includes(
                        keyword
                    );


                const recordDate =
                    getDateOnly(
                        item.date
                    );


                const fromMatch =
                    !fromDate ||
                    !recordDate ||
                    recordDate >= fromDate;


                const toMatch =
                    !toDate ||
                    !recordDate ||
                    recordDate <= toDate;


                return (
                    searchMatch &&
                    fromMatch &&
                    toMatch
                );

            }
        );


    currentPage = 1;


    renderHistory();

}


// ============================================================
// CLEAR FILTERS
// ============================================================

function clearFilters() {

    const search =
        document.getElementById(
            "historySearch"
        );


    const fromDate =
        document.getElementById(
            "fromDate"
        );


    const toDate =
        document.getElementById(
            "toDate"
        );


    if (search) {

        search.value = "";

    }


    if (fromDate) {

        fromDate.value = "";

    }


    if (toDate) {

        toDate.value = "";

    }


    filteredHistory =
        [...historyData];


    currentPage = 1;


    renderHistory();

}


// ============================================================
// PAGINATION
// ============================================================

function renderPagination() {

    const pagination =
        document.getElementById(
            "pagination"
        );


    if (!pagination) {

        return;

    }


    const total =
        filteredHistory.length;


    const totalPages =
        Math.ceil(
            total /
            recordsPerPage
        );


    if (
        totalPages <= 1
    ) {

        pagination.innerHTML =
            "";

        return;

    }


    let html = "";


    html += `

        <button
            type="button"
            class="page-btn"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(${currentPage - 1})"
        >

            <i class="fa fa-angle-left"></i>

        </button>

    `;


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        html += `

            <button
                type="button"
                class="page-btn ${
                    i === currentPage
                        ? "active"
                        : ""
                }"
                onclick="changePage(${i})"
            >

                ${i}

            </button>

        `;

    }


    html += `

        <button
            type="button"
            class="page-btn"
            ${
                currentPage === totalPages
                    ? "disabled"
                    : ""
            }
            onclick="changePage(${currentPage + 1})"
        >

            <i class="fa fa-angle-right"></i>

        </button>

    `;


    pagination.innerHTML =
        html;

}


// ============================================================
// CHANGE PAGE
// ============================================================

function changePage(page) {

    const totalPages =
        Math.ceil(
            filteredHistory.length /
            recordsPerPage
        );


    if (
        page < 1 ||
        page > totalPages
    ) {

        return;

    }


    currentPage =
        page;


    renderHistory();

}


// ============================================================
// EDIT HISTORY
// ============================================================

function editHistory(row) {

    currentRow =
        Number(row);


    const item =
        historyData.find(
            function (history) {

                return Number(
                    history.row
                ) === currentRow;

            }
        );


    if (!item) {

        showErrorPopup(
            "History record not found.",
            "Error"
        );

        currentRow =
            null;

        return;

    }


    setValue(
        "editIndex",
        item.row
    );


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
        convertDateForInput(
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


    const popup =
        document.querySelector(
            ".popup"
        );


    if (popup) {

        popup.classList.add(
            "show"
        );

    }

}


// ============================================================
// SET VALUE
// ============================================================

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
            value === null ||
            value === undefined
                ? ""
                : value;

    }

}


// ============================================================
// GET VALUE
// ============================================================

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


// ============================================================
// CLOSE EDIT
// ============================================================

function closeEdit() {

    const popup =
        document.querySelector(
            ".popup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }


    currentRow =
        null;

}


// ============================================================
// UPDATE HISTORY
// ============================================================

function updateHistory() {

    if (!currentRow) {

        showErrorPopup(
            "Please select a history record.",
            "Update Error"
        );

        return;

    }


    const customerId =
        getValue(
            "customerId"
        );


    const problem =
        getValue(
            "problem"
        );


    const reference =
        getValue(
            "reference"
        );


    const date =
        getValue(
            "date"
        );


    const support =
        getValue(
            "support"
        );


    const supportWork =
        getValue(
            "supportWork"
        );


    if (!customerId) {

        showErrorPopup(
            "Customer ID is required.",
            "Required"
        );

        return;

    }


    if (!problem) {

        showErrorPopup(
            "Problem is required.",
            "Required"
        );

        return;

    }


    const button =
        document.querySelector(
            ".popup .submit-btn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Updating...';

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
                    "updateHistory",

                row:
                    Number(
                        currentRow
                    ),

                customerId:
                    customerId,

                problem:
                    problem,

                reference:
                    reference,

                date:
                    date,

                support:
                    support,

                supportWork:
                    supportWork

            })

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "UPDATE HISTORY:",
                data
            );


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(
                    data?.message ||
                    "History update failed."
                );

            }


            const index =
                historyData.findIndex(
                    function (item) {

                        return Number(
                            item.row
                        ) === Number(
                            currentRow
                        );

                    }
                );


            if (index !== -1) {

                historyData[index] = {

                    ...historyData[index],

                    customerId:
                        customerId,

                    problem:
                        problem,

                    reference:
                        reference,

                    date:
                        date,

                    support:
                        support,

                    supportWork:
                        supportWork

                };

            }


            filteredHistory =
                [...historyData];


            applyHistoryFilters();


            closeEdit();


            showSuccessPopup(
                "History updated successfully.",
                "Updated Successfully"
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "UPDATE HISTORY ERROR:",
                error
            );


            showErrorPopup(
                error.message ||
                "Unable to update history.",
                "Update Failed"
            );

        }
    )

    .finally(
        function () {

            if (button) {

                button.disabled =
                    false;

                button.innerHTML =
                    '<i class="fa fa-check"></i> Submit';

            }

        }
    );

}


// ============================================================
// ASK DELETE
// ============================================================

function askDelete() {

    if (!currentRow) {

        showErrorPopup(
            "Please select a history record first.",
            "Delete Error"
        );

        return;

    }


    const title =
        document.getElementById(
            "confirmTitle"
        );


    const message =
        document.getElementById(
            "confirmMessage"
        );


    if (title) {

        title.textContent =
            "Confirm Delete";

    }


    if (message) {

        message.textContent =
            "Are you sure you want to permanently delete this history?";

    }


    const popup =
        getConfirmPopup();


    if (popup) {

        popup.classList.add(
            "show"
        );

    }

}


// ============================================================
// CONFIRM DELETE
// ============================================================

function confirmDelete() {

    if (!currentRow) {

        closeConfirmPopup();

        showErrorPopup(
            "Invalid history record.",
            "Delete Error"
        );

        return;

    }


    const row =
        Number(
            currentRow
        );


    if (
        !row ||
        row <= 1
    ) {

        closeConfirmPopup();

        showErrorPopup(
            "Invalid history row.",
            "Delete Error"
        );

        return;

    }


    const button =
        document.querySelector(
            "#confirmPopup .popup-confirm-btn"
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
                    "deleteHistory",

                row:
                    row

            })

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "DELETE HISTORY:",
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


            historyData =
                historyData.filter(
                    function (item) {

                        return Number(
                            item.row
                        ) !== row;

                    }
                );


            // Google Sheet deleteRow()
            // করার কারণে নিচের row numbers
            // automatically shift করে।
            historyData =
                historyData.map(
                    function (item) {

                        if (
                            Number(item.row) > row
                        ) {

                            return {

                                ...item,

                                row:
                                    Number(
                                        item.row
                                    ) - 1

                            };

                        }

                        return item;

                    }
                );


            applyHistoryFilters();


            closeConfirmPopup();


            closeEdit();


            currentRow =
                null;


            showSuccessPopup(
                "History deleted successfully.",
                "Deleted Successfully"
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "DELETE HISTORY ERROR:",
                error
            );


            showErrorPopup(
                error.message ||
                "Unable to delete history.",
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


// ============================================================
// FIND CONFIRM POPUP
// ============================================================

function getConfirmPopup() {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


    if (popup) {

        return popup;

    }


    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    return popups.length > 0
        ? popups[0]
        : null;

}


// ============================================================
// CLOSE CONFIRM POPUP
// ============================================================

function closeConfirmPopup() {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

        return;

    }


    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (popups.length > 0) {

        popups[0].classList.remove(
            "show"
        );

    }

}


// ============================================================
// SUCCESS POPUP
// ============================================================

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


// ============================================================
// CLOSE SUCCESS
// ============================================================

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


// ============================================================
// ERROR POPUP
// ============================================================

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


// ============================================================
// CLOSE ERROR
// ============================================================

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


// ============================================================
// DATE → INPUT
// ============================================================

function convertDateForInput(date) {

    if (!date) {

        return "";

    }


    const text =
        String(date);


    // yyyy-MM-dd
    const directMatch =
        text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );


    if (directMatch) {

        return (
            directMatch[1] +
            "-" +
            directMatch[2] +
            "-" +
            directMatch[3]
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


// ============================================================
// DATE DISPLAY
// ============================================================

function formatDisplayDate(date) {

    if (!date) {

        return "";

    }


    const text =
        String(date);


    const match =
        text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
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


// ============================================================
// DATE ONLY
// ============================================================

function getDateOnly(date) {

    if (!date) {

        return "";

    }


    const text =
        String(date);


    const match =
        text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );


    if (match) {

        return (

            match[1] +
            "-" +
            match[2] +
            "-" +
            match[3]

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


// ============================================================
// ESCAPE HTML
// ============================================================

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


// ============================================================
// PROFILE OUTSIDE CLICK
// ============================================================

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


// ============================================================
// EDIT POPUP OUTSIDE CLICK
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const popup =
            document.querySelector(
                ".popup"
            );


        if (
            popup &&
            event.target === popup
        ) {

            closeEdit();

        }

    }
);


// ============================================================
// CUSTOM POPUP OUTSIDE CLICK
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const popups =
            document.querySelectorAll(
                ".custom-popup"
            );


        popups.forEach(
            function (popup) {

                if (
                    event.target ===
                    popup
                ) {

                    popup.classList.remove(
                        "show"
                    );

                }

            }
        );

    }
);


// ============================================================
// ESC KEY
// ============================================================

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


        const popup =
            document.querySelector(
                ".popup"
            );


        if (
            popup &&
            popup.classList.contains(
                "show"
            )
        ) {

            closeEdit();

        }

    }
);
