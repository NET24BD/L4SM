"use strict";


/* =================================================
   API
================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


/* =================================================
   GLOBAL VARIABLES
================================================= */

let historyData = [];

let filteredHistory = [];

let currentRow = null;


/* =================================================
   AUTH PROTECTION
================================================= */

(function protectPage() {

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
     * Back button থেকে dashboard-এ যাওয়ার
     * কোনো custom connection রাখা হয়নি।
     *
     * Browser history naturally কাজ করবে।
     *
     * তবে logout হয়ে গেলে protected page
     * পুনরায় দেখা যাবে না।
     */

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


/* =================================================
   PAGE LOAD
================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadHistory();


        /* FILTER INPUT */

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

            fromDate.addEventListener(
                "change",
                applyFilter
            );

        }


        if (toDate) {

            toDate.addEventListener(
                "change",
                applyFilter
            );

        }


        if (search) {

            search.addEventListener(
                "input",
                applyFilter
            );

        }

    }
);


/* =================================================
   PROFILE
================================================= */

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


/* =================================================
   PROFILE TOGGLE
================================================= */

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


/* =================================================
   HISTORY FILTER TOGGLE
================================================= */

function toggleFilter() {

    const filter =
        document.getElementById(
            "filterContainer"
        );


    if (!filter) {
        return;
    }


    filter.classList.toggle(
        "show"
    );

}


/* =================================================
   MY ACCOUNT
================================================= */

function myAccount() {

    window.location.href =
        "my-account.html";

}


/* =================================================
   LOGOUT
================================================= */

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


/* =================================================
   BACK BUTTON
   NO CONNECTION
================================================= */

function goBack() {

    /*
     * Back button intentionally disabled.
     *
     * Clicking it will do NOTHING.
     */

    return false;

}


/* =================================================
   LOAD HISTORY
================================================= */

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
                            colspan="7"
                            style="
                                text-align:center;
                                padding:35px;
                                color:#ef4444;
                            "
                        >

                            Failed to load history

                        </td>

                    </tr>

                `;

            }

        }
    );

}


/* =================================================
   RENDER HISTORY
================================================= */

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

}


/* =================================================
   FILTER
================================================= */

function applyFilter() {

    const fromInput =
        document.getElementById(
            "fromDate"
        );


    const toInput =
        document.getElementById(
            "toDate"
        );


    const searchInput =
        document.getElementById(
            "searchHistory"
        );


    const fromDate =
        fromInput
            ? fromInput.value
            : "";


    const toDate =
        toInput
            ? toInput.value
            : "";


    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    filteredHistory =
        historyData.filter(
            function (item) {

                let itemDate =
                    convertDate(
                        item.date
                    );


                /*
                 * DATE FILTER
                 */

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


                /*
                 * SEARCH FILTER
                 */

                if (keyword) {

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


                    const date =
                        String(
                            item.date ||
                            ""
                        ).toLowerCase();


                    const formattedDate =
                        formatDate(
                            item.date
                        ).toLowerCase();


                    const matched =

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

                        date.includes(
                            keyword
                        )

                        ||

                        formattedDate.includes(
                            keyword
                        );


                    if (!matched) {

                        return false;

                    }

                }


                return true;

            }
        );


    renderHistory(
        filteredHistory
    );

}


/* =================================================
   RESET FILTER
================================================= */

function resetFilter() {

    const fromInput =
        document.getElementById(
            "fromDate"
        );


    const toInput =
        document.getElementById(
            "toDate"
        );


    const searchInput =
        document.getElementById(
            "searchHistory"
        );


    if (fromInput) {

        fromInput.value =
            "";

    }


    if (toInput) {

        toInput.value =
            "";

    }


    if (searchInput) {

        searchInput.value =
            "";

    }


    filteredHistory =
        [...historyData];


    renderHistory(
        filteredHistory
    );

}


/* =================================================
   VIEW HISTORY
================================================= */

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

        showMessage(
            "Error",
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


    /*
     * History data should normally be readonly.
     */

    makeReadOnlyFields();


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


/* =================================================
   READONLY FIELDS
================================================= */

function makeReadOnlyFields() {

    const ids = [

        "customerId",

        "problem",

        "reference",

        "date",

        "support",

        "supportWork",

        "call",

        "callWork"

    ];


    ids.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.readOnly =
                    true;

            }

        }
    );

}


/* =================================================
   SET VALUE
================================================= */

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


/* =================================================
   GET VALUE
================================================= */

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


/* =================================================
   CLOSE EDIT
================================================= */

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


/* =================================================
   MESSAGE POPUP
================================================= */

function showMessage(
    title,
    message
) {

    const overlay =
        document.getElementById(
            "messageOverlay"
        );


    const titleElement =
        document.getElementById(
            "messageTitle"
        );


    const textElement =
        document.getElementById(
            "messageText"
        );


    if (!overlay) {
        return;
    }


    if (titleElement) {

        titleElement.textContent =
            title || "Message";

    }


    if (textElement) {

        textElement.textContent =
            message || "Done";

    }


    overlay.classList.add(
        "show"
    );

}


/* =================================================
   CLOSE MESSAGE
================================================= */

function closeMessage() {

    const overlay =
        document.getElementById(
            "messageOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }

}


/* =================================================
   CLOSE POPUP WHEN CLICK OUTSIDE
================================================= */

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


        const messageOverlay =
            document.getElementById(
                "messageOverlay"
            );


        if (
            messageOverlay &&
            event.target ===
                messageOverlay
        ) {

            closeMessage();

        }

    }
);


/* =================================================
   ESCAPE KEY
================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeMessage();


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


/* =================================================
   DATE CONVERT
================================================= */

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


/* =================================================
   FORMAT DATE
================================================= */

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


/* =================================================
   ESCAPE HTML
================================================= */

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


/* =================================================
   AUTO REFRESH
================================================= */

function refreshHistory() {

    loadHistory();

}


/* =================================================
   END HISTORY.JS
================================================= */
