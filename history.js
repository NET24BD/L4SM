"use strict";

/* =========================================================
   HISTORY SYSTEM - FINAL JS
   ========================================================= */


/* =========================
   GLOBAL SETTINGS
========================= */

const ROWS_PER_PAGE = 10;

let currentPage = 1;
let selectedRow = null;


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {

    loadUserProfile();

    createPagination();

    showPage(1);

    setupOutsideClick();

});



/* =========================
   LOAD USER PROFILE
========================= */

function loadUserProfile() {

    const userName =
        document.getElementById("userName");

    const userRole =
        document.getElementById("userRole");

    const userPhoto =
        document.getElementById("userPhoto");


    /*
       Login system থেকে সাধারণত
       এই localStorage values আসবে:

       username
       name
       role
       photo
    */

    const username =
        localStorage.getItem("username") || "";

    const name =
        localStorage.getItem("name") || "";

    const role =
        localStorage.getItem("role") || "";

    const photo =
        localStorage.getItem("photo") || "";


    /* USERNAME / NAME */

    if (userName) {

        userName.textContent =
            name || username || "User";

    }


    /* ROLE */

    if (userRole) {

        userRole.textContent =
            role || "User";

    }


    /* PROFILE PHOTO */

    if (userPhoto) {

        if (photo.trim() !== "") {

            userPhoto.src = photo;

        }

        else {

            setDefaultProfile(userPhoto);

        }


        /*
           Photo URL কাজ না করলে
           Default profile দেখাবে
        */

        userPhoto.onerror = function () {

            setDefaultProfile(userPhoto);

        };

    }

}



/* =========================
   DEFAULT PROFILE
========================= */

function setDefaultProfile(img) {

    img.src =
        "https://ui-avatars.com/api/?name=User&background=064e3b&color=ffffff&size=100";

}



/* =========================
   BACK BUTTON
========================= */

function goBack() {

    if (window.history.length > 1) {

        window.history.back();

    }

    else {

        window.location.href =
            "dashboard.html";

    }

}



/* =========================
   FILTER SHOW / HIDE
========================= */

function toggleFilter() {

    const filterBox =
        document.getElementById("filterBox");

    if (!filterBox) return;

    filterBox.classList.toggle("show");

}



/* =========================
   PROFILE MENU
========================= */

function toggleProfile() {

    const menu =
        document.getElementById("profileMenu");

    if (!menu) return;


    if (menu.style.display === "block") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}



/* =========================
   OUTSIDE CLICK
========================= */

function setupOutsideClick() {

    document.addEventListener("click", function (event) {

        const profile =
            document.querySelector(".profile");

        const menu =
            document.getElementById("profileMenu");


        if (
            profile &&
            menu &&
            !profile.contains(event.target)
        ) {

            menu.style.display = "none";

        }

    });

}



/* =========================
   LOGOUT
========================= */

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    /*
       Login session data clear
    */

    localStorage.clear();

    sessionStorage.clear();


    /*
       Login page
    */

    window.location.href =
        "login.html";

}



/* =========================
   GET TABLE ROWS
========================= */

function getRows() {

    return Array.from(
        document.querySelectorAll(
            "#historyTable tr"
        )
    );

}



/* =========================
   SHOW PAGE
========================= */

function showPage(page) {

    const rows = getRows();

    const totalPages =
        Math.ceil(
            rows.length / ROWS_PER_PAGE
        );


    if (totalPages === 0) {

        currentPage = 1;

        createPagination();

        return;

    }


    if (page < 1) {

        page = 1;

    }


    if (page > totalPages) {

        page = totalPages;

    }


    currentPage = page;


    const start =
        (page - 1) * ROWS_PER_PAGE;


    const end =
        start + ROWS_PER_PAGE;


    rows.forEach(function (row, index) {

        if (
            index >= start &&
            index < end
        ) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });


    createPagination();

}



/* =========================
   CREATE PAGINATION
========================= */

function createPagination() {

    const pagination =
        document.getElementById("pagination");

    if (!pagination) return;


    const rows = getRows();

    const totalPages =
        Math.ceil(
            rows.length / ROWS_PER_PAGE
        );


    pagination.innerHTML = "";


    if (totalPages <= 1) {

        return;

    }


    /* PREVIOUS */

    const previous =
        document.createElement("button");

    previous.type = "button";

    previous.innerHTML =
        '<i class="fa fa-chevron-left"></i>';


    previous.disabled =
        currentPage === 1;


    previous.onclick = function () {

        if (currentPage > 1) {

            showPage(currentPage - 1);

        }

    };


    pagination.appendChild(previous);



    /* PAGE NUMBERS */

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement("button");


        button.type = "button";

        button.textContent = i;


        if (i === currentPage) {

            button.classList.add("active");

        }


        button.onclick = function () {

            showPage(i);

        };


        pagination.appendChild(button);

    }



    /* NEXT */

    const next =
        document.createElement("button");

    next.type = "button";

    next.innerHTML =
        '<i class="fa fa-chevron-right"></i>';


    next.disabled =
        currentPage === totalPages;


    next.onclick = function () {

        if (currentPage < totalPages) {

            showPage(currentPage + 1);

        }

    };


    pagination.appendChild(next);

}



/* =========================
   PARSE DATE
========================= */

function parseHistoryDate(value) {

    if (!value) {

        return null;

    }


    value =
        value.trim();


    /*
       DD-MM-YYYY
    */

    if (
        /^\d{2}-\d{2}-\d{4}$/.test(value)
    ) {

        const parts =
            value.split("-");


        return new Date(
            Number(parts[2]),
            Number(parts[1]) - 1,
            Number(parts[0])
        );

    }


    /*
       YYYY-MM-DD
    */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

        const parts =
            value.split("-");


        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    }


    const date =
        new Date(value);


    if (isNaN(date.getTime())) {

        return null;

    }


    return date;

}



/* =========================
   FILTER DATA
========================= */

function filterData() {

    const from =
        document.getElementById("fromDate").value;


    const to =
        document.getElementById("toDate").value;


    const search =
        document.getElementById("search")
            .value
            .trim()
            .toLowerCase();


    const fromDate =
        from
            ? new Date(from + "T00:00:00")
            : null;


    const toDate =
        to
            ? new Date(to + "T23:59:59")
            : null;


    const rows =
        getRows();


    rows.forEach(function (row) {

        const cells =
            row.children;


        if (cells.length < 4) {

            return;

        }


        const customerId =
            cells[0].innerText
                .trim()
                .toLowerCase();


        const problem =
            cells[1].innerText
                .trim()
                .toLowerCase();


        const reference =
            cells[2].innerText
                .trim()
                .toLowerCase();


        const dateText =
            cells[3].innerText
                .trim();


        const rowDate =
            parseHistoryDate(dateText);


        let show = true;


        /* DATE FROM */

        if (fromDate) {

            if (
                !rowDate ||
                rowDate < fromDate
            ) {

                show = false;

            }

        }


        /* DATE TO */

        if (
            show &&
            toDate
        ) {

            if (
                !rowDate ||
                rowDate > toDate
            ) {

                show = false;

            }

        }


        /* SEARCH */

        if (
            show &&
            search !== ""
        ) {

            const matches =
                customerId.includes(search) ||
                problem.includes(search) ||
                reference.includes(search);


            if (!matches) {

                show = false;

            }

        }


        row.dataset.filtered =
            show ? "true" : "false";

    });


    currentPage = 1;

    showFilteredPage(1);

}



/* =========================
   SHOW FILTERED PAGE
========================= */

function showFilteredPage(page) {

    const rows =
        getRows();


    const filteredRows =
        rows.filter(function (row) {

            return row.dataset.filtered !== "false";

        });


    const totalPages =
        Math.ceil(
            filteredRows.length /
            ROWS_PER_PAGE
        );


    if (totalPages === 0) {

        rows.forEach(function (row) {

            row.style.display = "none";

        });


        renderFilteredPagination(0);

        return;

    }


    if (page < 1) {

        page = 1;

    }


    if (page > totalPages) {

        page = totalPages;

    }


    currentPage = page;


    const start =
        (page - 1) *
        ROWS_PER_PAGE;


    const end =
        start +
        ROWS_PER_PAGE;


    rows.forEach(function (row) {

        row.style.display = "none";

    });


    filteredRows.forEach(function (row, index) {

        if (
            index >= start &&
            index < end
        ) {

            row.style.display = "";

        }

    });


    renderFilteredPagination(
        totalPages
    );

}



/* =========================
   FILTERED PAGINATION
========================= */

function renderFilteredPagination(
    totalPages
) {

    const pagination =
        document.getElementById(
            "pagination"
        );


    if (!pagination) return;


    pagination.innerHTML = "";


    if (totalPages <= 1) {

        return;

    }


    const previous =
        document.createElement("button");


    previous.type = "button";


    previous.innerHTML =
        '<i class="fa fa-chevron-left"></i>';


    previous.disabled =
        currentPage === 1;


    previous.onclick = function () {

        showFilteredPage(
            currentPage - 1
        );

    };


    pagination.appendChild(
        previous
    );



    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement("button");


        button.type = "button";

        button.textContent = i;


        if (i === currentPage) {

            button.classList.add("active");

        }


        button.onclick = function () {

            showFilteredPage(i);

        };


        pagination.appendChild(
            button
        );

    }



    const next =
        document.createElement("button");


    next.type = "button";


    next.innerHTML =
        '<i class="fa fa-chevron-right"></i>';


    next.disabled =
        currentPage === totalPages;


    next.onclick = function () {

        showFilteredPage(
            currentPage + 1
        );

    };


    pagination.appendChild(
        next
    );

}



/* =========================
   RESET FILTER
========================= */

function resetFilter() {

    const from =
        document.getElementById(
            "fromDate"
        );


    const to =
        document.getElementById(
            "toDate"
        );


    const search =
        document.getElementById(
            "search"
        );


    if (from) {

        from.value = "";

    }


    if (to) {

        to.value = "";

    }


    if (search) {

        search.value = "";

    }


    const rows =
        getRows();


    rows.forEach(function (row) {

        delete row.dataset.filtered;

        row.style.display = "";

    });


    currentPage = 1;


    createPagination();

    showPage(1);

}



/* =========================
   OPEN VIEW POPUP
========================= */

function openModal(button) {

    selectedRow =
        button.closest("tr");


    if (!selectedRow) {

        return;

    }


    const cells =
        selectedRow.children;


    const customer =
        document.getElementById(
            "mCustomer"
        );


    const problem =
        document.getElementById(
            "mProblem"
        );


    const reference =
        document.getElementById(
            "mReference"
        );


    const date =
        document.getElementById(
            "mDate"
        );


    const support =
        document.getElementById(
            "mSupport"
        );


    const supportWork =
        document.getElementById(
            "mSupportWork"
        );


    const call =
        document.getElementById(
            "mCall"
        );


    const callWork =
        document.getElementById(
            "mCallWork"
        );


    if (customer) {

        customer.value =
            cells[0].innerText.trim();

    }


    if (problem) {

        problem.value =
            cells[1].innerText.trim();

    }


    if (reference) {

        reference.value =
            cells[2].innerText.trim();

    }


    if (date) {

        date.value =
            cells[3].innerText.trim();

    }


    if (support) {

        support.value =
            selectedRow.dataset.support ||
            "";

    }


    if (supportWork) {

        supportWork.value =
            selectedRow.dataset.supportWork ||
            "";

    }


    if (call) {

        call.value =
            selectedRow.dataset.call ||
            "";

    }


    if (callWork) {

        callWork.value =
            selectedRow.dataset.callWork ||
            "";

    }


    const modal =
        document.getElementById(
            "viewModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}



/* =========================
   CLOSE POPUP
========================= */

function closeModal() {

    const modal =
        document.getElementById(
            "viewModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    selectedRow = null;

}



/* =========================
   SUBMIT / UPDATE
========================= */

function submitData() {

    if (!selectedRow) {

        return;

    }


    const customer =
        document.getElementById(
            "mCustomer"
        ).value.trim();


    const problem =
        document.getElementById(
            "mProblem"
        ).value.trim();


    const reference =
        document.getElementById(
            "mReference"
        ).value.trim();


    const date =
        document.getElementById(
            "mDate"
        ).value.trim();


    const support =
        document.getElementById(
            "mSupport"
        ).value.trim();


    const supportWork =
        document.getElementById(
            "mSupportWork"
        ).value.trim();


    const call =
        document.getElementById(
            "mCall"
        ).value.trim();


    const callWork =
        document.getElementById(
            "mCallWork"
        ).value.trim();



    /* UPDATE TABLE */

    selectedRow.children[0]
        .innerText = customer;


    selectedRow.children[1]
        .innerText = problem;


    selectedRow.children[2]
        .innerText = reference;


    selectedRow.children[3]
        .innerText = date;



    /* UPDATE EXTRA DATA */

    selectedRow.dataset.support =
        support;


    selectedRow.dataset.supportWork =
        supportWork;


    selectedRow.dataset.call =
        call;


    selectedRow.dataset.callWork =
        callWork;



    alert(
        "History updated successfully."
    );


    closeModal();


    createPagination();


    showPage(currentPage);

}



/* =========================
   DELETE TABLE ROW
========================= */

function deleteRow(button) {

    const row =
        button.closest("tr");


    if (!row) {

        return;

    }


    const customerId =
        row.children[0]
            .innerText
            .trim();


    const confirmDelete =
        confirm(
            "Delete history for " +
            customerId +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    row.remove();


    if (
        selectedRow === row
    ) {

        selectedRow = null;

    }


    const remainingRows =
        getRows();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                remainingRows.length /
                ROWS_PER_PAGE
            )
        );


    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;

    }


    createPagination();

    showPage(currentPage);

}



/* =========================
   DELETE FROM POPUP
========================= */

function deleteData() {

    if (!selectedRow) {

        return;

    }


    const customerId =
        selectedRow.children[0]
            .innerText
            .trim();


    const confirmDelete =
        confirm(
            "Delete history for " +
            customerId +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    selectedRow.remove();


    selectedRow = null;


    closeModal();


    const remainingRows =
        getRows();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                remainingRows.length /
                ROWS_PER_PAGE
            )
        );


    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;

    }


    createPagination();

    showPage(currentPage);

}



/* =========================
   CLOSE POPUP OUTSIDE
========================= */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "viewModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();

        }

    }
);



/* =========================
   ESCAPE CLOSE POPUP
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);
