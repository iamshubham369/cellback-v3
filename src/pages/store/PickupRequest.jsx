import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../../context/AuthContext'
import { Truck, MapPin, Package, AlertTriangle, ShieldCheck, Activity, Globe, Zap, History, ChevronRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { toast } from 'react-hot-toast'

const PickupRequest = () => {
    const { profile } = useAuth()
    const queryClient = useQueryClient()

    const { data: store } = useQuery({
        queryKey: ['store-id', profile?.id],
        queryFn: async () => {
            const stores = await gSheets.get('stores')
            return stores.find(s => s.owner_id == profile?.id)
        },
        enabled: !!profile?.id
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const pickupData = {
                id: uuidv4(),
                store_id: store.id,
                status: 'requested',
                estimated_weight: (parseInt(store.current_box_count) || 0) * 0.05,
                created_at: new Date().toISOString()
            }
            const response = await gSheets.addRow('pickups', pickupData)
            if (response.error) throw new Error(response.error)
            return response
        },
        onSuccess: () => {
            toast.success('Logistics deployment signal sent!')
            queryClient.invalidateQueries(['store-details'])
        }
    })

    const fillPercentage = store ? (store.current_box_count / store.box_capacity) * 100 : 0

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Logistics Dispatch Hub</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Synchronize hazardous waste pickup with central fleet</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 bg-slate-900 border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />

                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold font-display italic tracking-tight text-white mb-2 leading-none">Payload Density</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Authorized Volume Spectral check</p>
                        </div>
                        <span className="text-4xl font-bold font-display tabular-nums text-white">
                            {store?.current_box_count} / {store?.box_capacity}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="h-6 w-full bg-slate-950 rounded-2xl border border-white/5 p-1">
                            <div
                                className={`h-full rounded-xl transition-all duration-1000 ${fillPercentage > 80 ? 'bg-red-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-none">
                            {fillPercentage > 80 ? 'Signal Threshold Exceeded' : 'Deployment Optimal at >80%'}
                        </p>
                    </div>
                </Card>

                <Card className="p-10 bg-slate-950 border-white/5 relative group h-72 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-accent/20 rounded-2xl border border-accent/20">
                            <Truck className="w-10 h-10 text-accent group-hover:scale-110 transition-transform" />
                        </div>
                        <Badge variant="info" className="px-4 py-1 uppercase font-bold text-[9px] tracking-[2px] backdrop-blur-3xl">Carrier Sync: Online</Badge>
                    </div>

                    <div className="space-y-6">
                        <p className="text-xs text-slate-400 font-medium leading-relaxed leading-none">
                            Initializing a dispatch signal will notify the nearest logistics carrier node. Pickups are generally executed within 24-48 hours.
                        </p>
                        <Button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isLoading || fillPercentage < 10}
                            className={`w-full py-4 text-slate-900 font-bold uppercase tracking-[2px] transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group ${fillPercentage < 80 ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-accent hover:bg-accent-dark shadow-accent/20'}`}
                        >
                            {mutation.isLoading ? 'Syncing...' : (
                                <>
                                    Deploy Logistics Signal <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="p-10 bg-slate-900 border-white/5 relative group col-span-2">
                    <h3 className="text-xl font-bold mb-8 font-display italic text-white flex items-center gap-4">
                        <History className="w-5 h-5 text-slate-500" /> Dispatch History Feed
                    </h3>
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-3xl opacity-30 mt-4">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">No dispatch traces in current spectral filter</p>
                    </div>
                </Card>

                <Card className="p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 relative group">
                    <h3 className="text-xl font-bold mb-8 font-display italic text-white leading-none">Security Directive</h3>
                    <div className="space-y-10 group-hover:opacity-100 opacity-60 transition-opacity duration-700">
                        {[
                            { label: 'Carrier Matching', icon: ShieldCheck, text: 'Only authorize carriers with the cryptographically signed CellBack badge.' },
                            { label: 'Hazardous Waste', icon: AlertTriangle, text: 'Ensure the recycling signal bin is sealed before handing over to the fleet.' },
                            { label: 'Global Audit', icon: Globe, text: 'Acknowledge the pickup receipt in the portal once the carrier node departs.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-bold text-white uppercase italic tracking-[2px] mb-2">{item.label}</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tighter opacity-80 leading-none">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default PickupRequest

