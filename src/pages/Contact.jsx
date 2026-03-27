import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }}>Get in Touch</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              We're here to help. Reach out to us for support, partnerships, or any other inquiries.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '80px', alignItems: 'start' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Contact Information</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6' }}>
                Our support team is available 24/7 to assist you. Drop us a message or visit our headquarters.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Headquarters</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Gamma 2, Greater Noida, Uttar Pradesh 201310</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Phone Support</h4>
                  <p style={{ color: 'var(--text-muted)' }}>+91-987654321<br />24/7 Support</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Email Us</h4>
                  <p style={{ color: 'var(--text-muted)' }}>support@tripzo.com<br />partnerships@tripzo.com</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Send a Message</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Message sent successfully!'); }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" className="input-field" placeholder="John Doe" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" className="input-field" placeholder="john@example.com" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input type="text" className="input-field" placeholder="How can we help?" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" placeholder="Write your message here..." rows="5" required style={{ resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
