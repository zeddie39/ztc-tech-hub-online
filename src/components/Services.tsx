import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceDetail {
  detailed_description: string;
  process_steps?: string[];
  benefits?: string[];
  faq?: Record<string, string>;
}

const Services = () => {
  const [services, setServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail | null>(null);

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

  const fetchServiceDetails = async (serviceId) => {
    try {
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('service_id', serviceId)
        .single();

      if (data) {
        setServiceDetails(data);
      } else {
        // If no details exist, create mock data and search Google
        const mockDetails: ServiceDetail = {
          detailed_description: `Comprehensive ${selectedService?.title} service with professional expertise and quality assurance.`,
          process_steps: [
            'Initial consultation and assessment',
            'Detailed diagnosis and problem identification',
            'Professional repair or installation',
            'Quality testing and verification',
            'Follow-up support and warranty'
          ],
          benefits: [
            'Expert technician service',
            'Quality parts and materials',
            'Warranty coverage',
            '24/7 customer support',
            'Competitive pricing'
          ],
          faq: {
            "How long does the service take?": "Service time varies depending on complexity, typically 1-3 business days.",
            "Do you provide warranty?": "Yes, we provide comprehensive warranty on all our services.",
            "What are your service hours?": "We operate Monday to Saturday, 8 AM to 6 PM."
          }
        };
        setServiceDetails(mockDetails);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
  };

  const searchGoogleForService = (serviceName) => {
    const searchQuery = encodeURIComponent(`${serviceName} service guide tutorial`);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchUrl, '_blank');
  };

  const handleLearnMore = async (service) => {
    setSelectedService(service);
    setShowModal(true);
    await fetchServiceDetails(service.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setServiceDetails(null);
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
                <div className="service-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleLearnMore(service)}
                  >
                    Learn More
                  </button>
                  <button className="btn btn-secondary">Book Service</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Details Modal */}
        {showModal && selectedService && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content service-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>&times;</button>
              <h2>{selectedService.title}</h2>
              
              {serviceDetails && (
                <div className="service-details">
                  <div className="detail-section">
                    <h3>Description</h3>
                    <p>{serviceDetails.detailed_description}</p>
                  </div>

                  {serviceDetails.process_steps && (
                    <div className="detail-section">
                      <h3>Our Process</h3>
                      <ol>
                        {serviceDetails.process_steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {serviceDetails.benefits && (
                    <div className="detail-section">
                      <h3>Benefits</h3>
                      <ul>
                        {serviceDetails.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {serviceDetails.faq && (
                    <div className="detail-section">
                      <h3>Frequently Asked Questions</h3>
                      {Object.entries(serviceDetails.faq).map(([question, answer], index) => (
                        <div key={index} className="faq-item">
                          <h4>{question}</h4>
                          <p>{answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="modal-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => searchGoogleForService(selectedService.title)}
                    >
                      Search Google for More Info
                    </button>
                    <button className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
