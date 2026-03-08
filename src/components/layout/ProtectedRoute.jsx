import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, role = 'user' }) => {
    const { user, profile, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(22,163,74,0.3)]" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[4px] italic animate-pulse">Synchronizing Security Signal...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (role && profile?.role !== role) {
        const dashboard = profile?.role === 'admin' ? '/admin/dashboard' : profile?.role === 'store' ? '/store/dashboard' : '/dashboard'
        return <Navigate to={dashboard} replace />
    }

    return children
}

export default ProtectedRoute
