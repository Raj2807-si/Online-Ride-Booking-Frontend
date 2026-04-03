import React from 'react';
import { Calendar, MapPin, Clock, CreditCard, Star } from 'lucide-react';

const RideHistory = ({ rides, title = "Ride History" }) => {
  if (!rides || rides.length === 0) {
    return (
      <div className="glass-panel" style={{ 
        padding: '50px 30px', 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontSize: '3rem', opacity: 0.5 }}>📭</div>
        <div style={{ fontWeight: '600', color: 'white' }}>No Trip History Yet</div>
        <p style={{ fontSize: '0.85rem', maxWidth: '250px', margin: '0 auto' }}>
          When you complete your first journey with Tripzo, your details will be stored here safely.
        </p>
      </div>
    );
  }

  return (
    <div className="history-section">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Calendar size={20} /> {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {rides.map((ride) => (
          <div key={ride._id} className="glass-panel" style={{ padding: '20px', transition: 'transform 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ 
                  padding: '8px', 
                  background: 'rgba(255,193,7,0.1)', 
                  borderRadius: '10px',
                  color: 'var(--primary)'
                }}>
                  <Clock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(ride.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{ride.fare}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    background: ride.status === 'completed' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: ride.status === 'completed' ? '#4ade80' : '#f87171',
                    display: 'inline-block'
                  }}>
                    {ride.status.toUpperCase()}
                  </span>
                  {ride.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--primary)' }}>
                      <Star size={14} fill="var(--primary)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{ride.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={16} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem' }}>{ride.pickup}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem' }}>{ride.destination}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CreditCard size={14} />
                Paid via {ride.paymentMethod?.toUpperCase() || 'WALLET'}
              </div>
              <div>Status: <span style={{ color: 'white' }}>{ride.status.toUpperCase()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideHistory;
