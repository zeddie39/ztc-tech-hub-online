
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboardStats from './AdminDashboardStats';
import AdminMessagesManager from './AdminMessagesManager';
import AdminRequestsManager from './AdminRequestsManager';
import AdminTeamManager from './AdminTeamManager';
import AdminUsersManager from './AdminUsersManager';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardStats />;
      case 'messages':
        return <AdminMessagesManager />;
      case 'requests':
        return <AdminRequestsManager />;
      case 'team':
        return <AdminTeamManager />;
      case 'users':
        return <AdminUsersManager />;
      default:
        return <AdminDashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        user={user}
      />
      
      <div className="flex-1">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h1>
            <p className="text-gray-600">
              Manage your {activeTab === 'dashboard' ? 'business overview' : activeTab}
            </p>
          </div>
        </div>
        
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
