import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, ChevronLeft, Zap } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 blur-[160px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl mb-8 inline-block shadow-2xl shadow-red-500/10">
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-8xl font-bold text-white mb-4 font-display italic tracking-tighter tabular-nums drop-shadow-2xl">404</h1>
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-[3px] italic">Signal Frequency Lost</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-12 font-bold uppercase tracking-widest leading-relaxed">
                    The environmental coordinate you are attempting to reach does not exist in our current platform metadata mapping.
                </p>

                <Link to="/">
                    <Button className="px-10 py-5 bg-white text-slate-950 hover:bg-slate-100 flex items-center gap-3 group transition-all duration-300">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Return to Base Signal
                    </Button>
                </Link>

                <div className="mt-24 pt-12 border-t border-white/5 opacity-40">
                    <div className="flex items-center justify-center gap-2.5">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold font-display italic text-white">CellBack Infrastructure</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
