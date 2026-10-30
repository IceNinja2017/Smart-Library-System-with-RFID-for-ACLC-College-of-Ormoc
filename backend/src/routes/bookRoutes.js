import express from 'express'
import { addBook, addBookCopy, updateBook, getBooks, getBookById, archiveBook, getArchivedBooks, restoreBook, checkRfidTag } from '../controllers/bookController.js'
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router()

router.get('/', getBooks)
router.get('/archived', requireAuth, requireAdmin, getArchivedBooks)
router.get('/:bookId', getBookById)

router.post('/', requireAuth, requireAdmin, addBook)
router.post('/:bookId/copies', requireAuth, requireAdmin, addBookCopy)

router.put('/:bookId', requireAuth, requireAdmin, updateBook)

router.patch('/:bookId/restore', requireAuth, requireAdmin, restoreBook)
router.patch('/:bookId/archive', requireAuth, requireAdmin, archiveBook)

router.post('/check-rfid', checkRfidTag)

export default router