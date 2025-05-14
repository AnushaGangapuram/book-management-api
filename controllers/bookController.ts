import { Request, Response } from 'express';
import * as bookService from '../services/bookService';
import { BookInput } from '../models/bookModel';

export const getAllBooks = (req: Request, res: Response): void => {
  try {
    const books = bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: (error as Error).message });
  }
};

export const getBookById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const book = bookService.getBookById(id);
    
    if (!book) {
      res.status(404).json({ message: `Book with id ${id} not found` });
      return;
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: (error as Error).message });
  }
};

export const createBook = (req: Request, res: Response): void => {
  try {
    const bookData: BookInput = {
      title: req.body.title,
      author: req.body.author,
      publishedYear: Number(req.body.publishedYear)
    };
    
    const result = bookService.createBook(bookData);
    
    if (result.errors) {
      res.status(400).json({ message: 'Invalid book data', errors: result.errors });
      return;
    }
    
    res.status(201).json(result.book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error: (error as Error).message });
  }
};

export const updateBook = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const bookData: Partial<BookInput> = {
      ...(req.body.title !== undefined && { title: req.body.title }),
      ...(req.body.author !== undefined && { author: req.body.author }),
      ...(req.body.publishedYear !== undefined && { publishedYear: Number(req.body.publishedYear) })
    };
    
    const result = bookService.updateBook(id, bookData);
    
    if (result.errors && result.errors.includes('Book not found')) {
      res.status(404).json({ message: `Book with id ${id} not found` });
      return;
    } else if (result.errors) {
      res.status(400).json({ message: 'Invalid book data', errors: result.errors });
      return;
    }
    
    res.status(200).json(result.book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: (error as Error).message });
  }
};

export const deleteBook = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = bookService.deleteBook(id);
    
    if (!deleted) {
      res.status(404).json({ message: `Book with id ${id} not found` });
      return;
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: (error as Error).message });
  }
};