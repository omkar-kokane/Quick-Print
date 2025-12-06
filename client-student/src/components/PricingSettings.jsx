import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Settings, Save, Loader2, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const PricingSettings = ({ shopId = 2, onClose }) => {
    const [pricing, setPricing] = useState({
        bw_single_price: 1.00,
        bw_duplex_price: 0.80,
        color_single_price: 5.00,
        color_duplex_price: 4.00,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchPricing();
    }, [shopId]);

    const fetchPricing = async () => {
        try {
            const res = await api.get(`/pricing/shop/${shopId}`);
            setPricing(res.data);
        } catch (error) {
            console.error("Error fetching pricing:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/pricing/shop/${shopId}`, pricing);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Error saving pricing:", error);
            alert("Failed to save pricing");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setPricing(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 max-w-lg mx-auto"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl shadow-lg">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Pricing Settings</h2>
                    <p className="text-slate-500">Configure per-page rates</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* B&W Pricing */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-slate-400 rounded-full"></span>
                        Black & White
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <PriceInput
                            label="Single-sided"
                            value={pricing.bw_single_price}
                            onChange={(v) => handleChange('bw_single_price', v)}
                        />
                        <PriceInput
                            label="Duplex"
                            value={pricing.bw_duplex_price}
                            onChange={(v) => handleChange('bw_duplex_price', v)}
                        />
                    </div>
                </div>

                {/* Color Pricing */}
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-5 border border-rose-100">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"></span>
                        Color
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <PriceInput
                            label="Single-sided"
                            value={pricing.color_single_price}
                            onChange={(v) => handleChange('color_single_price', v)}
                        />
                        <PriceInput
                            label="Duplex"
                            value={pricing.color_duplex_price}
                            onChange={(v) => handleChange('color_duplex_price', v)}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                        "flex-1 py-3 px-5 font-medium rounded-xl transition-all flex items-center justify-center gap-2",
                        saved
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-900 hover:bg-primary-600 text-white shadow-lg"
                    )}
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saved ? (
                        <>✓ Saved</>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

const PriceInput = ({ label, value, onChange }) => (
    <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 block">
            {label}
        </label>
        <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
        </div>
    </div>
);

export default PricingSettings;
