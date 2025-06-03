
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    service_needed: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) {
        throw error;
      }

      setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        service_needed: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2>Send Us a Message</h2>
        <p className="section-subtitle">Get in touch for all your tech needs</p>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (Optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <select
            name="service_needed"
            value={formData.service_needed}
            onChange={handleChange}
          >
            <option value="">Select Service Needed</option>
            <option value="phone_repair">Phone Repair</option>
            <option value="laptop_repair">Laptop Repair</option>
            <option value="home_wiring">Home Wiring</option>
            <option value="cctv_installation">CCTV Installation</option>
            <option value="smart_home">Smart Home Setup</option>
            <option value="consultation">Tech Consultation</option>
            <option value="other">Other</option>
          </select>
          
          <textarea
            name="message"
            placeholder="Describe your tech needs..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
