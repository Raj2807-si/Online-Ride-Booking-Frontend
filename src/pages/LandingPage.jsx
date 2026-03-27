import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, ShieldCheck, Clock, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Abstract Background element */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, rgba(18,18,18,0) 70%)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, rgba(18,18,18,0) 70%)', borderRadius: '50%', zIndex: -1 }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px', display: 'flex', alignItems: 'center', gap: '40px', width: '100%' }}>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px' }}>
              Your Ride,<br/>
              <span style={{ color: 'var(--primary)' }}>Reimagined.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.6 }}>
              Experience the fastest, safest, and most affordable way to navigate your city. Tap a button, get a ride.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/book-ride" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.1rem', width: 'auto' }}>
                  Book a Ride <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'white', padding: '16px 32px', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => {e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}} onMouseOut={e => {e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'}}>
                  Become a Captain
                </button>
              </Link>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
             {/* Mock 3D or visual element, using glassmorphism card instead of an image to be strictly self-contained */}
             <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', height: '550px', padding: '30px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ flex: 1, borderRadius: '16px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', overflow: 'hidden', position: 'relative' }}>
                  {/* Simulate a map background inside phone mockup */}
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Mock UI elements inside the "phone" */}
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '10px' }}></div>
                    <div style={{ height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '15px' }}></div>
                    <div style={{ height: '45px', backgroundColor: 'var(--primary)', borderRadius: '8px' }}></div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: '#0f0f0f', padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Why Choose <span style={{ color: 'var(--primary)' }}>Tripzo</span>?</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>We combine technology with care to provide the best mobility experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
             <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Verified Captains</h3>
              <p style={{ color: 'var(--text-muted)' }}>Every driver goes through an extensive background check and vehicle inspection before joining our fleet.</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', transform: 'translateY(-20px)', border: '1px solid rgba(250,204,21,0.3)' }}>
              <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Zero Wait Times</h3>
              <p style={{ color: 'var(--text-muted)' }}>Our intelligent dispatch algorithm ensures there's always a captain just around the corner, ready to pick you up.</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Map size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Real-time Tracking</h3>
              <p style={{ color: 'var(--text-muted)' }}>Share your live location with friends and family for added safety and precise ETAs.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LandingPage;
