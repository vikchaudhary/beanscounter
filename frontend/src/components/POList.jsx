import React from 'react';
import { FileText, ChevronRight, FolderOpen } from 'lucide-react';

export function POList({ pos, selectedPO, onSelectPO, onOpenFolder }) {
    return (
        <div style={{
            width: '300px',
            height: '100vh',
            backgroundColor: '#242424',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Purchase Orders</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>{pos.length} documents found</p>
                </div>
                <button
                    onClick={onOpenFolder}
                    title="Open Folder"
                    style={{
                        background: 'transparent',
                        border: '1px solid #444',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#888',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FolderOpen size={16} />
                </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
                {pos.map((po) => (
                    <div
                        key={po.id}
                        onClick={() => onSelectPO(po)}
                        style={{
                            padding: '15px 20px',
                            borderBottom: '1px solid #2a2a2a',
                            cursor: 'pointer',
                            backgroundColor: selectedPO?.id === po.id ? '#2a2a2a' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileText size={16} color="#888" />
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{po.filename}</div>
                                <div style={{ color: '#666', fontSize: '12px' }}>{po.date || 'Unknown Date'}</div>
                            </div>
                        </div>
                        {selectedPO?.id === po.id && <ChevronRight size={16} color="#4a9eff" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
