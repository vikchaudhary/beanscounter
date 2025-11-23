import React from 'react';
import { FileText } from 'lucide-react';

export function FileViewer({ fileUrl }) {
    if (!fileUrl) {
        return (
            <div style={{
                flex: 1,
                height: '100%',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                margin: '24px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
            }}>
                <FileText size={48} strokeWidth={1.5} style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>Document preview not available</h3>
                <p style={{ fontSize: '13px' }}>Original document stored in: PDF format</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, height: '100%', backgroundColor: '#f3f4f6', padding: '24px' }}>
            <div style={{
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <iframe
                    src={fileUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="PDF Viewer"
                />
            </div>
        </div>
    );
}
