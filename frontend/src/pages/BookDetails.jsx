
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  RefreshCw,
  MapPin,
  CalendarDays,
  UserRound,
  Barcode,
  Library,
  CheckCircle2,
  AlertCircle,
  Layers3,
} from 'lucide-react'

import BookCopies from '../components/BookCopies'

const BookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const fetchBook = async () => {
      try {
        setLoading(true)
        setError('')

        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

        if (!apiUrl) {
          throw new Error('API URL is not configured.')
        }

        const response = await fetch(`${apiUrl}/books/${bookId}`, {
          method: 'GET',
          signal: controller.signal,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load book details.')
        }

        setBook(result.data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load book details.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchBook()

    return () => controller.abort()
  }, [bookId, refreshKey])

  const handleBack = () => {
    navigate('/books')
  }

  const handleRetry = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const copies = Array.isArray(book?.copies) ? book.copies : []
  const totalCopies = copies.length
  const availableCopies = copies.filter((copy) => copy.available).length
  const borrowedCopies = totalCopies - availableCopies

  const availabilityStatus =
    totalCopies === 0
      ? 'No Copies'
      : availableCopies > 0
        ? 'Available'
        : 'All Borrowed'

  const formatDate = (date) => {
    if (!date) return 'Not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Not available'
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-[#1746A2]" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-gray-700">
            Loading book details
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Please wait while we retrieve the information.
          </p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#1746A2] transition hover:bg-blue-50"
        >
          <ArrowLeft size={18} />
          Back to Books
        </button>

        <div className="mx-auto flex min-h-[350px] max-w-xl flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 rounded-2xl bg-red-50 p-4">
            <BookOpen className="h-10 w-10 text-[#D62828]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Unable to Load Book
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            {error || 'The requested book could not be found.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1746A2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123780]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">

      {/* Page Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-[#D62828] hover:text-[#D62828]"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Catalog
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <BookOpen size={15} />
          <span>Book Catalog</span>
          <span>/</span>
          <span className="text-[#1746A2]">Book Details</span>
        </div>
      </div>

      {/* Main Book Information */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[260px_1fr] lg:gap-10 lg:p-9">

          {/* Book Cover */}
          <div className="mx-auto w-full max-w-[240px] lg:mx-0">
            <div className="relative">
              <div className="absolute -bottom-3 -right-3 h-full w-full rounded-xl bg-[#D62828]/10" />

              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#1746A2] to-[#123780] shadow-xl">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-5 p-5 text-center text-white">
                    <BookOpen size={68} strokeWidth={1.2} />

                    <div>
                      <p className="text-lg font-bold leading-snug">
                        {book.title}
                      </p>
                      <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#D62828]" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-2 bg-[#D62828]" />
              </div>
            </div>

            <p className="mt-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
              Library Book Cover
            </p>
          </div>

          {/* Book Details */}
          <div className="flex min-w-0 flex-col justify-center">

            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#D62828]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D62828]" />
                {book.category || 'General'}
              </span>
            </div>

            {/* Title and Author */}
            <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-[#1746A2] sm:text-4xl">
              {book.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-base font-medium text-gray-600">
              <UserRound size={19} className="shrink-0 text-[#D62828]" />
              {book.author}
            </p>

            {/* Availability */}
            <div className="mt-5">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                  availableCopies > 0
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                {availabilityStatus}
              </span>
            </div>

            {/* Red and Blue Divider */}
            <div className="my-7 flex h-1 w-full max-w-[180px] overflow-hidden rounded-full">
              <div className="w-2/3 bg-[#1746A2]" />
              <div className="w-1/3 bg-[#D62828]" />
            </div>

            {/* Copy Statistics */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1746A2] text-white">
                  <Library size={18} />
                </div>

                <p className="text-2xl font-extrabold text-[#1746A2]">
                  {totalCopies}
                </p>

                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Total Copies
                </p>
              </div>

              <div className="rounded-xl border border-green-100 bg-green-50/70 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
                  <CheckCircle2 size={18} />
                </div>

                <p className="text-2xl font-extrabold text-green-700">
                  {availableCopies}
                </p>

                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Available
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-red-100 bg-red-50/70 p-4 sm:col-span-1">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#D62828] text-white">
                  <AlertCircle size={18} />
                </div>

                <p className="text-2xl font-extrabold text-[#D62828]">
                  {borrowedCopies}
                </p>

                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Borrowed
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-7">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Layers3 size={15} className="text-[#D62828]" />
                Book Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* ISBN */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-lg bg-red-50 p-2.5 text-[#D62828]">
                    <Barcode size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      ISBN
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-gray-800">
                      {book.isbn || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Shelf Location */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2.5 text-[#1746A2]">
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Shelf Location
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {book.shelfNumber || 'Not assigned'}
                    </p>
                  </div>
                </div>

                {/* Date Added */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-lg bg-red-50 p-2.5 text-[#D62828]">
                    <CalendarDays size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Date Added
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {formatDate(book.createdAt)}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Book Synopsis */}
      {book.synopsis && (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="rounded-lg bg-red-50 p-2 text-[#D62828]">
              <BookOpen size={19} />
            </div>

            <div>
              <h2 className="font-bold text-[#1746A2]">
                About This Book
              </h2>
              <p className="text-xs text-gray-400">
                Book synopsis and description
              </p>
            </div>
          </div>

          <div className="border-l-4 border-[#D62828] px-5 py-5 sm:px-7">
            <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
              {book.synopsis}
            </p>
          </div>
        </section>
      )}

      {/* Physical Copies */}
      <section className="space-y-5">

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#1746A2] p-3 text-white shadow-sm">
              <Library size={23} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1746A2] sm:text-2xl">
                Physical Copies
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Individual copies registered under this book.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-[#1746A2]">
              <BookOpen size={15} />
              {totalCopies} {totalCopies === 1 ? 'Copy' : 'Copies'}
            </span>

            <span className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-[#D62828]">
              <span className="h-2 w-2 rounded-full bg-[#D62828]" />
              {borrowedCopies} Borrowed
            </span>
          </div>
        </div>

        {/* Availability Legend */}
        <div className="flex flex-wrap items-center gap-4 px-1 text-xs font-semibold">
          <span className="flex items-center gap-2 text-green-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Available
          </span>

          <span className="flex items-center gap-2 text-red-700">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Borrowed
          </span>
        </div>

        {/* Copy Cards */}
        <BookCopies
          copies={copies}
          imageUrl={book.imageUrl}
          isbn={book.isbn}
        />
      </section>
    </div>
  )
}

export default BookDetails
