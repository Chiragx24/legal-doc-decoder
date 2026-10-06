import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Flag, Inbox } from 'lucide-react'
import { getDocument, listDocuments } from '../api/documents'
import Button from '../components/Button'
import Header from '../components/Header'
import QAPanel from '../components/QAPanel'

const DOC_TYPE_LABELS = {
  rental: 'Rental agreement',
  offer_letter: 'Offer letter',
}

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'rental', label: 'Rental' },
  { value: 'offer_letter', label: 'Offer letters' },
]

function formatDate(value) {
  if (!value) return 'Saved'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function sortDocuments(docs) {
  return [...docs].sort((a, b) => {
    const time = new Date(b.uploaded_at || 0) - new Date(a.uploaded_at || 0)
    if (time !== 0) return time
    const flagsA = (a.clauses || []).filter((clause) => clause.is_flagged).length
    const flagsB = (b.clauses || []).filter((clause) => clause.is_flagged).length
    return flagsB - flagsA
  })
}

function sortClauses(clauses) {
  return [...(clauses || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function History() {
  const [documents, setDocuments] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [detailError, setDetailError] = useState('')
  const [mobilePane, setMobilePane] = useState('list')

  useEffect(() => {
    listDocuments()
      .then((docs) => {
        const sorted = sortDocuments(docs)
        setDocuments(sorted)
        if (sorted[0]) setSelectedId(sorted[0].id)
      })
      .catch((err) => setError(err.message || 'Could not load history'))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    const list = filter === 'all'
      ? documents
      : documents.filter((doc) => doc.doc_type === filter)
    return sortDocuments(list)
  }, [documents, filter])

  useEffect(() => {
    if (!visible.length) {
      setSelectedId(null)
      return
    }
    if (!visible.some((doc) => doc.id === selectedId)) {
      setSelectedId(visible[0].id)
    }
  }, [visible, selectedId])

  useEffect(() => {
    if (!selectedId) {
      setSelectedDoc(null)
      return
    }

    setDetailLoading(true)
    setDetailError('')
    getDocument(selectedId)
      .then(setSelectedDoc)
      .catch((err) => setDetailError(err.message || 'Could not load document'))
      .finally(() => setDetailLoading(false))
  }, [selectedId])

  const flaggedTotal = documents.reduce((sum, doc) => (
    sum + (doc.clauses || []).filter((clause) => clause.is_flagged).length
  ), 0)

  function openDocument(id) {
    setSelectedId(id)
    setMobilePane('detail')
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-slate uppercase">Archive</p>
            <h1 className="mt-2 font-serif text-3xl font-medium text-ink">Your documents</h1>
            <p className="mt-2 text-sm text-slate">
              {loading
                ? 'Loading your files…'
                : error
                  ? 'We could not load your archive just now.'
                  : documents.length === 0
                    ? 'Nothing here yet.'
                    : `${documents.length} decoded · ${flaggedTotal} flagged`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {documents.length > 0 && (
              <div className="flex rounded-full bg-white p-1 ring-1 ring-ink/10">
                {FILTERS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      filter === value ? 'bg-ink text-paper' : 'text-slate hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <Link to="/upload">
              <Button className="rounded-full">
                Upload another
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid flex-1 items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)]">
          <div className={mobilePane === 'detail' ? 'hidden lg:block' : 'block'}>
            <section className="min-h-[28rem] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_20px_50px_-28px_rgba(27,36,64,0.28)] lg:min-h-[calc(100vh-12rem)]">
              <div className="border-b border-ink/10 px-5 py-4">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">Files</p>
              </div>

              <div className="p-2">
                {loading && <p className="px-3 py-4 text-sm text-slate">Loading…</p>}
                {error && <p className="px-3 py-4 text-sm text-flag">{error}</p>}

                {!loading && !error && documents.length === 0 && (
                  <div className="px-3 py-8">
                    <Inbox size={22} className="text-ink/40" />
                    <h2 className="mt-4 font-serif text-2xl font-medium text-ink">No documents yet</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate">
                      Upload a file and it will be listed here.
                    </p>
                    <Link to="/upload" className="mt-6 inline-block">
                      <Button className="rounded-full">
                        Upload a document
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                )}

                {!loading && !error && documents.length > 0 && visible.length === 0 && (
                  <p className="px-3 py-4 text-sm text-slate">No documents in this filter.</p>
                )}

                {!loading && visible.length > 0 && (
                  <ul className="space-y-1">
                    {visible.map((doc) => {
                      const clauses = doc.clauses || []
                      const flaggedCount = clauses.filter((clause) => clause.is_flagged).length
                      const active = doc.id === selectedId

                      return (
                        <li key={doc.id}>
                          <button
                            type="button"
                            onClick={() => openDocument(doc.id)}
                            className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                              active ? 'bg-ink text-paper' : 'text-ink hover:bg-paper'
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-[1.05rem] leading-snug">
                                {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                              </span>
                              <span className={`mt-1 block text-xs ${active ? 'text-paper/65' : 'text-slate'}`}>
                                {formatDate(doc.uploaded_at)} · {clauses.length} clauses
                              </span>
                            </span>
                            {flaggedCount > 0 ? (
                              <span className={`shrink-0 text-xs font-semibold ${active ? 'text-flag-light' : 'text-flag'}`}>
                                {flaggedCount} flagged
                              </span>
                            ) : (
                              <span className={`shrink-0 text-xs font-semibold ${active ? 'text-seal-light' : 'text-seal'}`}>
                                Clear
                              </span>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <section className={`min-h-[28rem] rounded-2xl border border-ink/10 bg-white px-5 py-6 shadow-[0_20px_50px_-28px_rgba(27,36,64,0.28)] sm:px-8 sm:py-8 lg:min-h-[calc(100vh-12rem)] ${mobilePane === 'list' ? 'hidden lg:block' : 'block'}`}>
            <button
              type="button"
              onClick={() => setMobilePane('list')}
              className="mb-4 inline-flex items-center gap-1 text-sm text-slate lg:hidden"
            >
              <ArrowLeft size={14} />
              Back to list
            </button>

            {detailLoading && <p className="text-sm text-slate">Opening the document…</p>}
            {detailError && <p className="text-sm text-flag">{detailError}</p>}

            {!detailLoading && !detailError && selectedDoc && (
              <DocumentReading doc={selectedDoc} />
            )}

            {!loading && !error && documents.length === 0 && (
              <p className="text-sm text-slate">Select a document from the list to read it here.</p>
            )}

            {!detailLoading && !selectedDoc && !detailError && documents.length > 0 && (
              <p className="text-sm text-slate">Select a document from the list to read it here.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function DocumentReading({ doc }) {
  const clauses = sortClauses(doc.clauses)
  const flaggedCount = clauses.filter((clause) => clause.is_flagged).length

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
        {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
      </p>
      <h2 className="mt-2 font-serif text-3xl font-medium text-ink">
        {formatDate(doc.uploaded_at)}
      </h2>
      <p className="mt-2 text-sm text-slate">
        {clauses.length} clauses
        {flaggedCount > 0 ? (
          <span className="text-flag"> · {flaggedCount} flagged</span>
        ) : (
          <span className="text-seal"> · nothing unusual</span>
        )}
      </p>

      <div className="mt-8 space-y-8">
        {clauses.map((clause) => (
          <article key={clause.id}>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-serif text-ink/30">{(clause.order ?? 0) + 1}</span>
              {clause.is_flagged ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-flag">
                  <Flag size={12} /> Flagged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-seal">
                  <CheckCircle2 size={12} /> Standard
                </span>
              )}
            </div>
            <p className="font-serif text-sm italic leading-relaxed text-ink/65">
              “{clause.text}”
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink">{clause.explanation}</p>
            {clause.is_flagged && clause.flag_reason && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-flag-light/80 px-3 py-2.5">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-flag" />
                <p className="text-sm text-ink">{clause.flag_reason}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-10">
        <QAPanel documentId={doc.id} />
      </div>
    </div>
  )
}

export default History
