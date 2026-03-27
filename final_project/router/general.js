const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user [cite: 300]
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list [cite: 270]
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN [cite: 276]
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

// Task 3: Get book details based on author [cite: 282]
public_users.get('/author/:author', function (req, res) {
    let keys = Object.keys(books);
    let authorBooks = [];
    keys.forEach(key => {
        if (books[key].author === req.params.author) {
            authorBooks.push(books[key]);
        }
    });
    res.send(authorBooks);
});

// Task 4: Get all books based on title [cite: 288]
public_users.get('/title/:title', function (req, res) {
    let keys = Object.keys(books);
    let titleBooks = [];
    keys.forEach(key => {
        if (books[key].title === req.params.title) {
            titleBooks.push(books[key]);
        }
    });
    res.send(titleBooks);
});

// Task 5: Get book review [cite: 294]
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

// --- Tasks 10-13 using Async/Await/Axios ---

// Task 10: Get all books using Async-Await [cite: 320]
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book by ISBN using Promises [cite: 323]
public_users.get('/async/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(err => res.status(500).json({ message: "Error fetching book" }));
});

// Task 12: Get books by Author using Async-Await [cite: 325]
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
});

// Task 13: Get books by Title using Promises [cite: 328]
public_users.get('/async/title/:title', (req, res) => {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => res.status(200).json(response.data))
        .catch(err => res.status(500).json({ message: "Error" }));
});

module.exports.general = public_users;