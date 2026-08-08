// =====================================================
// L4SM PENDING CALL
// FULL FINAL call.js
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================================
// GLOBAL
// =====================================================

let currentRow = "";

let callData = [];

let filteredCallData = [];


// =====================================================
// START
// =====================================================

document.addEventListener("DOMContentLoaded", function(){

    loadProfile();

    loadCall();

});


// =====================================================
// PROFILE
// =====================================================

function loadProfile(){

    const user =
        localStorage.getItem("username");

    const username =
        document.getElementById("username");

    if(user && username){

        username.innerText = user;

    }


    const picture =
        localStorage.getItem("picture");

    const profileImg =
        document.getElementById("profileImg");

    if(picture && profileImg){

        profileImg.src = picture;

    }

}


// =====================================================
// PROFILE MENU
// =====================================================

function toggleProfile(){

    const menu =
        document.getElementById("profileMenu");

    if(!menu) return;

    menu.classList.toggle("show");

}


// =====================================================
// CLOSE PROFILE OUTSIDE
// =====================================================

document.addEventListener("click", function(event){

    const profile =
        document.querySelector(".profile");

    const menu =
        document.getElementById("profileMenu");

    if(!profile || !menu) return;

    if(!profile.contains(event.target)){

        menu.classList.remove("show");

    }

});


// =====================================================
// MY ACCOUNT
// =====================================================

function myAccount(){

    window.location.href =
        "myaccount.html";

}


// =====================================================
// LOGOUT
// =====================================================

function logout(){

    localStorage.clear();

    window.location.href =
        "index.html";

}


// =====================================================
// BACK
// =====================================================

function goBack(){

    window.location.href =
        "dashboard.html";

}


// =====================================================
// FILTER TOGGLE
// =====================================================

function toggleFilter(){

    const filterBar =
        document.getElementById("filterBar");

    if(!filterBar) return;

    filterBar.classList.toggle("show");

}


// =====================================================
// LOAD CALL
// =====================================================

function loadCall(){

    const list =
        document.getElementById("callList");

    if(!list) return;


    list.innerHTML = `

        <tr>

            <td colspan="7"
                style="text-align:center;">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Loading...

            </td>

        </tr>

    `;


    fetch(API_URL,{

        method:"POST",

        headers:{

            "Content-Type":
            "text/plain;charset=utf-8"

        },

        body:JSON.stringify({

            action:"getPendingCall"

        })

    })

    .then(response => {

        if(!response.ok){

            throw new Error(
                "Network Error"
            );

        }

        return response.json();

    })

    .then(data => {

        console.log(
            "Pending Call:",
            data
        );


        if(
            !data ||
            data.success !== true
        ){

            list.innerHTML = `

                <tr>

                    <td colspan="7"
                        style="text-align:center;color:red;">

                        ${
                            data &&
                            data.message
                            ?
                            escapeHTML(data.message)
                            :
                            "Failed to load Call data"
                        }

                    </td>

                </tr>

            `;

            return;

        }


        callData =
            Array.isArray(data.data)
            ?
            data.data
            :
            [];


        filteredCallData =
            [...callData];


        displayCall(
            filteredCallData
        );

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


// =====================================================
// DISPLAY CALL
// =====================================================

function displayCall(data){

    const list =
        document.getElementById("callList");

    if(!list) return;


    if(
        !data ||
        data.length === 0
    ){

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


    data.forEach(function(item){

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

                    ${escapeHTML(
                        item.support
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        item.supportWork
                    )}

                </td>


                <td>

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editCall(${Number(item.row)})">

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


// =====================================================
// APPLY FILTER
// =====================================================

function applyFilter(){

    const fromInput =
        document.getElementById("fromDate");

    const toInput =
        document.getElementById("toDate");

    const lastDaysInput =
        document.getElementById("lastDays");

    const searchInput =
        document.getElementById("searchCall");


    const fromValue =
        fromInput
        ?
        fromInput.value
        :
        "";


    const toValue =
        toInput
        ?
        toInput.value
        :
        "";


    const lastDaysValue =
        lastDaysInput
        ?
        Number(lastDaysInput.value)
        :
        0;


    const searchValue =
        searchInput
        ?
        searchInput.value
            .trim()
            .toLowerCase()
        :
        "";


    let result =
        [...callData];


    // =================================================
    // LAST DAYS
    // =================================================

    if(lastDaysValue > 0){

        const today =
            new Date();

        today.setHours(
            0,0,0,0
        );


        const startDate =
            new Date(today);

        startDate.setDate(
            today.getDate() -
            lastDaysValue
        );


        result =
            result.filter(function(item){

                const itemDate =
                    parseItemDate(
                        item.date
                    );

                if(!itemDate){

                    return false;

                }


                itemDate.setHours(
                    0,0,0,0
                );


                return (
                    itemDate >= startDate &&
                    itemDate <= today
                );

            });

    }


    // =================================================
    // FROM DATE
    // =================================================

    if(fromValue){

        const fromDate =
            parseInputDate(
                fromValue
            );


        result =
            result.filter(function(item){

                const itemDate =
                    parseItemDate(
                        item.date
                    );

                if(!itemDate){

                    return false;

                }


                itemDate.setHours(
                    0,0,0,0
                );


                return itemDate >=
                    fromDate;

            });

    }


    // =================================================
    // TO DATE
    // =================================================

    if(toValue){

        const toDate =
            parseInputDate(
                toValue
            );


        toDate.setHours(
            23,59,59,999
        );


        result =
            result.filter(function(item){

                const itemDate =
                    parseItemDate(
                        item.date
                    );

                if(!itemDate){

                    return false;

                }


                return itemDate <=
                    toDate;

            });

    }


    // =================================================
    // SEARCH
    // =================================================

    if(searchValue){

        result =
            result.filter(function(item){

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


                const support =
                    String(
                        item.support || ""
                    ).toLowerCase();


                const supportWork =
                    String(
                        item.supportWork || ""
                    ).toLowerCase();


                const call =
                    String(
                        item.call || ""
                    ).toLowerCase();


                const callWork =
                    String(
                        item.callWork || ""
                    ).toLowerCase();


                return (

                    customerId.includes(
                        searchValue
                    )

                    ||

                    problem.includes(
                        searchValue
                    )

                    ||

                    reference.includes(
                        searchValue
                    )

                    ||

                    support.includes(
                        searchValue
                    )

                    ||

                    supportWork.includes(
                        searchValue
                    )

                    ||

                    call.includes(
                        searchValue
                    )

                    ||

                    callWork.includes(
                        searchValue
                    )

                );

            });

    }


    filteredCallData =
        result;


    displayCall(
        filteredCallData
    );

}


// =====================================================
// RESET FILTER
// =====================================================

function resetFilter(){

    const fromInput =
        document.getElementById("fromDate");

    const toInput =
        document.getElementById("toDate");

    const lastDaysInput =
        document.getElementById("lastDays");

    const searchInput =
        document.getElementById("searchCall");


    if(fromInput){

        fromInput.value = "";

    }


    if(toInput){

        toInput.value = "";

    }


    if(lastDaysInput){

        lastDaysInput.value = "";

    }


    if(searchInput){

        searchInput.value = "";

    }


    filteredCallData =
        [...callData];


    displayCall(
        filteredCallData
    );

}


// =====================================================
// DATE PARSER
// =====================================================

function parseItemDate(value){

    if(!value){

        return null;

    }


    const d =
        new Date(value);


    if(
        isNaN(
            d.getTime()
        )
    ){

        return null;

    }


    return d;

}


// =====================================================
// INPUT DATE PARSER
// =====================================================

function parseInputDate(value){

    if(!value){

        return null;

    }


    const parts =
        value.split("-");


    return new Date(

        Number(parts[0]),

        Number(parts[1]) - 1,

        Number(parts[2])

    );

}


// =====================================================
// EDIT CALL
// =====================================================

function editCall(row){

    currentRow =
        Number(row);


    const item =
        callData.find(function(record){

            return Number(
                record.row
            ) === Number(row);

        });


    if(!item){

        alert(
            "Call data not found. Please refresh."
        );

        return;

    }


    // =============================================
    // FILL POPUP
    // =============================================

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


    if(customerId){

        customerId.value =
            item.customerId || "";

    }


    if(problem){

        problem.value =
            item.problem || "";

    }


    if(reference){

        reference.value =
            item.reference || "";

    }


    if(date){

        date.value =
            convertDate(
                item.date
            );

    }


    if(support){

        support.value =
            item.support || "";

    }


    if(supportWork){

        supportWork.value =
            item.supportWork || "";

    }


    if(call){

        call.value =
            item.call || "";

    }


    if(callWork){

        callWork.value =
            item.callWork || "";

    }


    // =============================================
    // OPEN IMMEDIATELY
    // =============================================

    const modal =
        document.getElementById(
            "editModal"
        );


    if(modal){

        modal.classList.add(
            "show"
        );

    }

}


// =====================================================
// CONVERT DATE
// =====================================================

function convertDate(date){

    if(!date){

        return "";

    }


    if(
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(date)
        )
    ){

        return String(date);

    }


    const d =
        new Date(date);


    if(
        isNaN(
            d.getTime()
        )
    ){

        return "";

    }


    return (

        d.getFullYear()

        +

        "-" +

        String(
            d.getMonth() + 1
        ).padStart(2,"0")

        +

        "-" +

        String(
            d.getDate()
        ).padStart(2,"0")

    );

}


// =====================================================
// DISPLAY DATE
// =====================================================

function formatDate(date){

    if(!date){

        return "";

    }


    const d =
        new Date(date);


    if(
        isNaN(
            d.getTime()
        )
    ){

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
        ).padStart(2,"0")

        +

        " " +

        months[
            d.getMonth()
        ]

        +

        " " +

        d.getFullYear()

    );

}


// =====================================================
// CLOSE EDIT
// =====================================================

function closeEdit(){

    const modal =
        document.getElementById(
            "editModal"
        );


    if(modal){

        modal.classList.remove(
            "show"
        );

    }


    currentRow = "";

}


// =====================================================
// UPDATE CALL
// =====================================================

function updateCall(){

    if(!currentRow){

        alert(
            "Invalid Call Row"
        );

        return;

    }


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


    if(!customerId){

        alert(
            "Customer ID is required"
        );

        return;

    }


    if(!call){

        alert(
            "Call is required"
        );

        return;

    }


    if(!callWork){

        alert(
            "Call Work is required"
        );

        return;

    }


    const submitButton =
        document.querySelector(
            ".submit-btn"
        );


    if(submitButton){

        submitButton.disabled =
            true;

        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    }


    fetch(API_URL,{

        method:"POST",

        headers:{

            "Content-Type":
            "text/plain;charset=utf-8"

        },

        body:JSON.stringify({

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

        if(
            data &&
            data.success === true
        ){

            // =================================
            // REFRESH FROM SERVER
            // =================================

            closeEdit();

            showMessage(
                "Success",
                "Call updated successfully."
            );


            // =================================
            // AUTO REFRESH
            // =================================

            loadCall();

        }

        else{

            alert(

                data &&
                data.message

                ?

                data.message

                :

                "Update Failed"

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

        if(submitButton){

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                '<i class="fa-solid fa-save"></i> Submit';

        }

    });

}


// =====================================================
// DELETE CALL
// =====================================================

function deleteCall(){

    if(!currentRow){

        alert(
            "Invalid Call Row"
        );

        return;

    }


    const confirmModal =
        document.getElementById(
            "confirmModal"
        );


    if(confirmModal){

        confirmModal.classList.add(
            "show"
        );

        return;

    }


    if(
        confirm(
            "Are you sure you want to delete this record?"
        )
    ){

        confirmDelete();

    }

}


// =====================================================
// CONFIRM DELETE
// =====================================================

function confirmDelete(){

    if(!currentRow){

        return;

    }


    closeConfirm();


    fetch(API_URL,{

        method:"POST",

        headers:{

            "Content-Type":
            "text/plain;charset=utf-8"

        },

        body:JSON.stringify({

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

        if(
            data &&
            data.success === true
        ){

            closeEdit();


            showMessage(
                "Deleted",
                "Call deleted successfully."
            );


            // =================================
            // AUTO REFRESH
            // =================================

            loadCall();

        }

        else{

            alert(

                data &&
                data.message

                ?

                data.message

                :

                "Delete Failed"

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

    })

    .finally(() => {

        currentRow = "";

    });

}


// =====================================================
// CLOSE CONFIRM
// =====================================================

function closeConfirm(){

    const modal =
        document.getElementById(
            "confirmModal"
        );


    if(modal){

        modal.classList.remove(
            "show"
        );

    }

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    title,
    message
){

    const modal =
        document.getElementById(
            "messageModal"
        );


    if(!modal){

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


    if(titleElement){

        titleElement.innerText =
            title;

    }


    if(textElement){

        textElement.innerText =
            message;

    }


    modal.classList.add(
        "show"
    );

}


// =====================================================
// CLOSE MESSAGE
// =====================================================

function closeMessage(){

    const modal =
        document.getElementById(
            "messageModal"
        );


    if(modal){

        modal.classList.remove(
            "show"
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value){

    if(
        value === null ||
        value === undefined
    ){

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


// =====================================================
// MANUAL REFRESH
// =====================================================

function refreshCall(){

    loadCall();

}
