import React, { useState, useEffect } from 'react'

const ImpactCounter = ({ targetBatteries = 85420 }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const duration = 2000
        const increment = Math.ceil(targetBatteries / (duration / 16))

        const timer = setInterval(() => {
            start += increment
            if (start >= targetBatteries) {
                setCount(targetBatteries)
                clearInterval(timer)
            } else {
                setCount(start)
            }
        }, 16)

        return () => clearInterval(timer)
    }, [targetBatteries])

    const stats = [
        { label: 'Batteries Recycled', value: count.toLocaleString(), unit: 'cells', color: 'text-primary' },
        { label: 'Toxic Waste Prevented', value: (count * 0.05).toFixed(1), unit: 'kg', color: 'text-accent' },
        { label: 'CO2 Emissions Offset', value: (count * 0.12).toFixed(1), unit: 'kg', color: 'text-blue-400' }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mx-auto">
            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                    <div className={`text-4xl md:text-5xl font-bold font-display ${stat.color} mb-3 tabular-nums`}>
                        {stat.value}
                        <span className="text-sm font-medium ml-1 text-slate-500 uppercase tracking-widest">{stat.unit}</span>
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[2px]">{stat.label}</p>
                    <div className={`h-1 w-12 ${stat.color === 'text-primary' ? 'bg-primary' : stat.color === 'text-accent' ? 'bg-accent' : 'bg-blue-500'} mt-6 rounded-full opacity-30 group-hover:w-20 group-hover:opacity-100 transition-all duration-500`} />
                </div>
            ))}
        </div>
    )
}

export default ImpactCounter
