import React, { useState, useRef } from 'react';
import api from '../services/api';
import { Upload, FileText, Check, Copy, Layers, Palette, Loader2, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [config, setConfig] = useState({
        copies: 1,
        is_color: false,
        is_duplex: false,
        orientation: 'PORTRAIT'
    });
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                alert("Only PDF files are supported.");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await api.post('/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = uploadRes.data.url;

            const orderData = {
                user_id: 1,
                shop_id: 2,
                items: [{
                    file_url: url,
                    file_name: file.name,
                    page_count: 1,  // Default to 1 page for now
                    ...config
                }]
            };

            await api.post('/orders/', orderData);
            alert('Order placed successfully!');
            setFile(null);
        } catch (error) {
            console.error("Error uploading:", error);
            alert('Failed to place order.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto perspective-1000">
            <motion.div
                initial={{ opacity: 0, rotateX: 10 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative group"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-0 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight mb-2">
                            Supercharge Your Print
                        </h1>
                        <p className="text-slate-500 text-lg">Drop your PDF, we handle the rest.</p>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {!file ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={cn(
                                        "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group/drop",
                                        dragActive
                                            ? "border-primary-500 bg-primary-50/50 scale-[1.02]"
                                            : "border-slate-200 hover:border-primary-400 hover:bg-slate-50/50"
                                    )}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover/drop:scale-110 transition-transform duration-300">
                                        <Upload className="w-8 h-8 text-slate-400 group-hover/drop:text-primary-600 transition-colors" />
                                    </div>
                                    <p className="text-xl font-semibold text-slate-900 mb-2">Drag & drop your file</p>
                                    <p className="text-slate-500">or click to browse</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="config"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 truncate text-lg">{file.name}</p>
                                            <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Copy className="w-4 h-4" /> Copies
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={config.copies}
                                                onChange={(e) => setConfig({ ...config, copies: parseInt(e.target.value) })}
                                                className="w-full bg-slate-50 border-none rounded-xl p-4 text-lg font-semibold focus:ring-2 focus:ring-primary-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <Layers className="w-4 h-4" /> Orientation
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={config.orientation}
                                                    onChange={(e) => setConfig({ ...config, orientation: e.target.value })}
                                                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-lg font-semibold focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                                                >
                                                    <option value="PORTRAIT">Portrait</option>
                                                    <option value="LANDSCAPE">Landscape</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={cn(
                                            "relative overflow-hidden cursor-pointer group p-4 rounded-2xl border-2 transition-all duration-300",
                                            config.is_color
                                                ? "border-primary-500 bg-primary-50/50"
                                                : "border-slate-100 hover:border-primary-200 hover:bg-slate-50"
                                        )}>
                                            <input
                                                type="checkbox"
                                                checked={config.is_color}
                                                onChange={(e) => setConfig({ ...config, is_color: e.target.checked })}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <Palette className={cn("w-6 h-6 transition-colors", config.is_color ? "text-primary-600" : "text-slate-400")} />
                                                <span className={cn("font-semibold transition-colors", config.is_color ? "text-primary-700" : "text-slate-600")}>Color</span>
                                            </div>
                                            {config.is_color && (
                                                <motion.div layoutId="active-ring" className="absolute inset-0 border-2 border-primary-500 rounded-2xl" />
                                            )}
                                        </label>

                                        <label className={cn(
                                            "relative overflow-hidden cursor-pointer group p-4 rounded-2xl border-2 transition-all duration-300",
                                            config.is_duplex
                                                ? "border-primary-500 bg-primary-50/50"
                                                : "border-slate-100 hover:border-primary-200 hover:bg-slate-50"
                                        )}>
                                            <input
                                                type="checkbox"
                                                checked={config.is_duplex}
                                                onChange={(e) => setConfig({ ...config, is_duplex: e.target.checked })}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <Layers className={cn("w-6 h-6 transition-colors", config.is_duplex ? "text-primary-600" : "text-slate-400")} />
                                                <span className={cn("font-semibold transition-colors", config.is_duplex ? "text-primary-700" : "text-slate-600")}>Duplex</span>
                                            </div>
                                            {config.is_duplex && (
                                                <motion.div layoutId="active-ring-2" className="absolute inset-0 border-2 border-primary-500 rounded-2xl" />
                                            )}
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={uploading}
                                        className="w-full relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {uploading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5" />
                                                    Place Order
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FileUpload;
