const API_URL = "http://localhost:5000/api/auth/login";

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loginMessage.textContent = "";

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        localStorage.setItem("lexoAdmin", "true");

        window.location.href = "/admin/dashboard.html";

    } catch (error) {

        loginMessage.textContent = error.message;

    } finally {

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

    }

});