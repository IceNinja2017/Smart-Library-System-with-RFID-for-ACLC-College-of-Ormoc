import express from 'express'
import { addBook, addBookCopy, updateBook, getBooks, getBookById, archiveBook, getArchivedBooks, restoreBook } from '../controllers/bookController.js'
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, requireAdmin, getBooks)
router.get('/:bookId', requireAuth, requireAdmin, getBookById)

router.get('/archived', requireAuth, requireAdmin, getArchivedBooks)

router.post('/', requireAuth, requireAdmin, addBook)
router.post('/:bookId/copies', requireAuth, requireAdmin, addBookCopy)

router.put('/:bookId', requireAuth, requireAdmin, updateBook)

router.patch('/:bookId/restore', requireAuth, requireAdmin, restoreBook)
router.patch('/:bookId/archive', requireAuth, requireAdmin, archiveBook)

export default router