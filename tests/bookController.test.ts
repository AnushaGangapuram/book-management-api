import request from 'supertest';
import app from '../app';

describe('Book Controller', () => {
  let createdBookId: string;

  // Test creating a book
  describe('POST /books', () => {
    it('should create a new book', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          publishedYear: 2023
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Book');
      expect(response.body.author).toBe('Test Author');
      expect(response.body.publishedYear).toBe(2023);

      createdBookId = response.body.id;
    });

    it('should return 400 for invalid book data', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: '',
          author: 'Test Author',
          publishedYear: 3000
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  // Test getting all books
  describe('GET /books', () => {
    it('should get all books', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test getting a book by ID
  describe('GET /books/:id', () => {
    it('should get a book by ID', async () => {
      // First we need to ensure we have a book ID
      if (!createdBookId) {
        const createResponse = await request(app)
          .post('/books')
          .send({
            title: 'Another Test Book',
            author: 'Another Test Author',
            publishedYear: 2023
          });
        createdBookId = createResponse.body.id;
      }

      const response = await request(app).get(`/books/${createdBookId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdBookId);
    });

    it('should return 404 for non-existent book ID', async () => {
      const response = await request(app).get('/books/non-existent-id');

      expect(response.status).toBe(404);
    });
  });
});