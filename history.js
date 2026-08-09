/* =====================================================
   HISTORY DATA
===================================================== */

/*
   IMPORTANT:

   সামনে table-এ শুধু থাকবে:

   Customer ID
   Problem
   Reference
   Date
   Action

   Support এবং Support Work শুধু popup-এর ভিতরে থাকবে।
*/

const historyData = [

    {
        customerId: "ABMB020",

        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",

        reference: "Shemanto",

        date: "01 Aug 2026",

        support: "Shemanto",

        supportWork: "Onu Change"
    },


    {
        customerId: "AHSR073",

        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",

        reference: "Shemanto",

        date: "04 Aug 2026",

        support: "Shemanto",

        supportWork: "Onu Change"
    },


    {
        customerId: "ABMB028",

        problem: "উনার লাইনে এ কি সমস্যা দেখে আসতে হবে",

        reference: "Shemanto",

        date: "07 Aug 2026",

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


const editPopup =
    document.getElementById("editPopup");


const profileMenu =
    document.getElementById("profileMenu");


/* =====================================================
   LOAD HISTORY
===================================================== */

function loadHistory(data = historyData) {

    historyList.innerHTML = "";


    if (!data || data.length === 0) {

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


    data.forEach((item, index) => {

        const row = document.createElement("tr");


        /*
           IMPORTANT:

           এখানে মাত্র ৫টি <td> আছে।

           1. Customer ID
           2. Problem
           3. Reference
           4. Date
           5. Action

           Support এবং Support Work এখানে নেই।
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
                ${escapeHTML(item.date)}
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

        `;


        historyList.appendChild(row);

    });

}


/* =====================================================
   VIEW HISTORY
===================================================== */

function viewHistory(index) {

    const item = historyData[index];


    if (!item) {

        showError(
            "Error",
            "History information was not found."
        );

        return;
    }


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


    document.body.style.overflow = "hidden";
}


/* =====================================================
   CLOSE DETAILS POPUP
===================================================== */

function closeEdit() {

    editPopup.classList.remove("show");

    document.body.style.overflow = "";
}


/* =====================================================
   SEARCH
===================================================== */

historySearch.addEventListener(
    "input",
    function () {

        const searchText =
            this.value
                .trim()
                .toLowerCase();


        if (searchText === "") {

            loadHistory(historyData);

            return;
        }


        const filteredData =
            historyData.filter(item => {

                return (

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
                        .includes(searchText)

                    ||

                    String(item.date || "")
                        .toLowerCase()
                        .includes(searchText)

                );

            });


        renderSearchResults(filteredData);

    }
);


/* =====================================================
   RENDER SEARCH RESULTS
===================================================== */

function renderSearchResults(data) {

    historyList.innerHTML = "";


    if (data.length === 0) {

        historyList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-cell"
                >

                    No matching history found.

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
                ${escapeHTML(item.date)}
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
   PROFILE MENU
===================================================== */

function toggleProfile() {

    profileMenu.classList.toggle("show");

}


/* Close profile menu when clicking outside */

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

        window.location.href = "index.html";

    }

}


/* =====================================================
   MY ACCOUNT
===================================================== */

function myAccount() {

    profileMenu.classList.remove("show");


    /*
       পরে এখানে তোমার account page-এর URL দিতে পারবে।

       Example:

       window.location.href = "account.html";
    */

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    profileMenu.classList.remove("show");


    /*
       পরে তোমার existing logout system
       এখানে connect করবে।
    */

}


/* =====================================================
   CONFIRM POPUP
===================================================== */

function closeConfirmPopup() {

    const popup =
        document.getElementById("confirmPopup");


    popup.classList.remove("show");

}


/* =====================================================
   SUCCESS POPUP
===================================================== */

function showSuccess(title, message) {

    document.getElementById("successTitle").textContent =
        title || "Success";


    document.getElementById("successMessage").textContent =
        message || "Operation completed successfully.";


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

function showError(title, message) {

    document.getElementById("errorTitle").textContent =
        title || "Error";


    document.getElementById("errorMessage").textContent =
        message || "Something went wrong.";


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
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   CLOSE POPUP WITH ESC KEY
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
