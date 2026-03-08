import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { QrCode, TrendingUp, Wallet, Package, AlertTriangle, ChevronRight, Activity, MapPin, History } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const StoreDashboard = () => {
    const { profile } = useAuth()

    const { data: store, isLoading: storeLoading } = useQuery({
        queryKey: ['store-details', profile?.id],
        queryFn: async () => {
            const stores = await gSheets.get('stores')
            return stores.find(s => s.owner_id == profile?.id)
        },
        enabled: !!profile?.id
    })

    const { data: todayStats } = useQuery({
        queryKey: ['store-today-stats', store?.id],
        queryFn: async () => {
            const submissions = await gSheets.get('submissions')
            const today = new Date(); today.setHours(0, 0, 0, 0)

            const storeSubs = submissions.filter(s =>
                s.store_id == store?.id &&
                s.status === 'verified' &&
                new Date(s.created_at) >= today
            )

            return {
                count: storeSubs.length,
                cells: storeSubs.reduce((acc, curr) => acc + (parseInt(curr.verified_quantity) || 0), 0),
                points: storeSubs.reduce((acc, curr) => acc + (parseInt(curr.points_awarded) || 0), 0)
            }
        },
        enabled: !!store?.id
    })

    const fillPercentage = store ? (store.current_box_count / store.box_capacity) * 100 : 0
    const isNearlyFull = fillPercentage > 80

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight mb-2">Partner Store Portal</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> {store?.store_name} — Operational Signal Active
                    </p>
                </div>
                <Link to="/store/scan">
                    <Button className="flex items-center gap-3 px-10 py-5 bg-accent hover:bg-accent-dark shadow-2xl shadow-accent/20 group">
                        <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Scan Ticket Protocol
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className={`lg:col-span-2 p-10 relative overflow-hidden flex flex-col justify-between ${isNearlyFull ? 'border-red-500/20 bg-red-500/5' : 'bg-slate-900/50 border-white/5'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />

                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-2xl font-bold font-display italic tracking-tight text-white mb-1 leading-none">Box Capacity Monitoring</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Authorized Recycling Volume Check</p>
                        </div>
                        <span className={`text-4xl font-bold font-display tabular-nums ${isNearlyFull ? 'text-red-500' : 'text-primary'}`}>
                            {store?.current_box_count} <span className="text-xs uppercase text-slate-500">/ {store?.box_capacity} Cells</span>
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="h-6 w-full bg-slate-950 rounded-2xl border border-white/5 p-1 flex items-center shadow-inner overflow-hidden">
                            <div
                                className={`h-full rounded-xl transition-all duration-1000 shadow-[0_0_15px_rgba(22,163,74,0.3)] ${fillPercentage > 90 ? 'bg-red-500 shadow-red-500/50' :
                                    fillPercentage > 70 ? 'bg-orange-500 shadow-orange-500/50' :
                                        'bg-primary'
                                    }`}
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            />
                        </div>

                        {isNearlyFull && (
                            <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl animate-pulse">
                                <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-red-400 text-sm">Critical Threshold Signal</h4>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter italic">Collection bin capacity exceeded 80%. Logistics request advised.</p>
                                </div>
                                <Link to="/store/pickup" className="ml-auto">
                                    <Button className="text-[10px] py-2 px-6 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold uppercase tracking-widest">Request Pickup</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="bg-slate-900 border-white/5 flex flex-col justify-between p-10 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <div className="flex flex-col items-center text-center">
                        <div className="p-5 bg-accent/20 border border-accent/20 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                            <Wallet className="w-10 h-10 text-accent" />
                        </div>
                        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest italic mb-2">Commission Signal</h4>
                        <div className="text-5xl font-bold font-display text-white tabular-nums mb-2">
                            {store?.commission_points}
                            <span className="text-[10px] text-slate-500 ml-2 font-bold tracking-widest uppercase">PTS</span>
                        </div>
                        <p className="text-xs text-slate-600 italic font-medium leading-none">Net worth of partner contributions</p>
                    </div>
                    <Link to="/store/wallet">
                        <Button variant="outline" className="w-full mt-10 py-4 border-slate-800 text-[10px] font-bold uppercase tracking-[2px] hover:bg-white/5 hover:text-white">Access Earnings Hub</Button>
                    </Link>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Today's Scans", value: todayStats?.count || 0, icon: QrCode, color: "text-primary", bg: "bg-primary/20", border: "border-primary/20" },
                    { label: "Today's Cells", value: todayStats?.cells || 0, icon: Package, color: "text-accent", bg: "bg-accent/20", border: "border-accent/20" },
                    { label: "Network Sync", value: "Locked", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/20" }
                ].map((stat, i) => (
                    <Card key={i} className="flex items-center gap-6 p-8 group border-white/5">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.border} border group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[2px] mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white font-display tabular-nums tracking-tighter">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                <Card className="p-10 bg-slate-900/40 border-white/5">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <h3 className="text-xl font-bold font-display italic text-white flex items-center gap-3">
                            <History className="w-5 h-5 text-slate-500" /> Recent Log Scan
                        </h3>
                        <Link to="/store/history" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl">Full Records Logs</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-2xl">
                        <span className="text-xs text-slate-600 italic font-medium uppercase tracking-widest">Feed Trace standby...</span>
                        <p className="text-[10px] text-slate-700 font-bold mt-2">Active scanning session recommended</p>
                    </div>
                </Card>

                <Card className="p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 relative group">
                    <h3 className="text-xl font-bold mb-8 font-display italic text-white leading-none">System Directives</h3>
                    <div className="space-y-6">
                        {[
                            { title: "Point Protocol", text: "Points are awarded instantly upon physical verification of user signals." },
                            { title: "Box Custody", text: "Ensure the recycling signal bin is placed in a cool, monitored location." },
                            { title: "Fraud Trace", text: "Flag quantity discrepancies larger than 20% for admin audit protocol." }
                        ].map((directive, i) => (
                            <div key={i} className="flex gap-5 group/item">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover/item:scale-150 transition-transform duration-500 shadow-[0_0_5px_rgba(22,163,74,0.5)]" />
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1 uppercase italic tracking-tighter">{directive.title}</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{directive.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}


export default StoreDashboard
