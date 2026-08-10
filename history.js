// =====================================================
// HISTORY PAGE
// GOOGLE SHEET CONNECTED JS
// =====================================================

// -----------------------------------------------------
// GOOGLE APPS SCRIPT WEB APP URL
// -----------------------------------------------------
// এখানে তোমার Apps Script Web App URL বসাও
const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let historyData = [];
let filteredHistory = [];

let currentEditRow = null;
let currentDeleteRow = null;

let currentPage = 1;
const recordsPerPage = 10;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    loadHistory();

    setupSearch();

    setupDateFilters();

    setupOutsideClick();

});


// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(action, data = {}) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({
                action: action,
                ...data
            })

        });


        const text = await response.text();

        let result;

        try {

            result = JSON.parse(text);

        } catch (error) {

            console.error("Invalid JSON:", text);

            throw new Error(
                "Server returned invalid response."
            );

        }


        if (!result.success) {

            throw new Error(
                result.message || "Operation failed."
            );

        }


        return result;

    }

    catch (error) {

        console.error("API Error:", error);

        throw error;

    }

}


// =====================================================
// LOAD HISTORY
// =====================================================

async function loadHistory() {

    const list =
        document.getElementById("historyList");


    if (!list) return;


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


    try {

        const result =
            await apiRequest(
                "getHistory"
            );


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

        console.error(error);


        list.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-cell"
                >

                    <i class="fa fa-triangle-exclamation"></i>

                    Failed to load history.

                </td>

            </tr>

        `;


        showError(
            "History Load Failed",
            error.message
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


    if (!list) return;


    if (!filteredHistory.length) {

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

        return;

    }


    const start =
        (currentPage - 1)
        * recordsPerPage;


    const end =
        start + recordsPerPage;


    const pageData =
        filteredHistory.slice(
            start,
            end
        );


    list.innerHTML = "";


    pageData.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${escapeHtml(item.customerId)}
            </td>

            <td>
                ${escapeHtml(item.problem)}
            </td>

            <td>
                ${escapeHtml(item.reference)}
            </td>

            <td>
                ${formatDisplayDate(item.date)}
            </td>

            <td class="action-cell">

                <button
                    type="button"
                    class="edit-btn"
                    onclick="openEdit(${Number(item.row)})"
                    title="Edit"
                >

                    <i class="fa fa-pen"></i>

                </button>


                <button
                    type="button"
                    class="delete-btn"
                    onclick="askDelete(${Number(item.row)})"
                    title="Delete"
                >

                    <i class="fa fa-trash"></i>

                </button>

            </td>

        `;


        list.appendChild(tr);

    });


    renderPagination();

}


// =====================================================
// OPEN EDIT
// =====================================================

async function openEdit(row) {

    row = Number(row);


    if (!row || row <= 1) {

        showError(
            "Error",
            "Invalid history row."
        );

        return;

    }


    currentEditRow = row;


    try {

        // ------------------------------------------------
        // GET LATEST DATA FROM GOOGLE SHEET
        // ------------------------------------------------

        const result =
            await apiRequest(
                "getSingleHistory",
                {
                    row: row
                }
            );


        // ------------------------------------------------
        // PUT DATA INTO POPUP
        // ------------------------------------------------

        setValue(
            "editIndex",
            row
        );


        setValue(
            "customerId",
            result.customerId
        );


        setValue(
            "problem",
            result.problem
        );


        setValue(
            "reference",
            result.reference
        );


        setValue(
            "date",
            getInputDate(result.date)
        );


        setValue(
            "support",
            result.support
        );


        setValue(
            "supportWork",
            result.supportWork
        );


        // ------------------------------------------------
        // OPEN POPUP
        // ------------------------------------------------

        openEditPopup();

    }

    catch (error) {

        console.error(
            "Open edit error:",
            error
        );


        showError(
            "Edit Failed",
            error.message
        );

    }

}


// =====================================================
// UPDATE HISTORY
// =====================================================

async function updateHistory() {

    // ---------------------------------------------------
    // GET ROW
    // ---------------------------------------------------

    let row =
        Number(
            document.getElementById(
                "editIndex"
            )?.value
        );


    if (!row) {

        row = currentEditRow;

    }


    if (!row) {

        showError(
            "Update Failed",
            "History row not found."
        );

        return;

    }


    // ---------------------------------------------------
    // GET FORM VALUES
    // ---------------------------------------------------

    const customerId =
        getValue("customerId").trim();


    const problem =
        getValue("problem").trim();


    const reference =
        getValue("reference").trim();


    const date =
        getValue("date").trim();


    const support =
        getValue("support").trim();


    const supportWork =
        getValue("supportWork").trim();


    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!customerId) {

        showError(
            "Validation Error",
            "Customer ID is required."
        );

        return;

    }


    if (!problem) {

        showError(
            "Validation Error",
            "Problem is required."
        );

        return;

    }


    // ---------------------------------------------------
    // SUBMIT BUTTON
    // ---------------------------------------------------

    const submitBtn =
        document.querySelector(
            ".popup .submit-btn"
        );


    const oldText =
        submitBtn
            ? submitBtn.innerHTML
            : "";


    if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.innerHTML = `

            <i class="fa fa-spinner fa-spin"></i>

            Saving...

        `;

    }


    try {

        // ------------------------------------------------
        // UPDATE GOOGLE SHEET
        // ------------------------------------------------

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


        // ------------------------------------------------
        // CLOSE EDIT POPUP
        // ------------------------------------------------

        closeEdit();


        currentEditRow = null;


        // ------------------------------------------------
        // RELOAD FROM GOOGLE SHEET
        // ------------------------------------------------

        await loadHistory();


        // ------------------------------------------------
        // SUCCESS
        // ------------------------------------------------

        showSuccess(
            "Success",
            result.message ||
            "History updated successfully."
        );

    }

    catch (error) {

        console.error(
            "Update history error:",
            error
        );


        showError(
            "Update Failed",
            error.message
        );

    }

    finally {

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                oldText;

        }

    }

}


// =====================================================
// ASK DELETE
// =====================================================

function askDelete(row) {

    row = Number(row);


    if (!row || row <= 1) {

        showError(
            "Delete Failed",
            "Invalid history row."
        );

        return;

    }


    currentDeleteRow = row;


    const confirmTitle =
        document.getElementById(
            "confirmTitle"
        );


    const confirmMessage =
        document.getElementById(
            "confirmMessage"
        );


    if (confirmTitle) {

        confirmTitle.textContent =
            "Confirm Delete";

    }


    if (confirmMessage) {

        confirmMessage.textContent =
            "Are you sure you want to delete this history?";

    }


    openConfirmPopup();

}


// =====================================================
// CONFIRM DELETE
// =====================================================

async function confirmDelete() {

    const row =
        Number(currentDeleteRow);


    if (!row) {

        showError(
            "Delete Failed",
            "History row not found."
        );

        return;

    }


    const confirmBtn =
        document.querySelector(
            ".popup-confirm-btn"
        );


    const oldText =
        confirmBtn
            ? confirmBtn.innerHTML
            : "";


    if (confirmBtn) {

        confirmBtn.disabled = true;

        confirmBtn.innerHTML = `

            <i class="fa fa-spinner fa-spin"></i>

            Deleting...

        `;

    }


    try {

        // ------------------------------------------------
        // DELETE FROM GOOGLE SHEET
        // ------------------------------------------------

        const result =
            await apiRequest(
                "deleteHistory",
                {
                    row: row
                }
            );


        currentDeleteRow = null;


        closeConfirmPopup();


        // ------------------------------------------------
        // RELOAD
        // ------------------------------------------------

        await loadHistory();


        showSuccess(
            "Deleted",
            result.message ||
            "History deleted successfully."
        );

    }

    catch (error) {

        console.error(
            "Delete history error:",
            error
        );


        showError(
            "Delete Failed",
            error.message
        );

    }

    finally {

        if (confirmBtn) {

            confirmBtn.disabled = false;

            confirmBtn.innerHTML =
                oldText;

        }

    }

}


// =====================================================
// CLOSE EDIT
// =====================================================

function closeEdit() {

    const popup =
        document.querySelector(
            ".popup"
        );


    if (popup) {

        popup.classList.remove(
            "active"
        );

        popup.style.display = "none";

    }


    currentEditRow = null;

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

        console.error(
            "Edit popup not found."
        );

        return;

    }


    popup.style.display = "block";


    popup.classList.add(
        "active"
    );

}


// =====================================================
// CONFIRM POPUP
// =====================================================

function openConfirmPopup() {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    // First custom popup = confirm popup
    const popup =
        popups[0];


    if (!popup) {

        console.error(
            "Confirm popup not found."
        );

        return;

    }


    popup.style.display = "block";

    popup.classList.add(
        "active"
    );

}


function closeConfirmPopup() {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    const popup =
        popups[0];


    if (popup) {

        popup.classList.remove(
            "active"
        );

        popup.style.display = "none";

    }


    currentDeleteRow = null;

}


// =====================================================
// SUCCESS POPUP
// =====================================================

function showSuccess(
    title,
    message
) {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    // Second custom popup
    const popup =
        popups[1];


    if (!popup) {

        alert(message);

        return;

    }


    const titleEl =
        document.getElementById(
            "successTitle"
        );


    const messageEl =
        document.getElementById(
            "successMessage"
        );


    if (titleEl) {

        titleEl.textContent =
            title;

    }


    if (messageEl) {

        messageEl.textContent =
            message;

    }


    popup.style.display = "block";

    popup.classList.add(
        "active"
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


    const popup =
        popups[1];


    if (popup) {

        popup.classList.remove(
            "active"
        );

        popup.style.display = "none";

    }

}


// =====================================================
// ERROR POPUP
// =====================================================

function showError(
    title,
    message
) {

    const popups =
        document.querySelectorAll(
            ".custom-popup"
        );


    // Third custom popup
    const popup =
        popups[2];


    if (!popup) {

        alert(message);

        return;

    }


    const titleEl =
        document.getElementById(
            "errorTitle"
        );


    const messageEl =
        document.getElementById(
            "errorMessage"
        );


    if (titleEl) {

        titleEl.textContent =
            title;

    }


    if (messageEl) {

        messageEl.textContent =
            message;

    }


    popup.style.display = "block";

    popup.classList.add(
        "active"
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


    const popup =
        popups[2];


    if (popup) {

        popup.classList.remove(
            "active"
        );

        popup.style.display = "none";

    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const input =
        document.getElementById(
            "historySearch"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        applyFilters
    );

}


// =====================================================
// DATE FILTERS
// =====================================================

function setupDateFilters() {

    const from =
        document.getElementById(
            "fromDate"
        );


    const to =
        document.getElementById(
            "toDate"
        );


    if (from) {

        from.addEventListener(
            "change",
            applyFilters
        );

    }


    if (to) {

        to.addEventListener(
            "change",
            applyFilters
        );

    }

}


// =====================================================
// APPLY FILTERS
// =====================================================

function applyFilters() {

    const search =
        (
            getValue("historySearch")
        )
        .toLowerCase()
        .trim();


    const fromDate =
        getValue("fromDate");


    const toDate =
        getValue("toDate");


    filteredHistory =
        historyData.filter(
            function (item) {

                // ----------------------------------------
                // SEARCH
                // ----------------------------------------

                const searchable = (

                    String(
                        item.customerId || ""
                    ) +

                    " " +

                    String(
                        item.problem || ""
                    ) +

                    " " +

                    String(
                        item.reference || ""
                    ) +

                    " " +

                    String(
                        item.support || ""
                    ) +

                    " " +

                    String(
                        item.supportWork || ""
                    ) +

                    " " +

                    String(
                        item.call || ""
                    ) +

                    " " +

                    String(
                        item.callWork || ""
                    )

                ).toLowerCase();


                if (
                    search &&
                    !searchable.includes(
                        search
                    )
                ) {

                    return false;

                }


                // ----------------------------------------
                // DATE
                // ----------------------------------------

                const recordDate =
                    getDateOnly(
                        item.date
                    );


                if (
                    fromDate &&
                    recordDate < fromDate
                ) {

                    return false;

                }


                if (
                    toDate &&
                    recordDate > toDate
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
// CLEAR FILTERS
// =====================================================

function clearFilters() {

    setValue(
        "historySearch",
        ""
    );


    setValue(
        "fromDate",
        ""
    );


    setValue(
        "toDate",
        ""
    );


    filteredHistory =
        [...historyData];


    currentPage = 1;


    renderHistory();

}


// =====================================================
// TOGGLE FILTER
// =====================================================

function toggleHistoryFilter() {

    const filter =
        document.getElementById(
            "historyFilter"
        );


    if (!filter) return;


    if (
        filter.style.display === "none" ||
        !filter.style.display
    ) {

        filter.style.display =
            "block";

        filter.classList.add(
            "active"
        );

    }

    else {

        filter.style.display =
            "none";

        filter.classList.remove(
            "active"
        );

    }

}


// =====================================================
// PAGINATION
// =====================================================

function renderPagination() {

    const container =
        document.getElementById(
            "pagination"
        );


    if (!container) return;


    const totalPages =
        Math.ceil(
            filteredHistory.length /
            recordsPerPage
        );


    if (totalPages <= 1) {

        container.innerHTML = "";

        return;

    }


    let html = "";


    html += `

        <button
            type="button"
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
                class="${
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


    container.innerHTML =
        html;

}


// =====================================================
// CHANGE PAGE
// =====================================================

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


    currentPage = page;


    renderHistory();

}


// =====================================================
// PROFILE
// =====================================================

function toggleProfile() {

    const menu =
        document.getElementById(
            "profileMenu"
        );


    if (!menu) return;


    menu.classList.toggle(
        "active"
    );


    if (
        menu.style.display === "block"
    ) {

        menu.style.display =
            "none";

    }

    else {

        menu.style.display =
            "block";

    }

}


// =====================================================
// OUTSIDE CLICK
// =====================================================

function setupOutsideClick() {

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

                menu.style.display =
                    "none";

                menu.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =====================================================
// BACK
// =====================================================

function goBack() {

    if (
        window.history.length > 1
    ) {

        window.history.back();

    }

}


// =====================================================
// MY ACCOUNT
// =====================================================

function myAccount() {

    // তোমার আগের account page থাকলে
    // এখানে সেই URL বসাতে পারো।

    console.log(
        "My Account clicked"
    );

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    try {

        localStorage.clear();

    }

    catch (error) {

        console.error(error);

    }


    // তোমার login page থাকলে এখানে URL বসাও
    // window.location.href = "login.html";

    console.log(
        "Logout clicked"
    );

}


// =====================================================
// HELPERS
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) return "";


    return element.value || "";

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.value =
        value ?? "";

}


function formatDisplayDate(date) {

    if (!date) return "";


    const value =
        String(date);


    if (
        value.length >= 10
    ) {

        return value.substring(
            0,
            10
        );

    }


    return value;

}


function getInputDate(date) {

    if (!date) return "";


    const value =
        String(date);


    // Google Apps Script:
    // yyyy-MM-dd HH:mm:ss

    if (
        /^\d{4}-\d{2}-\d{2}/.test(
            value
        )
    ) {

        return value.substring(
            0,
            10
        );

    }


    // Try normal date
    const parsed =
        new Date(value);


    if (
        !isNaN(
            parsed.getTime()
        )
    ) {

        const year =
            parsed.getFullYear();


        const month =
            String(
                parsed.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                parsed.getDate()
            ).padStart(2, "0");


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    return "";

}


function getDateOnly(date) {

    if (!date) return "";


    const value =
        String(date);


    if (
        /^\d{4}-\d{2}-\d{2}/.test(
            value
        )
    ) {

        return value.substring(
            0,
            10
        );

    }


    return getInputDate(
        value
    );

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(
        value ?? ""
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
