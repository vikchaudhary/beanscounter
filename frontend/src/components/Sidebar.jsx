import React from 'react';
import { FileText, Settings, Home } from 'lucide-react';

export function Sidebar() {
    return (
        <div style={{
            width: '60px',
            height: '100vh',
            backgroundColor: '#1a1a1a',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '20px',
            gap: '20px'
        }}>
            <div style={{ padding: '10px', cursor: 'pointer' }} title="Dashboard">
                <Home size={24} color="#fff" />
            </div>
            <div style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#333', borderRadius: '8px' }} title="Purchase Orders">
                <FileText size={24} color="#4a9eff" />
            </div>
            <div style={{ marginTop: 'auto', padding: '20px', cursor: 'pointer' }} title="Settings">
                <Settings size={24} color="#666" />
            </div>
        </div>
    );
}
