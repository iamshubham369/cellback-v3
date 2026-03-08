import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Zap, LogOut, User, Bell, Menu } from 'lucide-react'
import Button from '../ui/Button'

const Navbar = () => {
    const { user, profile, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-all">
                        <Zap className="w-5 h-5 text-primary-light" />
                    </div>
                    <span className="text-xl font-bold font-display italic tracking-tight text-white">CellBack</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {!user ? (
                        <>
                            <a href="/#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it works</a>
                            <a href="/#impact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Global Impact</a>
                            <div className="h-4 w-px bg-slate-800 mx-2" />
                            <Link to="/login">
                                <Button variant="outline" className="text-xs px-5 py-2">Join Member</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-2xl">
                                <div className="flex flex-col text-right">
                                    <span className="text-xs font-bold text-white leading-tight">{profile?.name}</span>
                                    <span className="text-[10px] text-primary leading-tight font-bold uppercase tracking-tighter">
                                        {profile?.role === 'user' ? `${profile?.points?.toLocaleString()} Points` : profile?.role}
                                    </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                            <Button onClick={handleLogout} variant="outline" className="p-2 border-none text-slate-500 hover:text-red-400 hover:bg-red-500/5">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <Menu className="w-6 h-6 text-slate-400" />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
