import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import Card from '../../components/ui/Card'
import { TrendingUp, Activity, Package, Battery, Globe, Zap } from 'lucide-react'
import Badge from '../../components/ui/Badge'

const Analytics = () => {
    const lineData = [
        { name: 'Mon', count: 400 },
        { name: 'Tue', count: 300 },
        { name: 'Wed', count: 600 },
        { name: 'Thu', count: 800 },
        { name: 'Fri', count: 700 },
        { name: 'Sat', count: 900 },
        { name: 'Sun', count: 1200 },
    ]

    const pieData = [
        { name: 'AA', value: 400 },
        { name: 'AAA', value: 300 },
        { name: 'Li-ion', value: 300 },
        { name: '9V', value: 200 },
    ]

    const COLORS = ['#16a34a', '#fbbf24', '#3b82f6', '#ef4444']

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <h1 className="text-4xl font-bold font-display italic tracking-tight text-white leading-none">Environmental Data Intelligence</h1>
                <div className="flex items-center gap-4">
                    <Badge variant="success" className="px-4 py-1.5 uppercase tracking-[2px] text-[8px] bg-primary/10 border border-primary/20 text-primary-light">Live Dataset</Badge>
                    <Zap className="w-5 h-5 text-accent animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="h-[450px] p-10 bg-slate-900/40 border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                    <h3 className="text-xl font-bold mb-10 font-display italic tracking-tight text-white flex items-center gap-4 outline-none">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Daily Signal Density Volume
                    </h3>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `${v}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        backdropBlur: '12px'
                                    }}
                                    itemStyle={{ color: '#16a34a' }}
                                    cursor={{ stroke: '#16a34a', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#16a34a"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 8, strokeWidth: 0, shadow: '0 0 20px rgba(22,163,74,0.5)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="h-[450px] p-10 bg-slate-900/40 border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-700" />
                    <h3 className="text-xl font-bold mb-10 w-full font-display italic tracking-tight text-white flex items-center gap-4 outline-none">
                        <Activity className="w-6 h-6 text-accent" />
                        Battery Species Distribution
                    </h3>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#0f172a',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-4 gap-8 w-full max-w-sm mt-6">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { label: 'System Efficiency', value: '94.2%', change: '+2.1%', icon: Globe, color: 'text-primary' },
                    { label: 'Avg Return/Store', value: '124', change: 'Peak Traffic', icon: Package, color: 'text-accent' },
                    { label: 'Points Velocity', value: '1.4M', change: 'High Burn', icon: Zap, color: 'text-blue-400' }
                ].map((kpi, i) => (
                    <Card key={i} className="bg-slate-900/30 border-white/5 p-10 flex flex-col items-center text-center group relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                            <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                        </div>
                        <p className="text-slate-500 uppercase font-bold text-[10px] tracking-[3px] mb-2 italic leading-none">{kpi.label}</p>
                        <h4 className="text-4xl font-bold font-display text-white italic tracking-tighter leading-none mb-3 tabular-nums">{kpi.value}</h4>
                        <p className={`${kpi.color} text-[10px] font-bold uppercase tracking-widest italic`}>{kpi.change}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Analytics

