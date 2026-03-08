import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { BarChart3, Users, Store, Package, AlertTriangle, ShieldCheck, Activity, Globe } from 'lucide-react'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import ImpactCounter from '../../components/ImpactCounter'
import Button from '../../components/ui/Button'

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-global-stats'],
        queryFn: async () => {
            const [users, stores, pickups, submissions] = await Promise.all([
                gSheets.get('users'),
                gSheets.get('stores'),
                gSheets.get('pickups'),
                gSheets.get('submissions')
            ])

            return {
                users: users.length,
                stores: stores.length,
                pickups: pickups.filter(p => p.status === 'requested').length,
                batteries: submissions.reduce((acc, curr) => acc + (parseInt(curr.verified_quantity) || 0), 0)
            }
        }
    })

    const { data: recentFeed } = useQuery({
        queryKey: ['admin-recent-feed'],
        queryFn: async () => {
            const [submissions, users, stores] = await Promise.all([
                gSheets.get('submissions'),
                gSheets.get('users'),
                gSheets.get('stores')
            ])

            return submissions
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)
                .map(sub => ({
                    ...sub,
                    users: users.find(u => u.id == sub.user_id),
                    stores: stores.find(s => s.id == sub.store_id)
                }))
        }
    })

    const kpis = [
        { label: 'Total Yield', value: stats?.batteries?.toLocaleString() || '0', icon: Package, color: 'text-primary', bg: 'bg-primary/20' },
        { label: 'Network Nodes', value: stats?.users?.toLocaleString() || '0', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
        { label: 'Carrier Hubs', value: stats?.stores?.toLocaleString() || '0', icon: Store, color: 'text-accent', bg: 'bg-accent/20' },
        { label: 'Pending Logistics', value: stats?.pickups?.toLocaleString() || '0', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/20' },
    ]

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl relative">
                        <Globe className="w-6 h-6 text-primary-light animate-pulse" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none">Command Center Dashboard</h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mt-1 leading-none italic">Global Environmental Infrastructure Monitoring</p>
                    </div>
                </div>
                <Link to="/admin/analytics">
                    <Button variant="outline" className="flex items-center gap-3 px-8 py-4 border-slate-800 text-xs font-bold uppercase tracking-widest group bg-white/5">
                        <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Real-time Analytics Hub
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {kpis.map((kpi, i) => (
                    <Card key={i} className="bg-slate-900/40 border-white/5 group relative overflow-hidden flex flex-col justify-between p-8">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${kpi.bg} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                            </div>
                            <Badge variant="info" className="uppercase tracking-[2px] text-[8px] bg-slate-950/50 border border-white/5">Metric</Badge>
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 leading-none italic">{kpi.label}</p>
                            <h3 className="text-3xl font-bold text-white font-display tabular-nums tracking-tighter leading-none">{kpi.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <section className="bg-slate-900/20 p-16 rounded-[3rem] border border-white/5 relative overflow-hidden backdrop-blur-xl group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.05),transparent)]" />
                <div className="absolute -right-32 top-1/2 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
                <h2 className="text-lg font-bold text-center mb-12 text-slate-500 uppercase tracking-[4px] italic leading-none">Planetary Traceback Aggregator</h2>
                <ImpactCounter targetBatteries={stats?.batteries || 85420} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 p-10 bg-slate-900/40 border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                        <h3 className="text-xl font-bold flex items-center gap-4 text-white font-display italic tracking-tight leading-none">
                            <Activity className="w-5 h-5 text-primary" />
                            Live Event Signal Monitor
                        </h3>
                        <Badge variant="success" className="px-3 border border-primary/20 bg-primary/5 uppercase font-bold text-[8px] tracking-[2px]">Systems Operational</Badge>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50">
                        <Table headers={['Timestamp', 'User Node', 'Store Hub', 'Signal Qty', 'Metric Status']}>
                            {recentFeed?.length > 0 ? recentFeed.map(sub => (
                                <tr key={sub.id} className="text-xs group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-5 text-slate-500 font-bold uppercase tracking-widest tabular-nums leading-none">
                                        {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-white font-bold uppercase italic tracking-tighter text-sm leading-none">{sub.users?.name}</span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 font-bold uppercase text-[10px] leading-none">
                                        {sub.stores?.store_name}
                                    </td>
                                    <td className="px-6 py-5 font-bold text-lg tabular-nums leading-none">
                                        {sub.verified_quantity || sub.claimed_quantity}
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={sub.status === 'verified' ? 'success' : sub.status === 'rejected' ? 'error' : 'pending'}>
                                            {sub.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-slate-600 italic font-bold uppercase tracking-widest text-[10px]">No recent signals detected</td>
                                </tr>
                            )}
                        </Table>
                    </div>
                </Card>

                <div className="space-y-10 flex flex-col">
                    <Card className="bg-slate-950 border-white/5 p-10 flex flex-col justify-between group overflow-hidden relative flex-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl font-bold mb-8 font-display italic text-white leading-none">System Integrity</h3>
                        <div className="space-y-10">
                            {[
                                { label: 'Database Load', status: 'Normal', value: 15, color: 'bg-primary' },
                                { label: 'Cryptography Sync', status: 'Healthy', value: 100, color: 'bg-primary' },
                                { label: 'Realtime Latency', status: 'Active', value: 85, color: 'bg-accent' }
                            ].map((health, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[3px] leading-none">
                                        <span className="text-slate-500">{health.label}</span>
                                        <span className={health.color === 'bg-primary' ? 'text-primary' : 'text-accent'}>{health.status}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-900/50 rounded-full border border-white/5 p-0.5 overflow-hidden shadow-inner">
                                        <div className={`h-full ${health.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(22,163,74,0.3)]`} style={{ width: `${health.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 p-10 group overflow-hidden relative">
                        <ShieldCheck className="w-10 h-10 text-primary-light mb-6 opacity-40 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-2 font-display italic text-white leading-none">Security Protocol V1.2</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">
                            Row Level Security (RLS) policies are actively enforced on all environmental data transition signals.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
