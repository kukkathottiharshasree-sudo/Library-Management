function addBook() {

    let bookName = document.getElementById("bookName").value;
    let authorName = document.getElementById("authorName").value;

    if (bookName === "" || authorName === "") {
        alert("Please enter book name and author name");
        return;
    }

    let table = document.getElementById("bookList");

    let row = table.insertRow();

    let serialNumber = table.rows.length;

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

    rows.forEach(function (row, index) {
        row.cells[0].innerText = index + 1;
    });
}

