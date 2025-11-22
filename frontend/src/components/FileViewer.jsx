import React from 'react';

export function FileViewer({ fileUrl }) {
    if (!fileUrl) {
        return (
            <div style={{
                width: '50%',
                height: '100vh',
                backgroundColor: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#444'
            }}>
                No file selected
            </div>
        );
    }

    return (
        <div style={{ width: '50%', height: '100vh', backgroundColor: '#111', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', color: '#888', fontSize: '12px' }}>
                Source File Preview
            </div>
            <iframe
                src={fileUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="PDF Viewer"
            />
        </div>
    );
}
