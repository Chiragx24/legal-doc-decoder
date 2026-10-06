import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-react'
import { loginUser } from '../api/auth'
import Button from '../components/Button'
import BrandMark from '../components/BrandMark'

const fieldClass =
  'w-full rounded-xl border border-ink/15 bg-white py-3 pr-3 pl-11 text-ink shadow-sm placeholder:text-slate/50 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await loginUser(username, password)
      localStorage.setItem('token', data.token)
      toast.success('Welcome back')
      navigate('/upload')
    } catch (err) {
      toast.error('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16">
        <div className="pointer-events-none absolute inset-0 landing-grain opacity-20" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-flag/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-seal/20 blur-3xl" />
        <div className="pointer-events-none absolute right-6 bottom-0 select-none font-serif text-[16rem] leading-none text-paper/[0.04]">
          §
        </div>

        <Link to="/" className="relative z-10">
          <BrandMark light />
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-paper/80 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-flag" />
            Welcome back
          </p>
          <h1 className="font-serif text-4xl font-medium leading-[1.2] text-white xl:text-5xl">
            Pick up the document you were still reading.
          </h1>
          <p className="mt-5 max-w-sm text-[1.05rem] leading-relaxed text-paper/75">
            Your clauses, flags, and follow-up questions stay right where you left them.
          </p>
        </div>

        <p className="relative z-10 text-xs leading-relaxed text-paper/45">
          Plain-language explanations. Not formal legal advice.
        </p>
      </aside>

      <main className="flex min-h-screen flex-col px-5 py-8 sm:px-8">
        <div className="mb-10 flex items-center justify-between lg:hidden">
          <Link to="/">
            <BrandMark compact />
          </Link>
          <Link to="/signup" className="text-sm font-medium text-ink">
            Sign up
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center">
          <p className="text-xs font-semibold tracking-[0.14em] text-slate uppercase">Account</p>
          <h2 className="mt-2 font-serif text-3xl font-medium text-ink">Log in</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            Welcome back — pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
                Username
              </label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${fieldClass} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((open) => !open)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full rounded-full">
              {loading ? 'Logging in...' : 'Log in'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
