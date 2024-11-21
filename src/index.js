const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();

let currentUser = {};

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(express.static("models"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/dashboard", (req, res) => {
    if (currentUser.username && currentUser.password) {
        res.render("dashboard");
    } else {
        res.redirect("/"); // Redirect to login if user details are missing
    }
});

app.get("/gamepage", (req, res) => {
    if (currentUser.username) {
        res.render("gamepage", { username: currentUser.username });
    } else {
        res.redirect("/"); // Redirect to login if user details are missing
    }
    res.render("gamepage");
});

app.get("/settings", (req, res) => {
    if (currentUser.username && currentUser.password) {
        res.render("settings", { username: currentUser.username, password: currentUser.password });
    } else {
        res.redirect("/"); // Redirect to login if user details are missing
    }
});

// async function insert() {
//     collection.create({
//         name:"poko loko",
//         password:"12345678"
//     });
// }
// insert();

app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);

        res.redirect("/");
    }

});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            currentUser.username = req.body.username; // Save user details
            currentUser.password = req.body.password;
            res.render("dashboard");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});