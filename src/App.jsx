import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './components/LandingPage'
import AboutPage from './components/AboutPage'
import RegisterPage from './components/RegisterPage'
import Login from './components/Login'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import UrlAnalyticsPage from './components/Dashboard/UrlDetailsPopUp'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-ink font-sans text-slate-100">
        <NavBar />

        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#080E21',
              color: '#F1F5F9',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              boxShadow: '0 0 25px -5px rgba(59, 130, 246, 0.3)',
              fontSize: '13px',
            },
            success: {
              iconTheme: {
                primary: '#38BDF8',
                secondary: '#030712',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#030712',
              },
            },
          }}
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/analytics/:shortUrl" element={<UrlAnalyticsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App