
import { BookOpen } from 'lucide-react'

const BookCopies = ({ copies = [], imageUrl, isbn }) => {
  if (copies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />

        <h3 className="font-semibold text-gray-700">
          No Physical Copies
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          There are currently no physical copies registered for this book.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {copies.map((copy) => (
        <div
          key={copy.id}
          className="group relative aspect-[2/3] max-w-[280px] overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#1746A2] to-[#123780] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Book Cover */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <BookOpen size={70} strokeWidth={1} />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

          {/* Copy Information */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3">
            <span
              className={`w-fit rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
                copy.available
                  ? 'bg-green-600'
                  : 'bg-red-600'
              }`}
            >
              {copy.available ? 'Available' : 'Borrowed'}
            </span>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">
                ISBN
              </p>

              <p className="break-all text-xs font-bold leading-snug text-white">
                {isbn || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookCopies