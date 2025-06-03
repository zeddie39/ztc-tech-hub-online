
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Services = () => {
  const [services, setServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <section className="services" id="services">
      <div className="container">
        <h2>Our Services</h2>
        <p className="section-subtitle">Comprehensive tech solutions for all your needs</p>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Services
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'repair' ? 'active' : ''}`}
            onClick={() => setActiveFilter('repair')}
          >
            Repair
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'installation' ? 'active' : ''}`}
            onClick={() => setActiveFilter('installation')}
          >
            Installation
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'consultation' ? 'active' : ''}`}
            onClick={() => setActiveFilter('consultation')}
          >
            Consultation
          </button>
        </div>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card" data-category={service.category}>
              <img src={service.image_url} alt={service.title} />
              <div className="card-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="price">{service.price}</div>
                <ul className="features">
                  {service.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="btn btn-primary">Book Service</button>
              </div>
            </div>
          ))}
        </div>

        <div className="social-media-section">
          <h3>Connect With Us</h3>
          <div className="social-buttons">
            <a href="https://facebook.com/zedekiahtech" className="social-btn facebook" target="_blank">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="https://twitter.com/zedekiahtech" className="social-btn twitter" target="_blank">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://instagram.com/zedekiahtech" className="social-btn instagram" target="_blank">
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a href="https://linkedin.com/company/zedekiahtech" className="social-btn linkedin" target="_blank">
              <i className="fab fa-linkedin-in"></i> LinkedIn
            </a>
            <a href="https://youtube.com/@zedekiahtech" className="social-btn youtube" target="_blank">
              <i className="fab fa-youtube"></i> YouTube
            </a>
            <a href="https://tiktok.com/@zedekiahtech" className="social-btn tiktok" target="_blank">
              <i className="fab fa-tiktok"></i> TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
