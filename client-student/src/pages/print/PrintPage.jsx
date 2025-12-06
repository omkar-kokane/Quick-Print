import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { Upload, FileText, Copy, Layers, Palette, Loader2, Sparkles, Zap, Calculator, ShoppingCart, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const PrintPage = () => {
    // Cart state
    const [cartItems, setCartItems] = useState([]);

    // Current file being configured
    const [currentFile, setCurrentFile] = useState(null);
    const [currentFileUrl, setCurrentFileUrl] = useState(null);
    const [currentPageCount, setCurrentPageCount] = useState(1);
    const [config, setConfig] = useState({
        copies: 1,
        is_color: false,
        is_duplex: false,
        orientation: 'PORTRAIT'
    });

    const [pricing, setPricing] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const res = await api.get('/pricing/shop/2');
            setPricing(res.data);
        } catch (error) {
            console.error("Error fetching pricing:", error);
        }
    };

    const uploadFile = async (selectedFile) => {
        setProcessing(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadRes = await api.post('/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setCurrentFileUrl(uploadRes.data.url);
            setCurrentPageCount(uploadRes.data.page_count || 1);
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadError("Failed to process file. Please try again.");
            // Do NOT clear currentFile so user can see the error
        } finally {
            setProcessing(false);
        }
    };

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
                setCurrentFile(droppedFile);
                uploadFile(droppedFile);
            } else {
                alert("Only PDF files are supported.");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setCurrentFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const calculateItemPrice = (pageCount, copies, is_color, is_duplex) => {
        if (!pricing) return 0;
        let rate = 0;
        if (is_color) {
            rate = is_duplex ? parseFloat(pricing.color_duplex_price) : parseFloat(pricing.color_single_price);
        } else {
            rate = is_duplex ? parseFloat(pricing.bw_duplex_price) : parseFloat(pricing.bw_single_price);
        }
        return rate * pageCount * copies;
    };

    const calculateCurrentPrice = () => {
        return calculateItemPrice(currentPageCount, config.copies, config.is_color, config.is_duplex).toFixed(2);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    const addToCart = () => {
        if (!currentFile || !currentFileUrl) return;

        const price = calculateItemPrice(currentPageCount, config.copies, config.is_color, config.is_duplex);

        const newItem = {
            id: Date.now(), // Temporary ID for cart management
            file_url: currentFileUrl,
            file_name: currentFile.name,
            page_count: currentPageCount,
            copies: config.copies,
            is_color: config.is_color,
            is_duplex: config.is_duplex,
            orientation: config.orientation,
            price: price
        };

        setCartItems([...cartItems, newItem]);

        // Reset for next file
        setCurrentFile(null);
        setCurrentFileUrl(null);
        setCurrentPageCount(1);
        setConfig({
            copies: 1,
            is_color: false,
            is_duplex: false,
            orientation: 'PORTRAIT'
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const handleSubmitOrder = async () => {
        if (cartItems.length === 0) return;
        setSubmitting(true);
        try {
            const orderData = {
                user_id: 1,
                shop_id: 2,
                items: cartItems.map(item => ({
                    file_url: item.file_url,
                    file_name: item.file_name,
                    page_count: item.page_count,
                    copies: item.copies,
                    is_color: item.is_color,
                    is_duplex: item.is_duplex,
                    orientation: item.orientation
                }))
            };

            await api.post('/orders/', orderData);
            alert('Order placed successfully!');
            setCartItems([]);
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Failed to place order.');
        } finally {
            setSubmitting(false);
        }
    };

    const totalPages = cartItems.reduce((sum, item) => sum + (item.page_count * item.copies), 0);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Upload Section - 3 columns */}
                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                            <div className="p-6 pb-0 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 text-white shadow-lg mb-4">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight mb-1">
                                    Add Files to Print
                                </h1>
                                <p className="text-slate-500">Upload PDFs, configure settings, add to cart</p>
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {!currentFile ? (
                                        <motion.div
                                            key="upload"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={cn(
                                                "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer",
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
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-7 h-7 text-slate-400" />
                                            </div>
                                            <p className="text-lg font-semibold text-slate-900 mb-1">Drop PDF here</p>
                                            <p className="text-slate-500 text-sm">or click to browse</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="config"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-5"
                                        >
                                            {/* File Info */}
                                            <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">{currentFile.name}</p>
                                                    <p className={cn("text-xs", uploadError ? "text-red-500 font-medium" : "text-slate-500")}>
                                                        {uploadError || (processing ? "Processing..." : `${currentPageCount} Pages`)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => { setCurrentFile(null); setCurrentFileUrl(null); setUploadError(null); }}
                                                    className="p-1 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Config */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Copies</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={config.copies}
                                                        onChange={(e) => setConfig({ ...config, copies: parseInt(e.target.value) || 1 })}
                                                        className="w-full bg-slate-50 border-none rounded-lg p-3 font-semibold focus:ring-2 focus:ring-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Orientation</label>
                                                    <select
                                                        value={config.orientation}
                                                        onChange={(e) => setConfig({ ...config, orientation: e.target.value })}
                                                        className="w-full bg-slate-50 border-none rounded-lg p-3 font-semibold focus:ring-2 focus:ring-primary-500"
                                                    >
                                                        <option value="PORTRAIT">Portrait</option>
                                                        <option value="LANDSCAPE">Landscape</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <label className={cn(
                                                    "cursor-pointer p-3 rounded-xl border-2 transition-all text-center",
                                                    config.is_color ? "border-primary-500 bg-primary-50" : "border-slate-100 hover:border-primary-200"
                                                )}>
                                                    <input
                                                        type="checkbox"
                                                        checked={config.is_color}
                                                        onChange={(e) => setConfig({ ...config, is_color: e.target.checked })}
                                                        className="hidden"
                                                    />
                                                    <Palette className={cn("w-5 h-5 mx-auto mb-1", config.is_color ? "text-primary-600" : "text-slate-400")} />
                                                    <span className={cn("text-sm font-medium", config.is_color ? "text-primary-700" : "text-slate-600")}>Color</span>
                                                </label>

                                                <label className={cn(
                                                    "cursor-pointer p-3 rounded-xl border-2 transition-all text-center",
                                                    config.is_duplex ? "border-primary-500 bg-primary-50" : "border-slate-100 hover:border-primary-200"
                                                )}>
                                                    <input
                                                        type="checkbox"
                                                        checked={config.is_duplex}
                                                        onChange={(e) => setConfig({ ...config, is_duplex: e.target.checked })}
                                                        className="hidden"
                                                    />
                                                    <Layers className={cn("w-5 h-5 mx-auto mb-1", config.is_duplex ? "text-primary-600" : "text-slate-400")} />
                                                    <span className={cn("text-sm font-medium", config.is_duplex ? "text-primary-700" : "text-slate-600")}>Duplex</span>
                                                </label>
                                            </div>

                                            {/* Price + Add to Cart */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-slate-900 rounded-xl p-4 text-white flex justify-between items-center">
                                                    <span className="text-sm text-slate-400">Item Price</span>
                                                    <span className="text-xl font-bold">₹{calculateCurrentPrice()}</span>
                                                </div>
                                                <button
                                                    onClick={addToCart}
                                                    disabled={processing || !currentFileUrl}
                                                    className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-primary-500 hover:to-purple-500 disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    Add
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Cart Section - 2 columns */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 h-full flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-primary-600" />
                                <h2 className="font-bold text-lg text-slate-900">Cart</h2>
                                <span className="ml-auto bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {cartItems.length} files
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-4 space-y-2">
                            <AnimatePresence>
                                {cartItems.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-10 text-slate-400"
                                    >
                                        <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Cart is empty</p>
                                        <p className="text-xs">Add files to print</p>
                                    </motion.div>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-slate-50 rounded-xl p-3 flex items-start gap-2"
                                        >
                                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 text-sm truncate">{item.file_name}</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 rounded text-slate-600">
                                                        {item.page_count}pg × {item.copies}
                                                    </span>
                                                    <span className={cn(
                                                        "text-[10px] px-1.5 py-0.5 rounded",
                                                        item.is_color ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-600"
                                                    )}>
                                                        {item.is_color ? "Color" : "B&W"}
                                                    </span>
                                                    {item.is_duplex && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                            Duplex
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 text-sm">₹{item.price.toFixed(2)}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-400 hover:text-red-600 mt-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="p-4 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total Pages</span>
                                    <span className="font-semibold text-slate-900">{totalPages}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Total Amount</span>
                                    <span className="text-2xl font-bold text-slate-900">₹{calculateCartTotal()}</span>
                                </div>
                                <button
                                    onClick={handleSubmitOrder}
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-primary-500 hover:to-purple-500 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Place Order • ₹{calculateCartTotal()}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PrintPage;
