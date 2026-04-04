import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <>
      <Navbar />
      <Navbar />
      <div className="u-py-100 u-container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="u-title-mobile" style={{ color: 'var(--primary)', marginBottom: '16px' }}>Get in Touch</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            We're here to help. Reach out to us for support, partnerships, or any other inquiries. Our team is ready to assist you.
          </p>
        </div>

        <div className="u-stack-mobile u-flex" style={{ gap: '60px', alignItems: 'start', marginBottom: '80px' }}>
          {/* Contact Info */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Contact Information</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.8' }}>
              Our support team is available 24/7 to assist you. Drop us a message or visit our headquarters. We strive to respond within 2 hours.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Headquarters</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Gamma 2, Greater Noida, Uttar Pradesh 201310</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Phone Support</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>+91-987654321<br />24/7 Priority Support</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Email Us</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>support@tripzo.com<br />partnerships@tripzo.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel u-full-width-mobile" style={{ padding: '40px', flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Send a Message</h3>
            <form onSubmit={e => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.85rem' }}>Full Name</label>
                <input type="text" className="input-field" placeholder="John Doe" required />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                <input type="email" className="input-field" placeholder="john@example.com" required />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.85rem' }}>Subject</label>
                <input type="text" className="input-field" placeholder="How can we help?" required />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.85rem' }}>Message</label>
                <textarea className="input-field" placeholder="Write your message here..." rows="4" required style={{ resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
