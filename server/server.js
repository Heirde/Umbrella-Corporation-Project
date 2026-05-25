const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors({
    origin: ["https://heirde.github.io/Umbrella-Corporation-Project/", "http://localhost:3000"]
}));
app.use(express.json());

const client = new MongoClient(
  process.env.MONGO_URI ||
    "mongodb+srv://deninheir31_db_user:MIWuGchDoRxym0qE@umbrella.8xrpvbl.mongodb.net/?appName=Umbrella"
);
const dbName = process.env.DB_NAME || "umbrella";
let db;

async function connectDB() {
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB");
}

connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

function buildNameQuery(firstName, lastName) {
  return {
    firstName: { $regex: new RegExp(`^${firstName}$`, "i") },
    lastName: { $regex: new RegExp(`^${lastName}$`, "i") },
  };
}

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, password } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = await db.collection("users").findOne(
    buildNameQuery(firstName, lastName)
  );

  if (existing) {
    return res.status(409).json({ error: "Account already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({
    firstName,
    lastName,
    password: hashedPassword,
    role: "guest",
    clearance: 1,
  });

  res.json({ success: true, firstName, lastName, role: "guest", clearance: 1 });
});

app.post("/api/signin", async (req, res) => {
  const { firstName, lastName, password } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await db
    .collection("users")
    .findOne(buildNameQuery(firstName, lastName));

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
    clearance: user.clearance,
  });
});

app.get("/api/admin/users", async (req, res) => {
  const { firstName, lastName } = req.query;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Admin credentials are required" });
  }

  const requester = await db
    .collection("users")
    .findOne(buildNameQuery(firstName, lastName));

  if (!requester || requester.clearance < 6) {
    return res.status(403).json({ error: "Access denied" });
  }

  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();

  res.json(users);
});

app.post("/api/admin/update", async (req, res) => {
  const {
    adminFirstName,
    adminLastName,
    targetFirstName,
    targetLastName,
    role,
    clearance,
  } = req.body;

  if (
    !adminFirstName ||
    !adminLastName ||
    !targetFirstName ||
    !targetLastName ||
    !role ||
    clearance === undefined
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const requester = await db
    .collection("users")
    .findOne(buildNameQuery(adminFirstName, adminLastName));

  if (!requester || requester.clearance < 6) {
    return res.status(403).json({ error: "Access denied" });
  }

  const result = await db.collection("users").findOneAndUpdate(
    buildNameQuery(targetFirstName, targetLastName),
    {
      $set: {
        role,
        clearance: Number(clearance),
      },
    },
    { returnDocument: "after" }
  );

  if (!result.value) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ success: true, user: result.value });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));