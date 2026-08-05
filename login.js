const API_URL = "https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    loginBtn.disabled = true;
    loginBtn.innerText = "Please Wait...";

    message.style.color = "#ff4444";
    message.innerHTML = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const res = await fetch(API_URL, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();

        if (data.success) {

            localStorage.setItem("username", data.username);
            localStorage.setItem("name", data.name);
            localStorage.setItem("role", data.role);
            localStorage.setItem("picture", data.picture);

            message.style.color = "#00cc66";
            message.innerHTML = "Login Successful...";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {

            message.style.color = "#ff4444";
            message.innerHTML = data.message;

        }

    } catch (err) {

        console.log(err);

        message.style.color = "#ff4444";
        message.innerHTML = "Server Connection Failed.";

    }

    loginBtn.disabled = false;
    loginBtn.innerText = "LOGIN";

});
