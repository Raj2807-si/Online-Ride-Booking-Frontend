import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Moving <span style={{ color: 'var(--primary)' }}>Cities</span> Forward</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '24px' }}>
                Tripzo was founded on a simple belief: transportation should be accessible, seamless, and reliable for everyone. We connect people with professional Captains to make city navigation completely frictionless.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                From a single ride-hailing experiment, we've grown into a comprehensive mobility platform powering thousands of trips daily.
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <div className="glass-panel" style={{ height: '400px', borderRadius: '24px', background: 'linear-gradient(45deg, rgba(250, 204, 21, 0.2), rgba(0,0,0,0.8))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 {/* Visual Placeholder instead of img to respect guidelines */}
                 <div style={{ textAlign: 'center' }}>
                   <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary)', opacity: '0.8', transform: 'rotate(-5deg)' }}>TRIPZO</div>
                 </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Our Core Values</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
              <div className="glass-panel" style={{ padding: '40px 30px' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '16px' }}>Safety First</h3>
                <p style={{ color: 'var(--text-muted)' }}>Every Captain is background verified and our rides are tracked in real-time. Your security is uncompromising.</p>
              </div>
              <div className="glass-panel" style={{ padding: '40px 30px' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '16px' }}>Empowering Captains</h3>
                <p style={{ color: 'var(--text-muted)' }}>We believe in fair earnings. Our captains take home the majority of the fare, creating sustainable livelihoods.</p>
              </div>
              <div className="glass-panel" style={{ padding: '40px 30px' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '16px' }}>Innovation</h3>
                <p style={{ color: 'var(--text-muted)' }}>Using cutting-edge technology and optimized routing algorithms to ensure the fastest ETAs and seamless experiences.</p>
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
