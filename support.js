```javascript
// =====================================
// SUPPORT WEB - FINAL JS
// =====================================

// ===============================
// API URL
// ===============================
const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";

let currentRow = "";


// ===============================
// START
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // LOAD USER
    // ===============================
    const user = localStorage.getItem("username");

    if (user) {
        const usernameEl = document.getElementById("username");

        if (usernameEl) {
            usernameEl.innerHTML = user;
        }
    }


    // ===============================
    // LOAD PROFILE IMAGE
    // ===============================
    const img = localStorage.getItem("picture");

    if (img) {
        const profileImg = document.getElementById("profileImg");

        if (profileImg) {
            profileImg.src = img;
        }
    }


    // ===============================
    // LOAD SUPPORT DATA
    // ===============================
    loadSupport();

});


// ===============================
// PROFILE
// ===============================
function toggleProfile() {

    const menu = document.getElementById("profileMenu");

    if (menu) {
        menu.classList.toggle("show");
    }

}


function myAccount() {

    location.href = "myaccount.html";

}


function logout() {

    localStorage.clear();

    location.href = "index.html";

}


function goBack() {

    location.href = "dashboard.html";

}


// ===============================
// LOAD SUPPORT
// ===============================
function loadSupport() {

    const list = document.getElementById("supportList");

    if (list) {

        list.innerHTML = `
            <div class="loading">
                Loading...
            </div>
        `;

    }


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            action: "getPendingSupport"

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        if (!data || data.success === false) {

            throw new Error(
                data && data.message
                    ? data.message
                    : "Failed to load support data"
            );

        }


        let html = "";


        // ===============================
        // NO DATA
        // ===============================
        if (!data.data || data.data.length === 0) {

            html = `
                <div class="no-data">
                    No Pending Support
                </div>
            `;

        }

        else {

            data.data.forEach(function (item) {

                html += `

                    <div class="support-item">

                        <div class="customer-id">
                            ${escapeHTML(item.customerId)}
                        </div>

                        <div class="problem">
                            ${escapeHTML(item.problem)}
                        </div>

                        <div class="reference">
                            ${escapeHTML(item.reference)}
                        </div>

                        <div class="date">
                            ${escapeHTML(item.date)}
                        </div>

                        <button
                            class="edit-btn"
                            onclick="editSupport(${Number(item.row)})">

                            Edit

                        </button>

                    </div>

                `;

            });

        }


        if (list) {

            list.innerHTML = html;

        }

    })

    .catch(function (error) {

        console.error("Support Load Error:", error);

        if (list) {

            list.innerHTML = `
                <div class="error">
                    Failed to load support data
                </div>
            `;

        }

    });

}


// ===============================
// HTML ESCAPE
// ===============================
function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// DATE FORMAT
// ===============================
function formatDate(date) {

    if (!date) {
        return "";
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return String(date);
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


// ===============================
// EDIT SUPPORT
// ===============================
function editSupport(row) {

    currentRow = Number(row);


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify({

            action: "getSingleSupport",

            row: currentRow

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        if (!data || data.success === false) {

            throw new Error(
                data && data.message
                    ? data.message
                    : "Unable to load record"
            );

        }


        // ===============================
        // CUSTOMER ID
        // ===============================
        setValue(
            "customerId",
            data.customerId
        );


        // ===============================
        // PROBLEM
        // ===============================
        setValue(
            "problem",
            data.problem
        );


        // ===============================
        // REFERENCE
        // ===============================
        setValue(
            "reference",
            data.reference
        );


        // ===============================
        // DATE
        // ===============================
        setValue(
            "date",
            convertDate(data.date)
        );


        // ===============================
        // SUPPORT
        // ===============================
        setValue(
            "support",
            data.support
        );


        // ===============================
        // SUPPORT WORK
        // ===============================
        setValue(
            "supportWork",
            data.supportWork
        );


        // ===============================
        // SUPPORT TIME
        // ===============================
        setValue(
            "supportTime",
            data.supportTime
        );


        // ===============================
        // OPEN MODAL
        // ===============================
        const modal =
            document.getElementById("editModal");

        if (modal) {

            modal.classList.add("show");

        }

    })

    .catch(function (error) {

        console.error(
            "Edit Support Error:",
            error
        );

        alert(
            "Unable to load support data."
        );

    });

}


// ===============================
// SET VALUE
// ===============================
function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value || "";

    }

}


// ===============================
// DATE FOR INPUT
// ===============================
function convertDate(date) {

    if (!date) {
        return "";
    }


    const d = new Date(date);

    if (isNaN(d.getTime())) {

        return "";

    }


    return d
        .toISOString()
        .split("T")[0];

}


// ===============================
// CLOSE EDIT
// ===============================
function closeEdit() {

    const modal =
        document.getElementById("editModal");

    if (modal) {

        modal.classList.remove("show");

    }

}


// ===============================
// SUBMIT SUPPORT
// ===============================
// Support + Support Work পূরণ করে
// এই function call হবে
// ===============================
function updateSupport() {

    if (!currentRow) {

        alert(
            "No support record selected."
        );

        return;

    }


    const customerId =
        getValue("customerId");


    const problem =
        getValue("problem");


    const reference =
        getValue("reference");


    const date =
        getValue("date");


    const support =
        getValue("support").trim();


    const supportWork =
        getValue("supportWork").trim();


    const supportTime =
        getValue("supportTime").trim();


    // ===============================
    // VALIDATION
    // ===============================
    if (!support) {

        alert(
            "Please enter Support."
        );

        return;

    }


    if (!supportWork) {

        alert(
            "Please enter Support Work."
        );

        return;

    }


    // ===============================
    // BUTTON
    // ===============================
    const submitBtn =
        document.querySelector(
            "#editModal .submit-btn"
        );


    if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.innerText =
            "Submitting...";

    }


    // ===============================
    // SEND TO APPS SCRIPT
    // ===============================
    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action: "moveToCall",

            row: Number(currentRow),

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

            supportTime:
                supportTime

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        if (!data || data.success === false) {

            throw new Error(
                data && data.message
                    ? data.message
                    : "Support submission failed"
            );

        }


        // ===============================
        // SUCCESS
        // ===============================
        alert(
            "Support completed successfully."
        );


        closeEdit();


        currentRow = "";


        // ===============================
        // RELOAD SUPPORT LIST
        // ===============================
        loadSupport();

    })

    .catch(function (error) {

        console.error(
            "Support Submit Error:",
            error
        );

        alert(
            "Support submit failed.\n\n" +
            error.message
        );

    })

    .finally(function () {

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerText =
                "Submit";

        }

    });

}


// ===============================
// GET VALUE
// ===============================
function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {

        return "";

    }

    return element.value || "";

}


// ===============================
// DELETE SUPPORT
// ===============================
function deleteSupport() {

    if (!currentRow) {

        alert(
            "No support record selected."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this support?"
        );


    if (!confirmDelete) {

        return;

    }


    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "deleteSupport",

            row:
                Number(currentRow)

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        if (!data || data.success === false) {

            throw new Error(
                data && data.message
                    ? data.message
                    : "Delete failed"
            );

        }


        alert(
            "Deleted Successfully"
        );


        closeEdit();


        currentRow = "";


        loadSupport();

    })

    .catch(function (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Delete Failed"
        );

    });

}


// ===============================
// CLOSE PROFILE WHEN CLICK OUTSIDE
// ===============================
document.addEventListener(
    "click",
    function (event) {

        const profileMenu =
            document.getElementById(
                "profileMenu"
            );

        const profile =
            document.querySelector(
                ".profile"
            );


        if (
            profileMenu &&
            profile &&
            !profile.contains(event.target)
        ) {

            profileMenu.classList.remove(
                "show"
            );

        }

    }
);
```
