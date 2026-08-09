/* =========================================
   SUPPORT DASHBOARD JS
========================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserProfile();

    }
);



/* =========================================
   LOAD USER PROFILE
========================================= */

function loadUserProfile() {


    const userNameElement =
        document.getElementById("userName");


    const userRoleElement =
        document.getElementById("userRole");


    const userPhotoElement =
        document.getElementById("userPhoto");


    const profileFallback =
        document.getElementById("profileFallback");



    /* =====================================
       GET LOGIN DATA
    ====================================== */


    const userName =
        localStorage.getItem("userName");


    const userPhoto =
        localStorage.getItem("userPhoto");


    const userRole =
        localStorage.getItem("userRole");



    /* =====================================
       USER NAME
    ====================================== */


    if (
        userName &&
        userName.trim() !== ""
    ) {

        userNameElement.textContent =
            userName;

    }

    else {

        userNameElement.textContent =
            "User";

    }



    /* =====================================
       USER ROLE
    ====================================== */


    if (
        userRole &&
        userRole.trim() !== ""
    ) {

        userRoleElement.textContent =
            userRole;

    }

    else {

        userRoleElement.textContent =
            "Support User";

    }



    /* =====================================
       USER PHOTO
    ====================================== */


    if (
        userPhoto &&
        userPhoto.trim() !== ""
    ) {


        userPhotoElement.src =
            userPhoto;


        userPhotoElement.style.display =
            "block";


        profileFallback.style.display =
            "none";



        /* =================================
           INVALID IMAGE URL
        ================================== */

        userPhotoElement.onerror =
            function () {


                userPhotoElement.style.display =
                    "none";


                profileFallback.style.display =
                    "flex";


            };


    }

    else {


        userPhotoElement.style.display =
            "none";


        profileFallback.style.display =
            "flex";

    }

}



/* =========================================
   OPEN PAGE
========================================= */

function openPage(page) {

    window.location.href =
        page;

}
