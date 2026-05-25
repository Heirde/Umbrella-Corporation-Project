const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");

function getUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const users = getUsers();
    const existing = users.find(u =>
        u.firstName.toLowerCase() === firstName.toLowerCase() &&
        u.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (existing) {
        return res.status(409).json({ error: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ 
        firstName, 
        lastName, 
        password: hashedPassword,
        role: "guest",      
        clearance: 1          
    });
    saveUsers(users);

    res.json({ success: true, firstName, lastName, role: "guest", clearance: 1 });
});


app.post("/api/signin", async (req, res) => {
    const { firstName, lastName, password } = req.body;

    const users = getUsers();
    const user = users.find(u =>
        u.firstName.toLowerCase() === firstName.toLowerCase() &&
        u.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (!user) {
        return res.status(401).json({ error: "Account not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({ 
        success: true, 
        firstName: user.firstName, 
        lastName: user.lastName,
        role: user.role,
        clearance: user.clearance
    });

    app.get("/api/admin/users", (req, res) => {
    const { firstName, lastName } = req.query;
    const users = getUsers();

    const requester = users.find(u =>
        u.firstName.toLowerCase() === firstName.toLowerCase() &&
        u.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (!requester || requester.clearance < 6) {
        return res.status(403).json({ error: "Access denied" });
    }

    // Return users without passwords
    const safeUsers = users.map(u => ({
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        clearance: u.clearance
    }));

    res.json(safeUsers);
});

// Update a user's role and clearance (admin only)
app.post("/api/admin/update", async (req, res) => {
    const { adminFirstName, adminLastName, targetFirstName, targetLastName, role, clearance } = req.body;

    const users = getUsers();

    const requester = users.find(u =>
        u.firstName.toLowerCase() === adminFirstName.toLowerCase() &&
        u.lastName.toLowerCase() === adminLastName.toLowerCase()
    );

    if (!requester || requester.clearance < 6) {
        return res.status(403).json({ error: "Access denied" });
    }

    const targetIndex = users.findIndex(u =>
        u.firstName.toLowerCase() === targetFirstName.toLowerCase() &&
        u.lastName.toLowerCase() === targetLastName.toLowerCase()
    );

    if (targetIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[targetIndex].role = role;
    users[targetIndex].clearance = parseInt(clearance);
    saveUsers(users);

    res.json({ success: true });
});

});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));