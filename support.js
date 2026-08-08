// =====================================
// SUPPORT WEB - FINAL JAVASCRIPT
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
// PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserProfile();

        loadSupport();

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
// USER PROFILE
// =====================================

function loadUserProfile() {

    const username =
        localStorage.getItem(
            "username"
        );

    const picture =
        localStorage.getItem(
            "picture"
        );


    const usernameElement =
        document.getElementById(
            "username"
        );

    const profileImg =
        document.getElementById(
            "profileImg"
        );


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


    menu.classList.toggle(
        "show"
    );

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
                        color:#64748b;
                    "
                >

                    Loading...

                </td>

            </tr>

        `;

    }


    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body: JSON.stringify({

                action:
                    "getPendingSupport"

            })

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Support Data:",
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

        }
    )

    .catch(
        function (error) {

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

        }
    );

}


// =====================================
// RENDER SUPPORT TABLE
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


    data.forEach(
        function (item) {

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

        }
    );


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
                        item.customerId ||
                        ""
                    ).toLowerCase();


                const problem =
                    String(
                        item.problem ||
                        ""
                    ).toLowerCase();


                const reference =
                    String(
                        item.reference ||
                        ""
                    ).toLowerCase();


                const date =
                    String(
                        item.date ||
                        ""
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


    if (
        filtered.length === 0
    ) {

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

function editSupport(row) {

    currentRow =
        Number(row);


    if (
        !currentRow ||
        currentRow <= 1
    ) {

        showErrorPopup(
            "Invalid support record.",
            "Error"
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
            "Support record not found.",
            "Error"
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
        convertDate(
            item.date
        )
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
// SET INPUT VALUE
// =====================================

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) return;


    element.value =
        value || "";

}


// =====================================
// GET INPUT VALUE
// =====================================

function getValue(id) {

    const element =
        document.getElementById(
            id
        );


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
        )

        +

        " "

        +

        months[
            d.getMonth()
        ]

        +

        " "

        +

        d.getFullYear()

    );

}


// =====================================
// SUBMIT SUPPORT
// =====================================
// Support -> Call
// =====================================

function updateSupport() {

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        showErrorPopup(
            "No support record selected.",
            "Error"
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


    // =================================
    // VALIDATION
    // =================================

    if (!support) {

        showErrorPopup(
            "Please enter Support.",
            "Required"
        );

        return;

    }


    if (!supportWork) {

        showErrorPopup(
            "Please enter Support Work.",
            "Required"
        );

        return;

    }


    // =================================
    // SUBMIT BUTTON
    // =================================

    const submitBtn =
        document.querySelector(
            "#editModal .submit-btn"
        );


    if (submitBtn) {

        submitBtn.disabled =
            true;

        submitBtn.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    }


    // =================================
    // API REQUEST
    // =================================

    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body: JSON.stringify({

                action:
                    "moveToCall",

                row:
                    Number(
                        currentRow
                    ),

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

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Move To Call:",
                data
            );


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(

                    data &&
                    data.message
                        ? data.message
                        : "Support submission failed"

                );

            }


            // =========================
            // REMOVE LOCAL ROW
            // =========================

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


            currentRow = "";


            showSuccessPopup(

                "Support completed successfully and moved to Call.",

                "Support Completed"

            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "Update Error:",
                error
            );


            showErrorPopup(

                error.message ||
                "Support submit failed.",

                "Submit Failed"

            );

        }
    )

    .finally(
        function () {

            if (submitBtn) {

                submitBtn.disabled =
                    false;

                submitBtn.innerHTML =
                    '<i class="fa fa-paper-plane"></i> Submit';

            }

        }
    );

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
// DELETE BUTTON
// =====================================

function deleteSupport() {

    if (
        !currentRow ||
        Number(currentRow) <= 1
    ) {

        showErrorPopup(
            "Please select a support record first.",
            "Delete Error"
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
// PERFORM DELETE
// =====================================

function performDeleteSupport() {

    const rowToDelete =
        Number(
            currentRow
        );


    if (
        !rowToDelete ||
        rowToDelete <= 1
    ) {

        showErrorPopup(
            "Invalid support row.",
            "Delete Error"
        );

        return;

    }


    const deleteButton =
        document.querySelector(
            "#editModal .delete-btn"
        );


    if (deleteButton) {

        deleteButton.disabled =
            true;

        deleteButton.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Deleting...';

    }


    fetch(
        API_URL,
        {

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

        }
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server Error"
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Delete Response:",
                data
            );


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(

                    data &&
                    data.message
                        ? data.message
                        : "Delete failed."

                );

            }


            // =========================
            // REMOVE FROM LOCAL ARRAY
            // =========================

            supportData =
                supportData.filter(
                    function (item) {

                        return Number(
                            item.row
                        ) !== rowToDelete;

                    }
                );


            // =========================
            // UPDATE TABLE
            // =========================

            renderSupport(
                supportData
            );


            // =========================
            // CLOSE EDIT
            // =========================

            closeEdit();


            currentRow = "";


            // =========================
            // SUCCESS POPUP
            // =========================

            showSuccessPopup(

                "Support deleted successfully.",

                "Deleted Successfully"

            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "Delete Error:",
                error
            );


            showErrorPopup(

                error.message ||
                "Unable to delete support.",

                "Delete Failed"

            );

        }
    )

    .finally(
        function () {

            if (deleteButton) {

                deleteButton.disabled =
                    false;

                deleteButton.innerHTML =
                    '<i class="fa fa-trash"></i> Delete';

            }

        }
    );

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


    if (titleElement) {

        titleElement.innerText =
            title ||
            "Confirm";

    }


    if (messageElement) {

        messageElement.innerText =
            message ||
            "Are you sure?";

    }


    confirmCallback =
        callback;


    if (actionButton) {

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

    }


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


    if (titleElement) {

        titleElement.innerText =
            title ||
            "Success";

    }


    if (messageElement) {

        messageElement.innerText =
            message ||
            "Operation completed successfully.";

    }


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


    if (titleElement) {

        titleElement.innerText =
            title ||
            "Error";

    }


    if (messageElement) {

        messageElement.innerText =
            message ||
            "Something went wrong.";

    }


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
// CLOSE PROFILE OUTSIDE
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
// CLOSE EDIT BY OUTSIDE CLICK
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
// CLOSE CUSTOM POPUPS OUTSIDE
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


        closeConfirmPopup();

        closeSuccessPopup();

        closeErrorPopup();

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
);
