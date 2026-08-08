// =====================================================
// CALL.JS
// PENDING CALL - FINAL
// =====================================================


// =====================================================
// API URL
// =====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let currentRow = "";

let allCallData = [];


// =====================================================
// START
// =====================================================

document.addEventListener("DOMContentLoaded", function(){

    loadUserProfile();

    loadCall();

});


// =====================================================
// LOAD USER PROFILE
// =====================================================

function loadUserProfile(){

    const username =
        localStorage.getItem("username");

    const picture =
        localStorage.getItem("picture");


    const usernameElement =
        document.getElementById("username");


    const profileImg =
        document.getElementById("profileImg");


    if(usernameElement && username){

        usernameElement.innerText = username;

    }


    if(profileImg && picture){

        profileImg.src = picture;

    }

}


// =====================================================
// PROFILE MENU
// =====================================================

function toggleProfile(){

    const menu =
        document.getElementById("profileMenu");


    if(!menu){

        return;

    }


    menu.classList.toggle("show");

}


// =====================================================
// CLOSE PROFILE MENU WHEN CLICK OUTSIDE
// =====================================================

document.addEventListener("click", function(event){

    const profile =
        document.querySelector(".profile");


    const menu =
        document.getElementById("profileMenu");


    if(!profile || !menu){

        return;

    }


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

    const filter =
        document.getElementById("filterRow");


    if(!filter){

        return;

    }


    filter.classList.toggle("show");

}


// =====================================================
// LOAD CALL DATA
// =====================================================

function loadCall(){

    const list =
        document.getElementById("callList");


    if(list){

        list.innerHTML = `
            <tr>
                <td colspan="7">
                    Loading...
                </td>
            </tr>
        `;

    }


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

    .then(function(response){

        return response.json();

    })

    .then(function(data){

        console.log("Call Data:",data);


        if(data.success === false){

            showMessage(
                "Error",
                data.message || "Failed to load call data",
                "error"
            );

            return;

        }


        allCallData =
            Array.isArray(data.data)
            ? data.data
            : [];


        renderCall(allCallData);

    })

    .catch(function(error){

        console.error(
            "Load Call Error:",
            error
        );


        if(list){

            list.innerHTML = `
                <tr>
                    <td colspan="7">
                        Server Error
                    </td>
                </tr>
            `;

        }

    });

}


// =====================================================
// RENDER CALL TABLE
// =====================================================

function renderCall(data){

    const list =
        document.getElementById("callList");


    if(!list){

        return;

    }


    list.innerHTML = "";


    if(!data || data.length === 0){

        list.innerHTML = `
            <tr>
                <td colspan="7">
                    No Pending Call Found
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(function(item){

        const row =
            document.createElement("tr");


        row.innerHTML = `

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

        `;


        list.appendChild(row);

    });

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date){

    if(!date){

        return "";

    }


    const d =
        new Date(date);


    if(isNaN(d.getTime())){

        return date;

    }


    const day =
        String(d.getDate())
        .padStart(2,"0");


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


// =====================================================
// DATE FOR DATE INPUT
// =====================================================

function convertDate(date){

    if(!date){

        return "";

    }


    const d =
        new Date(date);


    if(isNaN(d.getTime())){

        return "";

    }


    const year =
        d.getFullYear();


    const month =
        String(d.getMonth()+1)
        .padStart(2,"0");


    const day =
        String(d.getDate())
        .padStart(2,"0");


    return `${year}-${month}-${day}`;

}


// =====================================================
// EDIT CALL
// =====================================================

function editCall(row){

    currentRow = row;


    fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:JSON.stringify({

            action:"getSingleCall",

            row:row

        })

    })

    .then(function(response){

        return response.json();

    })

    .then(function(data){

        console.log(
            "Single Call:",
            data
        );


        if(data.success === false){

            showMessage(
                "Error",
                data.message || "Failed to load data",
                "error"
            );

            return;

        }


        setValue(
            "customerId",
            data.customerId
        );


        setValue(
            "problem",
            data.problem
        );


        setValue(
            "reference",
            data.reference
        );


        setValue(
            "date",
            convertDate(data.date)
        );


        setValue(
            "support",
            data.support
        );


        setValue(
            "supportWork",
            data.supportWork
        );


        setValue(
            "call",
            data.call
        );


        setValue(
            "callWork",
            data.callWork
        );


        const modal =
            document.getElementById("editModal");


        if(modal){

            modal.classList.add("show");

        }

    })

    .catch(function(error){

        console.error(
            "Edit Error:",
            error
        );


        showMessage(
            "Error",
            "Failed to load call data",
            "error"
        );

    });

}


// =====================================================
// SET INPUT VALUE
// =====================================================

function setValue(id,value){

    const element =
        document.getElementById(id);


    if(element){

        element.value =
            value || "";

    }

}


// =====================================================
// CLOSE EDIT
// =====================================================

function closeEdit(){

    const modal =
        document.getElementById("editModal");


    if(modal){

        modal.classList.remove("show");

    }


    currentRow = "";

}


// =====================================================
// UPDATE CALL
// =====================================================

function updateCall(){

    if(!currentRow){

        showMessage(
            "Error",
            "Invalid record",
            "error"
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
        getValue("support");


    const supportWork =
        getValue("supportWork");


    const call =
        getValue("call");


    const callWork =
        getValue("callWork");


    if(customerId === "" ||
       problem === ""){

        showMessage(
            "Required",
            "Customer ID and Problem are required",
            "error"
        );

        return;

    }


    fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:JSON.stringify({

            action:"updateCall",

            row:currentRow,

            customerId:customerId,

            problem:problem,

            reference:reference,

            date:date,

            support:support,

            supportWork:supportWork,

            call:call,

            callWork:callWork

        })

    })

    .then(function(response){

        return response.json();

    })

    .then(function(data){

        console.log(
            "Update Response:",
            data
        );


        if(data.success === false){

            showMessage(
                "Update Failed",
                data.message || "Could not update record",
                "error"
            );

            return;

        }


        closeEdit();


        showMessage(
            "Success",
            data.message || "Call Updated Successfully",
            "success"
        );


        loadCall();

    })

    .catch(function(error){

        console.error(
            "Update Error:",
            error
        );


        showMessage(
            "Error",
            "Update Failed",
            "error"
        );

    });

}


// =====================================================
// DELETE CALL
// =====================================================

function deleteCall(){

    if(!currentRow){

        showMessage(
            "Error",
            "Invalid record",
            "error"
        );

        return;

    }


    openConfirm();

}


// =====================================================
// CONFIRM DELETE
// =====================================================

function confirmDelete(){

    if(!currentRow){

        closeConfirm();

        return;

    }


    fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:JSON.stringify({

            action:"deleteCall",

            row:currentRow

        })

    })

    .then(function(response){

        return response.json();

    })

    .then(function(data){

        console.log(
            "Delete Response:",
            data
        );


        closeConfirm();

        closeEdit();


        if(data.success === false){

            showMessage(
                "Delete Failed",
                data.message || "Could not delete record",
                "error"
            );

            return;

        }


        showMessage(
            "Deleted",
            data.message || "Call Deleted Successfully",
            "success"
        );


        currentRow = "";


        loadCall();

    })

    .catch(function(error){

        console.error(
            "Delete Error:",
            error
        );


        closeConfirm();


        showMessage(
            "Error",
            "Delete Failed",
            "error"
        );

    });

}


// =====================================================
// CONFIRM BOX OPEN
// =====================================================

function openConfirm(){

    const confirmModal =
        document.getElementById("confirmModal");


    if(confirmModal){

        confirmModal.classList.add("show");

    }

}


// =====================================================
// CLOSE CONFIRM
// =====================================================

function closeConfirm(){

    const confirmModal =
        document.getElementById("confirmModal");


    if(confirmModal){

        confirmModal.classList.remove("show");

    }

}


// =====================================================
// MESSAGE POPUP
// =====================================================

function showMessage(
    title,
    message,
    type
){

    const modal =
        document.getElementById("messageModal");


    const titleElement =
        document.getElementById("messageTitle");


    const textElement =
        document.getElementById("messageText");


    const icon =
        document.getElementById("messageIcon");


    if(!modal){

        alert(message);

        return;

    }


    if(titleElement){

        titleElement.innerText =
            title;

    }


    if(textElement){

        textElement.innerText =
            message;

    }


    if(icon){

        if(type === "error"){

            icon.innerHTML =
                '<i class="fa-solid fa-circle-xmark"></i>';

        }
        else{

            icon.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>';

        }

    }


    modal.classList.add("show");

}


// =====================================================
// CLOSE MESSAGE
// =====================================================

function closeMessage(){

    const modal =
        document.getElementById("messageModal");


    if(modal){

        modal.classList.remove("show");

    }

}


// =====================================================
// FILTER - APPLY
// =====================================================

function applyFilter(){

    const fromDate =
        getValue("fromDate");


    const toDate =
        getValue("toDate");


    const lastDays =
        getValue("lastDays");


    const search =
        getValue("searchCall")
        .toLowerCase()
        .trim();


    let result =
        [...allCallData];


    // =============================
    // SEARCH
    // =============================

    if(search){

        result =
            result.filter(function(item){

                const text = (

                    String(item.customerId || "") +
                    " " +
                    String(item.problem || "") +
                    " " +
                    String(item.reference || "") +
                    " " +
                    String(item.support || "") +
                    " " +
                    String(item.supportWork || "") +
                    " " +
                    String(item.call || "") +
                    " " +
                    String(item.callWork || "")

                ).toLowerCase();


                return text.includes(search);

            });

    }


    // =============================
    // FROM DATE
    // =============================

    if(fromDate){

        const from =
            new Date(fromDate);

        from.setHours(
            0,0,0,0
        );


        result =
            result.filter(function(item){

                const date =
                    getItemDate(item);


                if(!date){

                    return false;

                }


                return date >= from;

            });

    }


    // =============================
    // TO DATE
    // =============================

    if(toDate){

        const to =
            new Date(toDate);

        to.setHours(
            23,59,59,999
        );


        result =
            result.filter(function(item){

                const date =
                    getItemDate(item);


                if(!date){

                    return false;

                }


                return date <= to;

            });

    }


    // =================================================
    // LAST DAYS
    //
    // Example:
    // Last Days = 7
    //
    // Today থেকে গত 7 দিনের records
    // =================================================

    if(lastDays){

        const days =
            Number(lastDays);


        if(days > 0){

            const today =
                new Date();


            today.setHours(
                23,59,59,999
            );


            const startDate =
                new Date();


            startDate.setDate(
                startDate.getDate() - days
            );


            startDate.setHours(
                0,0,0,0
            );


            result =
                result.filter(function(item){

                    const date =
                        getItemDate(item);


                    if(!date){

                        return false;

                    }


                    return (
                        date >= startDate &&
                        date <= today
                    );

                });

        }

    }


    renderCall(result);

}


// =====================================================
// GET ITEM DATE
// =====================================================

function getItemDate(item){

    if(!item || !item.date){

        return null;

    }


    const date =
        new Date(item.date);


    if(isNaN(date.getTime())){

        return null;

    }


    date.setHours(
        0,0,0,0
    );


    return date;

}


// =====================================================
// RESET FILTER
// =====================================================

function resetFilter(){

    setValue(
        "fromDate",
        ""
    );


    setValue(
        "toDate",
        ""
    );


    setValue(
        "lastDays",
        ""
    );


    setValue(
        "searchCall",
        ""
    );


    renderCall(allCallData);

}


// =====================================================
// GET VALUE
// =====================================================

function getValue(id){

    const element =
        document.getElementById(id);


    if(!element){

        return "";

    }


    return element.value.trim();

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value){

    if(value === null ||
       value === undefined){

        return "";

    }


    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}


// =====================================================
// CLOSE MODALS BY CLICKING OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function(event){

        const editModal =
            document.getElementById("editModal");


        const confirmModal =
            document.getElementById("confirmModal");


        const messageModal =
            document.getElementById("messageModal");


        if(
            editModal &&
            event.target === editModal
        ){

            closeEdit();

        }


        if(
            confirmModal &&
            event.target === confirmModal
        ){

            closeConfirm();

        }


        if(
            messageModal &&
            event.target === messageModal
        ){

            closeMessage();

        }

    }
);
