
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">Page not found.</p>
      <Link
        to="/"
        className="mt-5 inline-block text-emerald-700 underline"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
