import React, { useState } from 'react';
import { X, FileText, Info, FileInput } from 'lucide-react';
import { FileViewer } from './FileViewer';
import { PODetails } from './PODetails';
import { InvoiceForm } from './InvoiceForm';

export function POMainView({ po, onExtract, isExtracting, extractedData, onClose }) {
    const [activeTab, setActiveTab] = useState('details');

    if (!po) {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
                color: '#6b7280'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <FileText size={32} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}>No Purchase Order Selected</h3>
                <p style={{ fontSize: '14px', marginTop: '4px' }}>Select a document from the list to view details</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff' }}>
            {/* Header */}
            <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        padding: '8px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        color: '#3b82f6'
                    }}>
                        <FileText size={20} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                        {po.filename}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div style={{
                padding: '0 24px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fff'
            }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <Tab
                        label="Document"
                        isActive={activeTab === 'document'}
                        onClick={() => setActiveTab('document')}
                    />
                    <Tab
                        label="Details"
                        isActive={activeTab === 'details'}
                        onClick={() => setActiveTab('details')}
                    />
                    <Tab
                        label="Convert to Invoice"
                        isActive={activeTab === 'invoice'}
                        onClick={() => setActiveTab('invoice')}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                {activeTab === 'document' && (
                    <FileViewer fileUrl={`/api/invoices/pos/${po.filename}/file`} />
                )}
                {activeTab === 'details' && (
                    <PODetails
                        po={po}
                        onExtract={onExtract}
                        isExtracting={isExtracting}
                        extractedData={extractedData}
                    />
                )}
                {activeTab === 'invoice' && (
                    <InvoiceForm po={extractedData || po} />
                )}
            </div>
        </div>
    );
}

function Tab({ label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '16px 4px',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                color: isActive ? '#0f172a' : '#6b7280',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-1px'
            }}
        >
            {label}
        </button>
    );
}
