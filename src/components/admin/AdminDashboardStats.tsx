
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Users, Settings, UserCheck } from 'lucide-react';

const AdminDashboardStats = () => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    newMessages: 0,
    totalRequests: 0,
    pendingRequests: 0,
    teamMembers: 0,
    userProfiles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch messages stats
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('status');
      
      // Fetch repair requests stats
      const { data: requests } = await supabase
        .from('repair_requests')
        .select('status');
      
      // Fetch team members count
      const { data: team } = await supabase
        .from('team_members')
        .select('id')
        .eq('is_active', true);
      
      // Fetch user profiles count
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id');

      setStats({
        totalMessages: messages?.length || 0,
        newMessages: messages?.filter(m => m.status === 'new').length || 0,
        totalRequests: requests?.length || 0,
        pendingRequests: requests?.filter(r => r.status === 'pending').length || 0,
        teamMembers: team?.length || 0,
        userProfiles: profiles?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      newValue: stats.newMessages,
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      title: 'Repair Requests',
      value: stats.totalRequests,
      newValue: stats.pendingRequests,
      icon: Settings,
      color: 'bg-green-500',
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'User Profiles',
      value: stats.userProfiles,
      icon: UserCheck,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.newValue !== undefined && (
                    <p className="text-sm text-green-600">
                      {stat.newValue} new
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardStats;
