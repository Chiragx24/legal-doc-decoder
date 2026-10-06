import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MessageCircleQuestion, Scale, Send, Loader2 } from 'lucide-react'
import { askQuestion, getQuestions } from '../api/documents'
import Card from './Card'

function QAPanel({ documentId }) {
  const [questions, setQuestions] = useState([])
  const [input, setInput] = useState('')
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    getQuestions(documentId)
      .then(setQuestions)
      .catch(() => {})
  }, [documentId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return

    setAsking(true)
    const questionText = input
    setInput('')

    try {
      const newQuestion = await askQuestion(documentId, questionText)
      setQuestions([newQuestion, ...questions])
    } catch (err) {
      toast.error(err.message || 'Could not get an answer')
      setInput(questionText)
    } finally {
      setAsking(false)
    }
  }

  return (
    <Card className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircleQuestion size={20} className="text-ink" />
        <h2 className="text-lg font-serif text-ink">Ask a question</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Can my landlord keep my full deposit?"
          disabled={asking}
          className="flex-1 border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink disabled:bg-paper-dim"
        />
        <button
          type="submit"
          disabled={asking}
          className="bg-ink text-paper rounded-md px-4 flex items-center justify-center hover:bg-ink-light disabled:opacity-50 transition-colors"
        >
          {asking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>

      <div className="space-y-5">
        {questions.map((q) => (
          <div key={q.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <p className="font-medium text-ink mb-1.5">{q.question_text}</p>
            <p className="text-slate text-sm leading-relaxed">{q.answer_text}</p>
            {q.law_reference && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-seal">
                <Scale size={12} />
                <span>{q.law_reference}</span>
              </div>
            )}
          </div>
        ))}

        {questions.length === 0 && (
          <p className="text-sm text-slate">No questions asked yet.</p>
        )}
      </div>
    </Card>
  )
}

export default QAPanel