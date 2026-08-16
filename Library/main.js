import { Book } from './book.js'
import { Library } from './library.js';

let myLibrary = new Library();
const form = document.querySelector('form');

myLibrary.addBook(new Book("The Hobbit", "J.R.R Tolkien", 295, false));
myLibrary.addBook(new Book("The Lord of the Rings", "J.R.R Tolkien", 1178, false));
myLibrary.addBook(new Book("Pride and Prejudice", "Jane Austin", 432, false));


window.addEventListener('load', () => {
    displayBooks();
});


form.addEventListener('submit', (event) => {
    event.preventDefault();     
    const formData = new FormData(event.target); 
    const formValues = Object.fromEntries(formData); 
    addBookToLibrary(formValues);
});

function bookFromParams(params) {
    const wasRead='was-read' in params;
    const pageCount=Number(params["book-length"]);
    return new Book(params["book-title"], params["book-author"], pageCount, wasRead);
}

function addBookToLibrary(params) {
    myLibrary.addBook(bookFromParams(params));
    displayBooks();
}


function displayBooks()
{
    const bookContainer=document.getElementById("book-container");

    //Clear the books from the container and the event listeners
    document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
        deleteBtn.removeEventListener('click', onDeleteButtonPressed);
    });
    document.querySelectorAll("read-btn").forEach((readBtn)=> {
        readBtn.removeEventListener('click', onToggleReadButtonPressed);
    });
    bookContainer.replaceChildren();

    //regenerates all the books on the page
    myLibrary.books.forEach((book, index) => {
        const deleteButton=createDeleteButton();
        const bookDiv=createBookDiv(book);
        const readButton=createReadButton();

        bookDiv.append(deleteButton);
        bookDiv.append(readButton);

        bookContainer.append(bookDiv);
    });
}

function onDeleteButtonPressed(event) {
    const id=event.target.parentElement.dataset.indexNumber;
    myLibrary.deleteBook(id);
    displayBooks();
}

function onToggleReadButtonPressed(event) {
    const id=event.target.parentElement.dataset.indexNumber;
    const book=myLibrary.findBook(id);
    book.toggleRead();
    displayBooks();
}

function createReadButton()
{
    const readButton=document.createElement("button");
    readButton.textContent="Change Read";
    readButton.className="read-btn";
    readButton.addEventListener('click', onToggleReadButtonPressed);
    return readButton;
}


function createDeleteButton()
{
    const deleteButton=document.createElement("button");
    deleteButton.textContent="Delete";
    deleteButton.className="delete-btn";
    deleteButton.addEventListener('click', onDeleteButtonPressed);
    return deleteButton;
}

function createBookDiv(book, deleteButton)
{
    const bookDiv=document.createElement("div");
    bookDiv.dataset.indexNumber=book.id;
    bookDiv.textContent = book.info;
    return bookDiv;
}