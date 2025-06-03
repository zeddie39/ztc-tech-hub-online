
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
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

  return (
    <section className="team" id="team">
      <div className="container">
        <h2>Meet Our Expert Team</h2>
        <p className="section-subtitle">Dedicated professionals committed to excellence</p>
        
        <div className="team-grid">
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
