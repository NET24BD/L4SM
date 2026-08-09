// =====================================
// L4SM COLORFUL DASHBOARD JS
// FINAL
// =====================================


// ===============================
// LOGIN PROTECTION
// ===============================

if (localStorage.getItem("isLogin") !== "true") {

    window.location.replace("login.html");

}


// ===============================
// PREVENT BACK AFTER LOGOUT
// ===============================

window.history.pushState(
    null,
    "",
    window.location.href
);


window.addEventListener(
    "popstate",
    function () {

        if (
            localStorage.getItem("isLogin")
            !== "true"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


// ===============================
// DOM READY
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ===============================
        // LOAD EXISTING LOGIN DATA
        // ===============================

        const name =
            localStorage.getItem("name");

        const username =
            localStorage.getItem("username");

        const picture =
            localStorage.getItem("picture");


        // ===============================
        // DISPLAY NAME
        // ===============================

        const displayName =
            name ||
            username ||
            "User";


        // ===============================
        // HEADER NAME
        // ===============================

        const headerName =
            document.getElementById(
                "headerName"
            );


        if (headerName) {

            headerName.textContent =
                displayName;

        }


        // ===============================
        // WELCOME NAME
        // ===============================

        const welcomeName =
            document.getElementById(
                "welcomeName"
            );


        if (welcomeName) {

            welcomeName.textContent =
                displayName;

        }


        // ===============================
        // PROFILE IMAGE
        // ===============================

        const profileImg =
            document.getElementById(
                "profileImg"
            );


        if (profileImg) {


            if (
                picture &&
                picture.trim() !== ""
            ) {

                profileImg.src =
                    picture;

            }

            else {

                profileImg.src =
                    "assets/profile.png";

            }


            // ===========================
            // IMAGE ERROR FALLBACK
            // ===========================

            profileImg.onerror =
                function () {

                    this.onerror = null;

                    this.src =
                        "assets/profile.png";

                };

        }


        // ===============================
        // LOGOUT
        // ===============================

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {


            logoutBtn.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();


                    // Clear storage

                    localStorage.clear();

                    sessionStorage.clear();


                    // Go Login

                    window.location.replace(
                        "login.html"
                    );

                }
            );

        }


    }
);


// ===============================
// OPEN PAGE
// ===============================

function openPage(page) {


    if (!page) return;


    window.location.href =
        page;

}


// ===============================
// PROFILE MENU
// ===============================

function toggleProfileMenu() {


    const menu =
        document.getElementById(
            "profileMenu"
        );


    if (!menu) return;


    if (
        menu.style.display === "block"
    ) {

        menu.style.display =
            "none";

    }

    else {

        menu.style.display =
            "block";

    }

}


// ===============================
// MY ACCOUNT
// ===============================

function openMyAccount() {


    window.location.href =
        "my-account.html";

}


// ===============================
// CLOSE PROFILE MENU
// ===============================

document.addEventListener(
    "click",
    function (e) {


        const profile =
            document.querySelector(
                ".profile"
            );


        const menu =
            document.getElementById(
                "profileMenu"
            );


        if (!profile || !menu) return;


        if (
            !profile.contains(e.target)
        ) {

            menu.style.display =
                "none";

        }

    }
);


// ===============================
// PREVENT CACHE AFTER LOGOUT
// ===============================

window.addEventListener(
    "pageshow",
    function (event) {


        if (
            event.persisted ||

            (
                window.performance &&

                performance.navigation.type
                === 2
            )
        ) {


            if (
                localStorage.getItem(
                    "isLogin"
                ) !== "true"
            ) {

                window.location.replace(
                    "login.html"
                );

            }

        }

    }
);


// ===============================
// END
// ===============================
