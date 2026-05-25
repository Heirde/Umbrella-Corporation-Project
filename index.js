document.addEventListener("DOMContentLoaded", function () {

    const API_BASE_URL = "https://umbrella-corporation-project-production.up.railway.app";
    const avatar = document.getElementById("profileAvatar");
    const nameEl = document.getElementById("profileName");
    const loggedInSection = document.getElementById("loggedInSection");
    const loggedOutSection = document.getElementById("loggedOutSection");

    function loadUser() {
        const firstName = localStorage.getItem("firstName");
        const lastName = localStorage.getItem("lastName");
        const role = localStorage.getItem("role");
        const clearance = parseInt(localStorage.getItem("clearance"));

        if (firstName && lastName) {
            avatar.textContent = (firstName[0] + lastName[0]).toUpperCase();
            nameEl.textContent = firstName + " " + lastName;
            loggedInSection.style.display = "block";
            loggedOutSection.style.display = "none";

            const roleBadge = document.getElementById("userRole");
            const clearanceBadge = document.getElementById("userClearance");
            const bowLink = document.getElementById("bowLink");

            if (roleBadge) roleBadge.textContent = role;
            if (clearanceBadge) clearanceBadge.textContent = "Clearance Level " + clearance;

            if (bowLink) {
                bowLink.style.display = clearance >= 4 ? "block" : "none";
            }

        } else {
            avatar.textContent = "?";
            nameEl.textContent = "Guest";
            loggedInSection.style.display = "none";
            loggedOutSection.style.display = "block";
        }
    
        const adminLink = document.getElementById("adminLink");
            if (adminLink) {
                adminLink.style.display = clearance >= 6 ? "block" : "none";
        }
    }

    loadUser();

    document.querySelector(".profile-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        document.getElementById("profileDropdown").classList.toggle("open");
        this.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
        if (!e.target.closest(".profile-wrapper")) {
            document.getElementById("profileDropdown").classList.remove("open");
            document.querySelector(".profile-btn").classList.remove("active");
        }
    });

    document.getElementById("dropdownLoginBtn").addEventListener("click", async function () {
        const first = document.getElementById("dropdownFirstName").value.trim();
        const last = document.getElementById("dropdownLastName").value.trim();
        const pass = document.getElementById("dropdownPassword").value;

        if (!first || !last || !pass) return;

        try {
const response = await fetch(`https://umbrella-corporation-project-production.up.railway.app/api/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName: first, lastName: last, password: pass })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            localStorage.setItem("firstName", data.firstName);
            localStorage.setItem("lastName", data.lastName);
            localStorage.setItem("role", data.role);
            localStorage.setItem("clearance", data.clearance);
            loadUser();
            document.getElementById("profileDropdown").classList.remove("open");

        } catch (err) {
            alert("Could not connect to server");
        }
    });

    document.getElementById("dropdownSignUpBtn").addEventListener("click", async function () {
    const first = document.getElementById("signUpFirstName").value.trim();
    const last = document.getElementById("signUpLastName").value.trim();
    const pass = document.getElementById("signUpPassword").value;

    if (!first || !last || !pass) return;

    try {
        const response = await fetch(`https://umbrella-corporation-project-production.up.railway.app/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName: first, lastName: last, password: pass })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);
        localStorage.setItem("role", data.role);
        localStorage.setItem("clearance", data.clearance);
        loadUser();
        document.getElementById("profileDropdown").classList.remove("open");

    } catch (err) {
        alert("Could not connect to server");
    }
    });

    document.getElementById("showSignUp").addEventListener("click", function () {
        document.getElementById("signInForm").style.display = "none";
        document.getElementById("signUpForm").style.display = "flex";

    });

    document.getElementById("showSignIn").addEventListener("click", function () {
        document.getElementById("signUpForm").style.display = "none";
        document.getElementById("signInForm").style.display = "flex";

    });

    document.querySelector(".signout").addEventListener("click", function () {
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("role");
        localStorage.removeItem("clearance");
        loadUser();
    });

});