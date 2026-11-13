const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");

let books = [];

// Load books from backend
async function loadBooks() {
    try {
        const response = await fetch("/api/books");
        books = await response.json();

        displayBooks(books);
        updateStats();
    } catch (error) {
        console.error("Error loading books:", error);
        alert("Cannot load books. Check whether the server is running.");
    }
}

// Display books
function displayBooks(bookArray) {
    bookList.innerHTML = "";

    if (bookArray.length === 0) {
        bookList.innerHTML =
            '<tr><td colspan="6">No books found.</td></tr>';
        return;
    }

    bookArray.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(book.title)}</td>
            <td>${escapeHTML(book.author)}</td>
            <td>${escapeHTML(book.category)}</td>
            <td>${escapeHTML(book.status)}</td>
            <td>${escapeHTML(book.student || "-")}</td>
            <td>
                ${
                    book.status === "Available"
                    ? `<button onclick="issueBook('${book.id}')">Issue</button>`
                    : `<button onclick="returnBook('${book.id}')">Return</button>`
                }
                <button onclick="deleteBook('${book.id}')">Delete</button>
            </td>
        `;

        bookList.appendChild(row);
    });
}

// Prevent HTML entered in book details from being interpreted as markup
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Update book counts
function updateStats() {
    document.getElementById("totalBooks").textContent = books.length;

    document.getElementById("availableBooks").textContent =
        books.filter(book => book.status === "Available").length;

    document.getElementById("issuedBooks").textContent =
        books.filter(book => book.status === "Issued").length;
}

// Add a book
bookForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();

    if (!title || !author || !category) {
        alert("Please enter book title, author and category.");
        return;
    }

    try {
        const response = await fetch("/api/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, author, category })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to add book.");
            return;
        }

        bookForm.reset();
        await loadBooks();
        alert("Book added successfully!");
    } catch (error) {
        console.error(error);
        alert("Error adding book. Check the server.");
    }
});

// Issue a book
async function issueBook(id) {
    const student = prompt("Enter student name:");

    if (student === null || !student.trim()) {
        alert("Please enter a student name.");
        return;
    }

    try {
        const response = await fetch(`/api/books/${id}/issue`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ student: student.trim() })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to issue book.");
            return;
        }

        await loadBooks();
        alert("Book issued successfully!");
    } catch (error) {
        console.error(error);
        alert("Error issuing book. Check the server.");
    }
}

// Return a book
async function returnBook(id) {
    try {
        const response = await fetch(`/api/books/${id}/return`, {
            method: "PUT"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to return book.");
            return;
        }

        await loadBooks();
        alert("Book returned successfully!");
    } catch (error) {
        console.error(error);
        alert("Error returning book.");
    }
}

// Delete a book
async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to delete book.");
            return;
        }

        await loadBooks();
        alert("Book deleted successfully!");
    } catch (error) {
        console.error(error);
        alert("Error deleting book.");
    }
}

// Search books
searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.category.toLowerCase().includes(searchText)
    );

    displayBooks(filteredBooks);
});

// Load books when page opens
loadBooks();
