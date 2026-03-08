import React from 'react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        danger: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all active:scale-95'
    }

    return (
        <button className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button
