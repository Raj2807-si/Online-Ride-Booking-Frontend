import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import UPIPayment from '../components/UPIPayment';

const Wallet = () => {
  const { token, user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('500');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const balanceRes = await axios.get(`${API_BASE_URL}/api/users/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const transRes = await axios.get(`${API_BASE_URL}/api/users/wallet/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(balanceRes.data.balance);
      setTransactions(transRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data', error);
      setLoading(false);
    }
  };

  return (
    <div className="u-container u-py-80" style={{ minHeight: '100vh' }}>
      <h2 className="u-title-mobile" style={{ marginBottom: '32px', fontWeight: 'bold' }}>Your Wallet</h2>
      
      <div className="u-grid u-grid-2" style={{ marginBottom: '40px', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '1rem' }}>Current Balance</p>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '0', fontWeight: '800' }}>₹{balance}</h1>
        </div>
        
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Top-up Wallet</h3>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label className="input-label" style={{ fontSize: '0.85rem' }}>Amount (₹)</label>
            <input 
              type="number" 
              className="input-field" 
              value={topupAmount} 
              onChange={(e) => setTopupAmount(e.target.value)}
              min="10"
              placeholder="Enter amount"
              style={{ fontSize: '1.1rem', padding: '14px' }}
            />
          </div>
          <UPIPayment amount={topupAmount} upiId="9006145808-3@ybl" />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '1.2rem', paddingLeft: '8px' }}>Transaction History</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading transactions...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No transactions yet.</p>
            ) : transactions.map(t => (
              <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()} • {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <p style={{ color: t.transactionType === 'topup' ? '#4ade80' : '#f87171', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0, paddingLeft: '15px' }}>
                  {t.transactionType === 'topup' ? '+' : '-'} ₹{t.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
