import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UPIPayment = ({ amount, upiId = "9006145808-3@ybl", onPaymentSuccess }) => {
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  
  const upiUri = `upi://pay?pa=${upiId}&pn=Tripzo&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/users/wallet/topup`, {
        amount: Number(amount),
        referenceId: 'SIM-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Payment Simulated Successfully!');
      if (onPaymentSuccess) onPaymentSuccess();
      setShowQR(false);
    } catch (error) {
      alert('Error simulating payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h3 style={{ marginBottom: '12px' }}>Top-up Wallet</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Amount to Add: <strong style={{ color: 'var(--primary)' }}>₹{amount}</strong></p>
      
      {!showQR ? (
        <button onClick={() => setShowQR(true)} className="btn-primary" style={{ width: '100%' }}>Generate UPI QR</button>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '10px', background: 'white', borderRadius: '12px' }}>
            <img src={qrUrl} alt="UPI QR Code" style={{ width: '200px', height: '200px' }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan with GPay, PhonePe, or Paytm</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '10px' }}>
            <button 
                onClick={handleSimulatePayment} 
                disabled={loading} 
                className="btn-primary" 
                style={{ fontSize: '0.85rem', padding: '10px 0', background: '#22c55e', borderColor: '#22c55e' }}
            >
                {loading ? 'Processing...' : 'Simulate Success'}
            </button>
            <button 
                onClick={() => setShowQR(false)} 
                className="glass-panel" 
                style={{ fontSize: '0.85rem', padding: '10px 0', cursor: 'pointer' }}
            >
                Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPIPayment;
