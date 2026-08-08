// =====================================
// SUPPORT WEB - FINAL JS
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

let supportData = [];

let confirmCallback = null;


// =====================================
// PAGE START
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    loadUserProfile();

    loadSupport();

    const searchInput =
        document.getElementById("supportSearch");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchSupport
        );

    }

});


// =====================================
// LOAD USER PROFILE
// =====================================

function loadUserProfile() {

    const username =
        localStorage.getItem("username");

    const picture =
        localStorage.getItem("picture");


    const usernameElement =
        document.getElementById("username");

    const profileImg =
        document.getElementById("profileImg");


    if (
        usernameElement &&
        username
    ) {

        usernameElement.innerText =
            username;

    }


    if (
        profileImg &&
        picture
    ) {

        profileImg.src =
            picture;

    }

}


// =====================================
// PROFILE MENU
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
// BACK
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


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(

                data &&
                data.message
                    ? data.message
                    : "Failed to load support"

            );

        }


        supportData =
            Array.isArray(data.data)
                ? data.data
                : [];


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

        return;

    }


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
                        color:#64748b;
                    "
                >

                    No Pending Support

                </td>

            </tr>

        `;

        return;

    }


    let html = "";


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
// SEARCH
// =====================================

function searchSupport() {

    const searchInput =
        document.getElementById(
            "supportSearch"
        );


    if (!searchInput) {

        return;

    }


    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!keyword) {

        renderSupport(
            supportData
        );

        return;

    }


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


                const displayDate =
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

                    displayDate.includes(
                        keyword
                    )

                );

            }
        );


    if (filtered.length === 0) {

        const supportList =
            document.getElementById(
                "supportList"
            );


        if (supportList) {

            supportList.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:35px;
                            color:#64748b;
                        "
                    >

                        No matching support found

                    </td>

                </tr>

            `;

        }

        return;

    }


    renderSupport(
        filtered
    );

}


// =====================================
// EDIT SUPPORT
// =====================================
// No API request here.
// Popup opens immediately.
// =====================================

function editSupport(row) {

    currentRow =
        Number(row);


    if (
        !currentRow ||
        currentRow <= 1
    ) {

        showErrorPopup(
            "Invalid support record."
        );

        return;

    }


    const item =
        supportData.find(
            function (support) {

                return Number(
                    support.row
                ) === currentRow;

            }
        );


    if (!item) {

        showErrorPopup(
            "Support record not found."
        );

        return;

    }


    setValue(
        "customerId",
        item.customerId
    );


    setValue(
        "problem",
        item.problem
    );


    setValue(
        "reference",
        item.reference
    );


    setValue(
        "date",
        convertDate(item.date)
    );


    setValue(
        "support",
        item.support
    );


    setValue(
        "supportWork",
        item.supportWork
    );


    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


// =====================================
// SET VALUE
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
// GET VALUE
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


    return (

        d.getFullYear() +

        "-" +

        String(
            d.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        "-" +

        String(
            d.getDate()
        ).padStart(
            2,
            "0"
        )

    );

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
            d.getDate()
        ).padStart(
            2,
            "0"
        ) +

        " " +

        months[
            d.getMonth()
        ] +

        " " +

        d.getFullYear()

    );

}


// =====================================
// UPDATE SUPPORT
// =====================================
// Support -> Call
// =====================================

function updateSupport() {

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        showErrorPopup(
            "No support record selected."
        );

        return;

    }


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

        showErrorPopup(
            "Please enter Support."
        );

        return;

    }


    if (!supportWork) {

        showErrorPopup(
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

        submitBtn.innerHTML =

            '<i class="fa fa-spinner fa-spin"></i> ' +
            'Submitting...';

    }


    // ===============================
    // API
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

        if (!response.ok) {

            throw new Error(
                "Server Error"
            );

        }

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
        // REMOVE FROM LOCAL DATA
        // ===============================

        supportData =
            supportData.filter(
                function (item) {

                    return Number(
                        item.row
                    ) !== Number(
                        currentRow
                    );

                }
            );


        renderSupport(
            supportData
        );


        closeEdit();


        const successMessage =
            "Support completed successfully and moved to Call.";


        currentRow = "";


        showSuccessPopup(
            successMessage,
            "Support Completed"
        );

    })

    .catch(function (error) {

        console.error(
            "Update Support Error:",
            error
        );


        showErrorPopup(
            error.message ||
            "Support submit failed."
        );

    })

    .finally(function () {

        if (submitBtn) {

            submitBtn.disabled =
                false;

            submitBtn.innerHTML =

                '<i class="fa fa-paper-plane"></i> Submit';

        }

    });

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
// DELETE SUPPORT
// =====================================
// Opens custom confirmation popup.
// =====================================

function deleteSupport() {

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        showErrorPopup(
            "No support record selected."
        );

        return;

    }


    showConfirmPopup(

        "Are you sure you want to delete this support?",

        function () {

            performDeleteSupport();

        },

        "Confirm Delete"

    );

}


// =====================================
// ACTUAL DELETE
// =====================================

function performDeleteSupport() {

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        showErrorPopup(
            "Invalid support record."
        );

        return;

    }


    const rowToDelete =
        Number(currentRow);


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
                rowToDelete

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
        // REMOVE LOCAL DATA
        // ===============================

        supportData =
            supportData.filter(
                function (item) {

                    return Number(
                        item.row
                    ) !== rowToDelete;

                }
            );


        renderSupport(
            supportData
        );


        closeEdit();


        currentRow = "";


        // ===============================
        // SUCCESS POPUP
        // ===============================

        showSuccessPopup(

            "Support deleted successfully.",

            "Deleted Successfully"

        );

    })

    .catch(function (error) {

        console.error(
            "Delete Error:",
            error
        );


        showErrorPopup(

            error.message ||
            "Delete failed."

        );

    });

}


// =====================================
// CUSTOM CONFIRM POPUP
// =====================================

function showConfirmPopup(
    message,
    callback,
    title
) {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


    const titleElement =
        document.getElementById(
            "confirmTitle"
        );


    const messageElement =
        document.getElementById(
            "confirmMessage"
        );


    const actionButton =
        document.getElementById(
            "confirmActionBtn"
        );


    if (!popup) {

        return;

    }


    titleElement.innerText =
        title ||
        "Confirm";


    messageElement.innerText =
        message ||
        "Are you sure?";


    confirmCallback =
        callback;


    actionButton.onclick =
        function () {

            const callbackToRun =
                confirmCallback;


            closeConfirmPopup();


            if (
                typeof callbackToRun ===
                "function"
            ) {

                callbackToRun();

            }

        };


    popup.classList.add(
        "show"
    );

}


// =====================================
// CLOSE CONFIRM POPUP
// =====================================

function closeConfirmPopup() {

    const popup =
        document.getElementById(
            "confirmPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }


    confirmCallback = null;

}


// =====================================
// SUCCESS POPUP
// =====================================

function showSuccessPopup(
    message,
    title
) {

    const popup =
        document.getElementById(
            "successPopup"
        );


    const titleElement =
        document.getElementById(
            "successTitle"
        );


    const messageElement =
        document.getElementById(
            "successMessage"
        );


    if (!popup) {

        return;

    }


    titleElement.innerText =
        title ||
        "Success";


    messageElement.innerText =
        message ||
        "Operation completed successfully.";


    popup.classList.add(
        "show"
    );

}


// =====================================
// CLOSE SUCCESS
// =====================================

function closeSuccessPopup() {

    const popup =
        document.getElementById(
            "successPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }

}


// =====================================
// ERROR POPUP
// =====================================

function showErrorPopup(
    message,
    title
) {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    const titleElement =
        document.getElementById(
            "errorTitle"
        );


    const messageElement =
        document.getElementById(
            "errorMessage"
        );


    if (!popup) {

        return;

    }


    titleElement.innerText =
        title ||
        "Error";


    messageElement.innerText =
        message ||
        "Something went wrong.";


    popup.classList.add(
        "show"
    );

}


// =====================================
// CLOSE ERROR
// =====================================

function closeErrorPopup() {

    const popup =
        document.getElementById(
            "errorPopup"
        );


    if (popup) {

        popup.classList.remove(
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
// CLOSE EDIT WHEN CLICK OUTSIDE
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
// CLOSE POPUPS BY CLICKING OUTSIDE
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const confirmPopup =
            document.getElementById(
                "confirmPopup"
            );


        const successPopup =
            document.getElementById(
                "successPopup"
            );


        const errorPopup =
            document.getElementById(
                "errorPopup"
            );


        if (
            confirmPopup &&
            event.target === confirmPopup
        ) {

            closeConfirmPopup();

        }


        if (
            successPopup &&
            event.target === successPopup
        ) {

            closeSuccessPopup();

        }


        if (
            errorPopup &&
            event.target === errorPopup
        ) {

            closeErrorPopup();

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
            event.key !== "Escape"
        ) {

            return;

        }


        const editModal =
            document.getElementById(
                "editModal"
            );


        if (
            editModal &&
            editModal.classList.contains(
                "show"
            )
        ) {

            closeEdit();

        }


        closeConfirmPopup();

        closeSuccessPopup();

        closeErrorPopup();

    }
);
