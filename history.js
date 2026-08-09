"use strict";

/* =========================================================
   HISTORY.JS
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


let historyData = [];
let filteredHistory = [];


/* =========================================================
   AUTH CHECK
========================================================= */

(function checkAuthentication() {

    const auth =
        localStorage.getItem("auth");

    if (auth !== "true") {

        window.location.replace("login.html");

        return;

    }

})();


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadHistory();

        setupSearch();

        setupDateFilters();

    }
);


/* =========================================================
   PROFILE
========================================================= */

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


    if (profileImg) {

        if (
            picture &&
            picture.trim() !== ""
        ) {

            profileImg.src =
                picture;

        } else {

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
   PROFILE MENU
========================================================= */

function toggleProfile() {

    const menu =
        document.getElementById("profileMenu");


    if (!menu) {

        return;

    }


    menu.classList.toggle("show");

}


document.addEventListener(
    "click",
    function (event) {

        const profile =
            document.querySelector(".profile");

        const menu =
            document.getElementById("profileMenu");


        if (
            profile &&
            menu &&
            !profile.contains(event.target)
        ) {

            menu.classList.remove("show");

        }

    }
);


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

    localStorage.removeItem("auth");

    localStorage.removeItem("username");

    localStorage.removeItem("picture");

    localStorage.removeItem("role");

    localStorage.removeItem("deviceToken");

    sessionStorage.clear();


    window.location.replace(
        "login.html"
    );

}


/* =========================================================
   FILTER TOGGLE
========================================================= */

function toggleFilter() {

    const filterBar =
        document.getElementById("filterBar");


    if (!filterBar) {

        return;

    }


    filterBar.classList.toggle("show");

}


/* =========================================================
   LOAD HISTORY
========================================================= */

function loadHistory() {

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
                Array.isArray(data.data)
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
                            class="error-cell"
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

function renderHistory(data) {

    const list =
        document.getElementById("historyList");


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
                    class="empty-cell"
                >

                    <i class="fa fa-folder-open"></i>

                    No History Found

                </td>

            </tr>

        `;

        return;

    }


    let html = "";


    data.forEach(
        function (item, index) {

            const customerId =
                getField(
                    item,
                    [
                        "customerId",
                        "customerID",
                        "Customer ID",
                        "CustomerId"
                    ]
                );


            const problem =
                getField(
                    item,
                    [
                        "problem",
                        "Problem"
                    ]
                );


            const reference =
                getField(
                    item,
                    [
                        "reference",
                        "Reference"
                    ]
                );


            const date =
                getField(
                    item,
                    [
                        "date",
                        "Date",
                        "datetime",
                        "DateTime"
                    ]
                );


            html += `

                <tr>

                    <td>
                        ${escapeHTML(customerId)}
                    </td>


                    <td>
                        ${escapeHTML(problem)}
                    </td>


                    <td>
                        ${escapeHTML(reference)}
                    </td>


                    <td>
                        ${escapeHTML(
                            formatDate(date)
                        )}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="view-btn"
                            onclick="viewHistory(${index})"
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

}


/* =========================================================
   VIEW HISTORY
========================================================= */

function viewHistory(index) {

    const item =
        filteredHistory[index];


    if (!item) {

        showError(
            "History record not found."
        );

        return;

    }


    /* MAIN INFORMATION */

    setValue(
        "viewCustomerId",
        getField(
            item,
            [
                "customerId",
                "customerID",
                "Customer ID",
                "CustomerId"
            ]
        )
    );


    setValue(
        "viewProblem",
        getField(
            item,
            [
                "problem",
                "Problem"
            ]
        )
    );


    setValue(
        "viewReference",
        getField(
            item,
            [
                "reference",
                "Reference"
            ]
        )
    );


    setValue(
        "viewDate",
        formatDate(
            getField(
                item,
                [
                    "date",
                    "Date",
                    "datetime",
                    "DateTime"
                ]
            )
        )
    );


    /* =====================================================
       OTHER INFORMATION
    ===================================================== */

    setValue(
        "viewSupport",
        getField(
            item,
            [
                "support",
                "Support"
            ]
        )
    );


    setValue(
        "viewSupportWork",
        getField(
            item,
            [
                "supportWork",
                "Support Work",
                "supportwork"
            ]
        )
    );


    setValue(
        "viewCall",
        getField(
            item,
            [
                "call",
                "Call"
            ]
        )
    );


    setValue(
        "viewCallWork",
        getField(
            item,
            [
                "callWork",
                "Call Work",
                "callwork"
            ]
        )
    );


    /* EXTRA POSSIBLE FIELDS */

    setValue(
        "viewName",
        getField(
            item,
            [
                "name",
                "Name"
            ]
        )
    );


    setValue(
        "viewNumber",
        getField(
            item,
            [
                "number",
                "Number",
                "phone",
                "Phone"
            ]
        )
    );


    setValue(
        "viewStatus",
        getField(
            item,
            [
                "status",
                "Status"
            ]
        )
    );


    setValue(
        "viewCreatedBy",
        getField(
            item,
            [
                "createdBy",
                "Created By",
                "user",
                "User"
            ]
        )
    );


    /* OPEN POPUP */

    const popup =
        document.getElementById("viewModal");


    if (popup) {

        popup.classList.add("show");

    }

}


/* =========================================================
   CLOSE VIEW POPUP
========================================================= */

function closeView() {

    const popup =
        document.getElementById("viewModal");


    if (popup) {

        popup.classList.remove("show");

    }

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        document.getElementById("searchHistory");


    if (!search) {

        return;

    }


    search.addEventListener(
        "input",
        applyHistoryFilter
    );

}


/* =========================================================
   DATE FILTERS
========================================================= */

function setupDateFilters() {

    const fromDate =
        document.getElementById("fromDate");

    const toDate =
        document.getElementById("toDate");


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


/* =========================================================
   AUTO FILTER
========================================================= */

function applyHistoryFilter() {

    const search =
        document.getElementById("searchHistory");

    const fromDate =
        document.getElementById("fromDate");

    const toDate =
        document.getElementById("toDate");


    const keyword =
        search
            ? search.value
                .trim()
                .toLowerCase()
            : "";


    const from =
        fromDate
            ? fromDate.value
            : "";


    const to =
        toDate
            ? toDate.value
            : "";


    filteredHistory =
        historyData.filter(
            function (item) {

                const customerId =
                    String(
                        getField(
                            item,
                            [
                                "customerId",
                                "customerID",
                                "Customer ID",
                                "CustomerId"
                            ]
                        )
                    ).toLowerCase();


                const problem =
                    String(
                        getField(
                            item,
                            [
                                "problem",
                                "Problem"
                            ]
                        )
                    ).toLowerCase();


                const reference =
                    String(
                        getField(
                            item,
                            [
                                "reference",
                                "Reference"
                            ]
                        )
                    ).toLowerCase();


                const support =
                    String(
                        getField(
                            item,
                            [
                                "support",
                                "Support"
                            ]
                        )
                    ).toLowerCase();


                const supportWork =
                    String(
                        getField(
                            item,
                            [
                                "supportWork",
                                "Support Work",
                                "supportwork"
                            ]
                        )
                    ).toLowerCase();


                const call =
                    String(
                        getField(
                            item,
                            [
                                "call",
                                "Call"
                            ]
                        )
                    ).toLowerCase();


                const callWork =
                    String(
                        getField(
                            item,
                            [
                                "callWork",
                                "Call Work",
                                "callwork"
                            ]
                        )
                    ).toLowerCase();


                const rawDate =
                    getField(
                        item,
                        [
                            "date",
                            "Date",
                            "datetime",
                            "DateTime"
                        ]
                    );


                const dateValue =
                    convertDate(
                        rawDate
                    );


                /* SEARCH */

                const searchMatch =
                    !keyword ||

                    customerId.includes(
                        keyword
                    ) ||

                    problem.includes(
                        keyword
                    ) ||

                    reference.includes(
                        keyword
                    ) ||

                    support.includes(
                        keyword
                    ) ||

                    supportWork.includes(
                        keyword
                    ) ||

                    call.includes(
                        keyword
                    ) ||

                    callWork.includes(
                        keyword
                    );


                /* FROM DATE */

                const fromMatch =
                    !from ||
                    !dateValue ||
                    dateValue >= from;


                /* TO DATE */

                const toMatch =
                    !to ||
                    !dateValue ||
                    dateValue <= to;


                return (
                    searchMatch &&
                    fromMatch &&
                    toMatch
                );

            }
        );


    renderHistory(
        filteredHistory
    );

}


/* =========================================================
   RESET FILTER
========================================================= */

function resetFilter() {

    const search =
        document.getElementById("searchHistory");

    const fromDate =
        document.getElementById("fromDate");

    const toDate =
        document.getElementById("toDate");


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


/* =========================================================
   GENERIC FIELD READER
========================================================= */

function getField(
    object,
    keys
) {

    if (
        !object ||
        typeof object !== "object"
    ) {

        return "";

    }


    for (
        let i = 0;
        i < keys.length;
        i++
    ) {

        const key =
            keys[i];


        if (
            Object.prototype.hasOwnProperty.call(
                object,
                key
            )
        ) {

            const value =
                object[key];


            if (
                value !== null &&
                value !== undefined
            ) {

                return String(value);

            }

        }

    }


    return "";

}


/* =========================================================
   SET VALUE
========================================================= */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.value =
        value || "";

}


/* =========================================================
   DATE CONVERT
========================================================= */

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


/* =========================================================
   FORMAT DATE
========================================================= */

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
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showError(message) {

    const popup =
        document.getElementById("errorPopup");


    const title =
        document.getElementById("errorTitle");


    const text =
        document.getElementById("errorMessage");


    if (!popup) {

        alert(message);

        return;

    }


    if (title) {

        title.textContent =
            "Error";

    }


    if (text) {

        text.textContent =
            message;

    }


    popup.classList.add("show");

}


/* =========================================================
   CLOSE ERROR
========================================================= */

function closeErrorPopup() {

    const popup =
        document.getElementById("errorPopup");


    if (popup) {

        popup.classList.remove("show");

    }

}


/* =========================================================
   MODAL BACKDROP CLOSE
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const viewModal =
            document.getElementById("viewModal");


        const errorPopup =
            document.getElementById("errorPopup");


        if (
            viewModal &&
            event.target === viewModal
        ) {

            closeView();

        }


        if (
            errorPopup &&
            event.target === errorPopup
        ) {

            closeErrorPopup();

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeView();

        closeErrorPopup();


        const filterBar =
            document.getElementById("filterBar");


        if (
            filterBar &&
            filterBar.classList.contains("show")
        ) {

            filterBar.classList.remove("show");

        }

    }
);


/* =========================================================
   BACK BUTTON DISABLED
   Clicking Back will do NOTHING.
========================================================= */

function goBack() {

    return false;

}
