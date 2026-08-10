/* =====================================================
   HISTORY.JS
===================================================== */


/* =====================================================
   DATA
===================================================== */

let historyData = [

    {
        customerId: "ABMB020",
        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",
        reference: "Shemanto",
        date: "2026-08-01",
        support: "Shemanto",
        supportWork: "ONU Change"
    },

    {
        customerId: "AHSR073",
        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",
        reference: "Shemanto",
        date: "2026-08-04",
        support: "Shemanto",
        supportWork: "ONU Change"
    },

    {
        customerId: "ABMB028",
        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",
        reference: "Shemanto",
        date: "2026-08-07",
        support: "Shemanto",
        supportWork: "ONU Change"
    },

    {
        customerId: "ABMB031",
        problem: "ইন্টারনেট কানেকশন চেক করতে হবে",
        reference: "Shemanto",
        date: "2026-08-08",
        support: "Shemanto",
        supportWork: "ONU Check"
    },

    {
        customerId: "ABMB045",
        problem: "Router সমস্যা",
        reference: "Rahim",
        date: "2026-08-09",
        support: "Rahim",
        supportWork: "Router Reset"
    },

    {
        customerId: "ABMB052",
        problem: "Internet slow",
        reference: "Karim",
        date: "2026-08-10",
        support: "Karim",
        supportWork: "Line Check"
    },

    {
        customerId: "ABMB067",
        problem: "ONU Power সমস্যা",
        reference: "Shemanto",
        date: "2026-08-11",
        support: "Shemanto",
        supportWork: "ONU Replace"
    },

    {
        customerId: "ABMB074",
        problem: "Fiber cable সমস্যা",
        reference: "Rahim",
        date: "2026-08-12",
        support: "Rahim",
        supportWork: "Fiber Repair"
    },

    {
        customerId: "ABMB081",
        problem: "WiFi connection সমস্যা",
        reference: "Karim",
        date: "2026-08-13",
        support: "Karim",
        supportWork: "Router Check"
    },

    {
        customerId: "ABMB093",
        problem: "No internet connection",
        reference: "Shemanto",
        date: "2026-08-14",
        support: "Shemanto",
        supportWork: "Line Check"
    },

    {
        customerId: "ABMB101",
        problem: "ONU signal low",
        reference: "Rahim",
        date: "2026-08-15",
        support: "Rahim",
        supportWork: "Optical Check"
    }

];


/* =====================================================
   SETTINGS
===================================================== */

const ITEMS_PER_PAGE = 10;

let currentPage = 1;

let filteredHistory = [];

let currentEditIndex = null;


/* =====================================================
   ELEMENTS
===================================================== */

const historyList =
    document.getElementById(
        "historyList"
    );

const historySearch =
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

const pagination =
    document.getElementById(
        "pagination"
    );

const editPopup =
    document.getElementById(
        "editPopup"
    );

const profileMenu =
    document.getElementById(
        "profileMenu"
    );

const profileImg =
    document.getElementById(
        "profileImg"
    );

const username =
    document.getElementById(
        "username"
    );


/* =====================================================
   USER
===================================================== */

function loadLoggedInUser() {

    let user = null;


    try {

        const savedUser =
            localStorage.getItem(
                "loggedInUser"
            );


        if (savedUser) {

            user =
                JSON.parse(
                    savedUser
                );

        }

    }

    catch (error) {

        console.error(
            "User data error:",
            error
        );

    }


    /*
     * Fallback for existing login system
     */

    if (!user) {

        user = {

            userId:
                localStorage.getItem(
                    "username"
                ) || "",

            username:
                localStorage.getItem(
                    "username"
                ) || "",

            name:
                localStorage.getItem(
                    "name"
                ) || "",

            role:
                localStorage.getItem(
                    "role"
                ) || "",

            profileImage:
                localStorage.getItem(
                    "picture"
                ) || ""

        };

    }


    const userName =
        user.name ||
        user.username ||
        user.userId ||
        "User";


    let userPicture =
        user.profileImage ||
        user.picture ||
        localStorage.getItem(
            "picture"
        ) ||
        "assets/profile.png";


    if (
        !userPicture ||
        String(userPicture).trim() === ""
    ) {

        userPicture =
            "assets/profile.png";

    }


    if (username) {

        username.textContent =
            userName;

    }


    if (profileImg) {

        profileImg.src =
            userPicture;


        profileImg.onerror =
            function () {

                this.onerror =
                    null;

                this.src =
                    "assets/profile.png";

            };

    }


    console.log(
        "CURRENT USER:",
        user
    );

}


/* =====================================================
   FILTER TOGGLE
===================================================== */

function toggleHistoryFilter() {

    const filter =
        document.getElementById(
            "historyFilter"
        );

    const button =
        document.getElementById(
            "historyFilterBtn"
        );


    if (!filter) {

        return;

    }


    filter.classList.toggle(
        "show"
    );


    if (
        filter.classList.contains(
            "show"
        )
    ) {

        if (button) {

            button.classList.add(
                "active"
            );

        }

    }

    else {

        if (button) {

            button.classList.remove(
                "active"
            );

        }

    }

}


/* =====================================================
   LOAD HISTORY
===================================================== */

function loadHistory() {

    applyFilters();

}


/* =====================================================
   APPLY FILTER
===================================================== */

function applyFilters() {

    const searchText =
        historySearch
            ? historySearch.value
                .trim()
                .toLowerCase()
            : "";


    const from =
        fromDate && fromDate.value
            ? parseHistoryDate(
                fromDate.value
            )
            : null;


    const to =
        toDate && toDate.value
            ? parseHistoryDate(
                toDate.value
            )
            : null;


    if (
        from &&
        to &&
        from > to
    ) {

        showError(
            "Invalid Date",
            "From date cannot be greater than To date."
        );

        return;

    }


    filteredHistory =
        historyData.filter(
            function (item) {

                const customerId =
                    String(
                        item.customerId || ""
                    ).toLowerCase();


                const problem =
                    String(
                        item.problem || ""
                    ).toLowerCase();


                const reference =
                    String(
                        item.reference || ""
                    ).toLowerCase();


                const support =
                    String(
                        item.support || ""
                    ).toLowerCase();


                const supportWork =
                    String(
                        item.supportWork || ""
                    ).toLowerCase();


                const matchesSearch =

                    customerId.includes(
                        searchText
                    )

                    ||

                    problem.includes(
                        searchText
                    )

                    ||

                    reference.includes(
                        searchText
                    )

                    ||

                    support.includes(
                        searchText
                    )

                    ||

                    supportWork.includes(
                        searchText
                    );


                if (!matchesSearch) {

                    return false;

                }


                const itemDate =
                    parseHistoryDate(
                        item.date
                    );


                if (!itemDate) {

                    return false;

                }


                if (
                    from &&
                    itemDate < from
                ) {

                    return false;

                }


                if (to) {

                    const endDate =
                        new Date(
                            to
                        );


                    endDate.setHours(
                        23,
                        59,
                        59,
                        999
                    );


                    if (
                        itemDate > endDate
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    currentPage = 1;

    renderPage();

}


/* =====================================================
   RENDER
===================================================== */

function renderPage() {

    if (!historyList) {

        return;

    }


    historyList.innerHTML =
        "";


    const totalPages =
        Math.ceil(
            filteredHistory.length /
            ITEMS_PER_PAGE
        );


    if (
        totalPages > 0 &&
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    const startIndex =
        (
            currentPage - 1
        ) *
        ITEMS_PER_PAGE;


    const endIndex =
        startIndex +
        ITEMS_PER_PAGE;


    const pageData =
        filteredHistory.slice(
            startIndex,
            endIndex
        );


    if (
        pageData.length === 0
    ) {

        historyList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-cell"
                >

                    No history found.

                </td>

            </tr>

        `;


        renderPagination();

        return;

    }


    pageData.forEach(
        function (item) {

            const originalIndex =
                historyData.indexOf(
                    item
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

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
                        onclick="viewHistory(${originalIndex})"
                    >

                        <i class="fa fa-eye"></i>

                        View

                    </button>

                </td>

            `;


            historyList.appendChild(
                row
            );

        }
    );


    renderPagination();

}


/* =====================================================
   PAGINATION
===================================================== */

function renderPagination() {

    if (!pagination) {

        return;

    }


    pagination.innerHTML =
        "";


    const totalItems =
        filteredHistory.length;


    const totalPages =
        Math.ceil(
            totalItems /
            ITEMS_PER_PAGE
        );


    if (
        totalPages <= 1
    ) {

        return;

    }


    /*
     * Previous
     */

    const previous =
        document.createElement(
            "button"
        );


    previous.type =
        "button";


    previous.className =
        "page-btn";


    previous.innerHTML =
        '<i class="fa fa-angle-left"></i>';


    previous.disabled =
        currentPage === 1;


    previous.onclick =
        function () {

            if (
                currentPage > 1
            ) {

                currentPage--;

                renderPage();

            }

        };


    pagination.appendChild(
        previous
    );


    /*
     * Pages
     */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "page-btn";


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.textContent =
            page;


        button.onclick =
            function () {

                currentPage =
                    page;

                renderPage();

            };


        pagination.appendChild(
            button
        );

    }


    /*
     * Next
     */

    const next =
        document.createElement(
            "button"
        );


    next.type =
        "button";


    next.className =
        "page-btn";


    next.innerHTML =
        '<i class="fa fa-angle-right"></i>';


    next.disabled =
        currentPage === totalPages;


    next.onclick =
        function () {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderPage();

            }

        };


    pagination.appendChild(
        next
    );


    /*
     * Info
     */

    const info =
        document.createElement(
            "span"
        );


    info.className =
        "page-info";


    const start =
        (
            currentPage - 1
        ) *
        ITEMS_PER_PAGE +
        1;


    const end =
        Math.min(
            currentPage *
            ITEMS_PER_PAGE,
            totalItems
        );


    info.textContent =
        `${start}-${end} of ${totalItems}`;


    pagination.appendChild(
        info
    );

}


/* =====================================================
   CLEAR FILTER
===================================================== */

function clearFilters() {

    if (historySearch) {

        historySearch.value =
            "";

    }


    if (fromDate) {

        fromDate.value =
            "";

    }


    if (toDate) {

        toDate.value =
            "";

    }


    currentPage =
        1;


    applyFilters();

}


/* =====================================================
   VIEW
===================================================== */

function viewHistory(index) {

    const item =
        historyData[index];


    if (!item) {

        showError(
            "Error",
            "History information was not found."
        );

        return;

    }


    currentEditIndex =
        index;


    document.getElementById(
        "editIndex"
    ).value =
        index;


    document.getElementById(
        "customerId"
    ).value =
        item.customerId || "";


    document.getElementById(
        "problem"
    ).value =
        item.problem || "";


    document.getElementById(
        "reference"
    ).value =
        item.reference || "";


    document.getElementById(
        "date"
    ).value =
        item.date || "";


    document.getElementById(
        "support"
    ).value =
        item.support || "";


    document.getElementById(
        "supportWork"
    ).value =
        item.supportWork || "";


    editPopup.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   UPDATE
===================================================== */

function updateHistory() {

    if (
        currentEditIndex === null
    ) {

        return;

    }


    const customerId =
        document.getElementById(
            "customerId"
        ).value.trim();


    const problem =
        document.getElementById(
            "problem"
        ).value.trim();


    const reference =
        document.getElementById(
            "reference"
        ).value.trim();


    const date =
        document.getElementById(
            "date"
        ).value;


    const support =
        document.getElementById(
            "support"
        ).value.trim();


    const supportWork =
        document.getElementById(
            "supportWork"
        ).value.trim();


    if (!customerId) {

        showError(
            "Missing Information",
            "Customer ID is required."
        );

        return;

    }


    if (!problem) {

        showError(
            "Missing Information",
            "Problem is required."
        );

        return;

    }


    if (!reference) {

        showError(
            "Missing Information",
            "Reference is required."
        );

        return;

    }


    if (!date) {

        showError(
            "Missing Information",
            "Date is required."
        );

        return;

    }


    historyData[
        currentEditIndex
    ] = {

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


    closeEdit();

    applyFilters();


    showSuccess(
        "Updated Successfully",
        "History information has been updated successfully."
    );


    currentEditIndex =
        null;

}


/* =====================================================
   DELETE ASK
===================================================== */

function askDelete() {

    if (
        currentEditIndex === null
    ) {

        return;

    }


    const item =
        historyData[
            currentEditIndex
        ];


    if (item) {

        document.getElementById(
            "confirmMessage"
        ).textContent =
            `Are you sure you want to delete ${item.customerId}?`;

    }


    document
        .getElementById(
            "confirmPopup"
        )
        .classList.add(
            "show"
        );

}


/* =====================================================
   DELETE CONFIRM
===================================================== */

function confirmDelete() {

    if (
        currentEditIndex === null
    ) {

        return;

    }


    historyData.splice(
        currentEditIndex,
        1
    );


    currentEditIndex =
        null;


    closeConfirmPopup();

    closeEdit();

    applyFilters();


    showSuccess(
        "Deleted Successfully",
        "History has been deleted successfully."
    );

}


/* =====================================================
   CLOSE EDIT
===================================================== */

function closeEdit() {

    if (editPopup) {

        editPopup.classList.remove(
            "show"
        );

    }


    document.body.style.overflow =
        "";

}


/* =====================================================
   CONFIRM CLOSE
===================================================== */

function closeConfirmPopup() {

    document
        .getElementById(
            "confirmPopup"
        )
        .classList.remove(
            "show"
        );

}


/* =====================================================
   SUCCESS
===================================================== */

function showSuccess(
    title,
    message
) {

    document.getElementById(
        "successTitle"
    ).textContent =
        title;


    document.getElementById(
        "successMessage"
    ).textContent =
        message;


    document
        .getElementById(
            "successPopup"
        )
        .classList.add(
            "show"
        );

}


/* =====================================================
   CLOSE SUCCESS
===================================================== */

function closeSuccessPopup() {

    document
        .getElementById(
            "successPopup"
        )
        .classList.remove(
            "show"
        );

}


/* =====================================================
   ERROR
===================================================== */

function showError(
    title,
    message
) {

    document.getElementById(
        "errorTitle"
    ).textContent =
        title;


    document.getElementById(
        "errorMessage"
    ).textContent =
        message;


    document
        .getElementById(
            "errorPopup"
        )
        .classList.add(
            "show"
        );

}


/* =====================================================
   CLOSE ERROR
===================================================== */

function closeErrorPopup() {

    document
        .getElementById(
            "errorPopup"
        )
        .classList.remove(
            "show"
        );

}


/* =====================================================
   PROFILE
===================================================== */

function toggleProfile() {

    if (!profileMenu) {

        return;

    }


    profileMenu.classList.toggle(
        "show"
    );

}


/* =====================================================
   OUTSIDE CLICK
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const profile =
            document.querySelector(
                ".profile"
            );


        if (
            profile &&
            !profile.contains(
                event.target
            )
        ) {

            if (profileMenu) {

                profileMenu.classList.remove(
                    "show"
                );

            }

        }

    }
);


/* =====================================================
   MY ACCOUNT
===================================================== */

function myAccount() {

    if (profileMenu) {

        profileMenu.classList.remove(
            "show"
        );

    }


    // আপনার account page থাকলে এখানে দিন:
    // window.location.href = "account.html";

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "auth"
    );

    localStorage.removeItem(
        "isLogin"
    );

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "name"
    );

    localStorage.removeItem(
        "role"
    );

    localStorage.removeItem(
        "picture"
    );

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "lastActivity"
    );


    window.location.href =
        "login.html";

}


/* =====================================================
   BACK
===================================================== */

function goBack() {

    window.location.href =
        "dashboard.html";

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(
    dateString
) {

    const date =
        parseHistoryDate(
            dateString
        );


    if (!date) {

        return dateString || "";

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
            date.getDate()
        ).padStart(
            2,
            "0"
        )

        +

        " "

        +

        months[
            date.getMonth()
        ]

        +

        " "

        +

        date.getFullYear()

    );

}


/* =====================================================
   DATE PARSER
===================================================== */

function parseHistoryDate(
    dateString
) {

    if (!dateString) {

        return null;

    }


    const parts =
        String(
            dateString
        ).split("-");


    if (
        parts.length === 3
    ) {

        return new Date(

            Number(
                parts[0]
            ),

            Number(
                parts[1]
            ) - 1,

            Number(
                parts[2]
            )

        );

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

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


/* =====================================================
   SEARCH
===================================================== */

if (historySearch) {

    historySearch.addEventListener(
        "input",
        function () {

            applyFilters();

        }
    );

}


/* =====================================================
   FROM DATE
===================================================== */

if (fromDate) {

    fromDate.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}


/* =====================================================
   TO DATE
===================================================== */

if (toDate) {

    toDate.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}


/* =====================================================
   EDIT BACKDROP
===================================================== */

if (editPopup) {

    editPopup.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                editPopup
            ) {

                closeEdit();

            }

        }
    );

}


/* =====================================================
   CONFIRM BACKDROP
===================================================== */

const confirmPopup =
    document.getElementById(
        "confirmPopup"
    );


if (confirmPopup) {

    confirmPopup.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                confirmPopup
            ) {

                closeConfirmPopup();

            }

        }
    );

}


/* =====================================================
   SUCCESS BACKDROP
===================================================== */

const successPopup =
    document.getElementById(
        "successPopup"
    );


if (successPopup) {

    successPopup.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                successPopup
            ) {

                closeSuccessPopup();

            }

        }
    );

}


/* =====================================================
   ERROR BACKDROP
===================================================== */

const errorPopup =
    document.getElementById(
        "errorPopup"
    );


if (errorPopup) {

    errorPopup.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                errorPopup
            ) {

                closeErrorPopup();

            }

        }
    );

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeEdit();

            closeConfirmPopup();

            closeSuccessPopup();

            closeErrorPopup();


            if (profileMenu) {

                profileMenu.classList.remove(
                    "show"
                );

            }

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLoggedInUser();

        loadHistory();

    }
);
