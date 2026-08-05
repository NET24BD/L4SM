// =====================================
// L4SM AUTO LOGOUT
// File: autologout.js
// =====================================

// Logout Time (10 Minutes)
const AUTO_LOGOUT_TIME = 10 * 60 * 1000;

let autoLogoutTimer = null;

// ----------------------------
// Logout Function
// ----------------------------
function logoutUser() {

    // Clear Local Storage
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("picture");

    // Clear Session Storage
    sessionStorage.clear();

    // Redirect Login
    window.location.replace("login.html");

}

// ----------------------------
// Reset Timer
// ----------------------------
function resetAutoLogoutTimer() {

    clearTimeout(autoLogoutTimer);

    autoLogoutTimer = setTimeout(logoutUser, AUTO_LOGOUT_TIME);

}

// ----------------------------
// User Activity Events
// ----------------------------
[
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keydown",
    "keyup",
    "touchstart",
    "touchmove"
].forEach(function(event){

    document.addEventListener(event, resetAutoLogoutTimer);

});

// Start Timer
resetAutoLogoutTimer();


// ----------------------------
// Check Login
// ----------------------------
(function () {

    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "true") {

        window.location.replace("login.html");

    }

})();
