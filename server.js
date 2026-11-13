const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "data", "books.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getBooks() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]");
    }
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function saveBooks(books) {
    fs.writeFileSync(dataFile, JSON.stringify(books, null, 2));
}

// Get all books
app.get("/api/books", (req, res) => {
    res.json(getBooks());
});

// Add a new book
app.post("/api/books", (req, res) => {
    const { title, author, category } = req.body;

    if (!title || !author || !category) {
        return res.status(400).json({ message: "Please fill all fields." });
    }

    const books = getBooks();

    const newBook = {
        id: Date.now().toString(),
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        status: "Available",
        student: ""
    };

    books.push(newBook);
    saveBooks(books);

    res.status(201).json(newBook);
});

// Issue a book
app.put("/api/books/:id/issue", (req, res) => {
    const books = getBooks();
    const book = books.find(b => b.id === req.params.id);

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (book.status === "Issued") {
        return res.status(400).json({ message: "This book is already issued." });
    }

    const student = req.body.student;

    if (!student || !student.trim()) {
        return res.status(400).json({ message: "Enter student name." });
    }

    book.status = "Issued";
    book.student = student.trim();

    saveBooks(books);
    res.json(book);
});

// Return a book
app.put("/api/books/:id/return", (req, res) => {
    const books = getBooks();
    const book = books.find(b => b.id === req.params.id);

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    book.status = "Available";
    book.student = "";

    saveBooks(books);
    res.json(book);
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
    let books = getBooks();
    const updatedBooks = books.filter(b => b.id !== req.params.id);

    if (books.length === updatedBooks.length) {
        return res.status(404).json({ message: "Book not found." });
    }

    saveBooks(updatedBooks);
    res.json({ message: "Book deleted successfully." });
});

// Start server
app.listen(PORT, () => {
    console.log(`Library server running at http://localhost:${PORT}`);
});