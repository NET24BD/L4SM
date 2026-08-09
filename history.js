/* =====================================================
   HISTORY DATA
===================================================== */

let historyData = [

    {
        customerId: "ABMB020",

        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",

        reference: "Shemanto",

        date: "2026-08-01",

        support: "Shemanto",

        supportWork: "Onu Change"
    },


    {
        customerId: "AHSR073",

        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",

        reference: "Shemanto",

        date: "2026-08-04",

        support: "Shemanto",

        supportWork: "Onu Change"
    },


    {
        customerId: "ABMB028",

        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",

        reference: "Shemanto",

        date: "2026-08-07",

        support: "Shemanto",

        supportWork: "Onu Change"
    }

];


/* =====================================================
   ELEMENTS
===================================================== */

const historyList =
    document.getElementById("historyList");

const historySearch =
    document.getElementById("historySearch");

const historyFilter =
    document.getElementById("historyFilter");

const editPopup =
    document.getElementById("editPopup");

const profileMenu =
    document.getElementById("profileMenu");


let currentEditIndex = null;


/* =====================================================
   LOAD HISTORY
===================================================== */

function loadHistory() {

    applyFilters();

}


/* =====================================================
   APPLY SEARCH + FILTER
===================================================== */

function applyFilters() {

    const searchText =
        historySearch.value
            .trim()
            .toLowerCase();


    const filterValue =
        historyFilter.value;


    const today =
        new Date();


    const filteredData =
        historyData.filter(item => {


            /* SEARCH */

            const matchesSearch =

                String(item.customerId || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(item.problem || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(item.reference || "")
                    .toLowerCase()
                    .includes(searchText);


            if (!matchesSearch) {

                return false;

            }


            /* FILTER */

            if (filterValue === "all") {

                return true;

            }


            const itemDate =
                parseHistoryDate(item.date);


            if (!itemDate) {

                return false;

            }


            /* TODAY */

            if (filterValue === "today") {

                return (

                    itemDate.getFullYear() ===
                    today.getFullYear()

                    &&

                    itemDate.getMonth() ===
                    today.getMonth()

                    &&

                    itemDate.getDate() ===
                    today.getDate()

                );

            }


            /* LAST 7 DAYS */

            if (filterValue === "7days") {

                const sevenDaysAgo =
                    new Date(today);

                sevenDaysAgo.setDate(
                    today.getDate() - 7
                );


                return (
                    itemDate >= sevenDaysAgo &&
                    itemDate <= today
                );

            }


            /* THIS MONTH */

            if (filterValue === "month") {

                return (

                    itemDate.getFullYear() ===
                    today.getFullYear()

                    &&

                    itemDate.getMonth() ===
                    today.getMonth()

                );

            }


            return true;

        });


    renderHistory(filteredData);

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderHistory(data) {

    historyList.innerHTML = "";


    if (data.length === 0) {

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

        return;

    }


    data.forEach(item => {


        const originalIndex =
            historyData.indexOf(item);


        const row =
            document.createElement("tr");


        /*
            IMPORTANT:

            এখানে মাত্র ৫টি TD আছে।

            Customer ID
            Problem
            Reference
            Date
            Action

            Support এবং Support Work
            table-এর বাইরে।
        */


        row.innerHTML = `

            <td>
                ${escapeHTML(item.customerId)}
            </td>


            <td class="problem-cell">
                ${escapeHTML(item.problem)}
            </td>


            <td>
                ${escapeHTML(item.reference)}
            </td>


            <td>
                ${formatDate(item.date)}
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


        historyList.appendChild(row);

    });

}


/* =====================================================
   VIEW / EDIT HISTORY
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


    currentEditIndex = index;


    document.getElementById("editIndex").value =
        index;


    document.getElementById("customerId").value =
        item.customerId || "";


    document.getElementById("problem").value =
        item.problem || "";


    document.getElementById("reference").value =
        item.reference || "";


    document.getElementById("date").value =
        item.date || "";


    document.getElementById("support").value =
        item.support || "";


    document.getElementById("supportWork").value =
        item.supportWork || "";


    editPopup.classList.add("show");


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   UPDATE HISTORY
===================================================== */

function updateHistory() {

    if (currentEditIndex === null) {

        showError(
            "Error",
            "No history selected."
        );

        return;

    }


    const customerId =
        document.getElementById("customerId")
            .value
            .trim();


    const problem =
        document.getElementById("problem")
            .value
            .trim();


    const reference =
        document.getElementById("reference")
            .value
            .trim();


    const date =
        document.getElementById("date")
            .value;


    const support =
        document.getElementById("support")
            .value
            .trim();


    const supportWork =
        document.getElementById("supportWork")
            .value
            .trim();


    /* VALIDATION */

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


    /* UPDATE */

    historyData[currentEditIndex] = {

        customerId,

        problem,

        reference,

        date,

        support,

        supportWork

    };


    closeEdit();


    applyFilters();


    showSuccess(
        "Updated Successfully",
        "History information has been updated successfully."
    );


    currentEditIndex = null;

}


/* =====================================================
   CLOSE EDIT POPUP
===================================================== */

function closeEdit() {

    editPopup.classList.remove("show");

    document.body.style.overflow = "";

}


/* =====================================================
   ASK DELETE
===================================================== */

function askDelete() {

    if (currentEditIndex === null) {

        showError(
            "Error",
            "No history selected."
        );

        return;

    }


    document
        .getElementById("confirmPopup")
        .classList.add("show");

}


/* =====================================================
   CONFIRM DELETE
===================================================== */

function confirmDelete() {

    if (currentEditIndex === null) {

        closeConfirmPopup();

        return;

    }


    historyData.splice(
        currentEditIndex,
        1
    );


    const deletedIndex =
        currentEditIndex;


    currentEditIndex = null;


    closeConfirmPopup();

    closeEdit();

    applyFilters();


    showSuccess(
        "Deleted Successfully",
        "History has been deleted successfully."
    );

}


/* =====================================================
   CLOSE CONFIRM POPUP
===================================================== */

function closeConfirmPopup() {

    document
        .getElementById("confirmPopup")
        .classList.remove("show");

}


/* =====================================================
   SUCCESS POPUP
===================================================== */

function showSuccess(
    title,
    message
) {

    document.getElementById(
        "successTitle"
    ).textContent =
        title || "Success";


    document.getElementById(
        "successMessage"
    ).textContent =
        message ||
        "Operation completed successfully.";


    document
        .getElementById("successPopup")
        .classList.add("show");

}


function closeSuccessPopup() {

    document
        .getElementById("successPopup")
        .classList.remove("show");

}


/* =====================================================
   ERROR POPUP
===================================================== */

function showError(
    title,
    message
) {

    document.getElementById(
        "errorTitle"
    ).textContent =
        title || "Error";


    document.getElementById(
        "errorMessage"
    ).textContent =
        message ||
        "Something went wrong.";


    document
        .getElementById("errorPopup")
        .classList.add("show");

}


function closeErrorPopup() {

    document
        .getElementById("errorPopup")
        .classList.remove("show");

}


/* =====================================================
   SEARCH
===================================================== */

historySearch.addEventListener(
    "input",
    function () {

        applyFilters();

    }
);


/* =====================================================
   FILTER
===================================================== */

historyFilter.addEventListener(
    "change",
    function () {

        applyFilters();

    }
);


/* =====================================================
   PROFILE
===================================================== */

function toggleProfile() {

    profileMenu.classList.toggle("show");

}


document.addEventListener(
    "click",
    function (event) {

        const profile =
            document.querySelector(".profile");


        if (
            profile &&
            !profile.contains(event.target)
        ) {

            profileMenu.classList.remove("show");

        }

    }
);


/* =====================================================
   BACK
===================================================== */

function goBack() {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href =
            "index.html";

    }

}


/* =====================================================
   MY ACCOUNT
===================================================== */

function myAccount() {

    profileMenu.classList.remove("show");

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    profileMenu.classList.remove("show");

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        parseHistoryDate(dateString);


    if (!date) {

        return dateString;

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

        String(date.getDate())
            .padStart(2, "0")

        + " "

        +

        months[date.getMonth()]

        + " "

        +

        date.getFullYear()

    );

}


/* =====================================================
   PARSE DATE
===================================================== */

function parseHistoryDate(dateString) {

    if (!dateString) {

        return null;

    }


    const parts =
        dateString.split("-");


    if (parts.length === 3) {

        return new Date(

            Number(parts[0]),

            Number(parts[1]) - 1,

            Number(parts[2])

        );

    }


    const parsed =
        new Date(dateString);


    if (isNaN(parsed.getTime())) {

        return null;

    }


    return parsed;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")

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
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeEdit();

            closeConfirmPopup();

            closeSuccessPopup();

            closeErrorPopup();

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHistory();

    }
);
