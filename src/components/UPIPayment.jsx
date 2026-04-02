import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UPIPayment = ({ amount, upiId = "9006145808-3@ybl" }) => {
  const [showQR, setShowQR] = useState(false);
  const upiUri = `upi://pay?pa=${upiId}&pn=Tripzo&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Top-up Wallet</h3>
      <p style={{ color: 'var(--text-muted)' }}>Amount: ₹{amount}</p>
      
      {!showQR ? (
        <button onClick={() => setShowQR(true)} className="btn-primary">Generate UPI QR</button>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <img src={qrUrl} alt="UPI QR Code" style={{ borderRadius: '8px', border: '8px solid white' }} />
          <p style={{ marginTop: '10px', fontSize: '0.8rem' }}>Scan with any UPI App (GPay, PhonePe, etc.)</p>
          <button onClick={() => setShowQR(false)} className="btn-secondary" style={{ marginTop: '10px' }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UPIPayment;
