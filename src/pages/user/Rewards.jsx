import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import {
    Gift,
    Search,
    Filter,
    ChevronRight,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Tag
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import Modal from '../../components/ui/Modal'

const Rewards = () => {
    const { profile, fetchProfile } = useAuth()
    const queryClient = useQueryClient()
    const [selectedReward, setSelectedReward] = useState(null)
    const [filter, setFilter] = useState('all')

    const { data: rewards, isLoading } = useQuery({
        queryKey: ['rewards-list'],
        queryFn: async () => {
            const data = await gSheets.get('rewards')
            return data.filter(r => r.is_active)
        }
    })

    const mutation = useMutation({
        mutationFn: async (reward) => {
            const response = await gSheets.redeemReward({
                userId: profile.id,
                rewardId: reward.id,
                pointsCost: reward.points_required
            })
            if (response.error) throw new Error(response.error)
        },
        onSuccess: () => {
            toast.success('Reward redeemed successfully!')
            fetchProfile(profile.id) // Refresh local points signal
            queryClient.invalidateQueries(['rewards-list'])
            setSelectedReward(null)
        },
        onError: (error) => {
            toast.error(error.message || 'Redemption failed')
        }
    })

    const filteredRewards = rewards?.filter(r => filter === 'all' || r.category === filter)
    const userPoints = profile?.points || 0

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight mb-2">Rewards Catalog</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Inventory of Environmental Loyalty Incentives</p>
                </div>
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    {['all', 'Voucher', 'Peripheral', 'Digital'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 ${filter === cat ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <Skeleton count={6} className="h-64 w-full" />
                ) : filteredRewards?.length > 0 ? (
                    filteredRewards.map((reward, i) => (
                        <Card key={reward.id} className="relative group overflow-hidden bg-slate-900/40 border-white/5 p-8 flex flex-col justify-between group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                                        <Gift className="w-6 h-6 text-primary" />
                                    </div>
                                    <Badge variant="success" className="px-3 border border-primary/20 bg-primary/5 uppercase font-bold text-[10px] tracking-widest">{reward.points_required} Points</Badge>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-light transition-colors font-display italic tracking-tight">{reward.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2">{reward.description || 'Access carbon-neutral rewards with your contribution.'}</p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">In Stock</span>
                                    <span className="text-white font-bold">{reward.stock} Left</span>
                                </div>
                                <Button
                                    variant={userPoints >= reward.points_required ? 'primary' : 'outline'}
                                    className={`text-xs px-6 py-3 font-bold uppercase tracking-widest group flex items-center gap-2 ${userPoints < reward.points_required ? 'opacity-50 border-slate-800' : 'shadow-xl shadow-primary/20'}`}
                                    disabled={userPoints < reward.points_required || reward.stock < 1}
                                    onClick={() => setSelectedReward(reward)}
                                >
                                    Redeem Incentive <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center glass-card border-dashed">
                        <Tag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h4 className="text-white font-bold text-xl uppercase tracking-tighter italic">Signal Frequency Clear</h4>
                        <p className="text-slate-500 text-sm italic">No items currently available in this category.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedReward}
                onClose={() => setSelectedReward(null)}
                title="Authorize Redemption"
            >
                <div className="space-y-6 pt-4">
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 leading-none">Selected Reward</h4>
                            <p className="text-white font-bold text-xl uppercase italic tracking-tight leading-none">{selectedReward?.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 leading-none">Cost Protocol</p>
                            <p className="text-primary font-bold text-xl leading-none">-{selectedReward?.points_required} PTS</p>
                        </div>
                    </div>

                    <div className="p-5 flex items-start gap-4 bg-accent/5 border border-accent/20 rounded-2xl">
                        <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            You are about to authorize a point-exchange transition. This protocol is irreversible and will deduct from your account balance.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" onClick={() => setSelectedReward(null)} className="flex-1 py-4 border-slate-800">Abort</Button>
                        <Button
                            onClick={() => mutation.mutate(selectedReward)}
                            disabled={mutation.isLoading}
                            className="flex-[2] py-4 bg-primary hover:bg-primary-dark shadow-2xl flex items-center justify-center gap-2 group"
                        >
                            {mutation.isLoading ? 'Verifying Transaction...' : (
                                <>
                                    Confirm Allocation <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Rewards
