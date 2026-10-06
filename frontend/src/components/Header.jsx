import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import BrandMark from './BrandMark'

function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleLogout() {
    localStorage.removeItem('token')
    toast.success('Logged out')
    navigate('/login')
  }

  const links = [
    { to: '/upload', label: 'Upload' },
    { to: '/history', label: 'History' },
  ]

  return (
    <nav className="sticky top-0 z-20 border-b border-[#e4ddd0] bg-[#f4f5f2]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link to="/upload" className="shrink-0">
          <BrandMark compact />
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          {links.map(({ to, label }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`)
            return (
              <Link
                key={to}
                to={to}
                className={`relative py-5 text-sm tracking-[0.04em] transition-colors ${
                  active
                    ? 'font-semibold text-ink'
                    : 'text-slate hover:text-ink'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute right-0 bottom-0 left-0 h-[1.5px] bg-ink" />
                )}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink/30 hover:bg-white"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Header
