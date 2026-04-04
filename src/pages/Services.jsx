import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Shield, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="u-py-100 u-container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="u-title-mobile" style={{ color: 'var(--primary)', marginBottom: '16px' }}>Our Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            We provide a comprehensive range of mobility solutions tailored to your modern lifestyle. Fast, safe, and reliable.
          </p>
        </div>

        <div className="u-grid u-grid-2" style={{ gap: '30px', marginBottom: '60px' }}>
          {/* Using grid-2 for tablet/desktop split, which is standardized in index.css to stack on mobile */}
          
          <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Car size={36} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>City Rides</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Quick, affordable, and reliable rides for your daily commute inside the city. Available 24/7 with our vast network of Captains.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <MapPin size={36} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Intercity Travel</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Comfortable outstation trips with verified professional drivers. Book round trips or one-way drops easily with transparent pricing.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center' }}>
             <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Zap size={36} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Package Delivery</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Fast and secure parcel delivery across the city. Track your packages in real-time from pickup to drop-off with OTP verification.
            </p>
          </div>
          
           <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center' }}>
             <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Shield size={36} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Corporate Fleet</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Dedicated transportation solutions for businesses. Manage employee rides, logs, and billing with a single unified dashboard.
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Link to="/book-ride" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: 'auto', padding: '16px 48px', fontSize: '1.1rem' }}>
              Experience Tripzo Now
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;
