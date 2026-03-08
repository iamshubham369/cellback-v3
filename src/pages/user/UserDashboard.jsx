import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import {
    Plus,
    TrendingUp,
    Gift,
    History,
    Sparkles,
    ChevronRight,
    ArrowUpRight,
    Battery,
    Leaf,
    ShieldCheck
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import ImpactCounter from '../../components/ImpactCounter'

const UserDashboard = () => {
    const { profile } = useAuth()

    // Fetch stats logic
    const { data: stats, isLoading } = useQuery({
        queryKey: ['user-stats', profile?.id],
        queryFn: async () => {
            const submissions = await gSheets.get('submissions')
            const userSubmissions = submissions.filter(s => s.user_id == profile?.id)

            const verifiedCount = userSubmissions.filter(s => s.status === 'verified').length

            // Get stores for joining store_name
            const stores = await gSheets.get('stores')

            const recentSub = userSubmissions
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3)
                .map(sub => ({
                    ...sub,
                    stores: stores.find(s => s.id == sub.store_id)
                }))

            return {
                submissions: verifiedCount,
                recent: recentSub
            }
        },
        enabled: !!profile?.id
    })

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Hero Stats */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-gradient-to-br from-primary-dark via-primary to-green-600 border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 -mr-32 -mt-32 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                        <div>
                            <h2 className="text-3xl font-bold text-white font-display italic tracking-tight mb-2">My Rewards Hub</h2>
                            <p className="text-primary-light/80 text-sm font-bold uppercase tracking-widest">Active Loyalty Points</p>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="text-6xl md:text-7xl font-bold text-white tabular-nums drop-shadow-lg">
                                {profile?.points?.toLocaleString()}
                                <span className="text-sm border border-white/20 px-3 py-1 rounded-full ml-4 inline-block translate-y-[-1.5rem] bg-white/10 uppercase tracking-widest">PTS</span>
                            </div>
                            <Link to="/rewards">
                                <Button className="bg-white text-primary hover:bg-white/90 shadow-xl py-3 px-6 flex items-center gap-2 group">
                                    Redeem Now <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-900/50 border-white/5 flex flex-col justify-between p-8 group">
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-accent/20 border border-accent/20 rounded-2xl group-hover:scale-110 transition-transform">
                            <Leaf className="w-8 h-8 text-accent" />
                        </div>
                        <Badge variant="success" className="uppercase tracking-widest text-[10px]">Eco Tier: Silver</Badge>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4 font-display text-white">Project Impact</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    <span>Recycling Progress</span>
                                    <span className="text-white">74%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[74%] rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic font-medium">12 more cells until your next reward voucher!</p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Submit Battery', path: '/submit', icon: Plus, color: 'text-primary' },
                    { label: 'View Rewards', path: '/rewards', icon: Gift, color: 'text-accent' },
                    { label: 'All History', path: '/history', icon: History, color: 'text-blue-400' },
                    { label: 'Security', path: '/profile', icon: ShieldCheck, color: 'text-red-400' }
                ].map((act, i) => (
                    <Link key={i} to={act.path}>
                        <Card className="flex flex-col items-center justify-center gap-4 py-8 group relative overflow-hidden text-center">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform ${act.color}`}>
                                <act.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{act.label}</span>
                        </Card>
                    </Link>
                ))}
            </section>

            {/* Global Impact Counter */}
            <section className="bg-slate-900/40 p-12 rounded-3xl border border-white/5 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.1),transparent)]" />
                <h2 className="text-xl font-bold text-center mb-10 text-slate-500 uppercase tracking-widest">Global Network Impact</h2>
                <ImpactCounter targetBatteries={85420} />
            </section>

            {/* Recent Submissions */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold font-display italic tracking-tight">Recent Activity Feed</h3>
                    <Link to="/history" className="text-sm font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
                        See Full History <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? (
                        <Skeleton count={3} className="h-44 w-full" />
                    ) : stats?.recent?.length > 0 ? (
                        stats.recent.map((sub, i) => (
                            <Card key={sub.id} className="group relative overflow-hidden bg-slate-900/50 border-white/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-all">
                                        <Battery className="w-5 h-5 text-primary" />
                                    </div>
                                    <Badge variant={sub.status === 'verified' ? 'success' : 'pending'}>
                                        {sub.status}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white text-lg">{sub.battery_type} Recycling</h4>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3" /> {sub.stores?.store_name}
                                    </p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Points Earned</p>
                                        <p className="text-primary font-bold text-lg">+{sub.points_awarded || 0}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase">{new Date(sub.created_at).toLocaleDateString()}</p>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-3 py-16 text-center border-dashed border-slate-700 bg-transparent flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-slate-600">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xl mb-1">No Activity Found</h4>
                                <p className="text-slate-500 text-sm italic">Start your recycling journey by generating a ticket</p>
                            </div>
                            <Link to="/submit" className="mt-4">
                                <Button variant="outline" className="px-8 border-slate-800">Generate First Ticket</Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    )
}

const MapPin = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

export default UserDashboard

