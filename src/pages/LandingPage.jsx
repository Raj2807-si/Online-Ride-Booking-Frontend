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
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, rgba(18,18,18,0) 70%)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-5%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, rgba(18,18,18,0) 70%)', borderRadius: '50%', zIndex: -1 }}></div>

        <div className="u-container u-py-100">
          <div className="u-stack-mobile u-flex" style={{ alignItems: 'center', gap: '60px' }}>
            
            <div style={{ flex: 1.2 }}>
              <h1 className="u-title-mobile" style={{ fontWeight: '800', lineHeight: 1.1, marginBottom: '24px' }}>
                Your Ride,<br/>
                <span style={{ color: 'var(--primary)' }}>Reimagined.</span>
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '540px', lineHeight: 1.6 }}>
                Experience the fastest, safest, and most affordable way to navigate your city. Tap a button, get a ride. Join the movement.
              </p>
              <div className="u-stack-mobile" style={{ display: 'flex', gap: '16px' }}>
                <Link to="/book-ride" style={{ textDecoration: 'none' }} className="u-full-width-mobile">
                  <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 36px', fontSize: '1.05rem', width: 'auto' }}>
                    Book a Ride <ArrowRight size={20} />
                  </button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }} className="u-full-width-mobile">
                  <button style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'white', padding: '16px 36px', fontSize: '1.05rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s', width: '100%' }} onMouseOver={e => {e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}} onMouseOut={e => {e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'}}>
                    Become a Captain
                  </button>
                </Link>
              </div>
            </div>

            <div style={{ flex: 1 }} className="u-hide-mobile">
               {/* Mock Phone Visual */}
               <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', height: '520px', padding: '25px', display: 'flex', flexDirection: 'column', position: 'relative', margin: '0 auto' }}>
                  <div style={{ flex: 1, borderRadius: '14px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '10px' }}>
                      <div style={{ height: '35px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '8px' }}></div>
                      <div style={{ height: '35px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '12px' }}></div>
                      <div style={{ height: '40px', backgroundColor: 'var(--primary)', borderRadius: '6px' }}></div>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: '#0a0a0a' }} className="u-py-100">
        <div className="u-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <h2 style={{ marginBottom: '16px' }}>Why Choose <span style={{ color: 'var(--primary)' }}>Tripzo</span>?</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>We combine technology with care to provide the best mobility experience.</p>
          </div>

          <div className="u-grid u-grid-3">
             <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Verified Captains</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Every driver goes through an extensive background check and vehicle inspection before joining our fleet.</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', border: '1px solid rgba(250,204,21,0.2)' }}>
              <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Zero Wait Times</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Our intelligent dispatch algorithm ensures there's always a captain just around the corner, ready to pick you up.</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Map size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Real-time Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Share your live location with friends and family for added safety and precise ETAs.</p>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </>
  );
};

export default LandingPage;
