
import { useEffect, useState } from 'react'
import {
  BookOpen,
  Search,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard'

export default function Books() {
  const navigate = useNavigate()

  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const timeout = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams()

        if (search.trim()) {
          params.set('search', search.trim())
        }

        if (author.trim()) {
          params.set('author', author.trim())
        }

        if (category.trim()) {
          params.set('category', category.trim())
        }

        const queryString = params.toString()
        const apiUrl = import.meta.env.VITE_API_URL

        const response = await fetch(
          `${apiUrl}/books${queryString ? `?${queryString}` : ''}`,
          {
            method: 'GET',
            signal: controller.signal,
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || 'Unable to load books.'
          )
        }

        const rows = result?.data

        if (!Array.isArray(rows)) {
          throw new Error(
            'The books API returned an unexpected response.'
          )
        }

        setBooks(rows)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(
            err.message || 'Unable to load books.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 350)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [search, author, category, refreshKey])

  const clearFilters = () => {
    setSearch('')
    setAuthor('')
    setCategory('')
  }

  const hasFilters =
    search.trim() !== '' ||
    author.trim() !== '' ||
    category.trim() !== ''

  const handleBookClick = (book) => {
    navigate(`/books/${book.id}`)
  }

  return (
    <section className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            Book Catalog
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Search and browse the library collection.
          </p>

          {/* Red Accent */}
          <div
            className="mt-4 h-1 w-16 rounded-full"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          />
        </div>

        <div
          className="flex items-center gap-2 self-start rounded-xl border px-4 py-3 text-sm font-semibold sm:self-center"
          style={{
            color: 'var(--color-primary)',
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <BookOpen size={18} />
          {books.length} {books.length === 1 ? 'Book' : 'Books'} Found
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="rounded-2xl border p-4 shadow-sm sm:p-5"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Main Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-primary)' }}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#D62828] focus:ring-2 focus:ring-[#D62828]/15"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-background)',
              }}
            />
          </div>

          {/* Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
            style={{
              backgroundColor: showFilters
                ? 'var(--color-secondary)'
                : 'var(--color-primary)',
            }}
          >
            <SlidersHorizontal size={17} />
            Filters

            {hasFilters && (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </button>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-red-50"
              style={{
                borderColor: 'var(--color-secondary)',
                color: 'var(--color-secondary)',
              }}
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div
            className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Author Filter */}
            <div>
              <label
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                />
                Author
              </label>

              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Filter by author..."
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#D62828] focus:ring-2 focus:ring-[#D62828]/15"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                />
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Filter by category..."
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#D62828] focus:ring-2 focus:ring-[#D62828]/15"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Book Results */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin"
            style={{ color: 'var(--color-primary)' }}
          />

          <p
            className="mt-4 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Loading books...
          </p>
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border p-6 text-center"
          style={{
            borderColor: 'var(--color-secondary)',
            backgroundColor: '#FEF2F2',
          }}
        >
          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>

          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : books.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-12 text-center"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <BookOpen
            size={38}
            className="mx-auto"
            style={{ color: 'var(--color-primary)' }}
          />

          <h2
            className="mt-4 font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            No books found
          </h2>

          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Try adjusting your search or filters.
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold transition hover:underline"
              style={{ color: 'var(--color-secondary)' }}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => handleBookClick(book)}
            />
          ))}
        </div>
      )}
    </section>
  )
}