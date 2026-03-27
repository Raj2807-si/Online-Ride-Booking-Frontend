import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', padding: '60px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>Tripzo</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            Revolutionizing urban mobility with smart, reliable, and secure rides. 
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link>
              <Link to="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Services</Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>
          <div>
             <h4 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Solutions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Rider App</Link>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Captain App</Link>
              <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Package Delivery</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '60px', paddingTop: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
         &copy; {new Date().getFullYear()} Tripzo Technologies Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
