/* ==========================================
   eSupport System Login
========================================== */

const API = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

/* ==========================
   Already Login
========================== */

if (localStorage.getItem("isLogin") === "true") {

    const role = localStorage.getItem("role");

    switch (role) {

        case "admin":
            location.replace("admin.html");
            break;

        case "support":
            location.replace("support.html");
            break;

        case "call":
            location.replace("call.html");
            break;

        case "manager":
            location.replace("manager.html");
            break;

        case "guest":
            location.replace("guest.html");
            break;

    }

}

/* ==========================
   Login
========================== */

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const user = username.value.trim();
    const pass = password.value.trim();

    message.innerHTML = "";

    if (!user || !pass) {

        message.innerHTML = "Please enter Username & Password";
        return;

    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

    try {

        const response = await fetch(

            `${API}?action=login&username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`

        );

        const data = await response.json();

        if (!data.success) {

            message.innerHTML = data.message;

            loginBtn.disabled = false;
            loginBtn.innerHTML = "LOGIN";

            return;

        }

        /* Save Session */

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("picture", data.picture);

        /* Redirect */

        switch (data.role.toLowerCase()) {

            case "admin":
                location.replace("admin.html");
                break;

            case "support":
                location.replace("support.html");
                break;

            case "call":
                location.replace("call.html");
                break;

            case "manager":
                location.replace("manager.html");
                break;

            case "guest":
                location.replace("guest.html");
                break;

            default:

                localStorage.clear();

                message.innerHTML = "Unknown Role";

                loginBtn.disabled = false;
                loginBtn.innerHTML = "LOGIN";

        }

    }

    catch (err) {

        console.error(err);

        message.innerHTML = "Server Connection Failed";

        loginBtn.disabled = false;
        loginBtn.innerHTML = "LOGIN";

    }

});
