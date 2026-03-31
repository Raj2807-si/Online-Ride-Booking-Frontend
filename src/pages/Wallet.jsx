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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Wallet</h2>
      
      <div className="u-grid u-grid-2" style={{ marginBottom: '30px' }}>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Current Balance</p>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '0' }}>₹{balance}</h1>
        </div>
        
        <UPIPayment amount="500" />
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>Transaction History</h3>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.length === 0 ? <p>No transactions yet.</p> : transactions.map(t => (
              <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{t.description}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <p style={{ color: t.transactionType === 'topup' ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
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
