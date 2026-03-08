import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Shield, Calendar, Zap, MapPin, LogOut } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const Profile = () => {
    const { profile, logout } = useAuth()

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            <h1 className="text-4xl font-bold font-display italic tracking-tight mb-4">Account Signal Presence</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <Card className="md:col-span-1 flex flex-col items-center text-center p-12 bg-slate-900/50 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                    <div className="w-28 h-28 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-8 overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-2xl shadow-primary/10">
                        <User className="w-14 h-14 text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1 font-display italic text-white leading-none capitalize">{profile?.name}</h2>
                    <p className="text-slate-500 text-sm mb-6 font-bold uppercase tracking-widest leading-none">{profile?.email}</p>
                    <Badge variant="success" className="uppercase tracking-widest text-[11px] font-bold px-4 py-1.5 border border-primary/20 bg-primary/5">{profile?.role}</Badge>

                    <div className="w-full h-px bg-white/5 my-10" />

                    <div className="w-full space-y-6">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest italic">
                            <span className="text-slate-500">Signal Since</span>
                            <span className="text-white">{new Date(profile?.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest italic">
                            <span className="text-slate-500">Loyalty Status</span>
                            <span className="text-primary font-bold">{profile?.points?.toLocaleString()} PTS</span>
                        </div>
                    </div>

                    <Button variant="danger" onClick={logout} className="w-full mt-12 py-4 flex items-center justify-center gap-2 group bg-slate-900 hover:bg-red-600 border border-white/5 uppercase tracking-widest text-xs font-bold transition-all duration-300">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out Protocol
                    </Button>
                </Card>

                <div className="md:col-span-2 space-y-10">
                    <Card className="p-10 bg-slate-900/40 border-white/5">
                        <h3 className="text-xl font-bold border-b border-white/5 pb-6 mb-8 font-display italic tracking-tight">Personal Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Email Identity</p>
                                <p className="text-white font-bold flex items-center gap-3 italic">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    {profile?.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Environmental Status</p>
                                <p className="text-white font-bold flex items-center gap-3 italic">
                                    <Shield className="w-4 h-4 text-slate-500" />
                                    {profile?.role === 'user' ? 'Contributor' : profile?.role} Tier
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-950 border-white/5 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-700" />
                        <h3 className="text-xl font-bold mb-4 font-display italic tracking-tight text-white leading-none">Signal Security</h3>
                        <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed leading-none">
                            Update your cryptographically secured password and manage second-factor authentication to keep your reward points safe.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button variant="outline" className="flex-1 py-4 border-slate-800 uppercase tracking-widest text-xs font-bold hover:bg-white/5">Update Password</Button>
                            <Button variant="outline" className="flex-1 py-4 border-slate-800 uppercase tracking-widest text-xs font-bold hover:bg-white/5">Initialize 2FA</Button>
                        </div>
                    </Card>

                    {profile?.role === 'store' && (
                        <Card className="border-accent/40 bg-accent/5 p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-700" />
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-accent/20">
                                <h3 className="text-xl font-bold flex items-center gap-3 font-display italic tracking-tight text-white leading-none">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    Store Verification Signal
                                </h3>
                                <Badge variant="warning" className="bg-accent text-slate-900 border-none uppercase font-bold text-[10px] tracking-widest px-4 py-1">Active</Badge>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed font-medium italic">
                                Your store is currently verified and online. Ensure your collection box is ready for customer signals.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
