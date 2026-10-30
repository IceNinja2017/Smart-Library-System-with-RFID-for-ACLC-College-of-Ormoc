
import { BookOpen, Layers } from 'lucide-react'

export default function BookCard({ book, onClick }) {
  const hasImage = Boolean(book.imageUrl)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full aspect-[2/3] max-w-[280px] overflow-hidden rounded-xl text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: 'var(--color-primary)',
        '--tw-ring-color': 'var(--color-primary)',
      }}
    >
      {/* Book Cover */}
      {hasImage ? (
        <img
          src={book.imageUrl}
          alt={`Cover of ${book.title}`}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              'linear-gradient(145deg, #1746A2 0%, #123780 65%, #0B2455 100%)',
          }}
        >
          <BookOpen
            size={110}
            strokeWidth={0.8}
            className="text-white/20"
          />
        </div>
      )}

      {/* Dark Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgb(0 0 0 / 5%) 15%, rgb(0 0 0 / 15%) 40%, rgb(0 0 0 / 90%) 100%)',
        }}
      />

      {/* Book Information */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">

        {/* Category */}
        <div className="mb-3">
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{
              backgroundColor: 'var(--color-secondary)',
            }}
          >
            {book.category || 'Uncategorized'}
          </span>
        </div>

        {/* Title */}
        <h2 className="line-clamp-3 text-lg font-bold leading-snug">
          {book.title}
        </h2>

        {/* Author */}
        <p className="mt-1.5 line-clamp-1 text-sm text-white/80">
          {book.author || 'Unknown author'}
        </p>

        {/* Divider */}
        <div className="my-3 border-t border-white/25" />

        {/* ISBN */}
        <p className="truncate text-[11px] text-white/75">
          ISBN: {book.isbn || 'Not provided'}
        </p>

        {/* Copies and Shelf */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            <Layers size={14} />
            {book._count?.copies ?? 0} Copies
          </span>

          <span className="truncate text-xs text-white/75">
            Shelf: {book.shelfNumber || 'N/A'}
          </span>
        </div>

        {/* View Details */}
        <div className="mt-3 border-t border-white/25 pt-3 text-right">
          <span className="text-xs font-semibold transition group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </button>
  )
}
