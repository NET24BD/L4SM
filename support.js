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

    let user =
        localStorage.getItem("username");

    if (user) {

        document.getElementById("username").innerHTML =
            user;

    }


    let img =
        localStorage.getItem("picture");

    if (img) {

        document.getElementById("profileImg").src =
            img;

    }


    loadSupport();

});


// ===============================
// PROFILE
// ===============================
function toggleProfile() {

    document
        .getElementById("profileMenu")
        .classList
        .toggle("show");

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

        let html = "";


        if (data.data) {

            data.data.forEach(function (item) {

                html += `

                    ${item.customerId || ""}

                    ${item.problem || ""}

                    ${item.reference || ""}

                    ${formatDate(item.date)}

                    <button
                        class="edit-btn"
                        onclick="editSupport('${item.row}')">

                        Edit

                    </button>

                `;

            });

        }


        document
            .getElementById("supportList")
            .innerHTML =
                html;

    })

    .catch(function (error) {

        console.log(
            "Server Error",
            error
        );

    });

}


// ===============================
// DATE FORMAT
// ===============================
function formatDate(date) {

    if (!date) {

        return "";

    }


    let d =
        new Date(date);


    let day =
        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        );


    let monthList = [

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


    let month =
        monthList[
            d.getMonth()
        ];


    let year =
        d.getFullYear();


    return `${day} ${month} ${year}`;

}


// ===============================
// EDIT OPEN
// ===============================
function editSupport(row) {

    currentRow =
        row;


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
                row

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {


        document
            .getElementById("customerId")
            .value =
                data.customerId || "";


        document
            .getElementById("problem")
            .value =
                data.problem || "";


        document
            .getElementById("reference")
            .value =
                data.reference || "";


        document
            .getElementById("date")
            .value =
                convertDate(
                    data.date
                );


        document
            .getElementById("support")
            .value =
                data.support || "";


        document
            .getElementById("supportWork")
            .value =
                data.supportWork || "";


        // Support Time
        let supportTime =
            document.getElementById(
                "supportTime"
            );

        if (supportTime) {

            supportTime.value =
                data.supportTime || "";

        }


        document
            .getElementById("editModal")
            .classList
            .add("show");

    })

    .catch(function (err) {

        console.log(err);

    });

}


// ===============================
// DATE FOR INPUT
// ===============================
function convertDate(date) {

    if (!date) {

        return "";

    }


    let d =
        new Date(date);


    return d
        .toISOString()
        .split("T")[0];

}


// ===============================
// CLOSE EDIT
// ===============================
function closeEdit() {

    document
        .getElementById("editModal")
        .classList
        .remove("show");

}


// ===============================
// UPDATE SUPPORT
// ===============================
function updateSupport() {

    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            action:
                "updateSupport",

            row:
                currentRow,

            customerId:
                document
                    .getElementById(
                        "customerId"
                    )
                    .value,

            problem:
                document
                    .getElementById(
                        "problem"
                    )
                    .value,

            reference:
                document
                    .getElementById(
                        "reference"
                    )
                    .value,

            date:
                document
                    .getElementById(
                        "date"
                    )
                    .value,

            support:
                document
                    .getElementById(
                        "support"
                    )
                    .value,

            supportWork:
                document
                    .getElementById(
                        "supportWork"
                    )
                    .value,

            supportTime:
                document.getElementById(
                    "supportTime"
                )
                ? document
                    .getElementById(
                        "supportTime"
                    )
                    .value
                : ""

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        if (
            data.success === false
        ) {

            alert(
                data.message ||
                "Update Failed"
            );

            return;

        }


        alert(
            "Updated Successfully"
        );


        closeEdit();


        loadSupport();

    })

    .catch(function (err) {

        console.log(err);

        alert(
            "Update Failed"
        );

    });

}


// ===============================
// DELETE
// ===============================
function deleteSupport() {

    let confirmDelete =
        confirm(
            "Are you sure you want to delete?"
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
                currentRow

        })

    })

    .then(function (res) {

        return res.json();

    })

    .then(function (data) {

        if (
            data.success === false
        ) {

            alert(
                data.message ||
                "Delete Failed"
            );

            return;

        }


        alert(
            "Deleted Successfully"
        );


        closeEdit();


        loadSupport();

    })

    .catch(function (err) {

        console.log(err);

        alert(
            "Delete Failed"
        );

    });

}
