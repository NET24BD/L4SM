// =====================================
// L4SM DASHBOARD JS
// FINAL PART 1
// =====================================

// ===============================
// LOGIN PROTECTION
// ===============================
if (localStorage.getItem("isLogin") !== "true") {

    window.location.replace("login.html");

}

// Prevent Back Button Cache
window.history.pushState(null, "", window.location.href);

window.addEventListener("popstate", function () {

    if (localStorage.getItem("isLogin") !== "true") {

        window.location.replace("login.html");

    }

});

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // LOAD USER DATA
    // ===============================

    const name = localStorage.getItem("name");
    const username = localStorage.getItem("username");
    const picture = localStorage.getItem("picture");

    const displayName = name || username || "User";

    // ===============================
    // HEADER NAME
    // ===============================

    const headerName = document.getElementById("headerName");

    if (headerName) {

        headerName.textContent = displayName;

    }

    // ===============================
    // WELCOME NAME
    // ===============================

    const welcomeName = document.getElementById("welcomeName");

    if (welcomeName) {

        welcomeName.textContent = displayName;

    }

    // ===============================
    // PROFILE IMAGE
    // ===============================

    const profileImg = document.getElementById("profileImg");

    if (profileImg) {

        if (picture && picture.trim() !== "") {

            profileImg.src = picture;

        } else {

            profileImg.src = "assets/profile.png";

        }

    }

    // ===============================
    // LOGOUT BUTTON
    // ===============================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            if (!confirm("Are you sure you want to logout?")) {

                return;

            }

            // Clear Session
            localStorage.clear();
            sessionStorage.clear();

            // Redirect
            window.location.replace("login.html");

        });

    }

});
// =====================================
// L4SM DASHBOARD JS
// FINAL PART 2
// =====================================

// ===============================
// SIDEBAR TOGGLE
// ===============================
function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("small");
    }

}

// ===============================
// OPEN PAGE
// ===============================
function openPage(page) {

    window.location.href = page;

}

// ===============================
// PROFILE MENU
// ===============================
function toggleProfileMenu() {

    const menu = document.getElementById("profileMenu");

    if (!menu) return;

    menu.style.display =
        (menu.style.display === "block") ? "none" : "block";

}

// ===============================
// MY ACCOUNT
// ===============================
function openMyAccount() {

    window.location.href = "my-account.html";

}

// ===============================
// CLOSE PROFILE MENU (OUTSIDE CLICK)
// ===============================
document.addEventListener("click", function (e) {

    const profile = document.querySelector(".profile");
    const menu = document.getElementById("profileMenu");

    if (!profile || !menu) return;

    if (!profile.contains(e.target)) {
        menu.style.display = "none";
    }

});

// ===============================
// PREVENT CACHE AFTER LOGOUT
// ===============================
window.addEventListener("pageshow", function (event) {

    if (event.persisted ||
        (window.performance &&
         performance.navigation.type === 2)) {

        if (localStorage.getItem("isLogin") !== "true") {

            window.location.replace("login.html");

        }

    }

});
