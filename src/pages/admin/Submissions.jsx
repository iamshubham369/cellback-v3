import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { History, Search, Download, Filter, MapPin, Battery, Activity, ShieldCheck } from 'lucide-react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'

const Submissions = () => {
    const { data: submissions, isLoading } = useQuery({
        queryKey: ['admin-all-submissions'],
        queryFn: async () => {
            const [subs, users, stores] = await Promise.all([
                gSheets.get('submissions'),
                gSheets.get('users'),
                gSheets.get('stores')
            ])

            return subs
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map(s => ({
                    ...s,
                    users: users.find(u => u.id == s.user_id),
                    stores: stores.find(st => st.id == s.store_id)
                }))
        }
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Environmental Audit Logs</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Complete Global Recycling Traceability Dataset</p>
                </div>
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <Input
                        placeholder="Search Signal Trace..."
                        className="bg-transparent border-none text-xs font-bold uppercase tracking-widest pl-4 pr-10 h-10 w-64"
                    />
                    <button className="p-3 rounded-xl bg-slate-800 text-slate-500">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/20 rounded-[2rem] border border-white/5 overflow-hidden">
                <Table headers={['Signal Time', 'Source Node', 'Carrier Hub', 'Battery Species', 'Signal Count', 'Audit Status', 'Award Track']}>
                    {isLoading ? (
                        <Skeleton count={10} className="h-16 w-full mb-2" />
                    ) : submissions?.length > 0 ? submissions.map(sub => (
                        <tr key={sub.id} className="text-sm group hover:bg-white/5 transition-colors">
                            <td className="px-6 py-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest tabular-nums leading-none">
                                {new Date(sub.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-6 font-bold text-white uppercase italic tracking-tighter text-sm leading-none">
                                {sub.users?.name}
                            </td>
                            <td className="px-6 py-6 text-slate-400 font-bold uppercase text-[10px] leading-none">
                                {sub.stores?.store_name}
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <Battery className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-white uppercase italic tracking-tighter text-sm leading-none">{sub.battery_type}</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 font-bold text-white text-lg tabular-nums leading-none">
                                {sub.verified_quantity || sub.claimed_quantity}
                                <span className="text-[10px] text-slate-600 block mt-1 font-bold uppercase tracking-tighter leading-none italic">{sub.verified_quantity ? 'Verified' : 'Claimed'}</span>
                            </td>
                            <td className="px-6 py-6">
                                <Badge variant={sub.status === 'verified' ? 'success' : sub.status === 'rejected' ? 'error' : 'pending'}>
                                    {sub.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-6">
                                <span className={`text-lg font-bold tabular-nums leading-none ${sub.points_awarded ? 'text-primary' : 'text-slate-700'}`}>
                                    {sub.points_awarded ? `+${sub.points_awarded}` : '0'}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr className="border-none">
                            <td colSpan="7" className="py-24 text-center">
                                <ShieldCheck className="w-12 h-12 text-slate-800 mx-auto mb-6 opacity-30" />
                                <p className="text-slate-600 font-bold uppercase tracking-[4px] italic text-[10px] leading-none">Signal clear. No environmental logs found.</p>
                            </td>
                        </tr>
                    )}
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 bg-slate-950 border-white/5 relative group flex flex-col justify-between h-48">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <h4 className="text-xl font-bold font-display italic tracking-tight text-white mb-2 leading-none">Audit Integrity Signal</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(22,163,74,1)]" />
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-none">Real-time Spectral Feed Sync: 100%</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic mt-auto leading-none">Protocol Version 1.0.2 Locked</p>
                </Card>
            </div>
        </div>
    )
}

const BatteryIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

export default Submissions

