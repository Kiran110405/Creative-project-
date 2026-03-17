const express = require("express");
const path = require("path");
const session = require("express-session");
const users = require("./models/users");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://kiranpatel23_db_user:y5d2znDZPpXKVyrq@digitaldoppelganger.xtkrypc.mongodb.net/?appName=DigitalDoppelganger",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
  }),
);

// MAIN ENTRY PAGE (Login / Signup UI)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const success = await users.addUser(username, password);

    if (!success) {
      return res.send("User already exists");
    }

    // Auto login after signup
    const user = await users.checkUser(username, password);
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/homepage");
  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).send("Error creating user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await users.checkUser(username, password);

    if (!user) {
      return res.send("Invalid username or password");
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/homepage");
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).send("Error logging in");
  }
});

// HOMEPAGE (PROTECTED)
app.get("/homepage", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "views", "homepage.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
