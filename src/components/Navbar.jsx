import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? { color: 'var(--primary)', fontWeight: 'bold' } : { color: 'white' };

  return (
    <nav className="glass-panel" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Tripzo</h2>
      </Link>

      {/* Desktop Navigation */}
      <div className="nav-desktop" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', transition: 'color 0.2s', ...isActive('/') }}>Home</Link>
        <Link to="/about" style={{ textDecoration: 'none', transition: 'color 0.2s', ...isActive('/about') }}>About</Link>
        <Link to="/services" style={{ textDecoration: 'none', transition: 'color 0.2s', ...isActive('/services') }}>Services</Link>
        <Link to="/contact" style={{ textDecoration: 'none', transition: 'color 0.2s', ...isActive('/contact') }}>Contact</Link>
      </div>

      <div className="nav-desktop" style={{ display: 'flex', gap: '15px' }}>
        {token ? (
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}>
                Login
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '10px 20px', width: 'auto' }}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <button className="nav-mobile-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="nav-mobile-menu">
           <Link to="/" style={{ textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', ...isActive('/') }} onClick={() => setIsOpen(false)}>Home</Link>
           <Link to="/about" style={{ textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', ...isActive('/about') }} onClick={() => setIsOpen(false)}>About</Link>
           <Link to="/services" style={{ textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', ...isActive('/services') }} onClick={() => setIsOpen(false)}>Services</Link>
           <Link to="/contact" style={{ textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', ...isActive('/contact') }} onClick={() => setIsOpen(false)}>Contact</Link>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {token ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{ width: '100%', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px 20px', borderRadius: '8px' }}>
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                    <button style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 20px', borderRadius: '8px' }}>Login</button>
                  </Link>
                  <Link to="/signup" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                    <button className="btn-primary" style={{ width: '100%', padding: '12px 20px' }}>Sign Up</button>
                  </Link>
                </>
              )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
