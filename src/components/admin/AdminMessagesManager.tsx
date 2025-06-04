
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Eye, Mail, Phone } from 'lucide-react';

const AdminMessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
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
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (!error) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);

        if (!error) {
          fetchMessages();
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const filteredMessages = messages.filter(msg => 
    filter === 'all' || msg.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Messages</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message: any) => (
          <div key={message.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {message.first_name} {message.last_name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {message.email}
                  </span>
                  {message.phone && (
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {message.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(message.status)}`}>
                  {message.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {message.service_needed && (
              <p className="text-sm text-blue-600 mb-2">
                Service Needed: {message.service_needed}
              </p>
            )}

            <p className="text-gray-700 mb-4">{message.message}</p>

            <div className="flex space-x-2">
              <button
                onClick={() => updateStatus(message.id, 'in-progress')}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => updateStatus(message.id, 'resolved')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => deleteMessage(message.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessagesManager;
