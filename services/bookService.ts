import { v4 as uuidv4 } from 'uuid';
import { Book, BookInput, validateBook } from '../models/bookModel';

// In-memory database
let books: Book[] = [];

export const getAllBooks = (): Book[] => {
  return books;
};

export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const createBook = (bookData: BookInput): { book?: Book; errors?: string[] } => {
  // Validate book data
  const errors = validateBook(bookData);
  if (errors.length > 0) {
    return { errors };
  }

  // Create new book with UUID
  const newBook: Book = {
    id: uuidv4(),
    ...bookData
  };

  // Add to collection
  books.push(newBook);

  return { book: newBook };
};

export const updateBook = (id: string, bookData: Partial<BookInput>): { book?: Book; errors?: string[] } => {
  // Find the book
  const bookIndex = books.findIndex(book => book.id === id);
  if (bookIndex === -1) {
    return { errors: ['Book not found'] };
  }

  // Prepare updated book data
  const updatedBook: Book = {
    ...books[bookIndex],
    ...(bookData.title !== undefined && { title: bookData.title }),
    ...(bookData.author !== undefined && { author: bookData.author }),
    ...(bookData.publishedYear !== undefined && { publishedYear: bookData.publishedYear })
  };

  // Validate the updated book
  const errors = validateBook(updatedBook);
  if (errors.length > 0) {
    return { errors };
  }

  // Update the book
  books[bookIndex] = updatedBook;

  return { book: updatedBook };
};

export const deleteBook = (id: string): boolean => {
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  return books.length < initialLength;
};

export const importBooks = (bookDataList: Partial<BookInput>[]): { 
  addedBooksCount: number; 
  errorRows: string[] 
} => {
  const errorRows: string[] = [];
  let addedBooksCount = 0;

  bookDataList.forEach((bookData, index) => {
    // Validate book data
    const errors = validateBook(bookData as BookInput);
    
    if (errors.length > 0) {
      // Add row index and errors to errorRows
      errorRows.push(`Row ${index + 1}: ${errors.join(', ')}`);
    } else {
      // Create and add valid book
      const newBook: Book = {
        id: uuidv4(),
        title: bookData.title!,
        author: bookData.author!,
        publishedYear: bookData.publishedYear!
      };
      
      books.push(newBook);
      addedBooksCount++;
    }
  });

  return { addedBooksCount, errorRows };
};