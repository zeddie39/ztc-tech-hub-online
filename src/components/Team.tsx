
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchUserProfiles();
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

  const fetchUserProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_ceo', true);

      if (data) {
        setUserProfiles(data);
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  const handleWhatsAppClick = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber.startsWith('254') ? cleanNumber : '254' + cleanNumber.substring(1)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="team" id="team">
      <div className="container">
        <h2>Meet Our Expert Team</h2>
        <p className="section-subtitle">Dedicated professionals committed to excellence</p>
        
        <div className="team-grid">
          {/* CEO Profile from user_profiles */}
          {userProfiles.map((profile) => (
            <div key={profile.id} className="team-card">
              <img src="/placeholder.svg" alt={profile.full_name} />
              <div className="card-content">
                <h3>{profile.full_name}</h3>
                <p className="position">{profile.position}</p>
                <p className="bio">{profile.bio}</p>

                <div className="social-links">
                  {profile.whatsapp_number && (
                    <button
                      onClick={() => handleWhatsAppClick(profile.whatsapp_number)}
                      className="whatsapp-btn"
                      title="Contact via WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </button>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Regular team members */}
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <img src={member.image_url} alt={member.name} />
              <div className="card-content">
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="bio">{member.bio}</p>
                
                <div className="specialties">
                  <h4>Specialties:</h4>
                  <ul>
                    {member.specialties?.map((specialty, index) => (
                      <li key={index}>{specialty}</li>
                    ))}
                  </ul>
                </div>

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
