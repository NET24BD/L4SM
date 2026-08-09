"use strict";


/* =========================================================
   GOOGLE APPS SCRIPT API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let historyData = [];

let filteredHistory = [];

let currentHistoryRow = null;


/* =========================================================
   AUTH CHECK
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
       IMPORTANT:

       Back button is intentionally disabled.

       Clicking browser back should NOT send
       the user to dashboard or another page.
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
                "searchHistory"
            );


        if (search) {

            search.addEventListener(
                "input",
                applyLocalFilter
            );

        }


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
                applyLocalFilter
            );

        }


        if (toDate) {

            toDate.addEventListener(
                "change",
                applyLocalFilter
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
   TOGGLE PROFILE
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


    localStorage.removeItem(
        "deviceToken"
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
       BACK BUTTON COMPLETELY DISABLED.

       Do NOT use history.back().
       Do NOT redirect to dashboard.
    */

    return false;

}


/* =========================================================
   FILTER TOGGLE
========================================================= */

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

                    <i class="fa fa-clock-rotate-left"></i>

                    No History Found

                </td>

            </tr>

        `;

        return;

    }


    let html = "";


    data.forEach(
        function (item, index) {

            const row =
                item.row ??
                item.rowNumber ??
                item.id ??
                index;


            html += `

                <tr>

                    <td>

                        ${escapeHTML(
                            getItemValue(
                                item,
                                [
                                    "customerId",
                                    "Customer ID",
                                    "customer_id",
                                    "customerID"
                                ]
                            )
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            getItemValue(
                                item,
                                [
                                    "problem",
                                    "Problem"
                                ]
                            )
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            getItemValue(
                                item,
                                [
                                    "reference",
                                    "Reference"
                                ]
                            )
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            formatDate(
                                getItemValue(
                                    item,
                                    [
                                        "date",
                                        "Date"
                                    ]
                                )
                            )
                        )}

                    </td>


                    <td>

                        <button
                            type="button"
                            class="view-btn"
                            onclick="viewHistory(${JSON.stringify(String(row))})"
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

function viewHistory(row) {

    const rowNumber =
        String(row);


    let item =
        historyData.find(
            function (history) {

                return String(
                    history.row ??
                    history.rowNumber ??
                    history.id ??
                    ""
                ) === rowNumber;

            }
        );


    /*
       If row cannot be matched,
       try numeric comparison.
    */

    if (!item) {

        item =
            historyData.find(
                function (history) {

                    return Number(
                        history.row
                    ) === Number(
                        rowNumber
                    );

                }
            );

    }


    if (!item) {

        showErrorPopup(
            "History record not found.",
            "Error"
        );

        return;

    }


    currentHistoryRow =
        item;


    /*
       BASIC INFORMATION
    */

    setValue(
        "viewCustomerId",
        getItemValue(
            item,
            [
                "customerId",
                "Customer ID",
                "customer_id",
                "customerID"
            ]
        )
    );


    setValue(
        "viewProblem",
        getItemValue(
            item,
            [
                "problem",
                "Problem"
            ]
        )
    );


    setValue(
        "viewReference",
        getItemValue(
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
            getItemValue(
                item,
                [
                    "date",
                    "Date"
                ]
            )
        )
    );


    /*
       SUPPORT INFORMATION
    */

    setValue(
        "viewSupport",
        getItemValue(
            item,
            [
                "support",
                "Support"
            ]
        )
    );


    setValue(
        "viewSupportWork",
        getItemValue(
            item,
            [
                "supportWork",
                "Support Work",
                "support_work"
            ]
        )
    );


    /*
       CALL INFORMATION
    */

    setValue(
        "viewCall",
        getItemValue(
            item,
            [
                "call",
                "Call"
            ]
        )
    );


    setValue(
        "viewCallWork",
        getItemValue(
            item,
            [
                "callWork",
                "Call Work",
                "call_work"
            ]
        )
    );


    /*
       OTHER INFORMATION
    */

    renderOtherInformation(
        item
    );


    /*
       OPEN MODAL
    */

    const modal =
        document.getElementById(
            "historyModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   RENDER OTHER INFORMATION
========================================================= */

function renderOtherInformation(item) {

    const container =
        document.getElementById(
            "otherInformation"
        );


    const section =
        document.getElementById(
            "otherInformationSection"
        );


    if (
        !container ||
        !section
    ) {

        return;

    }


    container.innerHTML =
        "";


    /*
       These are already shown
       in dedicated sections.
    */

    const hiddenKeys = [

        "customerId",
        "Customer ID",
        "customer_id",
        "customerID",

        "problem",
        "Problem",

        "reference",
        "Reference",

        "date",
        "Date",

        "support",
        "Support",

        "supportWork",
        "Support Work",
        "support_work",

        "call",
        "Call",

        "callWork",
        "Call Work",
        "call_work",

        "row",
        "rowNumber",
        "id"

    ];


    let foundOther =
        false;


    Object.keys(item).forEach(
        function (key) {

            if (
                hiddenKeys.includes(
                    key
                )
            ) {

                return;

            }


            const value =
                item[key];


            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {

                return;

            }


            foundOther =
                true;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "other-info-item";


            div.innerHTML = `

                <div
                    class="other-info-label"
                >

                    ${escapeHTML(
                        prettifyKey(
                            key
                        )
                    )}

                </div>


                <div
                    class="other-info-value"
                >

                    ${escapeHTML(
                        String(value)
                    )}

                </div>

            `;


            container.appendChild(
                div
            );

        }
    );


    /*
       Hide "Other Information"
       if there is nothing else.
    */

    if (foundOther) {

        section.style.display =
            "";

    }

    else {

        section.style.display =
            "none";

    }

}


/* =========================================================
   PRETTIFY KEY
========================================================= */

function prettifyKey(key) {

    return String(key)

        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )

        .replace(
            /_/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim()

        .replace(
            /^./,
            function (char) {

                return char.toUpperCase();

            }
        );

}


/* =========================================================
   GET ITEM VALUE
========================================================= */

function getItemValue(
    item,
    keys
) {

    if (!item) {

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
                item,
                key
            )
        ) {

            const value =
                item[key];


            if (
                value !== null &&
                value !== undefined
            ) {

                return String(
                    value
                );

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
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.value =
        value || "";

}


/* =========================================================
   CLOSE HISTORY POPUP
========================================================= */

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


    currentHistoryRow =
        null;

}


/* =========================================================
   APPLY FILTER
========================================================= */

function applyLocalFilter() {

    const searchInput =
        document.getElementById(
            "searchHistory"
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
                    getItemValue(
                        item,
                        [
                            "customerId",
                            "Customer ID",
                            "customer_id",
                            "customerID"
                        ]
                    ).toLowerCase();


                const problem =
                    getItemValue(
                        item,
                        [
                            "problem",
                            "Problem"
                        ]
                    ).toLowerCase();


                const reference =
                    getItemValue(
                        item,
                        [
                            "reference",
                            "Reference"
                        ]
                    ).toLowerCase();


                const dateValue =
                    getItemValue(
                        item,
                        [
                            "date",
                            "Date"
                        ]
                    );


                const formattedDate =
                    formatDate(
                        dateValue
                    ).toLowerCase();


                /*
                   SEARCH
                */

                const matchesSearch =

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

                    formattedDate.includes(
                        keyword
                    )

                    ||

                    dateValue
                        .toLowerCase()
                        .includes(
                            keyword
                        );


                /*
                   DATE FILTER
                */

                const recordDate =
                    getComparableDate(
                        dateValue
                    );


                let matchesFrom =
                    true;


                let matchesTo =
                    true;


                if (
                    fromDate &&
                    recordDate
                ) {

                    matchesFrom =
                        recordDate >=
                        fromDate;

                }


                if (
                    toDate &&
                    recordDate
                ) {

                    matchesTo =
                        recordDate <=
                        toDate;

                }


                return (

                    matchesSearch &&

                    matchesFrom &&

                    matchesTo

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
            "searchHistory"
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


    filteredHistory =
        [...historyData];


    renderHistory(
        filteredHistory
    );

}


/* =========================================================
   DATE TO YYYY-MM-DD
========================================================= */

function getComparableDate(date) {

    if (!date) {

        return "";

    }


    const text =
        String(date)
            .trim();


    /*
       Already YYYY-MM-DD
    */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        return text;

    }


    /*
       DD-MM-YYYY
    */

    let match =
        text.match(
            /^(\d{2})-(\d{2})-(\d{4})$/
        );


    if (match) {

        return (

            match[3] +
            "-" +
            match[2] +
            "-" +
            match[1]

        );

    }


    /*
       DD/MM/YYYY
    */

    match =
        text.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );


    if (match) {

        return (

            match[3] +
            "-" +
            match[2] +
            "-" +
            match[1]

        );

    }


    const date =
        new Date(text);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return (

        date.getFullYear() +

        "-" +

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        "-" +

        String(
            date.getDate()
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


    const text =
        String(date)
            .trim();


    /*
       YYYY-MM-DD
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


    /*
       DD-MM-YYYY
    */

    let match =
        text.match(
            /^(\d{2})-(\d{2})-(\d{4})$/
        );


    if (match) {

        return (

            match[1] +
            " " +
            getMonthName(
                Number(
                    match[2]
                )
            ) +
            " " +
            match[3]

        );

    }


    /*
       DD/MM/YYYY
    */

    match =
        text.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );


    if (match) {

        return (

            match[1] +
            " " +
            getMonthName(
                Number(
                    match[2]
                )
            ) +
            " " +
            match[3]

        );

    }


    const d =
        new Date(text);


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
        ).padStart(
            2,
            "0"
        )

        +

        " "

        +

        getMonthName(
            d.getMonth() + 1
        )

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
        months[
            Number(month) - 1
        ] || ""
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
   CLOSE PROFILE WHEN CLICK OUTSIDE
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

    }
);


/* =========================================================
   CLOSE HISTORY MODAL
   WHEN CLICKING OUTSIDE
========================================================= */

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

    }
);


/* =========================================================
   CLOSE ERROR POPUP
   WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const popup =
            document.getElementById(
                "errorPopup"
            );


        if (
            popup &&
            event.target === popup
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


        closeHistory();

        closeErrorPopup();

    }
);


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

        /*
           Fallback if popup is not
           available in HTML.
        */

        alert(
            message ||
            "Something went wrong."
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
   CLOSE ERROR POPUP
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
   END HISTORY.JS
========================================================= */
