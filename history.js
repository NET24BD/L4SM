"use strict";

/* =========================================================
   HISTORY.JS
   L4SM SUPPORT SYSTEM
   ========================================================= */


/* =========================================================
   API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


/* =========================================================
   GLOBAL
========================================================= */

let historyData = [];

let filteredData = [];

let currentRow = null;

let currentPage = 1;

const rowsPerPage = 10;


/* =========================================================
   AUTH
========================================================= */

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


    /*
     * BACK BUTTON COMPLETELY DISABLED
     *
     * Browser back করলে History page থেকে
     * অন্য page-এ যাওয়ার চেষ্টা আটকানো হবে।
     */

    history.pushState(
        null,
        "",
        location.href
    );


    window.addEventListener(
        "popstate",
        function () {

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


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadHistory();


        const search =
            document.getElementById(
                "historySearch"
            );


        if (search) {

            search.addEventListener(
                "input",
                searchHistory
            );

        }

    }
);


/* =========================================================
   PROFILE
========================================================= */

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


/* =========================================================
   PROFILE TOGGLE
========================================================= */

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


/* =========================================================
   MY ACCOUNT
========================================================= */

function myAccount() {

    window.location.href =
        "my-account.html";

}


/* =========================================================
   LOGOUT
========================================================= */

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


/* =========================================================
   BACK BUTTON
========================================================= */

function goBack() {

    /*
     * Intentionally disabled.
     *
     * Back button click করলে কিছুই হবে না।
     */

    return false;

}


/* =========================================================
   FILTER TOGGLE
========================================================= */

function toggleFilter() {

    const filter =
        document.getElementById(
            "filterPanel"
        );


    if (!filter) {

        return;
    }


    filter.classList.toggle(
        "show"
    );

}


/* =========================================================
   LOAD HISTORY
========================================================= */

function loadHistory() {

    const list =
        document.getElementById(
            "historyList"
        );


    if (list) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading-cell"
                >

                    <i class="fa fa-spinner fa-spin"></i>

                    Loading History...

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


            filteredData =
                historyData.slice();


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


            if (list) {

                list.innerHTML = `

                    <tr>

                        <td
                            colspan="6"
                            style="
                                text-align:center;
                                padding:40px;
                                color:#dc2626;
                            "
                        >

                            <i class="fa fa-circle-exclamation"></i>

                            Failed to load history

                        </td>

                    </tr>

                `;

            }

        }
    );

}


/* =========================================================
   RENDER HISTORY
========================================================= */

function renderHistory() {

    const list =
        document.getElementById(
            "historyList"
        );


    if (!list) {

        return;
    }


    if (
        !filteredData ||
        filteredData.length === 0
    ) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-cell"
                >

                    <i class="fa fa-clock-rotate-left"></i>

                    No History Found

                </td>

            </tr>

        `;


        renderPagination();

        return;
    }


    const totalPages =
        Math.ceil(
            filteredData.length /
            rowsPerPage
        );


    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;

    }


    const start =
        (
            currentPage -
            1
        ) *
        rowsPerPage;


    const end =
        start +
        rowsPerPage;


    const pageData =
        filteredData.slice(
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


                    <td
                        class="problem-cell"
                        title="${escapeHTML(
                            item.problem
                        )}"
                    >

                        ${escapeHTML(
                            item.problem
                        )}

                    </td>


                    <td
                        class="reference-cell"
                        title="${escapeHTML(
                            item.reference
                        )}"
                    >

                        ${escapeHTML(
                            item.reference
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            item.date
                        )}

                    </td>


                    <td
                        class="support-cell"
                        title="${escapeHTML(
                            item.support
                        )}"
                    >

                        ${escapeHTML(
                            item.support
                        )}

                    </td>


                    <td
                        class="support-work-cell"
                        title="${escapeHTML(
                            item.supportWork
                        )}"
                    >

                        ${escapeHTML(
                            item.supportWork
                        )}

                    </td>


                    <td>

                        <button
                            type="button"
                            class="view-btn"
                            onclick="viewHistory(${Number(
                                item.row
                            )})"
                        >

                            <i class="fa fa-eye"></i>

                            View

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    list.innerHTML =
        html;


    renderPagination();

}


/* =========================================================
   SEARCH HISTORY
========================================================= */

function searchHistory() {

    const input =
        document.getElementById(
            "historySearch"
        );


    if (!input) {

        return;
    }


    const keyword =
        input.value
            .trim()
            .toLowerCase();


    if (!keyword) {

        filteredData =
            historyData.slice();

        currentPage =
            1;

        renderHistory();

        return;
    }


    filteredData =
        historyData.filter(
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


                const support =
                    String(
                        item.support ||
                        ""
                    ).toLowerCase();


                const supportWork =
                    String(
                        item.supportWork ||
                        ""
                    ).toLowerCase();


                const call =
                    String(
                        item.call ||
                        ""
                    ).toLowerCase();


                const callWork =
                    String(
                        item.callWork ||
                        ""
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

                    ||

                    support.includes(
                        keyword
                    )

                    ||

                    supportWork.includes(
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

                );

            }
        );


    currentPage =
        1;


    renderHistory();

}


/* =========================================================
   VIEW / EDIT HISTORY
========================================================= */

function viewHistory(row) {

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


    setValue(
        "supportTime",
        item.supportTime
    );


    setValue(
        "call",
        item.call
    );


    setValue(
        "callWork",
        item.callWork
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

}


/* =========================================================
   SET VALUE
========================================================= */

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


/* =========================================================
   GET VALUE
========================================================= */

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


/* =========================================================
   CLOSE EDIT
========================================================= */

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


/* =========================================================
   UPDATE HISTORY
========================================================= */

function updateHistory() {

    if (!currentRow) {

        showErrorPopup(
            "Please select a history record.",
            "Error"
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


    const supportTime =
        getValue(
            "supportTime"
        );


    const call =
        getValue(
            "call"
        );


    const callWork =
        getValue(
            "callWork"
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


    if (!call) {

        showErrorPopup(
            "Call is required.",
            "Required"
        );

        return;
    }


    if (!callWork) {

        showErrorPopup(
            "Call Work is required.",
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
            '<i class="fa fa-spinner fa-spin"></i> Saving...';

    }


    /*
     * IMPORTANT
     *
     * History row-কে update করার জন্য
     * Apps Script-এ updateHistory action
     * থাকতে হবে।
     */

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
                    supportWork,

                supportTime:
                    supportTime,

                call:
                    call,

                callWork:
                    callWork

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


            /*
             * Local data update
             */

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
                        supportWork,

                    supportTime:
                        supportTime,

                    call:
                        call,

                    callWork:
                        callWork

                };

            }


            filteredData =
                historyData.slice();


            const search =
                document.getElementById(
                    "historySearch"
                );


            if (
                search &&
                search.value.trim() !== ""
            ) {

                searchHistory();

            }
            else {

                renderHistory();

            }


            closeEdit();


            showSuccessPopup(
                "History updated successfully.",
                "Update Successful"
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
                "History update failed.",
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
                    '<i class="fa fa-save"></i> Submit';

            }

        }
    );

}


/* =========================================================
   DELETE HISTORY
========================================================= */

function deleteHistory() {

    if (!currentRow) {

        showErrorPopup(
            "Please select a history record.",
            "Error"
        );

        return;
    }


    showConfirmPopup(
        "Are you sure you want to delete this history record?",
        function () {

            performDeleteHistory();

        },
        "Delete History"
    );

}


/* =========================================================
   PERFORM DELETE
========================================================= */

function performDeleteHistory() {

    const row =
        Number(
            currentRow
        );


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


            filteredData =
                filteredData.filter(
                    function (item) {

                        return Number(
                            item.row
                        ) !== row;

                    }
                );


            closeConfirmPopup();

            closeEdit();


            renderHistory();


            showSuccessPopup(
                "History deleted successfully.",
                "Deleted"
            );


            /*
             * Reload data after delete
             * because Google Sheet row numbers
             * may have shifted.
             */

            setTimeout(
                function () {

                    loadHistory();

                },
                500
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
                "Delete failed.",
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
                    "Confirm";

            }

        }
    );

}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    const container =
        document.getElementById(
            "pagination"
        );


    if (!container) {

        return;
    }


    const totalPages =
        Math.ceil(
            filteredData.length /
            rowsPerPage
        );


    if (
        totalPages <= 1
    ) {

        container.innerHTML =
            "";

        return;
    }


    let html = "";


    html += `

        <button
            type="button"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(${currentPage - 1})"
        >

            <i class="fa fa-chevron-left"></i>

        </button>

    `;


    /*
     * Page numbers
     */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        html += `

            <button
                type="button"
                class="${
                    page === currentPage
                        ? "active"
                        : ""
                }"
                onclick="changePage(${page})"
            >

                ${page}

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

            <i class="fa fa-chevron-right"></i>

        </button>

    `;


    container.innerHTML =
        html;

}


/* =========================================================
   CHANGE PAGE
========================================================= */

function changePage(page) {

    const totalPages =
        Math.ceil(
            filteredData.length /
            rowsPerPage
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


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) {

        return "";
    }


    const text =
        String(
            date
        );


    /*
     * yyyy-MM-dd
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        const parts =
            text.split("-");


        return (
            parts[2] +
            " " +
            getMonthName(
                Number(
                    parts[1]
                )
            ) +
            " " +
            parts[0]
        );

    }


    const d =
        new Date(
            date
        );


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


/* =========================================================
   MONTH NAME
========================================================= */

function getMonthName(
    month
) {

    const months = [

        "",
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
        months[month] ||
        ""
    );

}


/* =========================================================
   CONVERT DATE
========================================================= */

function convertDate(date) {

    if (!date) {

        return "";
    }


    const text =
        String(
            date
        );


    /*
     * Already yyyy-MM-dd
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        return text;
    }


    const d =
        new Date(
            date
        );


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return "";
    }


    return (

        d.getFullYear()

        +

        "-"

        +

        String(
            d.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

        +

        "-"

        +

        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        )

    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(
        value
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
   CONFIRM POPUP
========================================================= */

let confirmCallback =
    null;


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


/* =========================================================
   CLOSE CONFIRM
========================================================= */

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


/* =========================================================
   SUCCESS POPUP
========================================================= */

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


/* =========================================================
   CLOSE SUCCESS
========================================================= */

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


/* =========================================================
   ERROR POPUP
========================================================= */

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


/* =========================================================
   CLOSE ERROR
========================================================= */

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


/* =========================================================
   OUTSIDE CLICK
========================================================= */

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


/* =========================================================
   ESCAPE KEY
========================================================= */

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
