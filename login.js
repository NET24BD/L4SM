/* ==========================================
   LOGIN.JS
========================================== */

const API = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

loginForm.addEventListener("submit", login);

async function login(e) {

    e.preventDefault();

    const user = username.value.trim();
    const pass = password.value.trim();

    if (!user || !pass) {
        msg.innerHTML = "Enter Username & Password";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging in...";

    try {

        const res = await fetch(
            `${API}?action=login&username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
        );

        const data = await res.json();

        if (!data.success) {

            msg.innerHTML = data.message;
            loginBtn.disabled = false;
            loginBtn.innerHTML = "Login";
            return;

        }

        // Save Login Session
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("picture", data.picture);

        // Role Redirect
        switch (data.role.toLowerCase()) {

            case "admin":
                location.href = "admin.html";
                break;

            case "support":
                location.href = "support.html";
                break;

            case "call":
                location.href = "call.html";
                break;

            case "manager":
                location.href = "manager.html";
                break;

            case "guest":
                location.href = "guest.html";
                break;

            default:
                msg.innerHTML = "Invalid Role";
                localStorage.clear();
        }

    } catch (err) {

        console.error(err);
        msg.innerHTML = "Server Connection Failed";

    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = "Login";

}

/* ==========================================
   Already Login
========================================== */

if (localStorage.getItem("isLogin") === "true") {

    const role = localStorage.getItem("role");

    switch (role) {

        case "admin":
            location.href = "admin.html";
            break;

        case "support":
            location.href = "support.html";
            break;

        case "call":
            location.href = "call.html";
            break;

        case "manager":
            location.href = "manager.html";
            break;

        case "guest":
            location.href = "guest.html";
            break;

    }

}
