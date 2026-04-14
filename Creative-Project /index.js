const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const users = require("./models/users");

const app = express();
const PORT = 3000;

console.log("***** SERVER STARTED *****");

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://kiranpatel23_db_user:Bailey2020@digitaldoppelganger.xtkrypc.mongodb.net/test?retryWrites=true&w=majority",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
  }),
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ROOT
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP ROUTE HIT");
    console.log("req.body:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.send("Username and Password not found");
    }

    const success = await users.addUser(username.trim(), password.trim());
    console.log("Signup success:", success);

    if (!success) {
      return res.send("User already exists");
    }

    const user = await users.checkUser(username.trim(), password.trim());
    console.log("User after signup:", user);

    if (!user) {
      return res.send("User created but login failed");
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    console.log("Signup complete, redirecting...");
    res.redirect("/homepage");
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.send("Error creating user");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN ROUTE HIT");
    console.log("req.body:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.send("Missing username or password");
    }

    const user = await users.checkUser(username.trim(), password.trim());
    console.log("User found:", user);

    if (!user) {
      return res.send("Invalid username or password");
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    console.log("Login successful, redirecting...");
    res.redirect("/homepage");
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.send("Error logging in");
  }
});

//routes

app.get("/homepage", (req, res) => {
  console.log("HOMEPAGE ROUTE HIT");
  console.log("Session:", req.session);

  if (!req.session.userId) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "views", "homepage.html"));
});

app.get("/survey1", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "survey1.html"));
});

app.get("/survey2", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "survey2.html"));
});

app.get("/survey3", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "survey3.html"));
});

app.get("/survey4", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "survey4.html"));
});

app.get("/survey5", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "survey5.html"));
});

app.get("/resultspage", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "resultspage.html"));
});

// LOGOUT (optional but useful)
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
