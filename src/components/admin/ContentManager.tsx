
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ContentManager = () => {
  const [activeSection, setActiveSection] = useState('services');
  const [services, setServices] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch services
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .order('order_index');
    if (servicesData) setServices(servicesData);

    // Fetch blog posts
    const { data: blogData } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (blogData) setBlogPosts(blogData);

    // Fetch quotes
    const { data: quotesData } = await supabase
      .from('daily_quotes')
      .select('*')
      .order('created_at', { ascending: false });
    if (quotesData) setQuotes(quotesData);

    // Fetch team members
    const { data: teamData } = await supabase
      .from('team_members')
      .select('*')
      .order('order_index');
    if (teamData) setTeamMembers(teamData);
  };

  const toggleServiceStatus = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !isActive })
      .eq('id', id);
    
    if (!error) fetchData();
  };

  const toggleQuoteStatus = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('daily_quotes')
      .update({ is_active: !isActive })
      .eq('id', id);
    
    if (!error) fetchData();
  };

  const sections = [
    { id: 'services', label: 'Services' },
    { id: 'blog', label: 'Blog Posts' },
    { id: 'quotes', label: 'Daily Quotes' },
    { id: 'team', label: 'Team Members' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Manager</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-md font-medium ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === 'services' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Services</h3>
          {services.map((service: any) => (
            <div key={service.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{service.title}</h4>
                <p className="text-gray-600">{service.category} - {service.price}</p>
              </div>
              <button
                onClick={() => toggleServiceStatus(service.id, service.is_active)}
                className={`px-3 py-1 rounded text-sm ${
                  service.is_active 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {service.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'quotes' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Daily Quotes</h3>
          {quotes.map((quote: any) => (
            <div key={quote.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">"{quote.quote_text}"</p>
                <p className="text-gray-600">- {quote.author}</p>
                <span className="text-xs text-gray-500">{quote.category}</span>
              </div>
              <button
                onClick={() => toggleQuoteStatus(quote.id, quote.is_active)}
                className={`px-3 py-1 rounded text-sm ml-4 ${
                  quote.is_active 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {quote.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'blog' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Blog Posts</h3>
          {blogPosts.map((post: any) => (
            <div key={post.id} className="border rounded-lg p-4">
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-gray-600">{post.excerpt}</p>
              <p className="text-sm text-gray-500">By {post.author} - {post.read_time}</p>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'team' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Team Members</h3>
          {teamMembers.map((member: any) => (
            <div key={member.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-gray-600">{member.position}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                member.is_active 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {member.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManager;
