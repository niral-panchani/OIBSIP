
const USERS_KEY = "secureAccessUsers";
const SESSION_KEY = "secureAccessSession";

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        })
        .join("");
}

function showMessage(elementId, text) {
    document.getElementById(elementId).textContent = text;
}

// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value
            .trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        showMessage("registerMessage", "");

        if (!name || !email || !password || !confirmPassword) {
            showMessage("registerMessage", "Please fill in all fields.");
            return;
        }

        if (name.length > 50) {
            showMessage("registerMessage", "Username is too long.");
            return;
        }

        if (password.length < 8 || !/[0-9]/.test(password)) {
            showMessage(
                "registerMessage",
                "Password must have at least 8 characters and one number."
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage("registerMessage", "Passwords do not match.");
            return;
        }

        try {
            const users = getUsers();

            if (users.some(function (user) {
                return user.email === email;
            })) {
                showMessage(
                    "registerMessage",
                    "An account with this email already exists."
                );
                return;
            }

            const passwordHash = await hashPassword(password);

            // Check again in case the stored list changed during hashing.
            const latestUsers = getUsers();

            if (latestUsers.some(function (user) {
                return user.email === email;
            })) {
                showMessage(
                    "registerMessage",
                    "An account with this email already exists."
                );
                return;
            }

            latestUsers.push({
                id: crypto.randomUUID(),
                name: name,
                email: email,
                passwordHash: passwordHash
            });

            localStorage.setItem(USERS_KEY, JSON.stringify(latestUsers));

            alert("Registration successful! Please log in.");
            window.location.href = "index.html";
        } catch (error) {
            showMessage(
                "registerMessage",
                "Registration failed. Run the project on localhost and try again."
            );
        }
    });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    // An existing session should not remain on the login page.
    if (sessionStorage.getItem(SESSION_KEY)) {
        window.location.replace("dashboard.html");
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value
            .trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        showMessage("loginMessage", "");

        if (!email || !password) {
            showMessage("loginMessage", "Please fill in all fields.");
            return;
        }

        try {
            const users = getUsers();
            const passwordHash = await hashPassword(password);

            const user = users.find(function (item) {
                return item.email === email &&
                    item.passwordHash === passwordHash;
            });

            if (!user) {
                showMessage(
                    "loginMessage",
                    "Invalid email or password."
                );
                return;
            }

            const session = {
                userId: user.id,
                expiresAt: Date.now() + 60 * 60 * 1000
            };

            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            window.location.href = "dashboard.html";
        } catch (error) {
            showMessage(
                "loginMessage",
                "Login is unavailable. Please run the project on localhost."
            );
        }
    });
}

// Protected dashboard
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    let session = null;

    try {
        session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (error) {
        session = null;
    }

    const user = getUsers().find(function (item) {
        return session &&
            item.id === session.userId;
    });

    if (!session || !session.expiresAt ||
        session.expiresAt <= Date.now() || !user) {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace("index.html");
    } else {
        document.getElementById("welcomeName").textContent = user.name;
        document.getElementById("welcomeEmail").textContent = user.email;
    }

    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace("index.html");
    });
}
