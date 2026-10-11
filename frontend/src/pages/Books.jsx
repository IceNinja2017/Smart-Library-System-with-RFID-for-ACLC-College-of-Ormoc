
import { useEffect, useState } from 'react'
import { BookOpen, Search, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'

export default function Books() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadBooks() {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/books')
        const payload = response.data

        const rows = Array.isArray(payload)
          ? payload
          : payload.books

        if (!Array.isArray(rows)) {
          throw new Error(
            'The books API returned an unexpected response.',
          )
        }

        if (active) setBooks(rows)
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ??
              err.message ??
              'Unable to load books.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBooks()

    return () => {
      active = false
    }
  }, [])

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase()

    return [
      book.title,
      book.author,
      book.isbn,
      book.category,
    ].some((value) =>
      String(value ?? '').toLowerCase().includes(query),
    )
  })

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Book catalog
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Search and browse the library collection.
        </p>
      </div>

      <div className="relative max-w-lg">
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, ISBN, or category..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">
          Loading books...
        </p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-800"
          >
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <BookOpen className="mx-auto text-slate-400" size={32} />
          <p className="mt-4 font-medium text-slate-800">
            No books found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try another search or add books to your catalog.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <article
              key={book.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-4">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={`Cover of ${book.title}`}
                    className="h-28 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <BookOpen size={28} />
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {book.author || 'Unknown author'}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    {book.category || 'Uncategorized'}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    ISBN: {book.isbn || 'Not provided'}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
