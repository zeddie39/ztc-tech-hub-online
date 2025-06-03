
import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Team from '@/components/Team';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
              Zedekiah Tech Clinic
            </h2>
          </div>
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="#team" className="nav-link">Team</a></li>
            <li><a href="#blog" className="nav-link">Blog</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <li><a href="/admin" className="nav-link btn-login">Admin</a></li>
          </ul>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <Hero />
      <Services />
      <Team />
      <Blog />
      <Contact />

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Zedekiah Tech Clinic</h3>
              <p>Professional Electronic Repair & Tech Solutions</p>
              <p>Where Service is Beyond the Obvious</p>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📧 info@zedekiahtech.com</p>
              <p>📱 +1 (555) 123-4567</p>
              <p>📍 123 Tech Street, Digital City</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Zedekiah Tech Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
