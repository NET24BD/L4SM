// =====================================
// L4SM PENDING CALL
// FULL FINAL call.js
// =====================================


// =====================================
// API URL
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================
// GLOBAL VARIABLES
// =====================================

let currentRow = "";
let callData = [];


// =====================================
// START
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();

    loadCall();

});


// =====================================
// PROFILE
// =====================================

function loadProfile() {

    const user =
        localStorage.getItem("username");

    if (user) {

        const username =
            document.getElementById("username");

        if (username) {
            username.innerText = user;
        }

    }


    const picture =
        localStorage.getItem("picture");

    if (picture) {

        const profileImg =
            document.getElementById("profileImg");

        if (profileImg) {
            profileImg.src = picture;
        }

    }

}


// =====================================
// PROFILE MENU
// =====================================

function toggleProfile() {

    const menu =
        document.getElementById("profileMenu");

    if (!menu) return;

    menu.classList.toggle("show");

}


// =====================================
// CLOSE PROFILE MENU
// =====================================

document.addEventListener("click", function (event) {

    const profile =
        document.querySelector(".profile");

    const menu =
        document.getElementById("profileMenu");

    if (!profile || !menu) return;

    if (!profile.contains(event.target)) {

        menu.classList.remove("show");

    }

});


// =====================================
// MY ACCOUNT
// =====================================

function myAccount() {

    window.location.href =
        "myaccount.html";

}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.clear();

    window.location.href =
        "index.html";

}


// =====================================
// BACK
// =====================================

function goBack() {

    window.location.href =
        "dashboard.html";

}


// =====================================
// LOAD CALL
// =====================================

function loadCall() {

    const list =
        document.getElementById("callList");

    if (!list) return;


    list.innerHTML = `

        <tr>

            <td colspan="7"
                style="text-align:center;">

                Loading...

            </td>

        </tr>

    `;


    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "getPendingCall"

        })

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Network response failed"
            );

        }

        return response.json();

    })

    .then(data => {

        if (
            !data ||
            data.success !== true
        ) {

            list.innerHTML = `

                <tr>

                    <td colspan="7"
                        style="text-align:center;">

                        ${
                            data &&
                            data.message
                                ? data.message
                                : "Failed to load Call data"
                        }

                    </td>

                </tr>

            `;

            return;

        }


        // ---------------------------------
        // SAVE DATA LOCALLY
        // ---------------------------------

        callData =
            Array.isArray(data.data)
                ? data.data
                : [];


        // ---------------------------------
        // DISPLAY
        // ---------------------------------

        displayCall(callData);

    })

    .catch(error => {

        console.error(
            "Load Call Error:",
            error
        );


        list.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center;color:red;">

                    Server Error

                </td>

            </tr>

        `;

    });

}


// =====================================
// DISPLAY CALL
// =====================================

function displayCall(data) {

    const list =
        document.getElementById("callList");

    if (!list) return;


    if (!data || data.length === 0) {

        list.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center;">

                    No Pending Call

                </td>

            </tr>

        `;

        return;

    }


    let html = "";


    data.forEach(function (item) {

        html += `

            <tr>

                <td>
                    ${escapeHTML(item.customerId)}
                </td>

                <td>
                    ${escapeHTML(item.problem)}
                </td>

                <td>
                    ${escapeHTML(item.reference)}
                </td>

                <td>
                    ${formatDate(item.date)}
                </td>

                <td>
                    ${escapeHTML(item.support)}
                </td>

                <td>
                    ${escapeHTML(item.supportWork)}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editCall(${item.row})">

                        <i class="fa-solid fa-pen"></i>

                        Edit

                    </button>

                </td>

            </tr>

        `;

    });


    list.innerHTML =
        html;

}


// =====================================
// EDIT CALL - INSTANT POPUP
// =====================================

function editCall(row) {

    currentRow =
        Number(row);


    // ---------------------------------
    // FIND DATA FROM LOCAL ARRAY
    // ---------------------------------

    const item =
        callData.find(function (record) {

            return Number(record.row) ===
                Number(row);

        });


    if (!item) {

        alert(
            "Call data not found. Please refresh."
        );

        return;

    }


    // ---------------------------------
    // FILL FORM FIRST
    // ---------------------------------

    const customerId =
        document.getElementById(
            "customerId"
        );

    const problem =
        document.getElementById(
            "problem"
        );

    const reference =
        document.getElementById(
            "reference"
        );

    const date =
        document.getElementById(
            "date"
        );

    const support =
        document.getElementById(
            "support"
        );

    const supportWork =
        document.getElementById(
            "supportWork"
        );

    const call =
        document.getElementById(
            "call"
        );

    const callWork =
        document.getElementById(
            "callWork"
        );


    if (customerId)
        customerId.value =
            item.customerId || "";


    if (problem)
        problem.value =
            item.problem || "";


    if (reference)
        reference.value =
            item.reference || "";


    if (date)
        date.value =
            convertDate(item.date);


    if (support)
        support.value =
            item.support || "";


    if (supportWork)
        supportWork.value =
            item.supportWork || "";


    if (call)
        call.value =
            item.call || "";


    if (callWork)
        callWork.value =
            item.callWork || "";


    // ---------------------------------
    // OPEN POPUP IMMEDIATELY
    // ---------------------------------

    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.add("show");

    }

}


// =====================================
// CONVERT DATE
// =====================================

function convertDate(date) {

    if (!date) {
        return "";
    }


    // ---------------------------------
    // ALREADY YYYY-MM-DD
    // ---------------------------------

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(date)
        )
    ) {

        return String(date);

    }


    const d =
        new Date(date);


    if (isNaN(d.getTime())) {

        return "";

    }


    const year =
        d.getFullYear();


    const month =
        String(
            d.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            d.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =====================================
// DISPLAY DATE
// =====================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    // ---------------------------------
    // PARSE
    // ---------------------------------

    const d =
        new Date(date);


    if (isNaN(d.getTime())) {

        return String(date);

    }


    const day =
        String(
            d.getDate()
        ).padStart(2, "0");


    const monthList = [

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


    const month =
        monthList[
            d.getMonth()
        ];


    const year =
        d.getFullYear();


    return `${day} ${month} ${year}`;

}


// =====================================
// CLOSE EDIT
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


    currentRow = "";

}


// =====================================
// UPDATE CALL
// =====================================

function updateCall() {

    if (!currentRow) {

        alert(
            "Invalid Call Row"
        );

        return;

    }


    // ---------------------------------
    // GET FORM DATA
    // ---------------------------------

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


    const call =
        document.getElementById(
            "call"
        ).value.trim();


    const callWork =
        document.getElementById(
            "callWork"
        ).value.trim();


    // ---------------------------------
    // VALIDATION
    // ---------------------------------

    if (!customerId) {

        alert(
            "Customer ID is required"
        );

        return;

    }


    if (!call) {

        alert(
            "Call is required"
        );

        return;

    }


    if (!callWork) {

        alert(
            "Call Work is required"
        );

        return;

    }


    // ---------------------------------
    // BUTTON
    // ---------------------------------

    const submitButton =
        document.querySelector(
            ".submit-btn"
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    }


    // ---------------------------------
    // UPDATE API
    // ---------------------------------

    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "updateCall",

            row:
                currentRow,

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

    })

    .then(response =>
        response.json()
    )

    .then(data => {

        if (
            data &&
            data.success === true
        ) {

            // -------------------------
            // UPDATE LOCAL DATA
            // -------------------------

            const index =
                callData.findIndex(
                    function (record) {

                        return Number(
                            record.row
                        ) ===
                        Number(currentRow);

                    }
                );


            if (index !== -1) {

                callData[index] = {

                    ...callData[index],

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

                };

            }


            // -------------------------
            // CLOSE POPUP
            // -------------------------

            closeEdit();


            // -------------------------
            // REFRESH TABLE
            // -------------------------

            displayCall(
                callData
            );


            showMessage(
                "Success",
                "Call updated successfully."
            );

        }

        else {

            alert(
                data &&
                data.message
                    ? data.message
                    : "Update Failed"
            );

        }

    })

    .catch(error => {

        console.error(
            "Update Error:",
            error
        );

        alert(
            "Update Failed"
        );

    })

    .finally(() => {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                '<i class="fa-solid fa-save"></i> Submit';

        }

    });

}


// =====================================
// DELETE CALL
// =====================================

function deleteCall() {

    if (!currentRow) {

        alert(
            "Invalid Call Row"
        );

        return;

    }


    // ---------------------------------
    // OPEN CONFIRM POPUP
    // ---------------------------------

    const confirmModal =
        document.getElementById(
            "confirmModal"
        );


    if (confirmModal) {

        confirmModal.classList.add(
            "show"
        );

        return;

    }


    // Fallback
    if (
        confirm(
            "Are you sure you want to delete this record?"
        )
    ) {

        confirmDelete();

    }

}


// =====================================
// CONFIRM DELETE
// =====================================

function confirmDelete() {

    if (!currentRow) {
        return;
    }


    closeConfirm();


    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "deleteCall",

            row:
                currentRow

        })

    })

    .then(response =>
        response.json()
    )

    .then(data => {

        if (
            data &&
            data.success === true
        ) {

            // -------------------------
            // REMOVE LOCAL RECORD
            // -------------------------

            callData =
                callData.filter(
                    function (record) {

                        return Number(
                            record.row
                        ) !==
                        Number(currentRow);

                    }
                );


            closeEdit();


            displayCall(
                callData
            );


            showMessage(
                "Deleted",
                "Call deleted successfully."
            );


            currentRow = "";

        }

        else {

            alert(
                data &&
                data.message
                    ? data.message
                    : "Delete Failed"
            );

        }

    })

    .catch(error => {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Delete Failed"
        );

    });

}


// =====================================
// CLOSE CONFIRM
// =====================================

function closeConfirm() {

    const confirmModal =
        document.getElementById(
            "confirmModal"
        );


    if (confirmModal) {

        confirmModal.classList.remove(
            "show"
        );

    }

}


// =====================================
// SUCCESS / MESSAGE POPUP
// =====================================

function showMessage(
    title,
    message
) {

    const modal =
        document.getElementById(
            "messageModal"
        );


    if (!modal) {

        return;

    }


    const titleElement =
        document.getElementById(
            "messageTitle"
        );


    const textElement =
        document.getElementById(
            "messageText"
        );


    if (titleElement) {

        titleElement.innerText =
            title;

    }


    if (textElement) {

        textElement.innerText =
            message;

    }


    modal.classList.add(
        "show"
    );

}


// =====================================
// CLOSE MESSAGE
// =====================================

function closeMessage() {

    const modal =
        document.getElementById(
            "messageModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

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
// REFRESH CALL DATA
// =====================================

function refreshCall() {

    loadCall();

}
