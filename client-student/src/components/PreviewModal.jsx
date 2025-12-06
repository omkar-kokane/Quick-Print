import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PreviewModal = ({ isOpen, onClose, fileUrl, fileName }) => {
    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        window.open(fileUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-white/50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 truncate max-w-[200px] md:max-w-[400px]">
                                        {fileName}
                                    </h3>
                                    <p className="text-xs text-slate-500">PDF Preview</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleOpenInNewTab}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                                    title="Download"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-red-50 rounded-xl transition-colors text-slate-600 hover:text-red-600"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-1 bg-slate-100 p-4">
                            <iframe
                                src={fileUrl}
                                className="w-full h-full rounded-xl border border-slate-200 bg-white"
                                title={fileName}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PreviewModal;
