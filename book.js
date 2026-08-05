function Book(title, author, length, isRead) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }

    this.title=title;
    this.author=author;
    this.length=length;
    this.isRead=isRead;

    this.info=function() {
        let returnValue=`${this.title} by ${this.author}, ${length} pages `;
        returnValue+= isRead ? "read" : "not read yet";
        return returnValue;
    }
}


theHobbit=new Book("The Hobbit", "J.R.R. Tolkien", 295, false);


console.log(theHobbit.info()); // "The Hobbit by J.R.R. Tolkien, 295 pages, not read yet"
