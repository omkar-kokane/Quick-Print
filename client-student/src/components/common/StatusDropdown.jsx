import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const StatusDropdown = ({ status, onChange }) => {
    const [open, setOpen] = useState(false);

    const statuses = [
        { value: 'PENDING', label: 'Pending', color: 'amber' },
        { value: 'PROCESSING', label: 'Processing', color: 'blue' },
        { value: 'COMPLETED', label: 'Completed', color: 'emerald' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
    ];

    const currentStatus = statuses.find(s => s.value === status);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 transition-all",
                    status === 'PENDING' && "bg-amber-100/50 text-amber-700 border-amber-200 hover:bg-amber-100",
                    status === 'PROCESSING' && "bg-blue-100/50 text-blue-700 border-blue-200 hover:bg-blue-100",
                    status === 'COMPLETED' && "bg-emerald-100/50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
                    status === 'CANCELLED' && "bg-red-100/50 text-red-700 border-red-200 hover:bg-red-100"
                )}
            >
                {currentStatus?.label || status}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 min-w-[140px]">
                        {statuses.map(s => (
                            <button
                                key={s.value}
                                onClick={() => { onChange(s.value); setOpen(false); }}
                                className={cn(
                                    "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2",
                                    status === s.value && "bg-slate-50 font-medium"
                                )}
                            >
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    s.color === 'amber' && "bg-amber-500",
                                    s.color === 'blue' && "bg-blue-500",
                                    s.color === 'emerald' && "bg-emerald-500",
                                    s.color === 'red' && "bg-red-500"
                                )}></span>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StatusDropdown;
