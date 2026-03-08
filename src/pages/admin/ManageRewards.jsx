import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gSheets } from '../../lib/google-sheets'
import { v4 as uuidv4 } from 'uuid'
import { Gift, Plus, Search, Edit3, Trash2, ChevronRight, Tag, ShieldCheck, Zap } from 'lucide-react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { toast } from 'react-hot-toast'

const ManageRewards = () => {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingReward, setEditingReward] = useState(null)

    const { data: rewards, isLoading } = useQuery({
        queryKey: ['admin-rewards-list'],
        queryFn: async () => {
            const data = await gSheets.get('rewards')
            return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        }
    })

    const saveReward = useMutation({
        mutationFn: async (formData) => {
            if (editingReward) {
                const response = await gSheets.updateRow('rewards', editingReward.id, formData)
                if (response.error) throw new Error(response.error)
            } else {
                const newReward = {
                    ...formData,
                    id: uuidv4(),
                    is_active: true,
                    created_at: new Date().toISOString()
                }
                const response = await gSheets.addRow('rewards', newReward)
                if (response.error) throw new Error(response.error)
            }
        },
        onSuccess: () => {
            toast.success('Reward asset updated in catalog')
            queryClient.invalidateQueries(['admin-rewards-list'])
            setIsModalOpen(false)
            setEditingReward(null)
        }
    })

    // Basic form handling within modal
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        points_required: 0,
        stock: 0,
        category: 'Voucher'
    })

    const handleOpenModal = (reward = null) => {
        if (reward) {
            setEditingReward(reward)
            setFormData({
                name: reward.name,
                description: reward.description,
                points_required: reward.points_required,
                stock: reward.stock,
                category: reward.category
            })
        } else {
            setEditingReward(null)
            setFormData({ name: '', description: '', points_required: 0, stock: 0, category: 'Voucher' })
        }
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none mb-2">Rewards Catalog Assets</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] leading-none italic">Authorized Inventory of Loyalty Incentives</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="px-10 py-5 bg-primary hover:bg-primary-dark shadow-2xl shadow-primary/20 flex items-center gap-3 group transition-all duration-300"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    New Reward Asset Protocol
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Card className="bg-slate-900 border-white/5 p-8 flex flex-col justify-between h-40 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
                            <Gift className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="info" className="uppercase tracking-[2px] text-[8px] bg-slate-950/50 border border-white/5">Asset Count</Badge>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-white font-display tabular-nums tracking-tighter leading-none">{rewards?.length || 0}</h3>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic leading-none">Catalog Assets</span>
                    </div>
                </Card>
            </div>

            <div className="bg-slate-900/20 rounded-[2rem] border border-white/5 overflow-hidden">
                <Table headers={['Signal Asset Identity', 'Category Protocol', 'Point Cost', 'Spectral Stock', 'Status Control', 'Asset Configuration']}>
                    {rewards?.length > 0 ? rewards.map(reward => (
                        <tr key={reward.id} className="text-sm group hover:bg-white/5 transition-colors">
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                                        <Tag className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-bold text-white uppercase italic tracking-tighter text-lg leading-none">{reward.name}</span>
                                        <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest leading-none truncate w-48 opacity-60 italic">{reward.description}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 font-bold text-white uppercase italic tracking-tighter text-sm leading-none">
                                {reward.category}
                            </td>
                            <td className="px-6 py-6 font-bold text-primary text-xl tabular-nums leading-none">
                                {reward.points_required}
                            </td>
                            <td className="px-6 py-6 font-bold text-white text-xl tabular-nums leading-none">
                                {reward.stock}
                            </td>
                            <td className="px-6 py-6">
                                <Badge variant={reward.is_active ? 'success' : 'error'}>
                                    {reward.is_active ? 'Operational' : 'Deactivated'}
                                </Badge>
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleOpenModal(reward)}
                                        className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all group/btn"
                                    >
                                        <Edit3 className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                    </button>
                                    <button className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group/btn">
                                        <Trash2 className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="py-24 text-center">
                                <Tag className="w-12 h-12 text-slate-800 mx-auto mb-6 opacity-30" />
                                <p className="text-slate-600 font-bold uppercase tracking-[4px] italic text-[10px] leading-none">Catalog Filter Clear. No assets traced.</p>
                            </td>
                        </tr>
                    )}
                </Table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingReward ? "Update Reward Asset" : "New Reward Asset Protocol"}
            >
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Asset Designation"
                            placeholder="Eco Voucher V1"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Protocol Category"
                            placeholder="Voucher/Peripheral"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Point Exchange Rate"
                            type="number"
                            value={formData.points_required}
                            onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) })}
                        />
                        <Input
                            label="Supply Signal Unit"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        />
                    </div>

                    <Input
                        label="Brief Signal Description"
                        placeholder="Authorization requirements and benefits..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="p-5 flex items-start gap-4 bg-primary/5 border border-primary/20 rounded-2xl">
                        <ShieldCheck className="w-8 h-8 text-primary shrink-0 opacity-40" />
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                            Updating this asset will immediately synchronize across all planetary contributor nodes. Transaction is irreversible.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-slate-800 uppercase tracking-widest text-[10px] font-bold">Abort Protocol</Button>
                        <Button
                            onClick={() => saveReward.mutate(formData)}
                            disabled={saveReward.isLoading}
                            className="flex-[2] py-4 bg-primary hover:bg-primary-dark shadow-2xl flex items-center justify-center gap-3 group"
                        >
                            {saveReward.isLoading ? 'Syncing...' : (
                                <>
                                    Authorize Configuration <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ManageRewards

