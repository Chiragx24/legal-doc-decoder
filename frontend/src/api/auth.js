import apiRequest from './client'

export function registerUser(username, email, password) {
  return apiRequest('/auth/register/', {
    method: 'POST',
    body: { username, email, password },
  })
}

export function loginUser(username, password) {
  return apiRequest('/auth/login/', {
    method: 'POST',
    body: { username, password },
  })
}