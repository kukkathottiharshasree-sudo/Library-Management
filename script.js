function addBook() {

    let bookName = document.getElementById("bookName").value.trim();
    let authorName = document.getElementById("authorName").value.trim();

    if (bookName === "" || authorName === "") {
        alert("Please enter book name and author name");
        return;
    }

    let bookList = document.getElementById("bookList");

    let row = bookList.insertRow();

    let serialNumber = bookList.rows.length;

    row.innerHTML = `
        <td>${serialNumber}</td>
        <td>${bookName}</td>
        <td>${authorName}</td>
        <td>Available</td>
        <td>
            <button onclick="issueBook(this)">Issue</button>
            <button onclick="deleteBook(this)">Delete</button>
        </td>
    `;

    // Clear input fields
    document.getElementById("bookName").value = "";
    document.getElementById("authorName").value = "";
}


function issueBook(button) {

    let row = button.parentElement.parentElement;

    row.cells[3].innerText = "Issued";

    button.innerText = "Return";

    button.onclick = function () {
        returnBook(this);
    };
}


function returnBook(button) {

    let row = button.parentElement.parentElement;

    row.cells[3].innerText = "Available";

    button.innerText = "Issue";

    button.onclick = function () {
        issueBook(this);
    };
}


function deleteBook(button) {

    let row = button.parentElement.parentElement;

    row.remove();

    updateSerialNumbers();
}


function updateSerialNumbers() {

    let rows = document.querySelectorAll("#bookList tr");

    rows.forEach(function(row, index) {
        row.cells[0].innerText = index + 1;
    });
}
