
const Footer = () => {
  const schoolLogo = '/school-logo.png'
  const departmentLogo = '/department-logo.png'

  // Add the librarian's actual contact details here.
  const librarianEmail = 'test@example.com'
  const librarianPhone = '+1 (555) 123-4567'

  return (
    <footer className="border-t-4 border-t-[var(--color-secondary)] bg-[var(--color-primary)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">

        {/* School Branding */}
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <img
              src={schoolLogo}
              alt="ACLC College of Ormoc logo"
              className="h-12 w-12 rounded-full bg-white object-contain p-1"
            />

            <img
              src={departmentLogo}
              alt="Department logo"
              className="h-12 w-12 rounded-full bg-white object-contain p-1"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wide">
              ACLC College of Ormoc
            </h3>
            <p className="mt-1 text-xs text-white/75">
              BookSmart | Smart Library System
            </p>
          </div>
        </div>

        {/* Librarian Contact */}
        {(librarianEmail || librarianPhone) && (
          <div className="text-sm md:text-right">
            <p className="mb-1 font-semibold text-white">
              Library Assistance
            </p>

            {librarianEmail && (
              <p className="text-xs text-white/75">
                Email: {librarianEmail}
              </p>
            )}

            {librarianPhone && (
              <p className="text-xs text-white/75">
                Contact: {librarianPhone}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className="border-t border-white/15 px-5 py-3 text-center">
        <p className="text-xs text-white/65">
          © {new Date().getFullYear()} ACLC College of Ormoc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer