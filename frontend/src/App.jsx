import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'
import DocumentDashboard from './pages/DocumentDashboard'
import History from './pages/History'
import RequireAuth from './components/RequireAuth'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1B2440',
            color: '#F4F5F2',
            borderRadius: '6px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2F6F4E', secondary: '#F4F5F2' } },
          error: { iconTheme: { primary: '#C98A2C', secondary: '#F4F5F2' } },
        }}
      />
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <RequireAuth>
              <DocumentDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App