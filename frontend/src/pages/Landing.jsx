import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Flag,
  MessageCircleQuestion,
  Scale,
  ScanText,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import Button from '../components/Button'
import BrandMark from '../components/BrandMark'

function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="relative bg-ink text-paper">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 landing-grain opacity-20" />
          <div className="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-flag/15 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-seal/20 blur-3xl" />
          <div className="absolute top-10 right-10 hidden select-none font-serif text-[18rem] leading-none text-paper/[0.04] lg:block">
            §
          </div>
        </div>

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
          <BrandMark light compact />
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="#how-it-works" className="hidden text-sm text-paper/75 transition-colors hover:text-paper md:inline">
              How it works
            </a>
            <Link to="/login" className="text-sm text-paper/85 transition-colors hover:text-paper">
              Log in
            </Link>
            <Link to="/signup">
              <Button variant="light" className="rounded-full px-4 py-1.5 text-sm shadow-sm">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 lg:pb-24 lg:pt-12">
          <div className="landing-rise max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-paper/80 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-flag" />
              Rental agreements · Offer letters
            </p>
            <h1 className="font-serif text-[2.4rem] font-medium leading-[1.2] text-white sm:text-5xl lg:text-[3.35rem]">
              Understand what you're signing — before you sign it.
            </h1>
            <p className="mt-6 max-w-md text-[1.05rem] leading-[1.7] text-paper/80">
              Upload a rental agreement or offer letter and get a plain-language
              explanation of every clause, with unusual terms flagged and
              follow-up questions answered from the actual law.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/signup">
                <Button variant="light" size="lg" className="rounded-full px-7 shadow-lg shadow-black/20">
                  Try it for free
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm text-paper/75 transition-colors hover:text-paper"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="landing-rise-delay landing-float relative w-full">
            <div className="absolute inset-x-4 -bottom-3 top-3 rounded-2xl bg-paper-dim/30" />
            <div className="absolute inset-x-2 -bottom-1.5 top-1.5 rounded-2xl border border-white/10 bg-white/10" />
            <article className="relative overflow-hidden rounded-2xl border border-white/15 bg-paper shadow-[0_28px_60px_-18px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-paper">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">rental-agreement.pdf</p>
                    <p className="text-xs text-slate">14 clauses · 2 need attention</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-flag-light px-2.5 py-1 text-[11px] font-semibold text-flag">
                  Review
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div className="rounded-xl border border-flag/20 bg-flag-light p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Flag size={13} className="text-flag" />
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-flag uppercase">
                      Clause 8 — Lock-in period
                    </p>
                  </div>
                  <p className="font-serif text-[0.95rem] italic leading-relaxed text-ink/65">
                    “The tenant shall not vacate before 11 months, failing which the deposit stands forfeited.”
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    An 11-month lock-in with a forfeited deposit is unusually one-sided. Worth questioning before you sign.
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck size={13} className="text-seal" />
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-seal uppercase">
                      Clause 2 — Security deposit
                    </p>
                  </div>
                  <p className="font-serif text-[0.95rem] italic leading-relaxed text-ink/65">
                    “The security deposit shall be Rs. 30,000, refundable within 30 days of vacating.”
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    You'll pay Rs. 30,000 upfront, returned within 30 days after you move out — a standard, lawful term.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-slate">
                  <MessageCircleQuestion size={14} className="shrink-0 text-ink/50" />
                  <p>Ask follow-up questions, answered with the law behind them.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-slate uppercase">What you get</p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-snug text-ink sm:text-4xl">
              A clear reading of the contract in front of you.
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-slate">
              No jargon wall. No generic summary. Each clause, explained, then marked if it looks unusual.
            </p>
          </div>

          <div className="divide-y divide-line border-y border-line">
            <FeatureRow
              number="01"
              icon={<ScanText size={18} />}
              title="Plain-language explanations"
              body="Every clause rewritten so you can actually tell what you are agreeing to — rent, notice, lock-in, and the rest."
            />
            <FeatureRow
              number="02"
              icon={<ShieldAlert size={18} />}
              title="Unusual terms, flagged"
              body="One-sided lock-ins, hidden fees, and forfeiture clauses are called out so they do not slip past you."
            />
            <FeatureRow
              number="03"
              icon={<Scale size={18} />}
              title="Ask a follow-up"
              body="Questions are answered with the statute or rule behind the clause, not a vague guess."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
          <p className="text-xs font-semibold tracking-[0.14em] text-slate uppercase">How it works</p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium leading-snug text-ink sm:text-4xl">
            Three steps from a dense PDF to a decision you can stand behind.
          </h2>

          <div className="relative mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="pointer-events-none absolute top-8 right-8 left-8 hidden h-px bg-line md:block" />
            <Step
              number="1"
              icon={<Upload size={18} />}
              title="Upload the document"
              body="Drop in a rental agreement or offer letter. We read the file and split it into clauses."
            />
            <Step
              number="2"
              icon={<ScanText size={18} />}
              title="We decode each clause"
              body="You get a plain-language note for every section, plus a flag when something looks off."
            />
            <Step
              number="3"
              icon={<MessageCircleQuestion size={18} />}
              title="Ask, then decide"
              body="Follow up on anything unclear. Then sign, negotiate, or walk away with your eyes open."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-paper sm:px-14">
          <div className="pointer-events-none absolute inset-0 landing-grain opacity-15" />
          <div className="pointer-events-none absolute -right-16 -top-20 select-none font-serif text-[14rem] leading-none text-paper/[0.05]">
            §
          </div>
          <div className="relative max-w-xl">
            <h2 className="font-serif text-3xl font-medium leading-snug text-white sm:text-4xl">
              Read the fine print without needing a lawyer in the room.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-paper/70">
              Built for rental agreements and offer letters. Free to try. Always a second opinion — never a substitute for counsel.
            </p>
            <Link to="/signup" className="mt-8 inline-block">
              <Button variant="light" size="lg" className="rounded-full px-7 shadow-lg shadow-black/20">
                Get started
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <BrandMark />
          <p className="max-w-md text-xs leading-relaxed text-slate">
            This tool explains documents in plain language. It does not replace a lawyer and does not provide formal legal advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureRow({ number, icon, title, body }) {
  return (
    <div className="grid gap-3 py-7 sm:grid-cols-[4.5rem_1fr] sm:gap-8">
      <p className="font-serif text-2xl text-ink/25">{number}</p>
      <div>
        <div className="mb-2 flex items-center gap-2.5 text-ink">
          <span className="text-slate">{icon}</span>
          <h3 className="font-serif text-xl font-medium">{title}</h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-slate">{body}</p>
      </div>
    </div>
  )
}

function Step({ number, icon, title, body }) {
  return (
    <div className="relative rounded-2xl border border-line bg-paper px-5 py-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper">
        {icon}
      </div>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-slate uppercase">Step {number}</p>
      <h3 className="mt-2 font-serif text-xl font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate">{body}</p>
    </div>
  )
}

export default Landing
