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
// AUTH
// ============================================================

(function protectPage() {

    function checkAuth() {

        const auth = localStorage.getItem("auth");

        if (auth !== "true") {

            window.location.replace("login.html");

            return false;
        }

        return true;
    }


    if (!checkAuth()) {
        return;
    }


    window.logout = function () {

        localStorage.removeItem("auth");
        localStorage.removeItem("username");
        localStorage.removeItem("picture");
        localStorage.removeItem("role");

        window.location.replace("login.html");
    };


    window.addEventListener("pageshow", function (event) {

        if (!checkAuth()) {
            return;
        }

        if (event.persisted) {
            window.location.reload();
        }

    });

})();


// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();

    loadHistory();

    setupSearch();

    setupDateFilters();

    setupGlobalEvents();

});


// ============================================================
// PROFILE
// ============================================================

function loadProfile() {

    const username =
        localStorage.getItem("username");

    const picture =
        localStorage.getItem("picture");


    const usernameElement =
        document.getElementById("username");

    const profileImg =
        document.getElementById("profileImg");


    if (usernameElement && username) {

        usernameElement.textContent =
            username;

    }


    if (profileImg && picture) {

        profileImg.src =
            picture;

    }

}


// ============================================================
// PROFILE MENU
// ============================================================

function toggleProfile() {

    const menu =
        document.getElementById("profileMenu");

    if (!menu) {
        return;
    }

    menu.classList.toggle("show");

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
        document.getElementById("historyFilter");

    const button =
        document.getElementById("historyFilterBtn");


    if (!filter) {
        return;
    }


    filter.classList.toggle("show");


    if (button) {

        button.classList.toggle(
            "active"
        );

    }

}


// ============================================================
// LOAD HISTORY
// ============================================================

async function loadHistory() {

    const list =
        document.getElementById("historyList");


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


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: "getHistory"
                })

            });


        if (!response.ok) {

            throw new Error(
                "Server Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "GET HISTORY RESPONSE:",
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
            Array.isArray(data.data)
                ? data.data.map(normalizeHistoryItem)
                : [];


        filteredHistory =
            [...historyData];


        currentPage = 1;


        renderHistory();


    } catch (error) {

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

}


// ============================================================
// NORMALIZE HISTORY ITEM
// ============================================================

function normalizeHistoryItem(item) {

    if (!item || typeof item !== "object") {

        return {
            row: null,
            customerId: "",
            problem: "",
            reference: "",
            date: "",
            support: "",
            supportWork: "",
            supportTime: "",
            call: "",
            callWork: ""
        };

    }


    return {

        ...item,

        row:
            item.row !== undefined &&
            item.row !== null &&
            item.row !== ""
                ? Number(item.row)
                : null,

        customerId:
            item.customerId ??
            item.customerID ??
            item["Customer ID"] ??
            "",

        problem:
            item.problem ??
            item.Problem ??
            "",

        reference:
            item.reference ??
            item.Reference ??
            "",

        date:
            item.date ??
            item.Date ??
            "",

        support:
            item.support ??
            item.Support ??
            "",

        supportWork:
            item.supportWork ??
            item["Support Work"] ??
            "",

        supportTime:
            item.supportTime ??
            item["Support Time"] ??
            "",

        call:
            item.call ??
            item.Call ??
            "",

        callWork:
            item.callWork ??
            item["Call Work"] ??
            ""

    };

}


// ============================================================
// RENDER HISTORY
// ============================================================

function renderHistory() {

    const list =
        document.getElementById("historyList");


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


    pageData.forEach(function (item) {

        const row =
            Number(item.row);


        html += `
            <tr>

                <td>
                    ${escapeHTML(item.customerId)}
                </td>


                <td class="problem-cell">
                    ${escapeHTML(item.problem)}
                </td>


                <td>
                    ${escapeHTML(item.reference)}
                </td>


                <td>
                    ${formatDisplayDate(item.date)}
                </td>


                <td>

                    <button
                        type="button"
                        class="edit-btn view-btn"
                        data-row="${Number.isFinite(row) ? row : ""}"
                        onclick="editHistoryByButton(this)"
                    >

                        <i class="fa fa-pen"></i>

                        Edit

                    </button>

                </td>

            </tr>
        `;

    });


    list.innerHTML = html;


    renderPagination();

    updateRecordLabel();

}


// ============================================================
// EDIT BUTTON HANDLER
// ============================================================

function editHistoryByButton(button) {

    if (!button) {
        return;
    }


    const row =
        Number(
            button.getAttribute("data-row")
        );


    console.log(
        "EDIT BUTTON ROW:",
        row
    );


    if (
        !Number.isFinite(row) ||
        row <= 0
    ) {

        showErrorPopup(
            "This history record has no valid Google Sheet row number.",
            "Edit Error"
        );

        return;

    }


    editHistory(row);

}


// ============================================================
// EDIT HISTORY
// ============================================================

function editHistory(row) {

    const numericRow =
        Number(row);


    console.log(
        "EDIT HISTORY ROW:",
        numericRow
    );


    if (
        !Number.isFinite(numericRow) ||
        numericRow <= 0
    ) {

        showErrorPopup(
            "Invalid history row.",
            "Edit Error"
        );

        return;

    }


    const item =
        historyData.find(function (history) {

            return Number(history.row) === numericRow;

        });


    if (!item) {

        console.error(
            "History record not found. Row:",
            numericRow,
            historyData
        );


        showErrorPopup(
            "History record not found. Please reload the page.",
            "Edit Error"
        );

        return;

    }


    currentRow =
        numericRow;


    setValue(
        "editIndex",
        numericRow
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
        convertDateForInput(item.date)
    );


    setValue(
        "support",
        item.support
    );


    setValue(
        "supportWork",
        item.supportWork
    );


    openEditPopup();


}


// ============================================================
// OPEN EDIT POPUP
// ============================================================

function openEditPopup() {

    const popup =
        document.querySelector(".popup");


    const overlay =
        document.querySelector(".popup-overlay");


    if (overlay) {

        overlay.classList.add("show");

    }


    if (popup) {

        popup.classList.add("show");

        /*
         * তোমার CSS-এ .popup-overlay system আছে।
         * কিন্তু যদি HTML-এ overlay না থাকে,
         * তাহলে সরাসরি popup visible করে দিচ্ছি।
         */

        if (!overlay) {

            popup.style.display =
                "block";

        }

    }


    document.body.style.overflow =
        "hidden";

}


// ============================================================
// CLOSE EDIT
// ============================================================

function closeEdit() {

    const popup =
        document.querySelector(".popup");


    const overlay =
        document.querySelector(".popup-overlay");


    if (popup) {

        popup.classList.remove("show");

        popup.style.display = "";

    }


    if (overlay) {

        overlay.classList.remove("show");

    }


    document.body.style.overflow =
        "";


    currentRow = null;


    const editIndex =
        document.getElementById("editIndex");


    if (editIndex) {

        editIndex.value = "";

    }

}


// ============================================================
// SET VALUE
// ============================================================

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            "Element not found:",
            id
        );

        return;

    }


    element.value =
        value === null ||
        value === undefined
            ? ""
            : String(value);

}


// ============================================================
// GET VALUE
// ============================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value.trim();

}


// ============================================================
// UPDATE HISTORY
// ============================================================

async function updateHistory() {

    if (
        currentRow === null ||
        !Number.isFinite(Number(currentRow))
    ) {

        showErrorPopup(
            "Please select a history record.",
            "Update Error"
        );

        return;

    }


    const row =
        Number(currentRow);


    const customerId =
        getValue("customerId");


    const problem =
        getValue("problem");


    const reference =
        getValue("reference");


    const date =
        getValue("date");


    const support =
        getValue("support");


    const supportWork =
        getValue("supportWork");


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


    setButtonLoading(
        button,
        true,
        '<i class="fa fa-spinner fa-spin"></i> Updating...'
    );


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

                    action:
                        "updateHistory",

                    row:
                        row,

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

            });


        if (!response.ok) {

            throw new Error(
                "Server Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "UPDATE HISTORY RESPONSE:",
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


        /*
         * Local data update
         */

        const index =
            historyData.findIndex(
                function (item) {

                    return Number(item.row) === row;

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


        /*
         * Re-apply current filters
         */

        applyHistoryFilters();


        closeEdit();


        showSuccessPopup(
            "History updated successfully.",
            "Updated Successfully"
        );


    } catch (error) {

        console.error(
            "UPDATE HISTORY ERROR:",
            error
        );


        showErrorPopup(
            error.message ||
            "Unable to update history.",
            "Update Failed"
        );


    } finally {

        setButtonLoading(
            button,
            false,
            '<i class="fa fa-check"></i> Submit'
        );

    }

}


// ============================================================
// ASK DELETE
// ============================================================

function askDelete() {

    if (
        currentRow === null ||
        !Number.isFinite(Number(currentRow))
    ) {

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

        popup.classList.add("show");

        document.body.style.overflow =
            "hidden";

    } else {

        showErrorPopup(
            "Delete confirmation popup was not found.",
            "Delete Error"
        );

    }

}


// ============================================================
// CONFIRM DELETE
// ============================================================

async function confirmDelete() {

    if (
        currentRow === null ||
        !Number.isFinite(Number(currentRow))
    ) {

        closeConfirmPopup();

        showErrorPopup(
            "Invalid history record.",
            "Delete Error"
        );

        return;

    }


    const row =
        Number(currentRow);


    if (row <= 1) {

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
        ) ||
        getConfirmPopup()?.querySelector(
            ".popup-confirm-btn"
        );


    setButtonLoading(
        button,
        true,
        '<i class="fa fa-spinner fa-spin"></i> Deleting...'
    );


    try {

        const response =
            await fetch(API_URL, {

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

            });


        if (!response.ok) {

            throw new Error(
                "Server Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "DELETE HISTORY RESPONSE:",
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


        closeConfirmPopup();

        closeEdit();


        /*
         * Best solution:
         * Google Sheet থেকে আবার load করি।
         *
         * কারণ deleteRow() করার পরে
         * নিচের সব row number shift করে।
         */

        await loadHistory();


        showSuccessPopup(
            "History deleted successfully.",
            "Deleted Successfully"
        );


    } catch (error) {

        console.error(
            "DELETE HISTORY ERROR:",
            error
        );


        closeConfirmPopup();


        showErrorPopup(
            error.message ||
            "Unable to delete history.",
            "Delete Failed"
        );


    } finally {

        setButtonLoading(
            button,
            false,
            '<i class="fa fa-trash"></i> Delete'
        );

    }

}


// ============================================================
// CONFIRM POPUP
// ============================================================

function getConfirmPopup() {

    const direct =
        document.getElementById(
            "confirmPopup"
        );


    if (direct) {
        return direct;
    }


    /*
     * Fallback:
     * প্রথম custom popup = confirm
     */

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

        popup.classList.remove("show");

    } else {

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


    document.body.style.overflow =
        "";

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


    /*
     * If ID exists, use it.
     */

    if (popup) {

        setPopupText(
            "successTitle",
            title || "Success"
        );

        setPopupText(
            "successMessage",
            message ||
            "Operation completed successfully."
        );


        popup.classList.add("show");

        document.body.style.overflow =
            "hidden";

        return;

    }


    /*
     * Fallback:
     * custom popup containing success icon.
     */

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    let successPopup = null;


    popups.forEach(function (item) {

        if (
            item.querySelector(
                ".popup-icon.success"
            )
        ) {

            successPopup = item;

        }

    });


    if (!successPopup) {
        return;
    }


    const titleElement =
        successPopup.querySelector(
            "#successTitle"
        ) ||
        successPopup.querySelector("h3");


    const messageElement =
        successPopup.querySelector(
            "#successMessage"
        ) ||
        successPopup.querySelector("p");


    if (titleElement) {

        titleElement.textContent =
            title || "Success";

    }


    if (messageElement) {

        messageElement.textContent =
            message ||
            "Operation completed successfully.";

    }


    successPopup.classList.add("show");

    document.body.style.overflow =
        "hidden";

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

        popup.classList.remove("show");

    } else {

        const popups =
            document.querySelectorAll(
                ".custom-popup"
            );


        popups.forEach(function (item) {

            if (
                item.querySelector(
                    ".popup-icon.success"
                )
            ) {

                item.classList.remove(
                    "show"
                );

            }

        });

    }


    document.body.style.overflow =
        "";

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


    if (popup) {

        setPopupText(
            "errorTitle",
            title || "Error"
        );

        setPopupText(
            "errorMessage",
            message ||
            "Something went wrong."
        );


        popup.classList.add("show");

        document.body.style.overflow =
            "hidden";

        return;

    }


    /*
     * Fallback
     */

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    let errorPopup = null;


    popups.forEach(function (item) {

        if (
            item.querySelector(
                ".popup-icon.error"
            )
        ) {

            errorPopup = item;

        }

    });


    if (!errorPopup) {
        return;
    }


    const titleElement =
        errorPopup.querySelector(
            "#errorTitle"
        ) ||
        errorPopup.querySelector("h3");


    const messageElement =
        errorPopup.querySelector(
            "#errorMessage"
        ) ||
        errorPopup.querySelector("p");


    if (titleElement) {

        titleElement.textContent =
            title || "Error";

    }


    if (messageElement) {

        messageElement.textContent =
            message ||
            "Something went wrong.";

    }


    errorPopup.classList.add("show");

    document.body.style.overflow =
        "hidden";

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

        popup.classList.remove("show");

    } else {

        const popups =
            document.querySelectorAll(
                ".custom-popup"
            );


        popups.forEach(function (item) {

            if (
                item.querySelector(
                    ".popup-icon.error"
                )
            ) {

                item.classList.remove(
                    "show"
                );

            }

        });

    }


    document.body.style.overflow =
        "";

}


// ============================================================
// POPUP TEXT
// ============================================================

function setPopupText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// SEARCH
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
// DATE FILTER
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
// APPLY FILTERS
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
        historyData.filter(function (item) {

            const searchableText = [

                item.customerId,

                item.problem,

                item.reference,

                item.support,

                item.supportWork,

                item.supportTime,

                item.call,

                item.callWork,

                item.date,

                formatDisplayDate(item.date)

            ]
                .map(function (value) {

                    return String(
                        value ?? ""
                    ).toLowerCase();

                })
                .join(" ");


            const searchMatch =
                !keyword ||
                searchableText.includes(
                    keyword
                );


            const recordDate =
                getDateOnly(item.date);


            const fromMatch =
                !fromDate ||
                (
                    recordDate &&
                    recordDate >= fromDate
                );


            const toMatch =
                !toDate ||
                (
                    recordDate &&
                    recordDate <= toDate
                );


            return (
                searchMatch &&
                fromMatch &&
                toMatch
            );

        });


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
            total / recordsPerPage
        );


    if (totalPages <= 1) {

        pagination.innerHTML = "";

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
// DATE → INPUT
// ============================================================

function convertDateForInput(date) {

    if (!date) {
        return "";
    }


    const text =
        String(date).trim();


    /*
     * yyyy-MM-dd
     */

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


    /*
     * dd/MM/yyyy
     */

    const slashMatch =
        text.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );


    if (slashMatch) {

        return (
            slashMatch[3] +
            "-" +
            String(
                slashMatch[2]
            ).padStart(2, "0") +
            "-" +
            String(
                slashMatch[1]
            ).padStart(2, "0")
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
        ).padStart(2, "0") +
        "-" +
        String(
            d.getDate()
        ).padStart(2, "0")

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
        String(date).trim();


    const directMatch =
        text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );


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


    if (directMatch) {

        return (
            directMatch[3] +
            " " +
            months[
                Number(directMatch[2]) - 1
            ] +
            " " +
            directMatch[1]
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


// ============================================================
// DATE ONLY
// ============================================================

function getDateOnly(date) {

    if (!date) {
        return "";
    }


    const text =
        String(date).trim();


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


    const slashMatch =
        text.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );


    if (slashMatch) {

        return (
            slashMatch[3] +
            "-" +
            String(
                slashMatch[2]
            ).padStart(2, "0") +
            "-" +
            String(
                slashMatch[1]
            ).padStart(2, "0")
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
        ).padStart(2, "0") +
        "-" +
        String(
            d.getDate()
        ).padStart(2, "0")

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
// BUTTON LOADING
// ============================================================

function setButtonLoading(
    button,
    loading,
    html
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.disabled = true;

        button.dataset.originalHTML =
            button.innerHTML;

        button.innerHTML =
            html;

    } else {

        button.disabled = false;

        button.innerHTML =
            button.dataset.originalHTML ||
            html;

    }

}


// ============================================================
// GLOBAL EVENTS
// ============================================================

function setupGlobalEvents() {

    /*
     * Profile outside click
     */

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


    /*
     * Edit popup outside click
     */

    document.addEventListener(
        "click",
        function (event) {

            const overlay =
                document.querySelector(
                    ".popup-overlay"
                );


            if (
                overlay &&
                event.target === overlay
            ) {

                closeEdit();

            }

        }
    );


    /*
     * Custom popup outside click
     */

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
                        event.target === popup
                    ) {

                        popup.classList.remove(
                            "show"
                        );

                        document.body.style.overflow =
                            "";

                    }

                }
            );

        }
    );


    /*
     * Escape
     */

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


            const editPopup =
                document.querySelector(
                    ".popup"
                );


            if (
                editPopup &&
                (
                    editPopup.classList.contains(
                        "show"
                    ) ||
                    editPopup.style.display ===
                        "block"
                )
            ) {

                closeEdit();

            }

        }
    );

}


// ============================================================
// END
// ============================================================
