import apiRequest from './client'

export function uploadDocument(file, docType) {
  const formData = new FormData()
  formData.append('doc_type', docType)
  formData.append('file', file)

  return apiRequest('/documents/', {
    method: 'POST',
    body: formData,
  })
}

export function getDocument(id) {
  return apiRequest(`/documents/${id}/`)
}

export function askQuestion(documentId, questionText) {
  return apiRequest(`/documents/${documentId}/ask/`, {
    method: 'POST',
    body: { question_text: questionText },
  })
}

export function getQuestions(documentId) {
  return apiRequest(`/documents/${documentId}/ask/`)
}

export function listDocuments() {
  return apiRequest('/documents/')
}