// =====================================
// HISTORY.JS
// L4SM SUPPORT SYSTEM
// FINAL VERSION
// =====================================

"use strict";


// =====================================
// CONFIG
// =====================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================
// GLOBAL VARIABLES
// =====================================

let historyData = [];

let filteredHistory = [];

let currentRow = null;


// =====================================
// AUTH CHECK
// =====================================

(function checkAuth() {

    const auth =
        localStorage.getItem("auth");

    if (auth !== "true") {

        window.location.replace(
            "login.html"
        );

        return;

    }

})();


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadHistory();

        setupSearch();

        setupFilterInputs();

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
        "my-account.html";

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

    localStorage.removeItem(
        "token"
    );

    sessionStorage.clear();


    window.location.replace(
        "login.html"
    );

}


// =====================================
// FILTER TOGGLE
// =====================================

function toggleFilter() {

    const filterBar =
        document.getElementById(
            "filterBar"
        );


    if (!filterBar) {

        return;

    }


    filterBar.classList.toggle(
        "show"
    );

}


// =====================================
// LOAD HISTORY
// =====================================

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
                    "Unable to load History."

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


            renderHistory(
                filteredHistory
            );

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
                            colspan="5"
                            style="
                                text-align:center;
                                padding:35px;
                                color:#ef4444;
                            "
                        >

                            <i
                                class="fa fa-circle-exclamation"
                            ></i>

                            Failed to load History

                        </td>

                    </tr>

                `;

            }

        }
    );

}


// =====================================
// RENDER HISTORY
// =====================================

function renderHistory(data) {

    const list =
        document.getElementById(
            "historyList"
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

                    <i
                        class="fa fa-folder-open"
                    ></i>

                    No History Found

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
                            class="view-btn"
                            onclick="viewHistory(${Number(item.row)})"
                        >

                            <i
                                class="fa fa-eye"
                            ></i>

                            View

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
// SEARCH SETUP
// =====================================

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
        applyHistoryFilter
    );

}


// =====================================
// FILTER INPUT SETUP
// =====================================

function setupFilterInputs() {

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
            applyHistoryFilter
        );

    }


    if (toDate) {

        toDate.addEventListener(
            "change",
            applyHistoryFilter
        );

    }

}


// =====================================
// APPLY FILTER
// =====================================

function applyFilter() {

    applyHistoryFilter();

}


// =====================================
// HISTORY FILTER
// =====================================

function applyHistoryFilter() {

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


    const keyword =
        search
            ? search.value
                .trim()
                .toLowerCase()
            : "";


    const fromValue =
        fromDate
            ? fromDate.value
            : "";


    const toValue =
        toDate
            ? toDate.value
            : "";


    filteredHistory =
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


                const rawDate =
                    normalizeDate(
                        item.date
                    );


                const formattedDate =
                    formatDate(
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

                    call.includes(
                        keyword
                    )

                    ||

                    callWork.includes(
                        keyword
                    )

                    ||

                    formattedDate.includes(
                        keyword
                    );


                let dateMatch = true;


                if (
                    fromValue
                ) {

                    dateMatch =
                        rawDate >=
                        fromValue;

                }


                if (
                    toValue &&
                    dateMatch
                ) {

                    dateMatch =
                        rawDate <=
                        toValue;

                }


                return (
                    searchMatch &&
                    dateMatch
                );

            }
        );


    renderHistory(
        filteredHistory
    );

}


// =====================================
// RESET FILTER
// =====================================

function resetFilter() {

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


    renderHistory(
        filteredHistory
    );

}


// =====================================
// VIEW HISTORY
// =====================================

function viewHistory(row) {

    currentRow =
        Number(row);


    const item =
        historyData.find(
            function (history) {

                return Number(
                    history.row
                ) ===
                currentRow;

            }
        );


    if (!item) {

        showError(
            "History record not found."
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


// =====================================
// UPDATE HISTORY
// =====================================

function updateHistory() {

    if (!currentRow) {

        showError(
            "Please select a History record."
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


    const call =
        getValue(
            "call"
        );


    const callWork =
        getValue(
            "callWork"
        );


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


    if (!call) {

        showError(
            "Call is required."
        );

        return;

    }


    if (!callWork) {

        showError(
            "Call Work is required."
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


            const index =
                historyData.findIndex(
                    function (item) {

                        return Number(
                            item.row
                        ) ===
                        Number(
                            currentRow
                        );

                    }
                );


            if (
                index !== -1
            ) {

                historyData[index] = {

                    ...historyData[index],

                    customerId:
                        customerId,

                    problem:
                        problem,

                    reference:
                        reference,

                    date:
                        data.date ||
                        date,

                    support:
                        support,

                    supportWork:
                        supportWork,

                    call:
                        call,

                    callWork:
                        callWork

                };

            }


            filteredHistory =
                [...historyData];


            applyHistoryFilter();


            closeEdit();


            showSuccess(
                "History updated successfully."
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "UPDATE HISTORY ERROR:",
                error
            );


            showError(

                error.message ||
                "History update failed."

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


// =====================================
// CLOSE EDIT POPUP
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
// FORMAT DATE
// =====================================

function formatDate(date) {

    if (!date) {

        return "";

    }


    const text =
        String(date);


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


// =====================================
// CONVERT DATE FOR INPUT
// =====================================

function convertDate(date) {

    if (!date) {

        return "";

    }


    const text =
        String(date);


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


// =====================================
// NORMALIZE DATE
// =====================================

function normalizeDate(date) {

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
// SUCCESS POPUP
// =====================================

function showSuccess(message) {

    const popup =
        document.getElementById(
            "successPopup"
        );


    const messageElement =
        document.getElementById(
            "successMessage"
        );


    if (!popup) {

        return;

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

function showError(message) {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    const messageElement =
        document.getElementById(
            "errorMessage"
        );


    if (!popup) {

        alert(
            message ||
            "Something went wrong."
        );

        return;

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
// OUTSIDE CLICK
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
// MODAL OUTSIDE CLICK
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
            event.target ===
            modal
        ) {

            closeEdit();

        }

    }
);


// =====================================
// POPUP OUTSIDE CLICK
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const successPopup =
            document.getElementById(
                "successPopup"
            );


        const errorPopup =
            document.getElementById(
                "errorPopup"
            );


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


// =====================================
// END HISTORY.JS
// =====================================
