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
    let user =
        localStorage.getItem("username");

    if (user) {

        const username =
            document.getElementById("username");

        if (username) {
            username.innerHTML = user;
        }

    }


    // ===============================
    // LOAD PROFILE IMAGE
    // ===============================
    let img =
        localStorage.getItem("picture");

    if (img) {

        const profileImg =
            document.getElementById("profileImg");

        if (profileImg) {
            profileImg.src = img;
        }

    }


    // ===============================
    // LOAD SUPPORT
    // ===============================
    loadSupport();

});


// ===============================
// PROFILE
// ===============================
function toggleProfile() {

    const menu =
        document.getElementById("profileMenu");

    if (menu) {

        menu.classList.toggle("show");

    }

}


function myAccount() {

    location.href =
        "myaccount.html";

}


function logout() {

    localStorage.clear();

    location.href =
        "index.html";

}


function goBack() {

    location.href =
        "dashboard.html";

}


// ===============================
// LOAD SUPPORT
// ===============================
function loadSupport() {

    const supportList =
        document.getElementById("supportList");


    // ===============================
    // SHOW LOADING
    // ===============================
    if (supportList) {

        supportList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                    ">

                    Loading...

                </td>

            </tr>

        `;

    }


    // ===============================
    // FETCH SUPPORT DATA
    // ===============================
    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "getPendingSupport"

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        // ===============================
        // CHECK RESPONSE
        // ===============================
        if (
            !data ||
            data.success === false
        ) {

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
        if (
            !data.data ||
            data.data.length === 0
        ) {

            html = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:35px;
                        ">

                        No Pending Support

                    </td>

                </tr>

            `;

        }


        // ===============================
        // SHOW DATA
        // ===============================
        else {

            data.data.forEach(function (item) {

                html += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                item.customerId || ""
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.problem || ""
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.reference || ""
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
                                class="edit-btn"
                                onclick="editSupport(${Number(item.row)})">

                                Edit

                            </button>

                        </td>

                    </tr>

                `;

            });

        }


        // ===============================
        // REMOVE LOADING
        // ===============================
        if (supportList) {

            supportList.innerHTML =
                html;

        }

    })

    .catch(function (error) {

        console.error(
            "Support Load Error:",
            error
        );


        // ===============================
        // SHOW ERROR
        // ===============================
        if (supportList) {

            supportList.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:35px;
                        ">

                        Failed to load data

                    </td>

                </tr>

            `;

        }

    });

}


// ===============================
// HTML ESCAPE
// ===============================
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


// ===============================
// DATE FORMAT
// ===============================
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

        return String(date);

    }


    const day =
        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        );


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


// ===============================
// EDIT SUPPORT
// ===============================
function editSupport(row) {

    currentRow =
        Number(row);


    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "getSingleSupport",

            row:
                currentRow

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        // ===============================
        // CHECK RESPONSE
        // ===============================
        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data && data.message
                    ? data.message
                    : "Record not found"

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
            document.getElementById(
                "editModal"
            );

        if (modal) {

            modal.classList.add(
                "show"
            );

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
// DATE FOR INPUT
// ===============================
function convertDate(date) {

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


// ===============================
// SUBMIT SUPPORT
// ===============================
// Support + Support Work + Support Time
// পূরণ করে Submit করলে
//
// Support → Call
// ===============================
function updateSupport() {

    // ===============================
    // CHECK ROW
    // ===============================
    if (!currentRow) {

        alert(
            "No support record selected."
        );

        return;

    }


    // ===============================
    // GET DATA
    // ===============================
    const customerId =
        getValue("customerId")
        .trim();


    const problem =
        getValue("problem")
        .trim();


    const reference =
        getValue("reference")
        .trim();


    const date =
        getValue("date");


    const support =
        getValue("support")
        .trim();


    const supportWork =
        getValue("supportWork")
        .trim();


    const supportTime =
        getValue("supportTime")
        .trim();


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
    // SUBMIT BUTTON
    // ===============================
    const submitBtn =
        document.querySelector(
            "#editModal .submit-btn"
        );


    if (submitBtn) {

        submitBtn.disabled =
            true;

        submitBtn.innerText =
            "Submitting...";

    }


    // ===============================
    // SEND TO CALL
    // ===============================
    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "moveToCall",

            row:
                Number(currentRow),

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

        // ===============================
        // CHECK RESPONSE
        // ===============================
        if (
            !data ||
            data.success === false
        ) {

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


        // ===============================
        // CLOSE MODAL
        // ===============================
        closeEdit();


        currentRow =
            "";


        // ===============================
        // RELOAD
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

        // ===============================
        // ENABLE BUTTON
        // ===============================
        if (submitBtn) {

            submitBtn.disabled =
                false;

            submitBtn.innerText =
                "Submit";

        }

    });

}


// ===============================
// DELETE SUPPORT
// ===============================
function deleteSupport() {

    // ===============================
    // CHECK ROW
    // ===============================
    if (!currentRow) {

        alert(
            "No support record selected."
        );

        return;

    }


    // ===============================
    // CONFIRM
    // ===============================
    const confirmDelete =
        confirm(
            "Are you sure you want to delete?"
        );


    if (!confirmDelete) {

        return;

    }


    // ===============================
    // DELETE REQUEST
    // ===============================
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

        // ===============================
        // CHECK RESPONSE
        // ===============================
        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data && data.message
                    ? data.message
                    : "Delete failed"

            );

        }


        // ===============================
        // SUCCESS
        // ===============================
        alert(
            "Deleted Successfully"
        );


        // ===============================
        // CLOSE MODAL
        // ===============================
        closeEdit();


        currentRow =
            "";


        // ===============================
        // RELOAD
        // ===============================
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
// CLOSE PROFILE MENU
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
