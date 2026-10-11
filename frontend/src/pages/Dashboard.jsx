
import {
  BookOpen,
  BookMarked,
  Clock3,
  Users,
  ArrowRight,
  Radio,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'

const recentActivity = [
  {
    id: 1,
    student: 'Sample Student',
    action: 'Borrowed a book',
    book: 'Introduction to Computing',
    status: 'Borrowed',
  },
  {
    id: 2,
    student: 'Sample Teacher',
    action: 'Returned a book',
    book: 'Research Methods',
    status: 'Returned',
  },
  {
    id: 3,
    student: 'Sample Student 2',
    action: 'Borrowed a book',
    book: 'Web Development Basics',
    status: 'Borrowed',
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            LIBRARY OVERVIEW
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor your library collection and borrowing activity.
          </p>
        </div>

        <Link
          to="/books"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <BookOpen size={18} />
          Browse books
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total book copies"
          value="1,248"
          description="Sample inventory"
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Currently borrowed"
          value="186"
          description="Sample active loans"
          icon={BookMarked}
          color="blue"
        />
        <StatCard
          title="Overdue loans"
          value="12"
          description="Sample overdue count"
          icon={Clock3}
          color="amber"
        />
        <StatCard
          title="Registered members"
          value="342"
          description="Sample student and teacher accounts"
          icon={Users}
          color="violet"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Example borrowing and return records
              </p>
            </div>
            <Clock3 className="text-slate-400" size={20} />
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.student}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.action}: {item.book}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === 'Returned'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Radio size={23} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                RFID scanning
              </h2>
              <p className="text-xs text-slate-500">
                Integration placeholder
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            Connect your RFID reader to record scans and validate
            borrowing or return requests through the backend.
          </p>

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">
              Device status
            </p>
            <p className="mt-1 text-sm text-slate-500">
              No device connected yet
            </p>
          </div>

          <Link
            to="/books"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            View book catalog <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Demo dashboard — displayed counts and activity are not live library data.
      </p>
    </div>
  )
}
