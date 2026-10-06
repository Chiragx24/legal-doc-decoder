import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  Flag,
  Loader2,
  X,
} from 'lucide-react'
import { listDocuments, uploadDocument } from '../api/documents'
import Button from '../components/Button'
import Header from '../components/Header'

const DOC_TYPES = [
  { value: 'rental', label: 'Rental agreement' },
  { value: 'offer_letter', label: 'Offer letter' },
]

const DOC_TYPE_LABELS = {
  rental: 'Rental agreement',
  offer_letter: 'Offer letter',
}

function Upload() {
  const [file, setFile] = useState(null)
  const [docType, setDocType] = useState('rental')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([])
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    listDocuments()
      .then((docs) => setRecent(docs.slice(0, 4)))
      .catch(() => setRecent([]))
  }, [])

  function chooseFile(next) {
    if (next) setFile(next)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    chooseFile(e.dataTransfer.files[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!file) {
      toast.error('Please choose a file first')
      return
    }

    setLoading(true)

    try {
      const data = await toast.promise(
        uploadDocument(file, docType),
        {
          loading: 'Analyzing your document — this can take up to a minute...',
          success: 'Document analyzed',
          error: (err) => err.message || 'Upload failed',
        }
      )
      navigate(`/documents/${data.id}`)
    } catch (err) {
      // toast.promise already showed the error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Header />

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-10 px-5 py-8 sm:px-6 lg:grid-cols-[18.5rem_minmax(0,1fr)] lg:py-10"
      >
        <aside className="lg:sticky lg:top-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-slate uppercase">New document</p>
          <h1 className="mt-2 font-serif text-3xl font-medium leading-snug text-ink">
            Upload a document
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate">
            Choose the type, drop a PDF or TXT, and we will explain every clause.
          </p>

          <div className="mt-6 flex rounded-full bg-white p-1 shadow-sm ring-1 ring-ink/10">
            {DOC_TYPES.map(({ value, label }) => {
              const selected = docType === value
              return (
                <button
                  key={value}
                  type="button"
                  disabled={loading}
                  onClick={() => setDocType(value)}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    selected ? 'bg-ink text-paper' : 'text-slate hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <ol className="mt-8 space-y-3 text-sm text-slate">
            <li className="flex gap-3">
              <span className="font-serif text-ink/30">1</span>
              Plain-language notes for each clause
            </li>
            <li className="flex gap-3">
              <span className="font-serif text-ink/30">2</span>
              Unusual terms flagged
            </li>
            <li className="flex gap-3">
              <span className="font-serif text-ink/30">3</span>
              Ask a follow-up if something is unclear
            </li>
          </ol>

          {recent.length > 0 && (
            <div className="mt-10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.12em] text-slate uppercase">Recent</p>
                <Link to="/history" className="text-xs font-medium text-ink underline decoration-line underline-offset-4">
                  All
                </Link>
              </div>
              <div className="space-y-2">
                {recent.map((doc) => {
                  const flaggedCount = (doc.clauses || []).filter((c) => c.is_flagged).length
                  return (
                    <Link
                      key={doc.id}
                      to={`/documents/${doc.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-1 py-2 hover:bg-white"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">
                          {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-slate">
                          <Calendar size={11} />
                          {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Saved'}
                        </span>
                      </span>
                      {flaggedCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-flag">
                          <Flag size={11} /> {flaggedCount}
                        </span>
                      ) : (
                        <CheckCircle2 size={14} className="text-seal" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <p className="mt-10 text-xs leading-relaxed text-slate">
            This tool explains documents in plain language. It does not replace a lawyer.
          </p>
        </aside>

        <div className="relative">
          <div className="absolute inset-x-6 top-4 -bottom-2 rounded-sm bg-[#efe8d8] shadow-sm" />
          <div className="absolute inset-x-3 top-2 -bottom-1 rounded-sm bg-[#f6f1e4] shadow-sm" />

          <div
            role="button"
            tabIndex={0}
            onClick={() => !loading && fileInputRef.current.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (!loading) fileInputRef.current.click()
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              if (!loading) setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`upload-sheet relative min-h-[32rem] cursor-pointer rounded-sm border border-[#e4ddd0] px-10 py-12 shadow-[0_24px_50px_-28px_rgba(27,36,64,0.45)] transition-shadow sm:px-16 sm:py-14 lg:min-h-[calc(100vh-7.5rem)] ${
              loading ? 'cursor-not-allowed opacity-70' : ''
            } ${isDragging ? 'ring-2 ring-ink/30' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => chooseFile(e.target.files[0])}
              className="hidden"
            />

            <div className="pointer-events-none absolute top-6 right-8 font-serif text-5xl text-ink/10">§</div>

            {file ? (
              <div className="relative max-w-md">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-slate uppercase">
                  {DOC_TYPE_LABELS[docType]}
                </p>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h2 className="font-serif text-3xl font-medium leading-snug text-ink">{file.name}</h2>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="pointer-events-auto mt-1 rounded-md p-1 text-slate hover:text-ink"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate">
                  Ready to analyze. This usually takes under a minute.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto mt-8 rounded-full"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze this document
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="relative max-w-md">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-slate uppercase">
                  {DOC_TYPE_LABELS[docType]}
                </p>
                <h2 className="mt-4 font-serif text-3xl font-medium leading-snug text-ink">
                  Drop the file onto this page.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-slate">
                  PDF or TXT. Click anywhere on the sheet to browse.
                </p>
                <p className="mt-16 flex items-center gap-2 text-sm text-ink/70">
                  <FileText size={16} />
                  Waiting for a document
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default Upload
