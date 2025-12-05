import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import printJS from 'print-js';
import { Printer, Clock, FileText, Search, Check, CheckCircle2, Eye, ArrowUpDown, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import PreviewModal from './PreviewModal';
import PricingSettings from './PricingSettings';

const ShopDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewFile, setPreviewFile] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [showPricing, setShowPricing] = useState(false);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/shop/2');
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (url) => {
        printJS(url);
    };

    const handlePreview = (url, fileName) => {
        setPreviewFile({ url, fileName });
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleItemPrinted = async (itemId) => {
        try {
            await api.patch(`/orders/items/${itemId}/status`, { status: 'PRINTED' });
            fetchOrders();
        } catch (error) {
            console.error("Error updating item status:", error);
        }
    };

    // Filter and sort orders
    const processedOrders = useMemo(() => {
        let result = orders.filter(order => {
            const matchesFilter = filter === 'ALL' || order.status === filter;
            const matchesSearch = searchQuery === '' ||
                order.id.toString().includes(searchQuery) ||
                order.items.some(item => item.file_name.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesFilter && matchesSearch;
        });

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'amount-high':
                result.sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount));
                break;
            case 'amount-low':
                result.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
                break;
        }

        return result;
    }, [orders, filter, searchQuery, sortBy]);

    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    const completedCount = orders.filter(o => o.status === 'COMPLETED').length;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Preview Modal */}
            <PreviewModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile?.url}
                fileName={previewFile?.fileName}
            />

            {/* Pricing Modal */}
            {showPricing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPricing(false)}></div>
                    <div className="relative z-10">
                        <PricingSettings shopId={2} onClose={() => setShowPricing(false)} />
                    </div>
                </div>
            )}

            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Command Center</h1>
                    <p className="text-slate-500 mt-2 text-lg">Live print queue monitoring.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm w-48"
                        />
                    </div>
                    <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                    <button
                        onClick={() => setShowPricing(true)}
                        className="p-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full hover:bg-white transition-colors shadow-sm"
                        title="Pricing Settings"
                    >
                        <Settings className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50/80 backdrop-blur-md px-3 py-2 rounded-full border border-emerald-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <FilterTab active={filter === 'ALL'} onClick={() => setFilter('ALL')} count={orders.length}>
                    All Orders
                </FilterTab>
                <FilterTab active={filter === 'PENDING'} onClick={() => setFilter('PENDING')} count={pendingCount} color="amber">
                    Pending
                </FilterTab>
                <FilterTab active={filter === 'COMPLETED'} onClick={() => setFilter('COMPLETED')} count={completedCount} color="emerald">
                    Completed
                </FilterTab>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {processedOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={cn(
                                "absolute top-0 left-0 w-full h-1",
                                order.status === 'COMPLETED'
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                    : order.status === 'PROCESSING'
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                            )}></div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                                        <p className="text-2xl font-bold text-slate-900">#{order.id}</p>
                                    </div>
                                    <StatusDropdown
                                        status={order.status}
                                        onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    {order.items.map(item => (
                                        <div key={item.id} className="bg-white/50 rounded-2xl p-4 border border-white/50">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    item.status === 'PRINTED'
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-primary-50 text-primary-600"
                                                )}>
                                                    {item.status === 'PRINTED' ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">{item.file_name}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        <Badge color={item.is_color ? "rose" : "slate"}>
                                                            {item.is_color ? "Color" : "B&W"}
                                                        </Badge>
                                                        <Badge color="indigo">{item.copies}x</Badge>
                                                        <Badge color="blue">{item.is_duplex ? "Duplex" : "Single"}</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePreview(item.file_url, item.file_name)}
                                                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-medium transition-all active:scale-95 text-sm"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handlePrint(item.file_url)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-primary-600 text-white py-2 rounded-xl font-medium transition-all shadow-lg shadow-slate-900/10 active:scale-95 text-sm"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                    Print
                                                </button>
                                                {item.status !== 'PRINTED' && (
                                                    <button
                                                        onClick={() => handleItemPrinted(item.id)}
                                                        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl font-medium transition-all active:scale-95 text-sm"
                                                        title="Mark as Printed"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50/50 border-t border-white/50 flex justify-between items-center text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="font-semibold text-slate-900">
                                    ₹{order.total_amount}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {processedOrders.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50">
                        <Printer className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-600">
                        {filter === 'ALL' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
                    </h3>
                    <p>Orders will appear here when placed.</p>
                </div>
            )}
        </div>
    );
};

const SortDropdown = ({ sortBy, onSortChange }) => {
    const [open, setOpen] = useState(false);

    const options = [
        { value: 'newest', label: 'Newest First', icon: ArrowDown },
        { value: 'oldest', label: 'Oldest First', icon: ArrowUp },
        { value: 'amount-high', label: 'Amount: High to Low', icon: ArrowDown },
        { value: 'amount-low', label: 'Amount: Low to High', icon: ArrowUp },
    ];

    const current = options.find(o => o.value === sortBy);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-full text-sm text-slate-600 hover:bg-white transition-colors shadow-sm"
            >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">{current?.label}</span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 min-w-[180px]">
                        {options.map(option => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => { onSortChange(option.value); setOpen(false); }}
                                    className={cn(
                                        "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2",
                                        sortBy === option.value && "bg-slate-50 font-medium"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const FilterTab = ({ children, active, onClick, count, color = 'slate' }) => (
    <button
        onClick={onClick}
        className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            active
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white/50 text-slate-600 hover:bg-white/80 border border-white/60"
        )}
    >
        {children}
        <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            active ? "bg-white/20" : `bg-${color}-100 text-${color}-700`
        )}>
            {count}
        </span>
    </button>
);

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

const Badge = ({ children, color }) => {
    const colors = {
        rose: "bg-rose-100 text-rose-700",
        slate: "bg-slate-100 text-slate-600",
        indigo: "bg-indigo-100 text-indigo-700",
        blue: "bg-blue-100 text-blue-700",
        emerald: "bg-emerald-100 text-emerald-700",
    };

    return (
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", colors[color])}>
            {children}
        </span>
    );
};

export default ShopDashboard;
