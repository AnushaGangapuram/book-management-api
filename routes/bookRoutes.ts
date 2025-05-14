import express from 'express';
import multer from 'multer';
import * as bookController from '../controllers/bookController';
import * as importController from '../controllers/importController';

const router = express.Router();

// Set up multer for file upload (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Book routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// CSV import route
router.post('/import', upload.single('file'), importController.importBooks);

export default router;