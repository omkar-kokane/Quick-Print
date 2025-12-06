import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ children, color }) => {
    const colors = {
        rose: "bg-rose-100 text-rose-700",
        slate: "bg-slate-100 text-slate-600",
        indigo: "bg-indigo-100 text-indigo-700",
        blue: "bg-blue-100 text-blue-700",
        emerald: "bg-emerald-100 text-emerald-700",
        purple: "bg-purple-100 text-purple-700",
    };

    return (
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", colors[color])}>
            {children}
        </span>
    );
};

export default Badge;
