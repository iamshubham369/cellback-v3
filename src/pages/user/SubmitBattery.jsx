import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../../context/AuthContext'
import { generateQRData } from '../../lib/qr'
import { toast } from 'react-hot-toast'
import {
    ChevronRight,
    ChevronLeft,
    Battery,
    MapPin,
    Trash2,
    QrCode,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import QRGenerator from '../../components/qr/QRGenerator'

const SubmitBattery = () => {
    const { profile } = useAuth()
    const [step, setStep] = useState(1)
    const [ticket, setTicket] = useState(null)

    const { register, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { quantity: 1 }
    })

    // Fetch approved/active stores
    const { data: stores, isLoading: storesLoading } = useQuery({
        queryKey: ['stores-list'],
        queryFn: async () => {
            const data = await gSheets.get('stores')
            // Match both seeded 'active' status and future 'approved' status
            return data.filter(s => s.status === 'approved' || s.status === 'active')
        }
    })

    const mutation = useMutation({
        mutationFn: async (formData) => {
            // Check if user exists first to be safe
            if (!profile?.id) throw new Error("Auth signal lost")

            const currentStore = stores?.find(s => s.id == formData.storeId)
            const qrDataStr = generateQRData(profile.id, formData.storeId, formData.type, formData.quantity)
            const qrData = JSON.parse(qrDataStr)
            const subId = uuidv4()

            const submissionPayload = {
                id: subId,
                user_id: profile.id,
                store_id: formData.storeId,
                battery_type: formData.type || 'Standard',
                claimed_quantity: formData.quantity,
                qr_token: qrData.token,
                status: 'pending',
                created_at: new Date().toISOString()
            }

            const response = await gSheets.addRow('submissions', submissionPayload)
            if (response.error) throw new Error(response.error)

            return {
                ...submissionPayload,
                qr_token: qrData.token,
                store_name: currentStore?.store_name || 'Partner Store'
            }
        },
        onSuccess: (data) => {
            setTicket(data)
            setStep(4)
            toast.success('Protocol Initiated! Visit the partner to synchronize.')
        },
        onError: (error) => {
            toast.error(error.message || 'Transmission failed')
        }
    })

    const onSubmit = (data) => mutation.mutate(data)

    const batteryTypes = [
        { id: 'AA', label: 'AA Alkaline', icon: Battery, color: 'text-primary' },
        { id: 'AAA', label: 'AAA Alkaline', icon: Battery, color: 'text-primary' },
        { id: '9V', label: '9V Battery', icon: Battery, color: 'text-accent' },
        { id: 'li_ion', label: 'Li-ion (Mobile)', icon: Battery, color: 'text-blue-500' },
        { id: 'button_cell', label: 'Button Cell', icon: Battery, color: 'text-slate-400' }
    ]

    const selectedType = watch('type')
    const selectedStoreId = watch('storeId')
    const selectedStore = stores?.find(s => s.id === selectedStoreId)

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0 mx-12" />
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all ${step >= s ? 'bg-primary text-white' : 'bg-slate-900 border border-slate-800 text-slate-500'}`}>
                        {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                ))}
            </div>

            {step < 4 ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="p-4 bg-primary/20 border border-primary/20 rounded-3xl mb-4">
                                    <Battery className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Select Species</h2>
                                <p className="text-slate-500 max-w-sm text-sm font-medium uppercase tracking-widest italic">What type of cells are we recycling today?</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {batteryTypes.map(type => (
                                    <label key={type.id} className="cursor-pointer group flex flex-col items-center gap-4">
                                        <input
                                            type="radio"
                                            value={type.id}
                                            {...register('type', { required: true })}
                                            className="peer hidden"
                                        />
                                        <div className={`w-full aspect-square glass-card flex flex-col items-center justify-center p-6 border-slate-800 transition-all group-hover:scale-105 group-hover:bg-slate-900/80 peer-checked:border-primary-light peer-checked:bg-primary/10 peer-checked:shadow-xl peer-checked:shadow-primary/10 relative overflow-hidden`}>
                                            <div className={`mb-3 transition-transform ${type.color}`}>
                                                <type.icon className="w-12 h-12" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 peer-checked:text-white transition-colors">{type.label}</span>
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 peer-checked:opacity-20 transition-opacity" />
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-center mt-12">
                                <Button
                                    disabled={!selectedType}
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-12 py-5 text-lg group flex items-center gap-2 bg-primary shadow-xl shadow-primary/20"
                                >
                                    Next Phase <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2">Quantity Estimate</h2>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">How many cells of type {selectedType}?</p>
                            </div>
                            <Card className="p-12 flex flex-col items-center gap-8 bg-slate-900/50">
                                <div className="w-64">
                                    <Input
                                        type="number"
                                        {...register('quantity', { required: true, min: 1 })}
                                        className="text-center text-5xl font-bold bg-transparent border-none focus:ring-0 text-white"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <AlertTriangle className="w-4 h-4" />
                                    Verification happens at the store
                                </div>
                            </Card>
                            <div className="flex justify-between gap-6">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 py-5 flex items-center justify-center gap-2 border-slate-800">
                                    <ChevronLeft className="w-5 h-5" /> Previous
                                </Button>
                                <Button type="button" variant="primary" onClick={() => setStep(3)} className="flex-[2] py-5 group flex items-center justify-center gap-2 bg-primary shadow-xl shadow-primary/20">
                                    Continue <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2">All Available Partners</h2>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">Authorized Kirana Partners</p>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {stores?.length === 0 && (
                                    <div className="p-8 text-center glass-card border-dashed border-slate-800">
                                        <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Search Signal Weak: No partners found in your sector</p>
                                    </div>
                                )}
                                {stores?.map(store => (
                                    <label key={store.id} className="cursor-pointer block group">
                                        <input
                                            type="radio"
                                            value={store.id}
                                            {...register('storeId', { required: true })}
                                            className="peer hidden"
                                        />
                                        <Card className={`flex items-center justify-between p-6 border-slate-800 transition-all group-hover:bg-slate-900/80 peer-checked:border-accent/40 peer-checked:bg-accent/5 relative overflow-hidden`}>
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">
                                                    <MapPin className="w-5 h-5 text-accent" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white uppercase italic tracking-tight">{store.store_name}</h4>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{store.address}, {store.city}</p>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-800 peer-checked:border-accent peer-checked:bg-accent flex items-center justify-center transition-all">
                                                <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                                            </div>
                                        </Card>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-between gap-6">
                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 py-5 border-slate-800">
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!selectedStoreId || mutation.isLoading}
                                    className="flex-[4] py-5 bg-gradient-to-r from-primary to-green-500 shadow-2xl flex items-center justify-center gap-3 group"
                                >
                                    {mutation.isLoading ? 'Confirming Protocol...' : (
                                        <>
                                            <QrCode className="w-5 h-5" /> Generate Recycling Signal <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            ) : (
                <div className="animate-in zoom-in duration-500 space-y-8 flex flex-col items-center">
                    <QRGenerator
                        value={JSON.stringify({ id: ticket?.id, token: ticket?.qr_token })}
                        title={`${ticket?.battery_type || 'Cell'} Signal Generated`}
                        subtitle={`Target: ${ticket?.store_name || 'Partner Store'}`}
                    />
                    <div className="flex flex-col items-center gap-6 mt-8 w-full">
                        <div className="flex items-center gap-4 p-5 glass-card border-none bg-blue-500/10 w-full text-left">
                            <AlertTriangle className="w-10 h-10 text-blue-400 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-blue-300 uppercase tracking-widest italic">Terminal Safety</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Please tape battery terminals to prevent short-circuits. Ensure cells are transported in non-conductive packaging.</p>
                            </div>
                        </div>
                        <Link to="/dashboard" className="w-full">
                            <Button variant="outline" className="w-full py-5 border-slate-800 text-slate-400 hover:text-white uppercase tracking-[4px] text-[10px] font-bold font-display italic">
                                Return to Command Center
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

const Circle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
)

export default SubmitBattery
