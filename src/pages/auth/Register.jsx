import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Zap, Mail, Lock, User, Store, ShieldCheck, ChevronRight, MapPin } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

const Register = () => {
    const [role, setRole] = useState('user')
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const { register: signUp, user, profile } = useAuth()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (user && profile) {
            const dashboard = profile.role === 'admin' ? '/admin/dashboard' : profile.role === 'store' ? '/store/dashboard' : '/dashboard'
            navigate(dashboard, { replace: true })
        }
    }, [user, profile, navigate])

    const onSubmit = async (data) => {
        try {
            const storeData = role === 'store' ? {
                name: data.storeName,
                address: data.address,
                city: data.city,
                pincode: data.pincode
            } : null

            await signUp(data.name, data.email, data.password, role, storeData)
            toast.success('Registration successful!')
            navigate('/login')
        } catch (error) {
            toast.error(error.message || 'Registration failed')
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden py-24">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary blur-[160px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent blur-[140px] rounded-full" />
            </div>

            <div className="w-full max-w-xl relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
                        <div className="p-2.5 bg-primary/20 border border-primary/30 rounded-2xl group-hover:bg-primary/30 transition-all">
                            <Zap className="w-6 h-6 text-primary-light" />
                        </div>
                        <span className="text-2xl font-bold font-display italic text-white">CellBack</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 font-display italic">Join the Movement</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Help build a circular economy</p>
                </div>

                <Card className="p-10 border-white/5 bg-slate-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-blue-500" />

                    <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 mb-8 w-full">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'user' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            <User className="w-4 h-4" /> Environmental Contributor
                        </button>
                        <button
                            onClick={() => setRole('store')}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'store' ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Store className="w-4 h-4" /> Kirana Partner
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                placeholder="Rahul Sharma"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                            />
                            <Input
                                label="Email Identity"
                                type="email"
                                placeholder="rahul@earth.com"
                                {...register('email', { required: 'Email is required' })}
                                error={errors.email?.message}
                            />
                        </div>

                        {role === 'store' && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                                    <MapPin className="w-4 h-4" /> Business Specifics
                                </div>
                                <Input
                                    label="Registered Store Name"
                                    placeholder="Green Grocery Ltd."
                                    {...register('storeName', { required: 'Store name is required' })}
                                    error={errors.storeName?.message}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Physical Address"
                                            placeholder="Shop No. 4, MG Road"
                                            {...register('address', { required: 'Address is required' })}
                                        />
                                    </div>
                                    <Input
                                        label="City/Town"
                                        placeholder="Mumbai"
                                        {...register('city', { required: 'City is required' })}
                                    />
                                </div>
                            </div>
                        )}

                        <Input
                            label="Secured Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' }
                            })}
                            error={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            className={`w-full py-4 text-lg ${role === 'user' ? 'bg-primary' : 'bg-accent'} hover:opacity-90 flex items-center justify-center gap-3 shadow-xl transition-all duration-300 disabled:opacity-50`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" /> Initialize Account
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-white/5 text-center w-full">
                        <p className="text-slate-500 text-sm font-medium">Already part of the network?</p>
                        <Link to="/login" className="text-white font-bold hover:text-primary transition-colors flex items-center justify-center gap-2 mt-2">
                            Access Member Login
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Register
