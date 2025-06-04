
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ContactMessages from './ContactMessages';
import ContentManager from './ContentManager';
import Analytics from './Analytics';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'messages', label: 'Contact Messages', icon: '💬' },
    { id: 'content', label: 'Content Manager', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.email}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'messages' && <ContactMessages />}
          {activeTab === 'content' && <ContentManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
