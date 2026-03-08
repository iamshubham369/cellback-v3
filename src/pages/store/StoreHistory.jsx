import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { useAuth } from '../../context/AuthContext'
import { History, Search, Download, Filter, MapPin, Battery, Activity, ShieldCheck, User } from 'lucide-react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'

const StoreHistory = () => {
    const { profile } = useAuth()

    const { data: store } = useQuery({
        queryKey: ['store-id-history', profile?.id],
        queryFn: async () => {
            const stores = await gSheets.get('stores')
            return stores.find(s => s.owner_id == profile?.id)
        },
        enabled: !!profile?.id
    })

    const { data: submissions, isLoading } = useQuery({
        queryKey: ['store-submissions-history', store?.id],
        queryFn: async () => {
            const [allSubmissions, users] = await Promise.all([
                gSheets.get('submissions'),
                gSheets.get('users')
            ])

            return allSubmissions
                .filter(s => s.store_id == store?.id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map(sub => ({
                    ...sub,
                    users: users.find(u => u.id == sub.user_id)
                }))
        },
        enabled: !!store?.id
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Store Signal Logs</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Comprehensive Traceability Archive of Partner Hub Contributions</p>
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
                <Table headers={['Signal Time', 'Source Node (User)', 'Battery Species', 'Signal Count', 'Verification Status', 'Commission Trace']}>
                    {isLoading ? (
                        <Skeleton count={10} className="h-16 w-full mb-2" />
                    ) : submissions?.length > 0 ? submissions.map(sub => (
                        <tr key={sub.id} className="text-sm group hover:bg-white/5 transition-colors">
                            <td className="px-6 py-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest tabular-nums leading-none">
                                {new Date(sub.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-950 border border-white/5 rounded-lg">
                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white uppercase italic tracking-tighter text-sm leading-none">{sub.users?.name}</span>
                                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none mt-1">{sub.users?.email}</span>
                                    </div>
                                </div>
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
                            <td className="px-6 py-6 font-bold text-white text-lg tabular-nums leading-none">
                                <Badge variant={sub.status === 'verified' ? 'success' : sub.status === 'rejected' ? 'error' : 'pending'}>
                                    {sub.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-6">
                                <span className={`text-lg font-bold tabular-nums leading-none ${sub.status === 'verified' ? 'text-accent' : 'text-slate-700'}`}>
                                    {sub.status === 'verified' ? `+${Math.ceil((sub.points_awarded || 0) * 0.1)}` : '0'}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr className="border-none">
                            <td colSpan="6" className="py-24 text-center">
                                <Activity className="w-12 h-12 text-slate-800 mx-auto mb-6 opacity-30" />
                                <p className="text-slate-600 font-bold uppercase tracking-[4px] italic text-[10px] leading-none">Signal clear. No partner hub logs discovered in spectral filter.</p>
                            </td>
                        </tr>
                    )}
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 bg-slate-950 border-white/5 relative group flex flex-col justify-between h-48 h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <h4 className="text-xl font-bold font-display italic tracking-tight text-white mb-2 leading-none">Audit Traceability Protocol</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-none">Spectral Feed Archive Locked: System Online</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic mt-8 leading-none opacity-50">Authorized Hub Records: CellBack Infrastructure Version 1.0.2 Locked</p>
                </Card>
            </div>
        </div>
    )
}

export default StoreHistory

