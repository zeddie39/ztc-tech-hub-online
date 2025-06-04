
import React from 'react';
import { User, MessageSquare, Users, Settings, BarChart3, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: any;
}

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, user }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'requests', label: 'Repair Requests', icon: Settings },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'users', label: 'User Profiles', icon: User },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-gray-300 text-sm mt-1">{user?.email}</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                activeTab === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-red-300 hover:text-red-100 hover:bg-red-900/20 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
