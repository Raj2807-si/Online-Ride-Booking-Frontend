import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Shield, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="services-container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }}>Our Services</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              We provide a comprehensive range of mobility solutions tailored to your modern lifestyle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            {/* Service 1 */}
            <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Car size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>City Rides</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Quick, affordable, and reliable rides for your daily commute inside the city. Available 24/7 with our vast network of Captains.
              </p>
            </div>

            {/* Service 2 */}
            <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <MapPin size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Intercity Travel</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Comfortable outstation trips with verified professional drivers. Book round trips or one-way drops easily.
              </p>
            </div>

            {/* Service 3 */}
            <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
               <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Zap size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Package Delivery</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Fast and secure parcel delivery across the city. Track your packages in real-time from pickup to drop-off.
              </p>
            </div>
            
            {/* Service 4 */}
             <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
               <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Shield size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Corporate Fleet</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Dedicated transportation solutions for businesses. Manage employee rides and logistics with a single dashboard.
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Link to="/book" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '16px 40px', fontSize: '1.1rem' }}>
                Experience Tripzo Now
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;
