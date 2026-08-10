// =====================================================
// HISTORY PAGE - FINAL JS
// L4SM SUPPORT SYSTEM
// Google Sheets Connected
// =====================================================


// =====================================================
// CONFIG
// =====================================================

// তোমার Google Apps Script Web App URL এখানে বসাও
const API_URL =  "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let historyData = [];

let filteredHistory = [];

let currentHistoryRow = null;

let currentDeleteRow = null;

let currentPage = 1;

const ITEMS_PER_PAGE = 10;


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    initializeHistoryPage();

});


// =====================================================
// INITIALIZE
// =====================================================

function initializeHistoryPage() {

    setupSearch();

    setupDateFilters();

    loadHistory();

}


// =====================================================
// CHECK API URL
// =====================================================

function checkApiUrl() {

    if (
        !API_URL ||
        API_URL.includes("PASTE_YOUR")
    ) {

        showError(
            "Google Apps Script URL বসানো হয়নি। history.js-এর API_URL-এ Web App URL বসাও।"
        );

        return false;

    }

    return true;

}


// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(action, data = {}) {

    if (!checkApiUrl()) {

        throw new Error(
            "API URL is not configured."
        );

    }


    const payload = {

        action: action,

        ...data

    };


    try {

        const response = await fetch(
            API_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(payload)

            }
        );


        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );

        }


        const text =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(text);

        }
        catch (parseError) {

            console.error(
                "Invalid JSON response:",
                text
            );

            throw new Error(
                "Google Apps Script থেকে valid JSON response পাওয়া যায়নি।"
            );

        }


        return result;

    }
    catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;

    }

}


// =====================================================
// LOAD HISTORY
// =====================================================

async function loadHistory() {

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


    try {

        const result =
            await apiRequest(
                "getHistory"
            );


        console.log(
            "History API Response:",
            result
        );


        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.message ||
                "History load failed."
            );

        }


        historyData =
            Array.isArray(result.data)
                ? result.data
                : [];


        filteredHistory =
            [...historyData];


        currentPage = 1;


        renderHistory();


    }
    catch (error) {

        console.error(
            "Load History Error:",
            error
        );


        historyData = [];

        filteredHistory = [];


        if (list) {

            list.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="loading-cell"
                    >

                        <i class="fa fa-circle-exclamation"></i>

                        Failed to load history.

                    </td>

                </tr>

            `;

        }


        showError(
            error.message ||
            "History load করতে সমস্যা হয়েছে।"
        );

    }

}


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory() {

    const list =
        document.getElementById(
            "historyList"
        );


    if (!list) {

        console.error(
            "historyList element not found."
        );

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
                    class="loading-cell"
                >

                    <i class="fa fa-folder-open"></i>

                    No history records found.

                </td>

            </tr>

        `;


        renderPagination();

        updateRecordCount(0);

        return;

    }


    const totalPages =
        Math.ceil(
            filteredHistory.length /
            ITEMS_PER_PAGE
        );


    if (
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    if (
        currentPage < 1
    ) {

        currentPage = 1;

    }


    const start =
        (
            currentPage - 1
        ) *
        ITEMS_PER_PAGE;


    const end =
        start +
        ITEMS_PER_PAGE;


    const pageData =
        filteredHistory.slice(
            start,
            end
        );


    let html = "";


    pageData.forEach(
        function (item) {

            const row =
                Number(item.row);


            html += `

                <tr>

                    <td>
                        ${escapeHtml(
                            item.customerId
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            item.problem
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            item.reference
                        )}
                    </td>


                    <td>
                        ${formatDisplayDate(
                            item.date
                        )}
                    </td>


                    <td class="action-cell">

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="openEdit(${row})"
                            title="Edit"
                        >

                            <i class="fa fa-pen-to-square"></i>

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="askDelete(${row})"
                            title="Delete"
                        >

                            <i class="fa fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    list.innerHTML = html;


    renderPagination();


    updateRecordCount(
        filteredHistory.length
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

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
// DATE DISPLAY
// =====================================================

function formatDisplayDate(value) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        !isNaN(
            date.getTime()
        )
    ) {

        return date.toLocaleDateString(
            "en-CA"
        );

    }


    return escapeHtml(value);

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const input =
        document.getElementById(
            "historySearch"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        function () {

            applyFilters();

        }
    );

}


// =====================================================
// DATE FILTER
// =====================================================

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
            applyFilters
        );

    }


    if (toDate) {

        toDate.addEventListener(
            "change",
            applyFilters
        );

    }

}


// =====================================================
// APPLY FILTERS
// =====================================================

function applyFilters() {

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


    const search =
        (
            searchInput?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const fromDate =
        fromInput?.value ||
        "";


    const toDate =
        toInput?.value ||
        "";


    filteredHistory =
        historyData.filter(
            function (item) {


                // ---------------------------------
                // SEARCH
                // ---------------------------------

                const searchableText = [

                    item.customerId,

                    item.problem,

                    item.reference,

                    item.support,

                    item.supportWork,

                    item.supportTime,

                    item.call,

                    item.callWork

                ]
                .join(" ")
                .toLowerCase();


                if (
                    search &&
                    !searchableText.includes(
                        search
                    )
                ) {

                    return false;

                }


                // ---------------------------------
                // DATE
                // ---------------------------------

                const itemDate =
                    getDateOnly(
                        item.date
                    );


                if (
                    fromDate &&
                    itemDate &&
                    itemDate < fromDate
                ) {

                    return false;

                }


                if (
                    toDate &&
                    itemDate &&
                    itemDate > toDate
                ) {

                    return false;

                }


                return true;

            }
        );


    currentPage = 1;


    renderHistory();

}


// =====================================================
// GET DATE ONLY
// =====================================================

function getDateOnly(value) {

    if (!value) {

        return "";

    }


    const match =
        String(value).match(
            /^\d{4}-\d{2}-\d{2}/
        );


    if (match) {

        return match[0];

    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// =====================================================
// CLEAR FILTERS
// =====================================================

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


// =====================================================
// FILTER PANEL
// =====================================================

function toggleHistoryFilter() {

    const filter =
        document.getElementById(
            "historyFilter"
        );


    if (!filter) {

        return;

    }


    filter.classList.toggle(
        "active"
    );


}


// =====================================================
// PAGINATION
// =====================================================

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
            ITEMS_PER_PAGE
        );


    if (
        totalPages <= 1
    ) {

        pagination.innerHTML = "";

        return;

    }


    let html = "";


    // Previous

    html += `

        <button
            type="button"
            class="page-btn"
            ${
                currentPage === 1
                    ? "disabled"
                    : ""
            }
            onclick="changePage(${currentPage - 1})"
        >

            <i class="fa fa-angle-left"></i>

        </button>

    `;


    // Pages

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


    // Next

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


// =====================================================
// CHANGE PAGE
// =====================================================

function changePage(page) {

    const totalPages =
        Math.ceil(
            filteredHistory.length /
            ITEMS_PER_PAGE
        );


    if (
        page < 1 ||
        page > totalPages
    ) {

        return;

    }


    currentPage = page;


    renderHistory();

}


// =====================================================
// OPEN EDIT
// =====================================================
//
// IMPORTANT:
// এখানে row হচ্ছে Google Sheet-এর actual row number.
// যেমন Sheet-এর row 2 হলে row = 2
//
// =====================================================

async function openEdit(row) {

    row = Number(row);


    if (
        !row ||
        row <= 1
    ) {

        showError(
            "Invalid history row."
        );

        return;

    }


    currentHistoryRow =
        row;


    // ---------------------------------
    // First find local data
    // ---------------------------------

    let item =
        historyData.find(
            function (record) {

                return Number(
                    record.row
                ) === row;

            }
        );


    // ---------------------------------
    // Try getting latest data from Sheet
    // ---------------------------------

    try {

        const result =
            await apiRequest(
                "getSingleHistory",
                {
                    row: row
                }
            );


        if (
            result &&
            result.success === true
        ) {

            item = result;

        }

    }
    catch (error) {

        console.warn(
            "Single history fetch failed. Using local data.",
            error
        );

    }


    if (!item) {

        showError(
            "History record পাওয়া যায়নি।"
        );

        return;

    }


    fillEditForm(item);


    openEditPopup();

}


// =====================================================
// FILL EDIT FORM
// =====================================================

function fillEditForm(item) {

    setValue(
        "editIndex",
        item.row || currentHistoryRow
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
        getDateOnly(item.date)
    );


    setValue(
        "support",
        item.support
    );


    setValue(
        "supportWork",
        item.supportWork
    );

}


// =====================================================
// SET VALUE
// =====================================================

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value === null ||
            value === undefined
                ? ""
                : value;

    }

}


// =====================================================
// OPEN EDIT POPUP
// =====================================================

function openEditPopup() {

    const popup =
        document.querySelector(
            ".popup"
        );


    if (!popup) {

        showError(
            "Edit popup HTML পাওয়া যায়নি।"
        );

        return;

    }


    // CSS-এর existing system অনুযায়ী
    // বিভিন্নভাবে open করার চেষ্টা

    popup.classList.add(
        "active"
    );


    popup.classList.add(
        "show"
    );


    popup.style.display =
        "block";


    popup.style.visibility =
        "visible";


    popup.style.opacity =
        "1";


    popup.setAttribute(
        "aria-hidden",
        "false"
    );

}


// =====================================================
// CLOSE EDIT
// =====================================================

function closeEdit() {

    const popup =
        document.querySelector(
            ".popup"
        );


    if (!popup) {

        return;

    }


    popup.classList.remove(
        "active"
    );


    popup.classList.remove(
        "show"
    );


    popup.style.display =
        "none";


    popup.style.visibility =
        "hidden";


    popup.style.opacity =
        "0";


    popup.setAttribute(
        "aria-hidden",
        "true"
    );


    currentHistoryRow =
        null;

}


// =====================================================
// UPDATE HISTORY
// =====================================================

async function updateHistory() {

    const rowInput =
        document.getElementById(
            "editIndex"
        );


    let row =
        Number(
            rowInput?.value ||
            currentHistoryRow
        );


    if (
        !row ||
        row <= 1
    ) {

        showError(
            "Invalid History Row."
        );

        return;

    }


    const customerId =
        getValue(
            "customerId"
        )
        .trim();


    const problem =
        getValue(
            "problem"
        )
        .trim();


    const reference =
        getValue(
            "reference"
        )
        .trim();


    const date =
        getValue(
            "date"
        );


    const support =
        getValue(
            "support"
        )
        .trim();


    const supportWork =
        getValue(
            "supportWork"
        )
        .trim();


    if (!customerId) {

        showError(
            "Customer ID is required."
        );

        return;

    }


    if (!problem) {

        showError(
            "Problem is required."
        );

        return;

    }


    // ---------------------------------
    // Disable submit button
    // ---------------------------------

    const submitBtn =
        document.querySelector(
            ".popup .submit-btn"
        );


    const oldButtonText =
        submitBtn
            ? submitBtn.innerHTML
            : "";


    if (submitBtn) {

        submitBtn.disabled =
            true;


        submitBtn.innerHTML = `

            <i class="fa fa-spinner fa-spin"></i>

            Saving...

        `;

    }


    try {

        const result =
            await apiRequest(
                "updateHistory",
                {

                    row: row,

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

                }
            );


        console.log(
            "Update History Response:",
            result
        );


        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.message ||
                "History update failed."
            );

        }


        // ---------------------------------
        // Update local data
        // ---------------------------------

        const index =
            historyData.findIndex(
                function (item) {

                    return Number(
                        item.row
                    ) === row;

                }
            );


        if (index !== -1) {

            historyData[index] = {

                ...historyData[index],

                row: row,

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


        // ---------------------------------
        // Close edit
        // ---------------------------------

        closeEdit();


        applyFilters();


        showSuccess(
            "History updated successfully."
        );


    }
    catch (error) {

        console.error(
            "Update History Error:",
            error
        );


        showError(
            error.message ||
            "History update করতে সমস্যা হয়েছে।"
        );

    }
    finally {

        if (submitBtn) {

            submitBtn.disabled =
                false;


            submitBtn.innerHTML =
                oldButtonText;

        }

    }

}


// =====================================================
// GET INPUT VALUE
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value || "";

}


// =====================================================
// ASK DELETE
// =====================================================

function askDelete(row) {

    row = Number(row);


    if (
        !row ||
        row <= 1
    ) {

        showError(
            "Invalid History Row."
        );

        return;

    }


    currentDeleteRow =
        row;


    const confirmTitle =
        document.getElementById(
            "confirmTitle"
        );


    const confirmMessage =
        document.getElementById(
            "confirmMessage"
        );


    const item =
        historyData.find(
            function (record) {

                return Number(
                    record.row
                ) === row;

            }
        );


    if (confirmTitle) {

        confirmTitle.textContent =
            "Confirm Delete";

    }


    if (confirmMessage) {

        confirmMessage.textContent =
            item
                ? (
                    "Are you sure you want to delete history for Customer ID " +
                    item.customerId +
                    "?"
                )
                : (
                    "Are you sure you want to delete this history?"
                );

    }


    openConfirmPopup();

}


// =====================================================
// OPEN CONFIRM POPUP
// =====================================================

function openConfirmPopup() {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (!popups.length) {

        // fallback
        if (
            confirm(
                "Are you sure you want to delete this history?"
            )
        ) {

            confirmDelete();

        }

        return;

    }


    // First custom-popup = delete confirmation
    const popup =
        popups[0];


    showPopupElement(
        popup
    );

}


// =====================================================
// CONFIRM DELETE
// =====================================================

async function confirmDelete() {

    const row =
        Number(
            currentDeleteRow
        );


    if (
        !row ||
        row <= 1
    ) {

        showError(
            "Invalid History Row."
        );

        return;

    }


    const confirmButton =
        document.querySelector(
            ".custom-popup .popup-confirm-btn"
        );


    const oldText =
        confirmButton
            ? confirmButton.innerHTML
            : "";


    if (confirmButton) {

        confirmButton.disabled =
            true;


        confirmButton.innerHTML = `

            <i class="fa fa-spinner fa-spin"></i>

            Deleting...

        `;

    }


    try {

        const result =
            await apiRequest(
                "deleteHistory",
                {
                    row: row
                }
            );


        console.log(
            "Delete History Response:",
            result
        );


        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.message ||
                "Delete failed."
            );

        }


        // ---------------------------------
        // Remove local record
        // ---------------------------------

        historyData =
            historyData.filter(
                function (item) {

                    return Number(
                        item.row
                    ) !== row;

                }
            );


        closeConfirmPopup();


        applyFilters();


        currentDeleteRow =
            null;


        showSuccess(
            "History deleted successfully."
        );


    }
    catch (error) {

        console.error(
            "Delete History Error:",
            error
        );


        showError(
            error.message ||
            "History delete করতে সমস্যা হয়েছে।"
        );

    }
    finally {

        if (confirmButton) {

            confirmButton.disabled =
                false;


            confirmButton.innerHTML =
                oldText;

        }

    }

}


// =====================================================
// CLOSE CONFIRM POPUP
// =====================================================

function closeConfirmPopup() {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (!popups.length) {

        return;

    }


    // First popup = confirm
    hidePopupElement(
        popups[0]
    );


    currentDeleteRow =
        null;

}


// =====================================================
// SUCCESS POPUP
// =====================================================

function showSuccess(message, title = "Success") {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (!popups.length) {

        alert(message);

        return;

    }


    // Second custom popup = success
    const popup =
        popups[1];


    if (!popup) {

        alert(message);

        return;

    }


    const titleElement =
        popup.querySelector(
            "#successTitle"
        );


    const messageElement =
        popup.querySelector(
            "#successMessage"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    showPopupElement(
        popup
    );

}


// =====================================================
// CLOSE SUCCESS
// =====================================================

function closeSuccessPopup() {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (!popups.length) {

        return;

    }


    // Second popup = success
    if (popups[1]) {

        hidePopupElement(
            popups[1]
        );

    }

}


// =====================================================
// ERROR POPUP
// =====================================================

function showError(message, title = "Error") {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (!popups.length) {

        alert(message);

        return;

    }


    // Third custom popup = error
    const popup =
        popups[2];


    if (!popup) {

        alert(message);

        return;

    }


    const titleElement =
        popup.querySelector(
            "#errorTitle"
        );


    const messageElement =
        popup.querySelector(
            "#errorMessage"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    showPopupElement(
        popup
    );

}


// =====================================================
// CLOSE ERROR
// =====================================================

function closeErrorPopup() {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    if (!popups.length) {

        return;

    }


    // Third popup = error
    if (popups[2]) {

        hidePopupElement(
            popups[2]
        );

    }

}


// =====================================================
// GENERIC POPUP SHOW
// =====================================================

function showPopupElement(popup) {

    if (!popup) {

        return;

    }


    popup.classList.add(
        "active"
    );


    popup.classList.add(
        "show"
    );


    popup.style.display =
        "block";


    popup.style.visibility =
        "visible";


    popup.style.opacity =
        "1";


    popup.setAttribute(
        "aria-hidden",
        "false"
    );

}


// =====================================================
// GENERIC POPUP HIDE
// =====================================================

function hidePopupElement(popup) {

    if (!popup) {

        return;

    }


    popup.classList.remove(
        "active"
    );


    popup.classList.remove(
        "show"
    );


    popup.style.display =
        "none";


    popup.style.visibility =
        "hidden";


    popup.style.opacity =
        "0";


    popup.setAttribute(
        "aria-hidden",
        "true"
    );

}


// =====================================================
// UPDATE RECORD LABEL
// =====================================================

function updateRecordCount(count) {

    const label =
        document.querySelector(
            ".record-label"
        );


    if (!label) {

        return;

    }


    label.innerHTML = `

        <i class="fa fa-database"></i>

        Records

        <span>

            ${count}

        </span>

    `;

}


// =====================================================
// PROFILE
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
        "active"
    );


    menu.classList.toggle(
        "show"
    );

}


// =====================================================
// CLOSE PROFILE WHEN CLICK OUTSIDE
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
            !profile ||
            !menu
        ) {

            return;

        }


        if (
            !profile.contains(
                event.target
            )
        ) {

            menu.classList.remove(
                "active"
            );


            menu.classList.remove(
                "show"
            );

        }

    }
);


// =====================================================
// BACK
// =====================================================

function goBack() {

    if (
        window.history.length > 1
    ) {

        window.history.back();

    }
    else {

        window.location.href =
            "index.html";

    }

}


// =====================================================
// MY ACCOUNT
// =====================================================

function myAccount() {

    // তোমার existing account page থাকলে
    // এখানে path বসাতে পারো।

    window.location.href =
        "account.html";

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    try {

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "username"
        );

        localStorage.removeItem(
            "profile"
        );

    }
    catch (error) {

        console.warn(
            "Logout storage clear error:",
            error
        );

    }


    window.location.href =
        "login.html";

}


// =====================================================
// OPTIONAL: LOAD USER PROFILE
// =====================================================

function loadUserProfile() {

    try {

        const username =
            localStorage.getItem(
                "username"
            );


        const usernameElement =
            document.getElementById(
                "username"
            );


        if (
            username &&
            usernameElement
        ) {

            usernameElement.textContent =
                username;

        }


        const profileImage =
            localStorage.getItem(
                "profile"
            );


        const imageElement =
            document.getElementById(
                "profileImg"
            );


        if (
            profileImage &&
            imageElement
        ) {

            imageElement.src =
                profileImage;

        }

    }
    catch (error) {

        console.warn(
            "Profile loading error:",
            error
        );

    }

}


// =====================================================
// RUN PROFILE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserProfile();

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


        closeEdit();

        closeConfirmPopup();

        closeSuccessPopup();

        closeErrorPopup();

    }
);
