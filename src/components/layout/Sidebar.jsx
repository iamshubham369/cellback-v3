import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    Home,
    MapPin,
    History,
    ShoppingBag,
    User,
    TrendingUp,
    QrCode,
    Settings,
    ShieldAlert,
    BarChart3,
    Package,
    LayoutDashboard,
    Gift,
    Boxes,
    Truck,
    Scan
} from 'lucide-react'

const Sidebar = () => {
    const { profile } = useAuth()
    const location = useLocation()
    const role = profile?.role || 'user'

    const userLinks = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Submit Battery', path: '/submit', icon: QrCode },
        { label: 'Rewards Hub', path: '/rewards', icon: Gift },
        { label: 'My History', path: '/history', icon: History },
        { label: 'Store Map', path: '/map', icon: MapPin },
        { label: 'Profile', path: '/profile', icon: User },
    ]

    const storeLinks = [
        { label: 'Portal Home', path: '/store/dashboard', icon: Home },
        { label: 'Scan Ticket', path: '/store/scan', icon: Scan },
        { label: 'Verification Log', path: '/store/history', icon: History },
        { label: 'Box & Logistics', path: '/store/pickup', icon: Truck },
        { label: 'My Wallet', path: '/store/wallet', icon: ShoppingBag },
        { label: 'Store Profile', path: '/profile', icon: Settings },
    ]

    const adminLinks = [
        { label: 'Overview', path: '/admin/dashboard', icon: BarChart3 },
        { label: 'Partner Network', path: '/admin/stores', icon: Boxes },
        { label: 'Global Traffic', path: '/admin/submissions', icon: History },
        { label: 'Logistics Fleet', path: '/admin/logistics', icon: Truck },
        { label: 'Rewards Catalog', path: '/admin/rewards', icon: Gift },
        { label: 'Deep Analytics', path: '/admin/analytics', icon: TrendingUp },
    ]

    const activeLinks = role === 'admin' ? adminLinks : role === 'store' ? storeLinks : userLinks

    return (
        <aside className="fixed left-0 top-16 bottom-0 hidden lg:flex flex-col w-64 bg-slate-950 border-r border-white/5 py-8 px-4 z-40 overflow-y-auto">
            <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4">
                    Navigation
                </p>
                {activeLinks.map((link, i) => {
                    const isActive = location.pathname === link.path
                    return (
                        <Link
                            key={i}
                            to={link.path}
                            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${isActive
                                    ? 'bg-primary/10 text-primary-light border-l-4 border-primary'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                }`}
                        >
                            <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary-light transition-colors'}`} />
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="mt-auto pt-8">
                <div className="glass-card p-4 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldAlert className="w-5 h-5 text-accent" />
                        <span className="text-xs font-bold text-white uppercase italic">Safety Tip</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Always tape the terminals of 9V batteries to prevent accidental short circuits during drop-off.
                    </p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
