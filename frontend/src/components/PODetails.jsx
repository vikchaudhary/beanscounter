import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

export function PODetails({ po, onExtract, isExtracting, extractedData }) {
    if (!po) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Select a document to view details
            </div>
        );
    }

    return (
        <div style={{
            flex: 1,
            height: '100vh',
            backgroundColor: '#1e1e1e',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #333'
        }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>PO Details</h2>
                <button
                    onClick={() => onExtract(po)}
                    disabled={isExtracting}
                    style={{
                        backgroundColor: '#4a9eff',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: isExtracting ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: isExtracting ? 0.7 : 1
                    }}
                >
                    {isExtracting ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isExtracting ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto' }}>
                {extractedData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Section title="Vendor Information">
                            <Field label="Vendor Name" value={extractedData.vendor_name} />
                            <Field label="Address" value={extractedData.vendor_address} />
                        </Section>

                        <Section title="Invoice Details">
                            <Field label="PO Number" value={extractedData.po_number} />
                            <Field label="Date" value={extractedData.date} />
                            <Field label="Total Amount" value={extractedData.total_amount} highlight />
                        </Section>

                        <Section title="Line Items">
                            {extractedData.line_items?.map((item, i) => (
                                <div key={i} style={{
                                    backgroundColor: '#2a2a2a',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '8px',
                                    fontSize: '13px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: '#fff' }}>{item.description}</span>
                                        <span style={{ color: '#fff', fontWeight: 500 }}>{item.amount}</span>
                                    </div>
                                    <div style={{ color: '#888' }}>Qty: {item.quantity} × {item.unit_price}</div>
                                </div>
                            ))}
                        </Section>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '300px',
                        color: '#666',
                        gap: '10px'
                    }}>
                        <AlertCircle size={32} />
                        <p>No data extracted yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666', letterSpacing: '0.5px', marginBottom: '10px' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {children}
            </div>
        </div>
    );
}

function Field({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
            <span style={{
                fontSize: '14px',
                color: highlight ? '#4a9eff' : '#fff',
                fontWeight: highlight ? 600 : 400
            }}>{value || '-'}</span>
        </div>
    );
}
