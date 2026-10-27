
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

// POST /api/books
export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      shelfNumber,
      imageUrl,
      copies,
    } = req.body

    // Validate required book information
    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof author !== 'string' ||
      !author.trim()
    ) {
      return res.status(400).json({
        message: 'Book title and author are required.',
      })
    }

    // Require at least one physical copy
    if (!Array.isArray(copies) || copies.length === 0) {
      return res.status(400).json({
        message: 'Add at least one physical book copy.',
      })
    }

    // Validate the RFID tags provided for each copy
    for (let i = 0; i < copies.length; i++) {
      const copy = copies[i]

      if (!copy || typeof copy !== 'object' || Array.isArray(copy)) {
        return res.status(400).json({
          message: `Copy ${i + 1} has invalid data.`,
        })
      }

      if (
        copy.rfidTag != null &&
        (typeof copy.rfidTag !== 'string' || !copy.rfidTag.trim())
      ) {
        return res.status(400).json({
          message: `RFID tag for copy ${i + 1} must be a non-empty string or null.`,
        })
      }
    }

    // Normalize and validate optional fields
    const normalizedIsbn =
      typeof isbn === 'string' ? isbn.trim() || null : isbn ?? null

    const normalizedCategory =
      typeof category === 'string' && category.trim()
        ? category.trim()
        : 'General'

    const normalizedShelf =
      typeof shelfNumber === 'string'
        ? shelfNumber.trim() || null
        : shelfNumber ?? null

    const normalizedImageUrl =
      typeof imageUrl === 'string' ? imageUrl.trim() || null : imageUrl ?? null

    if (
      (normalizedIsbn !== null && typeof normalizedIsbn !== 'string') ||
      (normalizedShelf !== null && typeof normalizedShelf !== 'string') ||
      (normalizedImageUrl !== null &&
        typeof normalizedImageUrl !== 'string')
    ) {
      return res.status(400).json({
        message: 'ISBN, shelf number, and image URL must be strings or null.',
      })
    }

    // Avoid duplicate RFID tags within this request
    const rfidTags = copies
      .map((copy) =>
        typeof copy.rfidTag === 'string' ? copy.rfidTag.trim() : null
      )
      .filter(Boolean)

    if (new Set(rfidTags).size !== rfidTags.length) {
      return res.status(400).json({
        message: 'Each physical copy must have a unique RFID tag.',
      })
    }

    // Create one catalogue entry and all its physical copies.
    // Prisma's nested write is atomic: if a copy fails, the book
    // and its other copies are not partially saved.
    const book = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        isbn: normalizedIsbn,
        category: normalizedCategory,
        shelfNumber: normalizedShelf,
        imageUrl: normalizedImageUrl,

        copies: {
          create: copies.map((copy) => ({
            rfidTag:
              typeof copy.rfidTag === 'string'
                ? copy.rfidTag.trim() || null
                : null,
          })),
        },
      },
      include: {
        copies: true,
      },
    })

    return res.status(201).json({
      message: 'Book and physical copies added successfully.',
      data: book,
    })
  } catch (error) {
    console.error('Add book error:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        message:
          'The ISBN or an RFID tag already exists. Please check the values and try again.',
      })
    }

    return res.status(500).json({
      message: 'Failed to add book.',
    })
  }
}

// POST /api/books/:bookId/copies
export const addBookCopy = async (req, res) => {
  try {
    const { bookId } = req.params
    const { rfidTag } = req.body

    // Validate optional RFID tag
    if (
      rfidTag != null &&
      (typeof rfidTag !== 'string' || !rfidTag.trim())
    ) {
      return res.status(400).json({
        message: 'RFID tag must be a non-empty string or null.',
      })
    }

    // Check whether the catalogue book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, title: true },
    })

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found.',
      })
    }

    // Create a physical copy linked to the existing book
    const copy = await prisma.bookCopy.create({
      data: {
        bookId: existingBook.id,
        rfidTag:
          typeof rfidTag === 'string'
            ? rfidTag.trim() || null
            : null,
      },
    })

    return res.status(201).json({
      message: 'Physical book copy added successfully.',
      data: copy,
    })
  } catch (error) {
    console.error('Add book copy error:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        message: 'This RFID tag is already registered to another copy.',
      })
    }

    return res.status(500).json({
      message: 'Failed to add physical book copy.',
    })
  }
}

// GET /api/books
// List active books
// GET /api/books?search=harry&author=Rowling&category=Fantasy
export const getBooks = async (req, res) => {
  try {
    const { search, author, category } = req.query

    const where = {
      archivedAt: null,
    }

    // Search by title, author, or ISBN
    if (typeof search === 'string' && search.trim()) {
      const keyword = search.trim()

      where.OR = [
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          isbn: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ]
    }

    // Filter by author
    if (typeof author === 'string' && author.trim()) {
      where.author = {
        contains: author.trim(),
        mode: 'insensitive',
      }
    }

    // Filter by category
    if (typeof category === 'string' && category.trim()) {
      where.category = {
        equals: category.trim(),
        mode: 'insensitive',
      }
    }

    const books = await prisma.book.findMany({
      where,
      include: {
        _count: {
          select: { copies: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      data: books,
    })
  } catch (error) {
    console.error('Get books error:', error)

    return res.status(500).json({
      message: 'Failed to fetch books.',
    })
  }
}

// GET /api/books/:bookId
// Get one active book and its physical copies
export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params

    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        archivedAt: null,
      },
      include: {
        copies: true,
      },
    })

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' })
    }

    return res.status(200).json({ data: book })
  } catch (error) {
    console.error('Get book error:', error)
    return res.status(500).json({ message: 'Failed to fetch book.' })
  }
}

// PUT /api/books/:bookId
// Update catalogue information only, not physical copies

export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params

    const {
      title,
      author,
      isbn,
      category,
      shelfNumber,
      imageUrl,
      copies,
    } = req.body

    // 1. Check that the book exists and is not archived
    const existingBook = await prisma.book.findFirst({
      where: {
        id: bookId,
        archivedAt: null,
      },
    })

    if (!existingBook) {
      return res.status(404).json({
        message: 'Active book not found.',
      })
    }

    // 2. Validate the copies payload, if supplied
    if (copies !== undefined) {
      if (!Array.isArray(copies)) {
        return res.status(400).json({
          message: 'Copies must be an array.',
        })
      }

      for (let i = 0; i < copies.length; i++) {
        const copy = copies[i]

        if (
          !copy ||
          typeof copy !== 'object' ||
          Array.isArray(copy) ||
          typeof copy.id !== 'string' ||
          !copy.id.trim()
        ) {
          return res.status(400).json({
            message: `Copy ${i + 1} must have a valid copy ID.`,
          })
        }

        if (
          !Object.prototype.hasOwnProperty.call(copy, 'rfidTag') ||
          (copy.rfidTag !== null &&
            (typeof copy.rfidTag !== 'string' ||
              !copy.rfidTag.trim()))
        ) {
          return res.status(400).json({
            message: `Copy ${i + 1} must provide an RFID tag or null.`,
          })
        }
      }

      // Prevent the same copy from being submitted more than once
      const copyIds = copies.map((copy) => copy.id.trim())

      if (new Set(copyIds).size !== copyIds.length) {
        return res.status(400).json({
          message: 'A copy cannot be included more than once.',
        })
      }

      // Normalize tags and prevent duplicates within this request
      const rfidTags = copies
        .map((copy) =>
          typeof copy.rfidTag === 'string'
            ? copy.rfidTag.trim()
            : null
        )
        .filter(Boolean)

      if (new Set(rfidTags).size !== rfidTags.length) {
        return res.status(400).json({
          message: 'Each copy must have a unique RFID tag.',
        })
      }
    }

    // 3. Prepare book fields for updating
    const data = {}

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          message: 'Title must be a non-empty string.',
        })
      }

      data.title = title.trim()
    }

    if (author !== undefined) {
      if (typeof author !== 'string' || !author.trim()) {
        return res.status(400).json({
          message: 'Author must be a non-empty string.',
        })
      }

      data.author = author.trim()
    }

    if (isbn !== undefined) {
      if (isbn !== null && typeof isbn !== 'string') {
        return res.status(400).json({
          message: 'ISBN must be a string or null.',
        })
      }

      data.isbn =
        typeof isbn === 'string' ? isbn.trim() || null : null
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({
          message: 'Category must be a non-empty string.',
        })
      }

      data.category = category.trim()
    }

    if (shelfNumber !== undefined) {
      if (shelfNumber !== null && typeof shelfNumber !== 'string') {
        return res.status(400).json({
          message: 'Shelf number must be a string or null.',
        })
      }

      data.shelfNumber =
        typeof shelfNumber === 'string'
          ? shelfNumber.trim() || null
          : null
    }

    if (imageUrl !== undefined) {
      if (imageUrl !== null && typeof imageUrl !== 'string') {
        return res.status(400).json({
          message: 'Image URL must be a string or null.',
        })
      }

      data.imageUrl =
        typeof imageUrl === 'string'
          ? imageUrl.trim() || null
          : null
    }

    // 4. Update book and its specified copies atomically
    const updatedBook = await prisma.$transaction(async (tx) => {
      if (copies !== undefined && copies.length > 0) {
        // Ensure every copy belongs to this book
        const existingCopies = await tx.bookCopy.findMany({
          where: {
            bookId,
            id: {
              in: copies.map((copy) => copy.id.trim()),
            },
          },
          select: {
            id: true,
          },
        })

        if (existingCopies.length !== copies.length) {
          const error = new Error(
            'One or more copies do not belong to this book.'
          )
          error.statusCode = 400
          throw error
        }

        // Check whether any requested RFID tag belongs to
        // a different copy, including copies of other books
        const requestedTags = copies
          .map((copy) =>
            typeof copy.rfidTag === 'string'
              ? copy.rfidTag.trim() || null
              : null
          )
          .filter(Boolean)

        if (requestedTags.length > 0) {
          const conflictingCopy = await tx.bookCopy.findFirst({
            where: {
              rfidTag: { in: requestedTags },
              id: {
                notIn: copies.map((copy) => copy.id.trim()),
              },
            },
            select: { id: true },
          })

          if (conflictingCopy) {
            const error = new Error(
              'One or more RFID tags are already assigned to another copy.'
            )
            error.statusCode = 409
            throw error
          }
        }

        // Apply each RFID change to its existing copy
        for (const copy of copies) {
          await tx.bookCopy.update({
            where: {
              id: copy.id.trim(),
            },
            data: {
              rfidTag:
                typeof copy.rfidTag === 'string'
                  ? copy.rfidTag.trim() || null
                  : null,
            },
          })
        }
      }

      // Update catalogue information
      await tx.book.update({
        where: { id: bookId },
        data,
      })

      // Return the updated book and its physical copies
      return tx.book.findUnique({
        where: { id: bookId },
        include: {
          copies: true,
          _count: {
            select: { copies: true },
          },
        },
      })
    })

    return res.status(200).json({
      message: 'Book and copy details updated successfully.',
      data: updatedBook,
    })
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      })
    }

    console.error('Update book error:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        message: 'That ISBN or RFID tag is already assigned.',
      })
    }

    return res.status(500).json({
      message: 'Failed to update book.',
    })
  }
}


// DELETE /api/books/:bookId
// Soft-delete: archive the book instead of permanently deleting it
export const archiveBook = async (req, res) => {
  try {
    const { bookId } = req.params

    const book = await prisma.book.findFirst({
      where: { id: bookId, archivedAt: null },
      include: {
        copies: {
          include: {
            borrowTransactions: {
              where: { status: 'BORROWED' },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    })

    if (!book) {
      return res.status(404).json({
        message: 'Active book not found.',
      })
    }

    const hasBorrowedCopy = book.copies.some(
      (copy) => copy.borrowTransactions.length > 0
    )

    if (hasBorrowedCopy) {
      return res.status(409).json({
        message:
          'This book has a copy currently borrowed. Process its return before archiving the book.',
      })
    }

    const archivedBook = await prisma.book.update({
      where: { id: bookId },
      data: { archivedAt: new Date() },
    })

    return res.status(200).json({
      message: 'Book archived successfully.',
      data: archivedBook,
    })
  } catch (error) {
    console.error('Archive book error:', error)
    return res.status(500).json({ message: 'Failed to archive book.' })
  }
}

// GET /api/books/archive
// List archived books
export const getArchivedBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { archivedAt: { not: null } },
      include: {
        _count: { select: { copies: true } },
      },
      orderBy: { archivedAt: 'desc' },
    })

    return res.status(200).json({ data: books })
  } catch (error) {
    console.error('Get archived books error:', error)
    return res.status(500).json({
      message: 'Failed to fetch archived books.',
    })
  }
}

// PATCH /api/books/:bookId/restore
// Restore an archived book
export const restoreBook = async (req, res) => {
  try {
    const { bookId } = req.params

    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        archivedAt: { not: null },
      },
    })

    if (!book) {
      return res.status(404).json({
        message: 'Archived book not found.',
      })
    }

    const restoredBook = await prisma.book.update({
      where: { id: bookId },
      data: { archivedAt: null },
    })

    return res.status(200).json({
      message: 'Book restored successfully.',
      data: restoredBook,
    })
  } catch (error) {
    console.error('Restore book error:', error)
    return res.status(500).json({
      message: 'Failed to restore book.',
    })
  }
}