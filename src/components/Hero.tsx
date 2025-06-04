
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const [quote, setQuote] = useState({ quote_text: '', author: '' });

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  const fetchDailyQuote = async () => {
    try {
      // Get a rotating quote based on the day of the year
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
      
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // Use modulo to cycle through quotes based on day of year
        const quoteIndex = dayOfYear % data.length;
        setQuote(data[quoteIndex]);
      } else {
        // Fallback quote
        setQuote({
          quote_text: 'Regular maintenance extends device lifespan by up to 40%',
          author: 'ZTC Team'
        });
      }
    } catch (error) {
      console.error('Error fetching daily quote:', error);
      // Fallback quote
      setQuote({
        quote_text: 'Quality repair work is an investment in your technology\'s future',
        author: 'ZTC Experts'
      });
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
          <h4>💡 Tech Insight of the Day</h4>
          <blockquote>
            "{quote.quote_text}"
            <cite>- {quote.author}</cite>
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
