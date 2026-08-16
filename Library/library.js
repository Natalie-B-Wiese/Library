export class Library {
    constructor() {
        this.books=[];
    }

    addBook(book) {
        this.books.push(book);
    }

    findBook(id) {
        return this.books.find(book => book.id === id);
    }

    deleteBook(id) {
        this.books=this.books.filter(book => book.id !== id);
    }
}