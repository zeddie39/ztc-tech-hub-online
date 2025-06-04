
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [ceoProfile, setCeoProfile] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
    fetchCeoProfile();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (data) {
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchCeoProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_ceo', true)
        .single();

      if (data) {
        setCeoProfile(data);
      }
    } catch (error) {
      console.error('Error fetching CEO profile:', error);
    }
  };

  const handleWhatsAppClick = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="team" id="team">
      <div className="container">
        <h2>Our Expert Team</h2>
        <p className="section-subtitle">Meet the professionals behind our exceptional service</p>
        
        {/* CEO Profile Section */}
        {ceoProfile && (
          <div className="ceo-profile-section">
            <h3>Leadership</h3>
            <div className="ceo-card">
              <div className="ceo-info">
                <h4>{ceoProfile.full_name}</h4>
                <p className="ceo-position">{ceoProfile.position}</p>
                <p className="ceo-bio">{ceoProfile.bio}</p>
                <div className="ceo-contact">
                  {ceoProfile.whatsapp_number && (
                    <button
                      onClick={() => handleWhatsAppClick(ceoProfile.whatsapp_number)}
                      className="whatsapp-btn"
                      title="Contact via WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i>
                      WhatsApp: {ceoProfile.whatsapp_number}
                    </button>
                  )}
                  {ceoProfile.linkedin_url && (
                    <a
                      href={ceoProfile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-btn"
                    >
                      <i className="fab fa-linkedin"></i>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Members Grid */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <img src={member.image_url} alt={member.name} />
              <div className="card-content">
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="bio">{member.bio}</p>
                
                {member.specialties && (
                  <div className="specialties">
                    <h4>Specialties:</h4>
                    <ul>
                      {member.specialties.map((specialty, index) => (
                        <li key={index}>{specialty}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="social-links">
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
