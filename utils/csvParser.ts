import { Readable } from 'stream';
import csv from 'csv-parser';
import { BookInput } from '../models/bookModel';

export const parseCSVFile = (fileBuffer: Buffer): Promise<Partial<BookInput>[]> => {
  return new Promise((resolve, reject) => {
    const books: Partial<BookInput>[] = [];
    
    // Create a readable stream from the buffer
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null); // End the stream
    
    readableStream
      .pipe(csv())
      .on('data', (row) => {
        // Process each row
        const book: Partial<BookInput> = {
          title: row.title,
          author: row.author,
          publishedYear: row.publishedYear ? Number(row.publishedYear) : undefined
        };
        books.push(book);
      })
      .on('end', () => {
        resolve(books);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};