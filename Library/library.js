let myLibrary = [];

myLibrary.push(new Book("The Hobbit", "J.R.R Tolkien", 295, false));
myLibrary.push(new Book("The Lord of the Rings", "J.R.R Tolkien", 1178, false));
myLibrary.push(new Book("Pride and Prejudice", "Jane Austin", 432, false));


window.addEventListener('load', () => {
    displayBooks();
});

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();     
    const formData = new FormData(event.target); 
    const formValues = Object.fromEntries(formData); 
    addBookToLibrary(formValues);
});

function Book(title, author, length, isRead) {
    this.id=crypto.randomUUID();
    
    this.title=title;
    this.author=author;
    this.length=length;
    this.isRead=isRead;

    this.info=function() {
        let returnValue=`${this.title} by ${this.author}, ${this.length} pages `;
        returnValue+= this.isRead ? "read" : "not read yet";
        return returnValue;
    }
}

Book.prototype.toggleRead = function() {
    this.isRead=!this.isRead;
};

function addBookToLibrary(params) {
  // take params, create a book then store it in the array
    const wasRead='was-read' in params;
    const pageCount=Number(params["book-length"]);

    newBook = new Book(params["book-title"], params["book-author"], pageCount, wasRead);
    myLibrary.push(newBook);
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
    myLibrary.forEach((book, index) => {
        const deleteButton=createDeleteButton();
        const bookDiv=createBookDiv(book);
        const readButton=createReadButton();

        bookDiv.append(deleteButton);
        bookDiv.append(readButton);

        bookContainer.append(bookDiv);
    });
}

function onDeleteButtonPressed(event) {
    id=event.target.parentElement.dataset.indexNumber;
    deleteBookWithID(id);
}

function onToggleReadButtonPressed(event) {
    id=event.target.parentElement.dataset.indexNumber;
    book=myLibrary.find(book => book.id === id);
    book.toggleRead();
    displayBooks();
}

function deleteBookWithID(id)
{
    myLibrary=myLibrary.filter(book => book.id !== id);
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
    bookDiv.textContent = book.info();
    return bookDiv;
}