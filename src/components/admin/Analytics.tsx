
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Analytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_analytics_overview');
      if (data && data.length > 0) {
        setAnalytics(data[0]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  const stats = [
    {
      name: 'Total Messages',
      value: analytics?.total_messages || 0,
      icon: '💬',
      color: 'bg-blue-500'
    },
    {
      name: 'New Messages',
      value: analytics?.new_messages || 0,
      icon: '🆕',
      color: 'bg-green-500'
    },
    {
      name: 'Today Messages',
      value: analytics?.today_messages || 0,
      icon: '📅',
      color: 'bg-yellow-500'
    },
    {
      name: 'Blog Posts',
      value: analytics?.total_blog_posts || 0,
      icon: '📝',
      color: 'bg-purple-500'
    },
    {
      name: 'Active Services',
      value: analytics?.active_services || 0,
      icon: '🛠️',
      color: 'bg-indigo-500'
    },
    {
      name: 'Team Members',
      value: analytics?.active_team_members || 0,
      icon: '👥',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-full text-white text-2xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
