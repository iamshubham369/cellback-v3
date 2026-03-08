import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { calculatePoints, isFraudulent } from '../../lib/points'
import { toast } from 'react-hot-toast'
import { QrCode, ClipboardCheck, AlertCircle, X, CheckCircle2, ChevronLeft, ShieldCheck, Battery } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import QRScanner from '../../components/qr/QRScanner'

const ScanQR = () => {
    const { profile } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [isScanning, setIsScanning] = useState(true)
    const [submissionData, setSubmissionData] = useState(null)
    const [verifiedQty, setVerifiedQty] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const { data: store } = useQuery({
        queryKey: ['store-id', profile?.id],
        queryFn: async () => {
            const stores = await gSheets.get('stores')
            return stores.find(s => s.owner_id == profile?.id)
        },
        enabled: !!profile?.id
    })

    const onScanSuccess = React.useCallback(async (decodedText) => {
        try {
            const data = JSON.parse(decodedText)

            const submissions = await gSheets.get('submissions')
            const submission = submissions.find(s =>
                s.id == data.id &&
                s.qr_token == data.token &&
                s.status === 'pending'
            )

            if (!submission) throw new Error('Invalid or already processed ticket')
            if (submission.store_id !== store?.id) throw new Error('Ticket designated for another partner')

            // Get user for name display
            const users = await gSheets.get('users')
            const user = users.find(u => u.id == submission.user_id)

            setSubmissionData({ ...submission, users: user })
            setVerifiedQty(submission.claimed_quantity.toString())
            setIsScanning(false)
            toast.success('Ticket signal matched!')
        } catch (error) {
            toast.error(error.message || 'Scan failed')
        }
    }, [store])

    const handleVerify = async (action) => {
        setIsProcessing(true)
        try {
            if (action === 'confirm') {
                const qty = parseInt(verifiedQty)
                if (isNaN(qty) || qty < 0) throw new Error('Invalid qty')
                const points = calculatePoints(submissionData.battery_type, qty)

                const response = await gSheets.awardPoints({
                    userId: submissionData.user_id,
                    submissionId: submissionData.id,
                    storeId: store?.id,
                    points,
                    verifiedQty: qty
                })

                if (response.error) throw new Error(response.error)
                toast.success('Environmental points awarded!')
            } else {
                const response = await gSheets.updateRow('submissions', submissionData.id, { status: 'rejected' })
                if (response.error) throw new Error(response.error)
                toast.success('Ticket rejected')
            }

            queryClient.invalidateQueries(['store-today-stats'])
            navigate('/store/dashboard')
        } catch (error) {
            toast.error(error.message || 'Protocol failed')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-display italic tracking-tight mb-2">Ticket Verification</h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">Synchronizing Customer recycling signal</p>
            </div>

            {isScanning ? (
                <div className="animate-in fade-in duration-700">
                    <QRScanner onScanSuccess={onScanSuccess} onScanError={() => { }} />
                    <div className="mt-12 p-8 glass-card border-accent/20 bg-accent/5 flex items-start gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -mr-16 -mt-16 rounded-full blur-3xl opacity-50" />
                        <div className="p-3 bg-accent/20 rounded-xl relative">
                            <ShieldCheck className="w-8 h-8 text-accent" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter opacity-80">
                            Place the user's mobile screen within the designated frame. Ensure the screen brightness is adjusted for optimal cryptographic signal matching.
                        </p>
                    </div>
                    <div className="mt-10 flex justify-center">
                        <Link to="/store/dashboard">
                            <Button variant="outline" className="px-12 py-5 border-slate-800 text-xs font-bold uppercase tracking-[2px] flex items-center gap-2 group hover:bg-white/5">
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Abort Session
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="animate-in zoom-in duration-500 space-y-10">
                    <Card className="p-10 border-accent/30 shadow-2xl shadow-accent/10 relative overflow-hidden bg-slate-900/50">
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />

                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                            <h3 className="text-2xl font-bold flex items-center gap-4 text-white font-display italic tracking-tight leading-none">
                                <ClipboardCheck className="w-8 h-8 text-accent" />
                                Confirm Signal
                            </h3>
                            <Badge variant="pending" className="px-4 py-1.5 uppercase tracking-widest text-[10px] bg-accent/10 border border-accent/20 text-accent">Status: Pending</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-10">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-[2px]">Customer Identity</label>
                                <p className="text-xl font-bold text-white uppercase italic tracking-tighter leading-none">{submissionData.users?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-[2px]">Battery Profile</label>
                                <p className="text-xl font-bold text-white uppercase italic tracking-tighter leading-none flex items-center gap-2">
                                    <Battery className="w-4 h-4 text-primary" />
                                    {submissionData.battery_type}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-[2px]">Reported Quantity</label>
                                <p className="text-5xl font-bold text-accent tabular-nums leading-none">{submissionData.claimed_quantity}</p>
                            </div>
                            <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 flex flex-col justify-center">
                                <label className="text-[10px] text-slate-600 uppercase font-bold tracking-[2px] mb-2 leading-none">Estimated Yield</label>
                                <p className="text-lg font-bold text-primary leading-none">+{calculatePoints(submissionData.battery_type, submissionData.claimed_quantity)} <span className="text-[8px] uppercase tracking-widest text-slate-500">PTS</span></p>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-10 rounded-3xl border border-white/5 mb-10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Input
                                label="Physical Verification Count"
                                type="number"
                                value={verifiedQty}
                                onChange={(e) => setVerifiedQty(e.target.value)}
                                className="text-center font-display"
                                style={{ fontSize: '3rem', height: '5rem', fontWeight: 'bold' }}
                            />
                            {verifiedQty && parseInt(verifiedQty) !== submissionData.claimed_quantity && (
                                <p className="text-[11px] text-accent mt-6 text-center flex items-center justify-center gap-2 font-bold uppercase tracking-widest animate-pulse">
                                    <AlertCircle className="w-4 h-4" /> Mismatch Detected: Signal Flagged
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button
                                variant="outline"
                                className="flex-1 py-5 border-white/5 bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 flex items-center justify-center gap-3 transition-all duration-300"
                                disabled={isProcessing}
                                onClick={() => handleVerify('reject')}
                            >
                                <X className="w-5 h-5" /> Reject Signal
                            </Button>
                            <Button
                                className="flex-[2] py-5 bg-accent hover:bg-accent-dark shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 group transition-all duration-300"
                                disabled={isProcessing || !verifiedQty}
                                onClick={() => handleVerify('confirm')}
                            >
                                {isProcessing ? (
                                    <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Authorize & Signal Award
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>

                    <button
                        onClick={() => { setSubmissionData(null); setIsScanning(true); }}
                        className="w-full text-slate-600 text-xs font-bold uppercase tracking-[3px] hover:text-white transition-all py-8 border-t border-white/5 flex items-center justify-center gap-3"
                    >
                        <QrCode className="w-4 h-4" /> Reset cryptographic Scan
                    </button>
                </div>
            )}
        </div>
    )
}

export default ScanQR
