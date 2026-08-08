// =====================================
// CALL JS
// =====================================

// ===============================
// API URL
// ===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";

let currentRow = "";


// =====================================
// START
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // USERNAME
    const user = localStorage.getItem("username");

    if (user) {

        const username = document.getElementById("username");

        if (username) {
            username.textContent = user;
        }

    }


    // PROFILE PICTURE
    const picture = localStorage.getItem("picture");

    if (picture) {

        const profileImg =
            document.getElementById("profileImg");

        if (profileImg) {
            profileImg.src = picture;
        }

    }


    // LOAD CALL DATA
    loadCall();

});


// =====================================
// PROFILE
// =====================================

function toggleProfile() {

    const menu =
        document.getElementById("profileMenu");

    if (!menu) return;

    menu.classList.toggle("show");

}


function myAccount() {

    window.location.href = "myaccount.html";

}


function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}


function goBack() {

    window.location.href = "dashboard.html";

}


// =====================================
// LOAD PENDING CALL
// =====================================

function loadCall() {

    const list =
        document.getElementById("callList");

    if (!list) return;


    list.innerHTML = `
        <tr>
            <td colspan="7">
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

            action: "getPendingCall"

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log("CALL DATA:", data);


        if (!data.success) {

            list.innerHTML = `
                <tr>
                    <td colspan="7">
                        ${data.message || "Failed to load Call data"}
                    </td>
                </tr>
            `;

            return;

        }


        let html = "";


        if (!data.data || data.data.length === 0) {

            html = `
                <tr>
                    <td colspan="7">
                        No Pending Call
                    </td>
                </tr>
            `;

        }

        else {

            data.data.forEach(function (item) {

                html += `

                    <tr>

                        <td>
                            ${escapeHTML(item.customerId || "")}
                        </td>

                        <td>
                            ${escapeHTML(item.problem || "")}
                        </td>

                        <td>
                            ${escapeHTML(item.reference || "")}
                        </td>

                        <td>
                            ${formatDate(item.date)}
                        </td>

                        <td>
                            ${escapeHTML(item.support || "")}
                        </td>

                        <td>
                            ${escapeHTML(item.supportWork || "")}
                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                onclick="editCall('${item.row}')">

                                <i class="fa-solid fa-pen"></i>
                                Edit

                            </button>

                        </td>

                    </tr>

                `;

            });

        }


        list.innerHTML = html;

    })

    .catch(error => {

        console.error("CALL LOAD ERROR:", error);


        list.innerHTML = `
            <tr>
                <td colspan="7">
                    Server Error
                </td>
            </tr>
        `;

    });

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =====================================
// DATE FORMAT
// =====================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const d = new Date(date);


    if (isNaN(d.getTime())) {
        return date;
    }


    const day =
        String(d.getDate()).padStart(2, "0");


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
        monthList[d.getMonth()];


    const year =
        d.getFullYear();


    return `${day} ${month} ${year}`;

}


// =====================================
// EDIT CALL
// =====================================

function editCall(row) {

    currentRow = row;


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            action: "getSingleCall",

            row: row

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log("SINGLE CALL:", data);


        if (!data.success) {

            showMessage(
                "Error",
                data.message || "Failed to load Call",
                "error"
            );

            return;

        }


        document.getElementById("customerId").value =
            data.customerId || "";


        document.getElementById("problem").value =
            data.problem || "";


        document.getElementById("reference").value =
            data.reference || "";


        document.getElementById("date").value =
            convertDate(data.date);


        document.getElementById("support").value =
            data.support || "";


        document.getElementById("supportWork").value =
            data.supportWork || "";


        document.getElementById("call").value =
            data.call || "";


        document.getElementById("callWork").value =
            data.callWork || "";


        const modal =
            document.getElementById("editModal");

        if (modal) {

            modal.classList.add("show");

        }

    })

    .catch(error => {

        console.error("EDIT ERROR:", error);

        showMessage(
            "Error",
            "Failed to load Call data",
            "error"
        );

    });

}


// =====================================
// DATE FOR INPUT
// =====================================

function convertDate(date) {

    if (!date) {
        return "";
    }


    const d = new Date(date);


    if (isNaN(d.getTime())) {
        return "";
    }


    const year =
        d.getFullYear();


    const month =
        String(d.getMonth() + 1).padStart(2, "0");


    const day =
        String(d.getDate()).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =====================================
// CLOSE EDIT
// =====================================

function closeEdit() {

    const modal =
        document.getElementById("editModal");


    if (modal) {

        modal.classList.remove("show");

    }

}


// =====================================
// UPDATE CALL
// =====================================

function updateCall() {

    if (!currentRow) {

        showMessage(
            "Error",
            "Invalid Call record",
            "error"
        );

        return;

    }


    const data = {

        action: "updateCall",

        row: currentRow,

        customerId:
            document.getElementById("customerId").value.trim(),

        problem:
            document.getElementById("problem").value.trim(),

        reference:
            document.getElementById("reference").value.trim(),

        date:
            document.getElementById("date").value,

        support:
            document.getElementById("support").value.trim(),

        supportWork:
            document.getElementById("supportWork").value.trim(),

        call:
            document.getElementById("call").value.trim(),

        callWork:
            document.getElementById("callWork").value.trim()

    };


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body: JSON.stringify(data)

    })

    .then(response => response.json())

    .then(result => {

        console.log("UPDATE CALL:", result);


        if (!result.success) {

            showMessage(
                "Error",
                result.message || "Update Failed",
                "error"
            );

            return;

        }


        closeEdit();


        showMessage(
            "Success",
            "Call Updated Successfully",
            "success"
        );


        loadCall();

    })

    .catch(error => {

        console.error("UPDATE ERROR:", error);

        showMessage(
            "Error",
            "Server Error",
            "error"
        );

    });

}


// =====================================
// DELETE CALL
// =====================================

function deleteCall() {

    if (!currentRow) {

        showMessage(
            "Error",
            "Invalid Call record",
            "error"
        );

        return;

    }


    // CUSTOM CONFIRM POPUP
    const confirmBox =
        document.querySelector(".confirm-box");


    if (confirmBox) {

        const parent =
            confirmBox.parentElement;


        if (parent) {
            parent.classList.add("show");
        }

        else {
            confirmBox.style.display = "block";
        }

    }

}


// =====================================
// CONFIRM DELETE
// =====================================

function confirmDelete() {

    if (!currentRow) {
        return;
    }


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            action: "deleteCall",

            row: currentRow

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log("DELETE CALL:", data);


        closeConfirm();


        if (!data.success) {

            showMessage(
                "Error",
                data.message || "Delete Failed",
                "error"
            );

            return;

        }


        closeEdit();


        showMessage(
            "Success",
            "Call Deleted Successfully",
            "success"
        );


        currentRow = "";


        loadCall();

    })

    .catch(error => {

        console.error("DELETE ERROR:", error);

        closeConfirm();


        showMessage(
            "Error",
            "Server Error",
            "error"
        );

    });

}


// =====================================
// CLOSE CONFIRM
// =====================================

function closeConfirm() {

    const confirmBox =
        document.querySelector(".confirm-box");


    if (!confirmBox) {
        return;
    }


    const parent =
        confirmBox.parentElement;


    if (parent) {

        parent.classList.remove("show");

    }

    else {

        confirmBox.style.display = "none";

    }

}


// =====================================
// MESSAGE POPUP
// =====================================

function showMessage(title, text, type) {

    const titleElement =
        document.getElementById("messageTitle");


    const textElement =
        document.getElementById("messageText");


    const icon =
        document.getElementById("messageIcon");


    if (titleElement) {
        titleElement.textContent = title;
    }


    if (textElement) {
        textElement.textContent = text;
    }


    if (icon) {

        if (type === "error") {

            icon.innerHTML =
                '<i class="fa-solid fa-circle-xmark"></i>';

        }

        else {

            icon.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>';

        }

    }


    const messageBox =
        document.querySelector(".message-box");


    if (messageBox) {

        const parent =
            messageBox.parentElement;


        if (parent) {

            parent.classList.add("show");

        }

        else {

            messageBox.style.display = "block";

        }

    }

}


// =====================================
// CLOSE MESSAGE
// =====================================

function closeMessage() {

    const messageBox =
        document.querySelector(".message-box");


    if (!messageBox) {
        return;
    }


    const parent =
        messageBox.parentElement;


    if (parent) {

        parent.classList.remove("show");

    }

    else {

        messageBox.style.display = "none";

    }

}
