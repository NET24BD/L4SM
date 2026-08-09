"use strict";

/* =====================================================
   HISTORY SYSTEM
   ===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


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
     * Back button disabled.
     * History page থেকে Dashboard বা
     * আগের page-এ যাওয়ার জন্য browser back
     * ব্যবহার করা যাবে না।
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

/*
 * IMPORTANT:
 * History page-এর Back button থাকলে
 * কোনো page-এ যাবে না।
 */

function goBack() {

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


            renderHistory(
                historyData
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "HISTORY ERROR:",
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
        !data ||
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

                        ${escapeHTML(
                            item.support
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            item.supportWork
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
   SEARCH
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
   DATE FILTER
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


    if (
        !fromDate &&
        !toDate
    ) {

        renderHistory(
            historyData
        );

        return;

    }


    const filtered =
        historyData.filter(
            function (item) {

                const itemDate =
                    convertDate(
                        item.date
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

    const fromInput =
        document.getElementById(
            "fromDate"
        );


    const toInput =
        document.getElementById(
            "toDate"
        );


    const search =
        document.getElementById(
            "historySearch"
        );


    if (fromInput) {

        fromInput.value =
            "";

    }


    if (toInput) {

        toInput.value =
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
            "historyModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =====================================================
   CLOSE HISTORY
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


    if (element) {

        element.value =
            value || "";

    }

}


/* =====================================================
   CONVERT DATE
   ===================================================== */

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

        return String(
            date
        );

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
   ERROR
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
   CLICK OUTSIDE PROFILE
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
   CLICK OUTSIDE HISTORY MODAL
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

    }
);


/* =====================================================
   CLICK OUTSIDE ERROR
   ===================================================== */

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


/* =====================================================
   ESCAPE KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeErrorPopup();

        closeHistory();

    }
);


/* =====================================================
   END HISTORY.JS
   ===================================================== */
