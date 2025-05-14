import { Request, Response } from 'express';
import * as bookService from '../services/bookService';
import { parseCSVFile } from '../utils/csvParser';

export const importBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file exists in request
    if (!req.file) {
      res.status(400).json({ message: 'No CSV file uploaded' });
      return;
    }

    // Parse CSV file
    const bookDataList = await parseCSVFile(req.file.buffer);
    
    // Process books
    const result = bookService.importBooks(bookDataList);
    
    res.status(200).json({
      addedBooksCount: result.addedBooksCount,
      errorRows: result.errorRows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to import books', 
      error: (error as Error).message 
    });
  }
};