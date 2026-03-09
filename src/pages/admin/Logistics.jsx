import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { Truck, MapPin, Package, History, ChevronRight, CheckCircle2, ShieldAlert, Activity, Boxes } from 'lucide-react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { toast } from 'react-hot-toast'

const Logistics = () => {
    const queryClient = useQueryClient()

    const { data: pickups, isLoading } = useQuery({
        queryKey: ['admin-pickups'],
        queryFn: async () => {
            const [allPickups, stores] = await Promise.all([
                gSheets.get('pickups'),
                gSheets.get('stores')
            ])

            return allPickups
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map(p => ({
                    ...p,
                    stores: stores.find(s => s.id == p.store_id)
                }))
        }
    })

    const updateStatus = useMutation({
        mutationFn: async ({ id, status, store_id }) => {
            const response = await gSheets.updateRow('pickups', id, { status })
            if (response.error) throw new Error(response.error)

            if (status === 'completed') {
                const resetResponse = await gSheets.updateRow('stores', store_id, { current_box_count: 0 })
                if (resetResponse.error) throw new Error(resetResponse.error)
            }
        },
        onSuccess: () => {
            toast.success('Logistics fleet status updated')
            queryClient.invalidateQueries(['admin-pickups'])
        }
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Logistics Fleet Protocol</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Manage and track hazardous waste carrier signals</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="info" className="px-6 py-2 uppercase tracking-[2px] text-[10px] bg-slate-900 border border-white/5">Fleet Status: Operational</Badge>
                    <Activity className="w-5 h-5 text-primary animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 bg-gradient-to-br from-primary-dark/20 to-slate-950 border-primary/20 relative overflow-hidden flex flex-col justify-between h-56">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30">
                            <Truck className="w-8 h-8 text-primary-light" />
                        </div>
                        <Badge variant="success" className="px-4 border border-primary/30 bg-primary/10">Active Carrier Signal</Badge>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white font-display italic tracking-tight leading-none mb-2">Carrier Availability</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-none">Global Logistic Grid Sync: Online</p>
                    </div>
                </Card>

                <Card className="p-10 bg-slate-900/40 border-white/5 relative group h-56 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-accent/20 rounded-2xl border border-accent/30">
                            <Boxes className="w-8 h-8 text-accent" />
                        </div>
                        <span className="text-xs font-bold text-accent uppercase italic tracking-tighter">Capacity Check</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white font-display italic tracking-tight leading-none mb-2">Payload Aggregator</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-none">Audit Protocol V1.0 - Logistics Sync Filtered</p>
                    </div>
                </Card>
            </div>

            <div className="bg-slate-900/20 rounded-[2rem] border border-white/5 overflow-x-auto">
                <Table headers={['Signal Time', 'Source Hub Hub', 'Geographic Location', 'Payload Volume', 'Protocol Status', 'Fleet Deployment']}>
                    {pickups?.length > 0 ? pickups.map(p => (
                        <tr key={p.id} className="text-sm group hover:bg-white/5 transition-colors">
                            <td className="px-6 py-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest tabular-nums leading-none">
                                {new Date(p.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-8 font-bold text-white uppercase italic tracking-tighter text-lg leading-none">
                                {p.stores?.store_name}
                            </td>
                            <td className="px-6 py-8">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-slate-300 font-bold italic tracking-tighter text-sm leading-none">
                                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                        {p.stores?.city}
                                    </div>
                                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter opacity-70 leading-none">{p.stores?.address}</span>
                                </div>
                            </td>
                            <td className="px-6 py-8">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-lg font-bold text-white leading-none">Signal Max</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none italic">Hazardous Waste Profile B1</span>
                                </div>
                            </td>
                            <td className="px-6 py-8">
                                <Badge variant={p.status === 'completed' ? 'success' : p.status === 'in_transit' ? 'warning' : 'pending'}>
                                    {p.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-8">
                                <div className="flex gap-4">
                                    {p.status === 'requested' && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: p.id, status: 'in_transit', store_id: p.store_id })}
                                            className="px-6 py-3 rounded-xl bg-accent/20 text-accent hover:bg-accent text-slate-900 font-bold uppercase tracking-widest text-[9px] transition-all duration-300"
                                        >
                                            Deploy Fleet Signal
                                        </button>
                                    )}
                                    {p.status === 'in_transit' && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: p.id, status: 'completed', store_id: p.store_id })}
                                            className="px-6 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary text-white font-bold uppercase tracking-widest text-[9px] transition-all duration-300"
                                        >
                                            Finalize Pickup
                                        </button>
                                    )}
                                    <button className="p-3 rounded-xl bg-slate-800 text-slate-500 hover:text-white group/btn">
                                        <History className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="py-24 text-center">
                                <Truck className="w-12 h-12 text-slate-800 mx-auto mb-6 opacity-30" />
                                <p className="text-slate-600 font-bold uppercase tracking-[4px] italic text-[10px] leading-none">Global Logistic Grid Clear. No deployment signals detected.</p>
                            </td>
                        </tr>
                    )}
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 bg-slate-950 border-white/5 relative overflow-hidden flex items-center gap-6 group h-32">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <div className="p-3 bg-primary/20 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-tight leading-none">
                        Carrier routes are optimized for carbon-neutrality transitions.
                    </p>
                </Card>
            </div>
        </div>
    )
}

const ActivityIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

export default Logistics

