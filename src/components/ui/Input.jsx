import React, { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
            <input ref={ref} className="input-field" {...props} />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
