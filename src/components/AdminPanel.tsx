
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [repairRequests, setRepairRequests] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    fetchRepairRequests();
    fetchAnalytics();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchRepairRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setRepairRequests(data);
      }
    } catch (error) {
      console.error('Error fetching repair requests:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_analytics_overview');

      if (data && data.length > 0) {
        setAnalytics(data[0]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (!error) {
        fetchMessages();
        toast({
          title: "Success",
          description: "Message status updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const updateRepairRequestStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('repair_requests')
        .update({ status })
        .eq('id', id);

      if (!error) {
        fetchRepairRequests();
        toast({
          title: "Success",
          description: "Repair request status updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating repair request status:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`tab ${activeTab === 'repairs' ? 'active' : ''}`}
            onClick={() => setActiveTab('repairs')}
          >
            Repair Requests
          </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <h2>Analytics Overview</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Messages</h3>
              <p className="stat-number">{analytics.total_messages || 0}</p>
            </div>
            <div className="analytics-card">
              <h3>New Messages</h3>
              <p className="stat-number">{analytics.new_messages || 0}</p>
            </div>
            <div className="analytics-card">
              <h3>Today's Messages</h3>
              <p className="stat-number">{analytics.today_messages || 0}</p>
            </div>
            <div className="analytics-card">
              <h3>Active Services</h3>
              <p className="stat-number">{analytics.active_services || 0}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="messages-section">
          <div className="section-header">
            <h2>Contact Messages</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="messages-list">
            {filteredMessages.map((message) => (
              <div key={message.id} className="message-card">
                <div className="message-header">
                  <h3>{message.first_name} {message.last_name}</h3>
                  <span className={`status-badge ${message.status}`}>
                    {message.status}
                  </span>
                </div>
                <p><strong>Email:</strong> {message.email}</p>
                {message.phone && <p><strong>Phone:</strong> {message.phone}</p>}
                {message.service_needed && <p><strong>Service:</strong> {message.service_needed}</p>}
                <p><strong>Message:</strong> {message.message}</p>
                <div className="message-actions">
                  <button
                    onClick={() => updateMessageStatus(message.id, 'replied')}
                    className="btn btn-sm btn-primary"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => updateMessageStatus(message.id, 'resolved')}
                    className="btn btn-sm btn-success"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'repairs' && (
        <div className="repairs-section">
          <h2>Repair Requests</h2>
          <div className="repairs-list">
            {repairRequests.map((request) => (
              <div key={request.id} className="repair-card">
                <div className="repair-header">
                  <h3>{request.device_type} - {request.brand} {request.model}</h3>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <p><strong>Issue:</strong> {request.issue_description}</p>
                <p><strong>Urgency:</strong> {request.urgency_level}</p>
                {request.estimated_cost && <p><strong>Estimated Cost:</strong> {request.estimated_cost}</p>}
                <div className="repair-actions">
                  <button
                    onClick={() => updateRepairRequestStatus(request.id, 'in_progress')}
                    className="btn btn-sm btn-primary"
                  >
                    Start Work
                  </button>
                  <button
                    onClick={() => updateRepairRequestStatus(request.id, 'completed')}
                    className="btn btn-sm btn-success"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
