// ==========================================
// eSupport Login
// ==========================================

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

const form = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

// যদি আগে থেকেই Login থাকে
const session = localStorage.getItem("user");

if (session) {
    const user = JSON.parse(session);
    redirectByRole(user.role);
}

// Login Submit
form.addEventListener("submit", login);

async function login(e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Please enter Username & Password", "#dc3545");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging in...";

    try {

        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "login",
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("user", JSON.stringify(data));

            showMessage("Login Successful", "#198754");

            setTimeout(() => {
                redirectByRole(data.role);
            }, 500);

        } else {

            showMessage(data.message || "Login Failed", "#dc3545");

        }

    } catch (err) {

        console.error(err);

        showMessage("Cannot connect to server", "#dc3545");

    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = "LOGIN";
}

// Redirect by Role
function redirectByRole(role) {

    role = (role || "").toLowerCase();

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

        default:
            location.href = "dashboard.html";
    }

}

// Show Message
function showMessage(text, color) {

    message.innerHTML = text;
    message.style.color = color;

}
