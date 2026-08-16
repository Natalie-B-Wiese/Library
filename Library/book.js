export class Book {
    constructor(title, author, length, isRead) {
        this.id=crypto.randomUUID();
        
        this.title=title;
        this.author=author;
        this.length=length;
        this.isRead=isRead;
    }

    get info() {
        let returnValue=`${this.title} by ${this.author}, ${this.length} pages `;
        returnValue+= this.isRead ? "read" : "not read yet";
        return returnValue;
    }

    toggleRead() {
        this.isRead=!this.isRead;
    }
} 