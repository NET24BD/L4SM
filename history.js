"use strict";


/* =====================================================
   HISTORY API
===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let historyData = [];

let currentRow = null;

let filterVisible = false;


/* =====================================================
   AUTH PROTECTION
===================================================== */

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
     * Browser Back Button OFF
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
        function () {

            if (
                localStorage.getItem("auth")
                !== "true"
            ) {

                window.location.replace(
                    "login.html"
                );

            }

        }
    );

})();


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadHistory();

        setupSearch();

        setupDateFilters();

    }
);


/* =====================================================
   PROFILE
===================================================== */

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


/* =====================================================
   PROFILE MENU
===================================================== */

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


function myAccount() {

    window.location.href =
        "my-account.html";

}


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
        "deviceId"
    );

    sessionStorage.clear();


    window.location.replace(
        "login.html"
    );

}


/* =====================================================
   BACK BUTTON
===================================================== */

function goBack() {

    /*
     * Back button intentionally disabled.
     */

    return false;

}


/* =====================================================
   FILTER TOGGLE
===================================================== */

function toggleFilter() {

    const filterBar =
        document.getElementById(
            "filterBar"
        );


    if (!filterBar) {

        return;

    }


    filterVisible =
        !filterVisible;


    if (filterVisible) {

        filterBar.classList.add(
            "show"
        );

    }

    else {

        filterBar.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   LOAD HISTORY
===================================================== */

function loadHistory() {

    const list =
        document.getElementById(
            "historyList"
        );


    if (list) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="7"
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
                "HISTORY RESPONSE:",
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


            renderHistory(
                historyData
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
                            colspan="7"
                            style="
                                text-align:center;
                                padding:35px;
                                color:#ef4444;
                            "
                        >

                            <i class="fa fa-triangle-exclamation"></i>

                            Failed to load History

                        </td>

                    </tr>

                `;

            }

        }
    );

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory(data) {

    const list =
        document.getElementById(
            "historyList"
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
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >

                    <i class="fa fa-clock-rotate-left"></i>

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
                            getCustomerId(item)
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            getProblem(item)
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            getReference(item)
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            formatDate(
                                getDate(item)
                            )
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            getSupport(item)
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            getSupportWork(item)
                        )}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="view-btn"
                            onclick="viewHistory(${Number(item.row)})"
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


/* =====================================================
   SEARCH SETUP
===================================================== */

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
        searchHistory
    );

}


/* =====================================================
   SEARCH HISTORY
===================================================== */

function searchHistory() {

    const search =
        document.getElementById(
            "historySearch"
        );


    if (!search) {

        return;

    }


    const keyword =
        search.value
            .trim()
            .toLowerCase();


    if (!keyword) {

        renderHistory(
            historyData
        );

        return;

    }


    const result =
        historyData.filter(
            function (item) {

                const values = [

                    getCustomerId(item),

                    getProblem(item),

                    getReference(item),

                    getDate(item),

                    getSupport(item),

                    getSupportWork(item),

                    getCall(item),

                    getCallWork(item),

                    getStatus(item),

                    getUsername(item),

                    getName(item),

                    getRole(item),

                    getFrom(item),

                    getTo(item)

                ];


                return values.some(
                    function (value) {

                        return String(
                            value || ""
                        )
                        .toLowerCase()
                        .includes(
                            keyword
                        );

                    }
                );

            }
        );


    if (
        result.length === 0
    ) {

        const list =
            document.getElementById(
                "historyList"
            );


        if (list) {

            list.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="
                            text-align:center;
                            padding:35px;
                            color:#64748b;
                        "
                    >

                        No matching history found

                    </td>

                </tr>

            `;

        }

        return;

    }


    renderHistory(
        result
    );

}


/* =====================================================
   DATE FILTER SETUP
===================================================== */

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
            applyDateFilter
        );

    }


    if (toDate) {

        toDate.addEventListener(
            "change",
            applyDateFilter
        );

    }

}


/* =====================================================
   APPLY DATE FILTER
===================================================== */

function applyDateFilter() {

    const fromInput =
        document.getElementById(
            "fromDate"
        );


    const toInput =
        document.getElementById(
            "toDate"
        );


    const fromDate =
        fromInput
            ? fromInput.value
            : "";


    const toDate =
        toInput
            ? toInput.value
            : "";


    const search =
        document.getElementById(
            "historySearch"
        );


    const keyword =
        search
            ? search.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        historyData.filter(
            function (item) {

                const itemDate =
                    convertDate(
                        getDate(item)
                    );


                if (!itemDate) {

                    return false;

                }


                if (
                    fromDate &&
                    itemDate < fromDate
                ) {

                    return false;

                }


                if (
                    toDate &&
                    itemDate > toDate
                ) {

                    return false;

                }


                if (keyword) {

                    const values = [

                        getCustomerId(item),

                        getProblem(item),

                        getReference(item),

                        getSupport(item),

                        getSupportWork(item),

                        getCall(item),

                        getCallWork(item),

                        getStatus(item),

                        getUsername(item),

                        getName(item),

                        getRole(item)

                    ];


                    const matched =
                        values.some(
                            function (value) {

                                return String(
                                    value || ""
                                )
                                .toLowerCase()
                                .includes(
                                    keyword
                                );

                            }
                        );


                    if (!matched) {

                        return false;

                    }

                }


                return true;

            }
        );


    renderHistory(
        filtered
    );

}


/* =====================================================
   RESET FILTER
===================================================== */

function resetFilter() {

    const fromDate =
        document.getElementById(
            "fromDate"
        );


    const toDate =
        document.getElementById(
            "toDate"
        );


    const search =
        document.getElementById(
            "historySearch"
        );


    if (fromDate) {

        fromDate.value =
            "";

    }


    if (toDate) {

        toDate.value =
            "";

    }


    if (search) {

        search.value =
            "";

    }


    renderHistory(
        historyData
    );

}


/* =====================================================
   VIEW HISTORY
===================================================== */

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

        showError(
            "History record not found."
        );

        currentRow =
            null;

        return;

    }


    console.log(
        "VIEW RECORD:",
        item
    );


    /* ================================================
       CUSTOMER INFORMATION
    ================================================ */

    setValue(
        "customerId",
        getCustomerId(item)
    );


    setValue(
        "problem",
        getProblem(item)
    );


    setValue(
        "reference",
        getReference(item)
    );


    setValue(
        "date",
        formatDate(
            getDate(item)
        )
    );


    /* ================================================
       FROM / TO
    ================================================ */

    setValue(
        "from",
        getFrom(item)
    );


    setValue(
        "to",
        getTo(item)
    );


    /* ================================================
       SUPPORT
    ================================================ */

    setValue(
        "support",
        getSupport(item)
    );


    setValue(
        "supportWork",
        getSupportWork(item)
    );


    setValue(
        "supportTime",
        getSupportTime(item)
    );


    /* ================================================
       CALL
    ================================================ */

    setValue(
        "call",
        getCall(item)
    );


    setValue(
        "callWork",
        getCallWork(item)
    );


    setValue(
        "callTime",
        getCallTime(item)
    );


    /* ================================================
       OTHER
    ================================================ */

    setValue(
        "status",
        getStatus(item)
    );


    setValue(
        "historyUsername",
        getUsername(item)
    );


    setValue(
        "name",
        getName(item)
    );


    setValue(
        "role",
        getRole(item)
    );


    /* ================================================
       OPEN POPUP
    ================================================ */

    const modal =
        document.getElementById(
            "historyModal"
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


/* =====================================================
   CLOSE HISTORY POPUP
===================================================== */

function closeHistory() {

    const modal =
        document.getElementById(
            "historyModal"
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


/* =====================================================
   SET VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    if (
        value === null ||
        value === undefined
    ) {

        element.value =
            "";

        return;

    }


    element.value =
        String(value);

}


/* =====================================================
   DATA FIELD HELPERS
===================================================== */

function getCustomerId(item) {

    return (
        item.customerId ??
        item.customerID ??
        item.CustomerID ??
        item.customer ??
        item.Customer ??
        ""
    );

}


function getProblem(item) {

    return (
        item.problem ??
        item.Problem ??
        item.issue ??
        item.Issue ??
        ""
    );

}


function getReference(item) {

    return (
        item.reference ??
        item.Reference ??
        item.ref ??
        item.Ref ??
        ""
    );

}


function getDate(item) {

    return (
        item.date ??
        item.Date ??
        item.entryDate ??
        item.EntryDate ??
        item.createdDate ??
        item.CreatedDate ??
        ""
    );

}


function getFrom(item) {

    return (
        item.from ??
        item.From ??
        item.fromDate ??
        item.FromDate ??
        item.startDate ??
        item.StartDate ??
        item.start ??
        item.Start ??
        ""
    );

}


function getTo(item) {

    return (
        item.to ??
        item.To ??
        item.toDate ??
        item.ToDate ??
        item.endDate ??
        item.EndDate ??
        item.end ??
        item.End ??
        ""
    );

}


function getSupport(item) {

    return (
        item.support ??
        item.Support ??
        ""
    );

}


function getSupportWork(item) {

    return (
        item.supportWork ??
        item.SupportWork ??
        item.support_work ??
        item.Support_Work ??
        ""
    );

}


function getSupportTime(item) {

    return (
        item.supportTime ??
        item.SupportTime ??
        item.support_time ??
        ""
    );

}


function getCall(item) {

    return (
        item.call ??
        item.Call ??
        ""
    );

}


function getCallWork(item) {

    return (
        item.callWork ??
        item.CallWork ??
        item.call_work ??
        item.Call_Work ??
        ""
    );

}


function getCallTime(item) {

    return (
        item.callTime ??
        item.CallTime ??
        item.call_time ??
        ""
    );

}


function getStatus(item) {

    return (
        item.status ??
        item.Status ??
        ""
    );

}


function getUsername(item) {

    return (
        item.username ??
        item.Username ??
        item.user ??
        item.User ??
        ""
    );

}


function getName(item) {

    return (
        item.name ??
        item.Name ??
        ""
    );

}


function getRole(item) {

    return (
        item.role ??
        item.Role ??
        ""
    );

}


/* =====================================================
   DATE CONVERT
===================================================== */

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


/* =====================================================
   FORMAT DATE
===================================================== */

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


/* =====================================================
   ESCAPE HTML
===================================================== */

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


/* =====================================================
   ERROR POPUP
===================================================== */

function showError(message) {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    const messageElement =
        document.getElementById(
            "errorMessage"
        );


    if (messageElement) {

        messageElement.textContent =
            message ||
            "Something went wrong.";

    }


    if (popup) {

        popup.classList.add(
            "show"
        );

    }

}


/* =====================================================
   CLOSE ERROR
===================================================== */

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


/* =====================================================
   PROFILE OUTSIDE CLICK
===================================================== */

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


/* =====================================================
   MODAL OUTSIDE CLICK
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "historyModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeHistory();

        }


        const errorPopup =
            document.getElementById(
                "errorPopup"
            );


        if (
            errorPopup &&
            event.target === errorPopup
        ) {

            closeErrorPopup();

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeHistory();

        closeErrorPopup();

    }
);


/* =====================================================
   END HISTORY.JS
===================================================== */
