
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const [quote, setQuote] = useState({ quote_text: '', author: '' });

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  const fetchDailyQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setQuote(data[0]);
      }
    } catch (error) {
      console.error('Error fetching daily quote:', error);
    }
  };

  return (
    <section className="hero" id="home">
      <div className="stars"></div>
      <div className="hero-content">
        <h1>Professional Electronic Repair & Tech Solutions</h1>
        <p className="hero-subtitle">Where Service is Beyond the Obvious</p>
        <div className="vision-statement">
          <h3>Our Vision</h3>
          <p>To be the leading technology partner in our community, providing innovative solutions that bridge the gap between technology and everyday life, making digital experiences accessible, reliable, and transformative for everyone.</p>
        </div>
        
        <div className="daily-quote">
          <h4>💡 Tech Tip of the Day</h4>
          <blockquote>
            "{quote.quote_text || 'Regular maintenance extends device lifespan by up to 40%'}"
            <cite>- {quote.author || 'ZTC Team'}</cite>
          </blockquote>
        </div>

        <div className="cta-buttons">
          <a href="#contact" className="btn btn-primary">Get Started</a>
          <a href="#services" className="btn btn-secondary">Our Services</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
