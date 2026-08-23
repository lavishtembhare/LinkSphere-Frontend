import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import AboutPage from './components/AboutPage'
import RegisterPage from './components/RegisterPage'
import Login from './components/Login'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import ShortenUrlPage from './components/ShortenUrlPage'
import ErrorPage from './components/ErrorPage'
import PrivateRoute from './PrivateRoute'

const AppRouter = () => {
    const location = useLocation()
    const hideHeaderFooter = location.pathname.startsWith('/s/')

    return (
        <div className="flex min-h-screen flex-col bg-ink font-sans text-slate-100">
            {!hideHeaderFooter && <NavBar />}

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

                    <Route
                        path="/register"
                        element={
                            <PrivateRoute publicPage={true}>
                                <RegisterPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PrivateRoute publicPage={true}>
                                <Login />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute publicPage={false}>
                                <DashboardLayout />
                            </PrivateRoute>
                        }
                    />

                    <Route path="/s/:url" element={<ShortenUrlPage />} />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route
                        path="*"
                        element={
                            <ErrorPage
                                code="404"
                                title="Page Not Found"
                                message="We can't seem to find the page you're looking for."
                            />
                        }
                    />
                </Routes>
            </main>

            {!hideHeaderFooter && <Footer />}
        </div>
    )
}

export default AppRouter

export const SubDomainRouter = () => {
    return (
        <Routes>
            <Route path="/:url" element={<ShortenUrlPage />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}