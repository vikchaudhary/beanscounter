import React, { useState, useEffect } from 'react';
import { POList } from './components/POList';
import { POMainView } from './components/POMainView';

function App() {
    const [pos, setPos] = useState([]);
    const [selectedPO, setSelectedPO] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractedData, setExtractedData] = useState(null);

    useEffect(() => {
        fetchPOs();
    }, []);

    const fetchPOs = async () => {
        try {
            const response = await fetch('/api/invoices/pos');
            if (response.ok) {
                const data = await response.json();
                setPos(data);
            }
        } catch (error) {
            console.error('Failed to fetch POs:', error);
        }
    };

    const handleSelectPO = (po) => {
        setSelectedPO(po);
        setExtractedData(null); // Reset extracted data when switching POs
        handleExtract(po); // Automatically extract data
    };

    const handleExtract = async (po) => {
        setIsExtracting(true);
        try {
            const response = await fetch(`/api/invoices/pos/${po.filename}/parse`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                setExtractedData(data);
            }
        } catch (error) {
            console.error('Failed to extract data:', error);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleOpenFolder = async () => {
        try {
            await fetch('/api/invoices/pos/open-folder', { method: 'POST' });
        } catch (error) {
            console.error('Failed to open folder:', error);
        }
    };

    const handleClosePO = () => {
        setSelectedPO(null);
        setExtractedData(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
            {/* Global Header */}
            <div style={{
                height: '60px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 24px',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>PO to Invoice Converter</h1>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Manage purchase orders and generate invoices</p>
                    </div>
                </div>
                <button
                    onClick={handleOpenFolder}
                    style={{
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Open POs
                </button>
            </div>

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <POList
                    pos={pos}
                    selectedPO={selectedPO}
                    onSelectPO={handleSelectPO}
                    onOpenFolder={handleOpenFolder}
                />
                <POMainView
                    po={selectedPO}
                    onExtract={handleExtract}
                    isExtracting={isExtracting}
                    extractedData={extractedData}
                    onClose={handleClosePO}
                />
            </div>
        </div>
    );
}

export default App;
