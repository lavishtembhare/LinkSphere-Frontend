import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import AboutPage from './components/AboutPage'
import RegisterPage from './components/RegisterPage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-ink font-sans text-slate-100">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App