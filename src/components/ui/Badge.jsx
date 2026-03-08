import React from 'react'

const Badge = ({ children, variant = 'info', className = '' }) => {
    const variants = {
        info: 'bg-slate-800 text-slate-300',
        success: 'bg-primary/20 text-primary-light',
        warning: 'bg-accent/20 text-accent',
        error: 'bg-red-500/20 text-red-500',
        pending: 'bg-yellow-500/20 text-yellow-500'
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}

export default Badge
