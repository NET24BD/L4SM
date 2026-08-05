const API_URL = "https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";

const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

// যদি আগে থেকেই Login করা থাকে
if (localStorage.getItem("isLogin") === "true") {
    window.location.href = "dashboard.html";
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";
    message.style.color = "#ff4444";

    if (username.value.trim() === "" || password.value.trim() === "") {
        message.innerHTML = "Please enter Username & Password";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Please Wait...";

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                username: username.value.trim(),
                password: password.value.trim()
            })
        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("isLogin", "true");
            localStorage.setItem("username", data.username);
            localStorage.setItem("name", data.name);
            localStorage.setItem("role", data.role);
            localStorage.setItem("picture", data.picture);

            message.style.color = "#00c853";
            message.innerHTML = "Login Successful...";

            setTimeout(() => {
                window.location.href = "1d.html";
            }, 1000);

        } else {

            message.style.color = "#ff1744";
            message.innerHTML = data.message;

        }

    } catch (error) {

        console.error(error);

        message.style.color = "#ff1744";
        message.innerHTML = "Server Connection Failed";

    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = "LOGIN";

});
