// =================================
// GOOGLE SHEET LOGIN SYSTEM
// =================================


const WEB_APP_URL = 
"https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";



// Login Form

document
// =================================
// GOOGLE SHEET LOGIN SYSTEM
// =================================

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

// Login Form Event Listener
document.getElementById("loginForm").addEventListener("submit", login);

async function login(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const btn = document.getElementById("loginBtn");

    // Validation
    if (username === "" || password === "") {
        message.innerHTML = "Please enter Username and Password";
        message.style.color = "#dc2626"; // Error red
        return;
    }

    // UI Loading State
    btn.innerHTML = "Checking...";
    btn.disabled = true;

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "login",
                username: username,
                password: password
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            // Save Session Data
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", data.name);
            localStorage.setItem("photo", data.picture || "profile.png");

            message.innerHTML = "Login Successful";
            message.style.color = "#16a34a"; // Success green

            // Role-based Redirection
            setTimeout(() => {
                switch (data.role) {
                    case "admin":
                        window.location.href = "1d.html";
                        break;
                    case "support":
                        window.location.href = "support.html";
                        break;
                    case "call":
                        window.location.href = "call.html";
                        break;
                    case "manager":
                        window.location.href = "manager.html";
                        break;
                    default:
                        window.location.href = "dashboard.html";
                }
            }, 700);

        } else {
            message.innerHTML = data.message || "Invalid Username or Password";
            message.style.color = "#dc2626";
        }

    } catch (error) {
        console.error("Login Error:", error);
        message.innerHTML = "Server Connection Failed";
        message.style.color = "#dc2626";
    } finally {
        btn.innerHTML = "LOGIN";
        btn.disabled = false;
    }
}
