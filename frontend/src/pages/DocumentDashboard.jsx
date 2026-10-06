import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Flag, CheckCircle2, AlertTriangle } from 'lucide-react'
import { getDocument } from '../api/documents'
import Card from '../components/Card'
import QAPanel from '../components/QAPanel'
import Header from '../components/Header'

function DocumentDashboard() {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocument(id)
      .then(setDocument)
      .catch((err) => setError(err.message || 'Could not load document'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <div className="p-8 text-slate">Loading document...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <div className="p-8 text-flag">{error}</div>
      </div>
    )
  }

  const flaggedCount = document.clauses.filter((c) => c.is_flagged).length

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-serif text-ink">Document summary</h1>
          <p className="text-sm text-slate mt-1">
            {document.clauses.length} clauses analyzed
            {flaggedCount > 0 ? (
              <span className="text-flag"> — {flaggedCount} flagged for your attention</span>
            ) : (
              <span className="text-seal"> — nothing unusual found</span>
            )}
          </p>
        </div>

        <div>
          {document.clauses.map((clause, idx) => {
            const isLast = idx === document.clauses.length - 1
            return (
              <div key={clause.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-sm font-serif font-semibold shrink-0">
                    {clause.order + 1}
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-line my-1" />}
                </div>

                <div className="flex-1 pb-6">
                  <Card className={clause.is_flagged ? 'border-flag/40' : ''}>
                    <div className="mb-3">
                      {clause.is_flagged ? (
                        <span className="inline-flex items-center gap-1 bg-flag text-white text-xs font-medium px-2.5 py-1 rounded">
                          <Flag size={12} /> Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-seal text-xs font-medium">
                          <CheckCircle2 size={14} /> Looks standard
                        </span>
                      )}
                    </div>

                    <p className="font-serif italic text-ink/70 text-sm mb-3 pl-3 border-l-2 border-line">
                      "{clause.text}"
                    </p>

                    <p className="text-ink leading-relaxed">{clause.explanation}</p>

                    {clause.is_flagged && clause.flag_reason && (
                      <div className="flex items-start gap-2 mt-3 bg-flag-light rounded-md p-3">
                        <AlertTriangle size={16} className="text-flag shrink-0 mt-0.5" />
                        <p className="text-ink text-sm">{clause.flag_reason}</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )
          })}
        </div>

        <QAPanel documentId={id} />
      </div>
    </div>
  )
}

export default DocumentDashboard