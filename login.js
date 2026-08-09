const API_URL =
    "https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";


const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");

const loginBtn =
    document.getElementById("loginBtn");


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const usernameInput =
                document.getElementById(
                    "username"
                );

            const passwordInput =
                document.getElementById(
                    "password"
                );


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value.trim();


            // =============================================
            // VALIDATION
            // =============================================

            if (
                username === "" ||
                password === ""
            ) {

                message.style.color = "red";

                message.innerHTML =
                    "Enter Username and Password";

                return;

            }


            // =============================================
            // LOGIN BUTTON
            // =============================================

            loginBtn.disabled = true;

            loginBtn.innerHTML =
                "CHECKING...";


            // =============================================
            // SEND LOGIN REQUEST
            // =============================================

            fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action: "login",

                        username:
                            username,

                        password:
                            String(password)

                    })
                }
            )

            .then(
                response => {

                    if (!response.ok) {

                        throw new Error(
                            "Server response error"
                        );

                    }

                    return response.json();

                }
            )

            .then(
                data => {

                    console.log(
                        "LOGIN RESPONSE:",
                        data
                    );


                    // =====================================
                    // LOGIN SUCCESS
                    // =====================================

                    if (
                        data.success === true
                    ) {


                        // =================================
                        // GET USER INFORMATION
                        // =================================

                        const savedUsername =
                            data.username ||
                            username;


                        const savedName =
                            data.name ||
                            data.username ||
                            username;


                        const savedRole =
                            data.role ||
                            "";


                        const savedPicture =
                            data.picture ||
                            "assets/profile.png";


                        // =================================
                        // OLD LOGIN DATA
                        // =================================

                        localStorage.setItem(
                            "auth",
                            "true"
                        );


                        localStorage.setItem(
                            "isLogin",
                            "true"
                        );


                        localStorage.setItem(
                            "username",
                            savedUsername
                        );


                        localStorage.setItem(
                            "name",
                            savedName
                        );


                        localStorage.setItem(
                            "role",
                            savedRole
                        );


                        localStorage.setItem(
                            "picture",
                            savedPicture
                        );


                        // =================================
                        // NEW USER OBJECT
                        // =================================

                        const loggedInUser = {

                            userId:
                                savedUsername,

                            username:
                                savedUsername,

                            name:
                                savedName,

                            role:
                                savedRole,

                            profileImage:
                                savedPicture

                        };


                        // =================================
                        // SAVE USER OBJECT
                        // =================================

                        localStorage.setItem(
                            "loggedInUser",
                            JSON.stringify(
                                loggedInUser
                            )
                        );


                        // =================================
                        // SESSION TIMER
                        // =================================

                        localStorage.setItem(
                            "lastActivity",
                            Date.now()
                        );


                        // =================================
                        // SUCCESS MESSAGE
                        // =================================

                        message.style.color =
                            "green";


                        message.innerHTML =
                            "Login Successful";


                        // =================================
                        // ROLE REDIRECT
                        // =================================

                        setTimeout(
                            function () {

                                const role =
                                    savedRole;


                                if (
                                    role === "Admin"
                                ) {

                                    window.location.href =
                                        "dashboard.html";

                                }

                                else if (
                                    role === "Support"
                                ) {

                                    window.location.href =
                                        "std.html";

                                }

                                else if (
                                    role === "Caller"
                                ) {

                                    window.location.href =
                                        "cd.html";

                                }

                                else if (
                                    role === "Manager"
                                ) {

                                    window.location.href =
                                        "manager.html";

                                }

                                else {

                                    /*
                                     * Unknown role
                                     */

                                    window.location.href =
                                        "dashboard.html";

                                }

                            },
                            800
                        );

                    }


                    // =====================================
                    // LOGIN FAILED
                    // =====================================

                    else {

                        message.style.color =
                            "red";


                        message.innerHTML =
                            data.message ||
                            "Login Failed";

                    }

                }
            )

            .catch(
                error => {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );


                    message.style.color =
                        "red";


                    message.innerHTML =
                        "Server Connection Error";

                }
            )

            .finally(
                () => {

                    loginBtn.disabled =
                        false;


                    loginBtn.innerHTML =
                        "LOGIN";

                }
            );

        }
    );

}


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


if (togglePassword) {

    togglePassword.onclick =
        function () {

            const password =
                document.getElementById(
                    "password"
                );


            if (
                password.type ===
                "password"
            ) {

                password.type =
                    "text";


                togglePassword.innerHTML =
                    '<i class="fa fa-eye-slash"></i>';

            }

            else {

                password.type =
                    "password";


                togglePassword.innerHTML =
                    '<i class="fa fa-eye"></i>';

            }

        };

}
