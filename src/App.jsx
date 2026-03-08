import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { MapPin } from 'lucide-react'

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex flex-1 pt-16"> {/* Added pt-16 to clear fixed navbar */}
                <Sidebar />
                <main className="flex-1 lg:ml-64 p-4 md:p-8">
                    <Suspense fallback={
                        <>
                            <div className="loading-bar overflow-hidden">
                                <div className="h-full w-1/3 bg-white/20 animate-slide-right shadow-[0_0_10px_white]" />
                            </div>
                            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(22,163,74,0.3)]" />
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-[4px] italic animate-pulse">Synchronizing Data...</p>
                            </div>
                        </>
                    }>
                        {children}
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const NotFound = lazy(() => import('./pages/NotFound'))
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'))
const SubmitBattery = lazy(() => import('./pages/user/SubmitBattery'))
const Rewards = lazy(() => import('./pages/user/Rewards'))
const History = lazy(() => import('./pages/user/History'))
const Profile = lazy(() => import('./pages/user/Profile'))
const StoreDashboard = lazy(() => import('./pages/store/StoreDashboard'))
const ScanQR = lazy(() => import('./pages/store/ScanQR'))
const StoreHistory = lazy(() => import('./pages/store/StoreHistory'))
const StoreWallet = lazy(() => import('./pages/store/StoreWallet'))
const PickupRequest = lazy(() => import('./pages/store/PickupRequest'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ManageStores = lazy(() => import('./pages/admin/ManageStores'))
const Submissions = lazy(() => import('./pages/admin/Submissions'))
const Logistics = lazy(() => import('./pages/admin/Logistics'))
const ManageRewards = lazy(() => import('./pages/admin/ManageRewards'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <div className="min-h-screen bg-slate-950">
                        <Toaster position="top-right" />
                        <Suspense fallback={
                            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(22,163,74,0.3)]" />
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-[4px] italic animate-pulse">Initializing System...</p>
                            </div>
                        }>
                            <Routes>
                                <Route path="/" element={<><Navbar /><Landing /></>} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/dashboard" element={<ProtectedRoute role="user"><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/submit" element={<ProtectedRoute role="user"><DashboardLayout><SubmitBattery /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/rewards" element={<ProtectedRoute role="user"><DashboardLayout><Rewards /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/history" element={<ProtectedRoute role="user"><DashboardLayout><History /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute role={null}><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/map" element={<ProtectedRoute role={null}><DashboardLayout><div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-slate-800 rounded-3xl"><MapPin className="w-12 h-12 text-primary mb-4" /><h3 className="text-xl font-bold text-white uppercase italic">Impact Map: Coming Soon</h3><p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Connecting all recycling hubs in real-time</p></div></DashboardLayout></ProtectedRoute>} />

                                <Route path="/store/dashboard" element={<ProtectedRoute role="store"><DashboardLayout><StoreDashboard /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/store/scan" element={<ProtectedRoute role="store"><DashboardLayout><ScanQR /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/store/history" element={<ProtectedRoute role="store"><DashboardLayout><StoreHistory /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/store/wallet" element={<ProtectedRoute role="store"><DashboardLayout><StoreWallet /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/store/pickup" element={<ProtectedRoute role="store"><DashboardLayout><PickupRequest /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/admin/stores" element={<ProtectedRoute role="admin"><DashboardLayout><ManageStores /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/admin/submissions" element={<ProtectedRoute role="admin"><DashboardLayout><Submissions /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/admin/logistics" element={<ProtectedRoute role="admin"><DashboardLayout><Logistics /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/admin/rewards" element={<ProtectedRoute role="admin"><DashboardLayout><ManageRewards /></DashboardLayout></ProtectedRoute>} />
                                <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
