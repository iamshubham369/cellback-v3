import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { toast } from 'react-hot-toast'
import { Store, User, MapPin, Search, Check, Ban, X, ShieldAlert, Activity } from 'lucide-react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const ManageStores = () => {
    const queryClient = useQueryClient()
    const [filter, setFilter] = useState('all')

    const { data: stores, isLoading } = useQuery({
        queryKey: ['admin-stores'],
        queryFn: async () => {
            const [storesList, users] = await Promise.all([
                gSheets.get('stores'),
                gSheets.get('users')
            ])

            return storesList.map(store => ({
                ...store,
                users: users.find(u => u.id == store.owner_id)
            }))
        }
    })

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }) => {
            const response = await gSheets.updateRow('stores', id, { status })
            if (response.error) throw new Error(response.error)
            return response
        },
        onSuccess: () => {
            toast.success('Carrier Hub signal updated')
            queryClient.invalidateQueries(['admin-stores'])
        }
    })

    const filteredStores = stores?.filter(s => filter === 'all' || s.status === filter)

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Partner Network Hubs</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Authorized Carrier Verification Center</p>
                </div>
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    {['all', 'pending', 'approved', 'suspended'].map(v => (
                        <button
                            key={v}
                            onClick={() => setFilter(v)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${filter === v ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900/20 rounded-[2rem] border border-white/5 overflow-hidden">
                <Table headers={['Signal Hub Name', 'Authorized Operator', 'Geographic Location', 'Hub Capacity', 'Safety Tier', 'Access Controls']}>
                    {filteredStores?.length > 0 ? filteredStores.map(store => (
                        <tr key={store.id} className="text-sm group hover:bg-white/5 transition-colors">
                            <td className="px-6 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                                        <Store className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="font-bold text-white uppercase italic tracking-tighter text-lg leading-none">{store.store_name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-8">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-white font-bold italic tracking-tighter leading-none">{store.users?.name}</span>
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-none">{store.users?.email}</span>
                                </div>
                            </td>
                            <td className="px-6 py-8">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-slate-300 font-bold italic tracking-tighter leading-none">
                                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                        {store.city}
                                    </div>
                                    <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest leading-none opacity-50">{store.address}</span>
                                </div>
                            </td>
                            <td className="px-6 py-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest leading-none">
                                        <span className="text-slate-600">Fill Density</span>
                                        <span className="text-white">{Math.round((store.current_box_count / store.box_capacity) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-32 bg-slate-950 rounded-full border border-white/5 p-0.5 overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${(store.current_box_count / store.box_capacity) * 100}%` }} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-8">
                                <Badge variant={store.status === 'approved' ? 'success' : store.status === 'pending' ? 'pending' : 'error'}>
                                    {store.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-8">
                                <div className="flex gap-4">
                                    {store.status !== 'approved' && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: store.id, status: 'approved' })}
                                            className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all group/btn"
                                            title="Authorize Node"
                                        >
                                            <Check className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                        </button>
                                    )}
                                    {store.status !== 'suspended' && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: store.id, status: 'suspended' })}
                                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all group/btn"
                                            title="Deactivate Hub"
                                        >
                                            <Ban className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                        </button>
                                    )}
                                    <button className="p-3 rounded-xl bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white transition-all group/btn">
                                        <Search className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="py-24 text-center">
                                <ShieldAlert className="w-12 h-12 text-slate-800 mx-auto mb-6" />
                                <p className="text-slate-600 font-bold uppercase tracking-[4px] italic text-xs leading-none">No hubs detected in current spectral filter</p>
                            </td>
                        </tr>
                    )}
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 bg-slate-900 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    <h4 className="text-xl font-bold font-display italic tracking-tight text-white mb-4 leading-none flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary" /> Network Growth Signal
                    </h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed leading-none">
                        Carrier node density has increased by 14.2% in the last quarter. Mumbai and Bangalore remain high-yield signals.
                    </p>
                </Card>
            </div>
        </div>
    )
}


export default ManageStores
