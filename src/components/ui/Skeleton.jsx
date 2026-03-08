import React from 'react'

const Skeleton = ({ className = '', count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`animate-pulse bg-slate-900 border border-slate-800 rounded-xl ${className}`} />
            ))}
        </>
    )
}

export default Skeleton
