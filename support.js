// =====================================
// SUPPORT WEB - FINAL JS
// =====================================


// =====================================
// API CONFIG
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================
// GLOBAL VARIABLES
// =====================================

let currentRow = "";

let supportData = [];


// =====================================
// PAGE START
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ===============================
        // USERNAME
        // ===============================

        const username =
            localStorage.getItem("username");

        const usernameElement =
            document.getElementById("username");

        if (
            usernameElement &&
            username
        ) {

            usernameElement.innerHTML =
                escapeHTML(username);

        }


        // ===============================
        // PROFILE IMAGE
        // ===============================

        const picture =
            localStorage.getItem("picture");

        const profileImg =
            document.getElementById("profileImg");

        if (
            profileImg &&
            picture
        ) {

            profileImg.src = picture;

        }


        // ===============================
        // LOAD SUPPORT
        // ===============================

        loadSupport();


        // ===============================
        // SEARCH ENTER
        // ===============================

        const searchInput =
            document.getElementById(
                "supportSearch"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchSupport
            );

        }

    }
);


// =====================================
// PROFILE
// =====================================

function toggleProfile() {

    const menu =
        document.getElementById(
            "profileMenu"
        );

    if (!menu) return;

    menu.classList.toggle("show");

}


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
// GO BACK
// =====================================

function goBack() {

    window.location.href =
        "dashboard.html";

}


// =====================================
// LOAD SUPPORT
// =====================================

function loadSupport() {

    const supportList =
        document.getElementById(
            "supportList"
        );


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
                    "
                >

                    Loading...

                </td>

            </tr>

        `;

    }


    // ===============================
    // API REQUEST
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

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server Error"
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log(
            "Support API:",
            data
        );


        // ===============================
        // CHECK SUCCESS
        // ===============================

        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data &&
                data.message

                    ? data.message

                    : "Unable to load support"

            );

        }


        // ===============================
        // SAVE DATA
        // ===============================

        supportData =
            Array.isArray(data.data)
                ? data.data
                : [];


        // ===============================
        // RENDER
        // ===============================

        renderSupport(
            supportData
        );

    })

    .catch(function (error) {

        console.error(
            "Load Support Error:",
            error
        );


        if (supportList) {

            supportList.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:35px;
                            color:#ef4444;
                        "
                    >

                        Failed to load support data

                    </td>

                </tr>

            `;

        }

    });

}


// =====================================
// RENDER SUPPORT
// =====================================

function renderSupport(data) {

    const supportList =
        document.getElementById(
            "supportList"
        );


    if (!supportList) {

        console.error(
            "supportList not found"
        );

        return;

    }


    let html = "";


    // ===============================
    // NO DATA
    // ===============================

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        supportList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                    "
                >

                    No Pending Support

                </td>

            </tr>

        `;

        return;

    }


    // ===============================
    // CREATE ROWS
    // ===============================

    data.forEach(function (item) {

        const row =
            Number(item.row);


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

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editSupport(${row})"
                    >

                        <i class="fa fa-pen"></i>

                        Edit

                    </button>

                </td>

            </tr>

        `;

    });


    supportList.innerHTML =
        html;

}


// =====================================
// SEARCH SUPPORT
// =====================================

function searchSupport() {

    const searchInput =
        document.getElementById(
            "supportSearch"
        );


    if (!searchInput) {

        console.error(
            "supportSearch input not found"
        );

        return;

    }


    // ===============================
    // SEARCH TEXT
    // ===============================

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    console.log(
        "Searching:",
        keyword
    );


    // ===============================
    // EMPTY SEARCH
    // ===============================

    if (!keyword) {

        renderSupport(
            supportData
        );

        return;

    }


    // ===============================
    // FILTER DATA
    // ===============================

    const filtered =
        supportData.filter(
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


                const date =
                    String(
                        item.date || ""
                    ).toLowerCase();


                const formattedDate =
                    formatDate(
                        item.date
                    ).toLowerCase();


                return (

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

                    date.includes(
                        keyword
                    )

                    ||

                    formattedDate.includes(
                        keyword
                    )

                );

            }
        );


    // ===============================
    // SHOW RESULT
    // ===============================

    renderSupport(
        filtered
    );

}


// =====================================
// EDIT SUPPORT
// =====================================

function editSupport(row) {

    currentRow =
        Number(row);


    if (
        !currentRow ||
        currentRow <= 1
    ) {

        alert(
            "Invalid support record."
        );

        return;

    }


    // ===============================
    // LOADING MODAL DATA
    // ===============================

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

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        console.log(
            "Single Support:",
            data
        );


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data &&
                data.message

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
            convertDate(
                data.date
            )
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
            "Edit Error:",
            error
        );


        alert(
            "Unable to load support data."
        );

    });

}


// =====================================
// SET INPUT VALUE
// =====================================

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.value =
        value || "";

}


// =====================================
// GET INPUT VALUE
// =====================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value || "";

}


// =====================================
// CONVERT DATE
// =====================================

function convertDate(date) {

    if (!date) {

        return "";

    }


    // ===============================
    // ALREADY YYYY-MM-DD
    // ===============================

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(date)
        )
    ) {

        return String(date);

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


    const year =
        d.getFullYear();


    const month =
        String(
            d.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


// =====================================
// FORMAT DATE
// =====================================

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


    const month =
        months[
            d.getMonth()
        ];


    const year =
        d.getFullYear();


    return `${day} ${month} ${year}`;

}


// =====================================
// UPDATE / MOVE TO CALL
// =====================================

function updateSupport() {

    // ===============================
    // CHECK ROW
    // ===============================

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        alert(
            "No support record selected."
        );

        return;

    }


    // ===============================
    // GET VALUES
    // ===============================

    const customerId =
        getValue(
            "customerId"
        ).trim();


    const problem =
        getValue(
            "problem"
        ).trim();


    const reference =
        getValue(
            "reference"
        ).trim();


    const date =
        getValue(
            "date"
        );


    const support =
        getValue(
            "support"
        ).trim();


    const supportWork =
        getValue(
            "supportWork"
        ).trim();


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

        submitBtn.disabled =
            true;

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
                supportWork

        })

    })

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        console.log(
            "Move To Call:",
            data
        );


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data &&
                data.message

                    ? data.message

                    : "Support submission failed"

            );

        }


        // ===============================
        // SUCCESS
        // ===============================

        alert(
            "Support completed successfully.\nMoved to Call."
        );


        // ===============================
        // CLOSE MODAL
        // ===============================

        closeEdit();


        // ===============================
        // RELOAD SUPPORT
        // ===============================

        loadSupport();

    })

    .catch(function (error) {

        console.error(
            "Update Support Error:",
            error
        );


        alert(
            "Support submit failed.\n\n" +
            error.message
        );

    })

    .finally(function () {

        if (submitBtn) {

            submitBtn.disabled =
                false;

            submitBtn.innerText =
                "Submit";

        }

    });

}


// =====================================
// CLOSE EDIT MODAL
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


    currentRow =
        "";

}


// =====================================
// DELETE SUPPORT
// =====================================

function deleteSupport() {

    // ===============================
    // CHECK ROW
    // ===============================

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        alert(
            "No support record selected."
        );

        return;

    }


    // ===============================
    // CONFIRM
    // ===============================

    const confirmed =
        confirm(
            "Are you sure you want to delete this support?"
        );


    if (!confirmed) {

        return;

    }


    // ===============================
    // SEND DELETE
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

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        console.log(
            "Delete:",
            data
        );


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data &&
                data.message

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


        closeEdit();


        loadSupport();

    })

    .catch(function (error) {

        console.error(
            "Delete Error:",
            error
        );


        alert(
            "Delete Failed.\n\n" +
            error.message
        );

    });

}


// =====================================
// HTML ESCAPE
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
// CLOSE PROFILE WHEN CLICK OUTSIDE
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const menu =
            document.getElementById(
                "profileMenu"
            );


        const profile =
            document.querySelector(
                ".profile"
            );


        if (
            menu &&
            profile &&
            !profile.contains(
                event.target
            )
        ) {

            menu.classList.remove(
                "show"
            );

        }

    }
);


// =====================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// =====================================

document.addEventListener(
    "click",
    function (event) {

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

    }
);


// =====================================
// ESC KEY
// =====================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

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

    }
);
