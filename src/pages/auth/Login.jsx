import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Zap, Mail, Lock, LogIn, ChevronRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const { login } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password)
            toast.success('Successfully logged in!')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error.message || 'Login failed')
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-[160px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent blur-[140px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
                        <div className="p-2.5 bg-primary/20 border border-primary/30 rounded-2xl group-hover:bg-primary/30 transition-all">
                            <Zap className="w-6 h-6 text-primary-light" />
                        </div>
                        <span className="text-2xl font-bold font-display italic text-white">CellBack</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 font-display italic">Welcome Back</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Secure Environmental Authority</p>
                </div>

                <Card className="p-10 border-white/5 bg-slate-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-blue-500" />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-4 top-[38px] w-5 h-5 text-slate-500 z-10" />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="admin@cellback.earth"
                                className="pl-12"
                                {...register('email', { required: 'Email is required' })}
                                error={errors.email?.message}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-[38px] w-5 h-5 text-slate-500 z-10" />
                            <Input
                                label="Platform Password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-12"
                                {...register('password', { required: 'Password is required' })}
                                error={errors.password?.message}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg bg-primary hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" /> Access Portal
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-white/5 text-center flex flex-col gap-4">
                        <p className="text-slate-500 text-sm font-medium">New to the platform?</p>
                        <Link to="/register">
                            <Button variant="outline" className="w-full py-3 border-slate-800 text-slate-300 flex items-center justify-center gap-2 group">
                                Create Project Account
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Login
