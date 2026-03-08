import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Recycle, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import ImpactCounter from '../components/ImpactCounter'

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden px-4 md:px-0">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 -right-24 w-80 h-80 bg-accent/10 blur-[100px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <Zap className="w-3 h-3" />
                        Empowering Green Innovation
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold font-display leading-tight mb-6 text-white max-w-4xl mx-auto">
                        Recycle Batteries. <span className="text-primary italic">Earn Rewards.</span> Save the Planet.
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Join CellBack's mission to prevent toxic waste. Drop off your old batteries at any partner Kirana Store and get rewarded instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button className="px-10 py-5 text-lg bg-primary shadow-2xl shadow-primary/30 flex items-center gap-2 group">
                                Get Started
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" className="px-10 py-5 text-lg border-slate-700 bg-white/5 backdrop-blur-sm">
                                Member Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Impact Counter Section */}
            <section id="impact" className="py-24 border-y border-white/5 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -left-32 top-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
                <div className="container mx-auto px-4 relative z-10">
                    <ImpactCounter targetBatteries={85420} />
                </div>
            </section>

            {/* Features Container */}
            <section id="features" className="py-32 container mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 font-display italic tracking-tight">How it Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            title: "Gather Batteries",
                            desc: "Collect AA, AAA, 9V, or Li-ion batteries that are no longer in use.",
                            icon: Recycle,
                            color: "text-primary-light",
                            bg: "bg-primary/20",
                            border: "border-primary/30"
                        },
                        {
                            title: "Drop at Store",
                            desc: "Generate a QR ticket and drop batteries at your nearest Kirana partner.",
                            icon: ShieldCheck,
                            color: "text-accent",
                            bg: "bg-accent/20",
                            border: "border-accent/30"
                        },
                        {
                            title: "Redeem Rewards",
                            desc: "Earn points for every cell and redeem them for coupons or accessories.",
                            icon: TrendingUp,
                            color: "text-blue-400",
                            bg: "bg-blue-500/20",
                            border: "border-blue-500/30"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card glass-card-hover p-10 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                            <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-display text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats/Social Proof */}
            <section className="py-32 bg-slate-950 border-t border-white/5 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto glass-card border-none bg-slate-900/50 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 italic tracking-tight">Expanding Reach</h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">We're building a sustainable future, one battery at a time. Join our rapidly growing network across the country.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">500+</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[2px] font-bold">Partners</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">12k+</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[2px] font-bold">Members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-white/5 mt-auto bg-slate-950">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2.5 mb-8">
                        <Zap className="w-6 h-6 text-primary" />
                        <span className="text-2xl font-bold font-display italic tracking-tight text-white">CellBack</span>
                    </div>
                    <div className="flex items-center justify-center gap-8 mb-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
                        <Link to="/" className="hover:text-primary transition-colors">Safety</Link>
                        <Link to="/" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/" className="hover:text-primary transition-colors">API Docs</Link>
                    </div>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">© 2024 CellBack Infrastructure. Designed for Earth.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing
