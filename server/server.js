const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb+srv://deninheir31_db_user:MIWuGchDoRxym0qE@umbrella.8xrpvbl.mongodb.net/?appName=Umbrella");
let db;

async function connectDB() {
    await client.connect();
    db = client.db("umbrella");
    console.log("Connected to MongoDB");
}

connectDB();

app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

const existing = await db.collection("users").findOne({
    firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
    lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
});

if (existing) {
    return res.status(409).json({ error: "Account already exists" });
}

const hashedPassword = await bcrypt.hash(password, 10);
await db.collection("users").insertOne({
    firstName,
    lastName,
    password: hashedPassword,
    role: "guest",
    clearance: 1
});

    res.json({ success: true, firstName, lastName, role: "guest", clearance: 1 });
});


app.post("/api/signin", async (req, res) => {
    const { firstName, lastName, password } = req.body;

    const user = await db.collection("users").findOne({
        firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
        lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
    });

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