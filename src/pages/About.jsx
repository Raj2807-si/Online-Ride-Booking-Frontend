import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <Navbar />
      <div className="u-py-100 u-container">
        
        <div className="u-stack-mobile u-flex" style={{ gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ flex: 1 }}>
            <h1 className="u-title-mobile" style={{ fontWeight: 'bold', marginBottom: '24px' }}>Moving <span style={{ color: 'var(--primary)' }}>Cities</span> Forward</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '24px', maxWidth: '600px' }}>
              Tripzo was founded on a simple belief: transportation should be accessible, seamless, and reliable for everyone. We connect people with professional Captains to make city navigation completely frictionless.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '600px' }}>
              From a single ride-hailing experiment, we've grown into a comprehensive mobility platform powering thousands of trips daily across the region.
            </p>
          </div>
          <div style={{ flex: 1 }} className="u-full-width-mobile">
            <div className="glass-panel" style={{ height: '360px', borderRadius: '24px', background: 'linear-gradient(45deg, rgba(250, 204, 21, 0.15), rgba(18,18,18,0.9))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', opacity: '0.6', transform: 'rotate(-5deg)', letterSpacing: '4px' }}>TRIPZO</div>
               </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px' }}>Our Core Values</h2>
          <div className="u-grid u-grid-3">
            <div className="glass-panel" style={{ padding: '40px 30px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '16px' }}>Safety First</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Every Captain is background verified and our rides are tracked in real-time. Your security is our top priority, always.</p>
            </div>
            <div className="glass-panel" style={{ padding: '40px 30px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '16px' }}>Empowering Captains</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>We believe in fair earnings. Our captains take home the majority of the fare, creating sustainable and rewarding livelihoods.</p>
            </div>
            <div className="glass-panel" style={{ padding: '40px 30px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '16px' }}>Innovation</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Using cutting-edge technology and optimized routing algorithms to ensure the fastest ETAs and seamless user experiences.</p>
            </div>
          </div>
        </div>
        
      </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
