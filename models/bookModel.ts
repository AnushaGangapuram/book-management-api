export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

export interface BookInput {
  title: string;
  author: string;
  publishedYear: number;
}

export const validateBook = (book: Partial<BookInput>): string[] => {
  const errors: string[] = [];

  if (!book.title || typeof book.title !== 'string' || book.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!book.author || typeof book.author !== 'string' || book.author.trim() === '') {
    errors.push('Author is required and must be a non-empty string');
  }

  if (
    !book.publishedYear ||
    typeof book.publishedYear !== 'number' ||
    book.publishedYear < 0 ||
    book.publishedYear > new Date().getFullYear() + 5 // Allow books up to 5 years in the future
  ) {
    errors.push(`Published year is required and must be a valid year (up to ${new Date().getFullYear() + 5})`);
  }

  return errors;
};