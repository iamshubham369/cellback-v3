import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { useAuth } from '../../context/AuthContext'
import { History as HistoryIcon, Boxes, Gift, ChevronRight, MapPin, Battery } from 'lucide-react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import Card from '../../components/ui/Card'

const History = () => {
    const { profile } = useAuth()
    const [activeTab, setActiveTab] = useState('submissions')

    const { data: submissions, isLoading: submissionsLoading } = useQuery({
        queryKey: ['user-history-submissions', profile?.id],
        queryFn: async () => {
            const [allSubmissions, stores] = await Promise.all([
                gSheets.get('submissions'),
                gSheets.get('stores')
            ])

            return allSubmissions
                .filter(s => s.user_id == profile?.id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map(sub => ({
                    ...sub,
                    stores: stores.find(s => s.id == sub.store_id)
                }))
        },
        enabled: !!profile?.id && activeTab === 'submissions'
    })

    const { data: redemptions, isLoading: redemptionsLoading } = useQuery({
        queryKey: ['user-history-redemptions', profile?.id],
        queryFn: async () => {
            const [allRedemptions, rewards] = await Promise.all([
                gSheets.get('redemptions'),
                gSheets.get('rewards')
            ])

            return allRedemptions
                .filter(r => r.user_id == profile?.id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map(red => ({
                    ...red,
                    rewards: rewards.find(rw => rw.id == red.reward_id)
                }))
        },
        enabled: !!profile?.id && activeTab === 'redemptions'
    })

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight mb-2">Platform Logs</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic leading-none">Complete chronological trace of recycling & rewards activity.</p>
                </div>

                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-300 flex items-center gap-2 ${activeTab === 'submissions' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Boxes className="w-4 h-4" /> Drop Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('redemptions')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-300 flex items-center gap-2 ${activeTab === 'redemptions' ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Gift className="w-4 h-4" /> Redemption Trace
                    </button>
                </div>
            </div>

            <section>
                {activeTab === 'submissions' ? (
                    submissionsLoading ? <Skeleton count={5} className="h-20 w-full mb-4" /> : (
                        <Table headers={['Signal Time', 'Battery Type', 'Target Store', 'Qty Check', 'Status', 'Points Trace']}>
                            {submissions?.length > 0 ? submissions.map(sub => (
                                <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-6 text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">
                                        {new Date(sub.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <Battery className="w-4 h-4 text-primary" />
                                            <span className="font-bold text-white uppercase italic tracking-tighter text-sm leading-none">{sub.battery_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-slate-300 text-xs font-bold flex items-center gap-1.5 uppercase italic">
                                        {sub.stores?.store_name}
                                    </td>
                                    <td className="px-6 py-6 font-bold text-white text-lg tabular-nums">
                                        {sub.verified_quantity || sub.claimed_quantity}
                                        <span className="text-[10px] text-slate-500 ml-1.5 uppercase font-medium">{sub.verified_quantity ? 'V' : 'C'}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <Badge variant={sub.status === 'verified' ? 'success' : sub.status === 'rejected' ? 'error' : 'pending'}>
                                            {sub.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`text-lg font-bold tabular-nums ${sub.points_awarded ? 'text-primary' : 'text-slate-700 font-medium'}`}>
                                            {sub.points_awarded ? `+${sub.points_awarded}` : '--'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr className="border-none">
                                    <td colSpan="6" className="py-24 text-center italic text-slate-600 font-medium uppercase tracking-widest text-xs">No signals traced in drop logs.</td>
                                </tr>
                            )}
                        </Table>
                    )
                ) : (
                    redemptionsLoading ? <Skeleton count={5} className="h-20 w-full mb-4" /> : (
                        <Table headers={['Redemption Time', 'Loyalty Asset', 'Points Cost', 'Protocol Status']}>
                            {redemptions?.length > 0 ? redemptions.map(red => (
                                <tr key={red.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-6 text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">
                                        {new Date(red.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-6 font-bold text-white uppercase italic tracking-tighter text-sm leading-none">
                                        {red.rewards?.name}
                                    </td>
                                    <td className="px-6 py-6 font-bold text-red-500/80 text-lg tabular-nums">
                                        -{red.points_spent}
                                    </td>
                                    <td className="px-6 py-6">
                                        <Badge variant={red.status === 'fulfilled' ? 'success' : 'pending'}>
                                            {red.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr className="border-none">
                                    <td colSpan="4" className="py-24 text-center italic text-slate-600 font-medium uppercase tracking-widest text-xs">No redemption trace found.</td>
                                </tr>
                            )}
                        </Table>
                    )
                )}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <Card className="bg-slate-900/50 border-white/5 p-10 relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <HistoryIcon className="w-10 h-10 text-primary-light mb-4" />
                    <h4 className="text-xl font-bold font-display italic tracking-tight mb-2">Traceability Legend</h4>
                    <div className="flex gap-4 mb-6">
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-500" /> <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">C: User Claimed</span></div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">V: Partner Verified</span></div>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        All transactions are cryptographically locked within our project infrastructure for environmental verification.
                    </p>
                </Card>
                <Card className="bg-slate-900/50 border-white/5 p-10 relative overflow-hidden flex flex-col justify-center gap-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <div className="flex items-center gap-4 group">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                            <ChevronRight className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white italic tracking-tight leading-none mb-1">Audit Protocol V1.0</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Health: Nominal</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 font-bold italic leading-relaxed uppercase tracking-tighter">
                        Total Environmental Traceback Points: {profile?.points?.toLocaleString()}
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default History
