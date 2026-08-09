/* =====================================================
   HISTORY.JS
   ===================================================== */


/* =====================================================
   1. HISTORY DATA
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
   2. PAGINATION SETTINGS
   ===================================================== */

const ITEMS_PER_PAGE = 10;

let currentPage = 1;

let filteredHistory = [];

let currentEditIndex = null;


/* =====================================================
   3. GET HTML ELEMENTS
   ===================================================== */

const historyList =
    document.getElementById("historyList");


const historySearch =
    document.getElementById("historySearch");


const fromDate =
    document.getElementById("fromDate");


const toDate =
    document.getElementById("toDate");


const pagination =
    document.getElementById("pagination");


const editPopup =
    document.getElementById("editPopup");


const profileMenu =
    document.getElementById("profileMenu");


const profileImg =
    document.getElementById("profileImg");


const username =
    document.getElementById("username");


/* =====================================================
   4. LOAD LOGGED-IN USER
   ===================================================== */

function loadLoggedInUser() {

    try {

        const savedUser =
            localStorage.getItem(
                "loggedInUser"
            );


        if (!savedUser) {

            setDefaultUser();

            return;

        }


        const user =
            JSON.parse(savedUser);


        /*
         * Supported names:
         *
         * username
         * name
         * userName
         * fullName
         */

        const userName =
            user.username ||
            user.name ||
            user.userName ||
            user.fullName ||
            user.userId ||
            "User";


        /*
         * Supported image names:
         *
         * profileImage
         * profileImg
         * image
         * photo
         */

        const userImage =
            user.profileImage ||
            user.profileImg ||
            user.image ||
            user.photo ||
            "assets/profile.png";


        username.textContent =
            userName;


        profileImg.src =
            userImage;


        profileImg.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "assets/profile.png";

            };


    } catch (error) {

        console.error(
            "User loading error:",
            error
        );


        setDefaultUser();

    }

}


/* =====================================================
   5. DEFAULT USER
   ===================================================== */

function setDefaultUser() {

    username.textContent =
        "User";


    profileImg.src =
        "assets/profile.png";

}


/* =====================================================
   6. LOAD HISTORY
   ===================================================== */

function loadHistory() {

    applyFilters();

}


/* =====================================================
   7. APPLY SEARCH + DATE FILTER
   ===================================================== */

function applyFilters() {

    const searchText =
        historySearch.value
            .trim()
            .toLowerCase();


    const from =
        fromDate.value
            ? parseHistoryDate(
                fromDate.value
            )
            : null;


    const to =
        toDate.value
            ? parseHistoryDate(
                toDate.value
            )
            : null;


    /*
     * Check date
     */

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


                /*
                 * SEARCH
                 */

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


                /*
                 * DATE
                 */

                const itemDate =
                    parseHistoryDate(
                        item.date
                    );


                if (!itemDate) {

                    return false;

                }


                /*
                 * FROM DATE
                 */

                if (
                    from &&
                    itemDate < from
                ) {

                    return false;

                }


                /*
                 * TO DATE
                 */

                if (to) {

                    const endDate =
                        new Date(to);


                    endDate.setHours(
                        23,
                        59,
                        59,
                        999
                    );


                    if (
                        itemDate >
                        endDate
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    /*
     * Reset page
     */

    currentPage = 1;


    renderPage();

}


/* =====================================================
   8. RENDER PAGE
   ===================================================== */

function renderPage() {

    historyList.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredHistory.length /
            ITEMS_PER_PAGE
        );


    /*
     * Fix current page
     */

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


    /*
     * No data
     */

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


    /*
     * Render data
     */

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


                <td class="problem-cell"
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
   9. PAGINATION
   ===================================================== */

function renderPagination() {

    pagination.innerHTML = "";


    const totalItems =
        filteredHistory.length;


    const totalPages =
        Math.ceil(
            totalItems /
            ITEMS_PER_PAGE
        );


    /*
     * No pagination needed
     */

    if (
        totalPages <= 1
    ) {

        return;

    }


    /*
     * PREVIOUS
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

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        };


    pagination.appendChild(
        previous
    );


    /*
     * PAGE NUMBERS
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


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            };


        pagination.appendChild(
            button
        );

    }


    /*
     * NEXT
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

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        };


    pagination.appendChild(
        next
    );


    /*
     * RECORD INFO
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
   10. CLEAR FILTER
   ===================================================== */

function clearFilters() {

    historySearch.value =
        "";


    fromDate.value =
        "";


    toDate.value =
        "";


    currentPage =
        1;


    applyFilters();

}


/* =====================================================
   11. VIEW / EDIT HISTORY
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
   12. UPDATE HISTORY
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


    /*
     * VALIDATION
     */

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


    /*
     * UPDATE DATA
     */

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


    /*
     * CLOSE EDIT
     */

    closeEdit();


    /*
     * REFRESH TABLE
     */

    applyFilters();


    /*
     * SUCCESS
     */

    showSuccess(
        "Updated Successfully",
        "History information has been updated successfully."
    );


    currentEditIndex =
        null;

}


/* =====================================================
   13. ASK DELETE
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
   14. CONFIRM DELETE
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
   15. CLOSE EDIT
   ===================================================== */

function closeEdit() {

    editPopup.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   16. CLOSE DELETE POPUP
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
   17. SUCCESS POPUP
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
   18. CLOSE SUCCESS POPUP
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
   19. ERROR POPUP
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
   20. CLOSE ERROR POPUP
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
   21. PROFILE DROPDOWN
   ===================================================== */

function toggleProfile() {

    profileMenu.classList.toggle(
        "show"
    );

}


/* =====================================================
   22. CLOSE PROFILE WHEN CLICK OUTSIDE
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

            profileMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   23. MY ACCOUNT
   ===================================================== */

function myAccount() {

    profileMenu.classList.remove(
        "show"
    );


    /*
     * পরে এখানে আপনার
     * account page দিতে পারবেন।
     */

    // window.location.href = "account.html";

}


/* =====================================================
   24. LOGOUT
   ===================================================== */

function logout() {

    profileMenu.classList.remove(
        "show"
    );


    /*
     * Login করা user-এর data remove
     */

    localStorage.removeItem(
        "loggedInUser"
    );


    /*
     * অন্যান্য login data থাকলে
     * পরে এখানে remove করা যাবে।
     */


    /*
     * Login page-এ পাঠানো
     */

    window.location.href =
        "login.html";

}


/* =====================================================
   25. BACK BUTTON
   ===================================================== */

function goBack() {

    /*
     * Dashboard-এ ফিরে যাওয়ার
     * জন্য সরাসরি dashboard.html
     */

    window.location.href =
        "dashboard.html";

}


/* =====================================================
   26. DATE FORMAT
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
   27. DATE PARSER
   ===================================================== */

function parseHistoryDate(
    dateString
) {

    if (!dateString) {

        return null;

    }


    /*
     * YYYY-MM-DD
     */

    const parts =
        String(
            dateString
        ).split("-");


    if (
        parts.length === 3
    ) {

        const year =
            Number(
                parts[0]
            );


        const month =
            Number(
                parts[1]
            ) - 1;


        const day =
            Number(
                parts[2]
            );


        return new Date(
            year,
            month,
            day
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
   28. ESCAPE HTML
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
   29. SEARCH EVENT
   ===================================================== */

historySearch.addEventListener(
    "input",
    function () {

        applyFilters();

    }
);


/* =====================================================
   30. FROM DATE EVENT
   ===================================================== */

fromDate.addEventListener(
    "change",
    function () {

        applyFilters();

    }
);


/* =====================================================
   31. TO DATE EVENT
   ===================================================== */

toDate.addEventListener(
    "change",
    function () {

        applyFilters();

    }
);


/* =====================================================
   32. CLOSE POPUPS BY BACKDROP
   ===================================================== */

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


document
    .getElementById(
        "confirmPopup"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                this
            ) {

                closeConfirmPopup();

            }

        }
    );


document
    .getElementById(
        "successPopup"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                this
            ) {

                closeSuccessPopup();

            }

        }
    );


document
    .getElementById(
        "errorPopup"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                this
            ) {

                closeErrorPopup();

            }

        }
    );


/* =====================================================
   33. ESC KEY
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

            profileMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   34. INITIAL LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Login করা user load
         */

        loadLoggedInUser();


        /*
         * History load
         */

        loadHistory();

    }
);
