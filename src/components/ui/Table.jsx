import React from 'react'

const Table = ({ headers, children }) => {
    return (
        <div className="w-full overflow-x-auto glass-card p-0 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 border-b border-slate-800">
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {children}
                </tbody>
            </table>
        </div>
    )
}

export default Table
