import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }} className="u-py-60">
      <div className="u-container">
        <div className="u-grid u-grid-3 u-stack-mobile" style={{ gap: '40px' }}>
          <div style={{ flex: '1.5' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>Tripzo</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px', maxWidth: '400px' }}>
              Revolutionizing urban mobility with smart, reliable, and secure rides. Experience the future of city transit today.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>About Us</Link>
              <Link to="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Services</Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Contact</Link>
            </div>
          </div>

          <div>
             <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600' }}>Solutions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Rider App</Link>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Captain App</Link>
              <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Package Delivery</Link>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '60px', paddingTop: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
           &copy; {new Date().getFullYear()} Tripzo Technologies Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
