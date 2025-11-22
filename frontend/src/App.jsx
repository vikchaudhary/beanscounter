import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { POList } from './components/POList';
import { PODetails } from './components/PODetails';
import { FileViewer } from './components/FileViewer';

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

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <POList
                pos={pos}
                selectedPO={selectedPO}
                onSelectPO={handleSelectPO}
                onOpenFolder={handleOpenFolder}
            />
            <PODetails
                po={selectedPO}
                onExtract={handleExtract}
                isExtracting={isExtracting}
                extractedData={extractedData}
            />
            <FileViewer fileUrl={selectedPO ? `/api/invoices/pos/${selectedPO.filename}/file` : null} />
        </div>
    );
}

export default App;
