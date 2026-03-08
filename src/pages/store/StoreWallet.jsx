import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { useAuth } from '../../context/AuthContext'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Globe, Zap, History, ChevronRight, ShieldCheck } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const StoreWallet = () => {
    const { profile } = useAuth()

    const { data: store, isLoading } = useQuery({
        queryKey: ['store-wallet-details', profile?.id],
        queryFn: async () => {
            const stores = await gSheets.get('stores')
            return stores.find(s => s.owner_id == profile?.id)
        },
        enabled: !!profile?.id
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Partner Earnings Hub</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Manage and track commission signals from environmental contributions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 p-10 bg-slate-900 border-white/5 relative overflow-hidden flex flex-col justify-between h-80 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-700" />

                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold font-display italic tracking-tight text-white mb-2 leading-none">Net Commission Yield</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Global Partner Infrastructure Asset Balance</p>
                        </div>
                        <Badge variant="warning" className="px-6 border border-accent/20 bg-accent/5 uppercase font-bold text-[10px] tracking-widest">Active Partner Ledger</Badge>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="text-6xl md:text-8xl font-bold text-white tabular-nums drop-shadow-2xl">
                            {store?.commission_points?.toLocaleString() || 0}
                            <span className="text-sm border border-white/20 px-4 py-1.5 rounded-full ml-4 inline-block translate-y-[-2rem] bg-white/10 uppercase tracking-widest font-bold">PTS</span>
                        </div>
                        <Button className="bg-accent text-slate-900 hover:bg-accent-dark shadow-2xl py-4 px-8 flex items-center gap-3 group transition-all duration-300">
                            Redeem Rewards Hub <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </div>
                </Card>

                <Card className="p-10 bg-slate-950 border-white/5 relative group h-80 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-primary/20 rounded-2xl border border-primary/20">
                            <TrendingUp className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <Badge variant="success" className="px-4 py-1 uppercase font-bold text-[10px] tracking-widest bg-primary/10 border border-primary/20 text-primary-light">Stats: Scalable</Badge>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic leading-none">Environmental Momentum Signal</h4>
                        <p className="text-white font-bold text-3xl tabular-nums leading-none">+21.4% <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">This Epoch</span></p>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full mt-4 border border-white/5 overflow-hidden">
                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]" style={{ width: '64%' }} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="p-10 bg-slate-900 border-white/5 relative group">
                    <h3 className="text-xl font-bold mb-8 font-display italic text-white flex items-center gap-4 outline-none">
                        <History className="w-5 h-5 text-slate-500" /> Financial Transition Trace
                    </h3>
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-3xl opacity-30 mt-4 h-64">
                        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">No transition trace in current spectral filter</span>
                        <p className="text-[10px] text-slate-600 font-bold mt-2 italic leading-none">Wallet is currently initializing active contributions</p>
                    </div>
                </Card>

                <Card className="p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 relative group">
                    <h3 className="text-xl font-bold mb-10 font-display italic text-white leading-none">System Security Brief</h3>
                    <div className="space-y-12">
                        {[
                            { label: 'Asset Protection', icon: ShieldCheck, text: 'All commission points are cryptographically locked until authorization.', color: 'text-primary' },
                            { label: 'Net Sync', icon: Globe, text: 'Points are signal-matched with physical hazardous waste logistics fleet.', color: 'text-accent' },
                            { label: 'Auth V2.0', icon: Zap, text: 'Redemption transitions require second-factor signal verification for nodes > 10,000 PTS.', color: 'text-blue-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start group/item">
                                <item.icon className={`w-5 h-5 ${item.color} mt-1 shrink-0 opacity-40 group-hover/item:opacity-100 transition-opacity`} />
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[10px] font-bold text-white uppercase italic tracking-[2px] leading-none mb-1">{item.label}</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tighter italic leading-none opacity-80">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default StoreWallet

