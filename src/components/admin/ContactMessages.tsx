
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (!error) {
        fetchMessages(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>
      
      <div className="space-y-4">
        {messages.map((message: any) => (
          <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {message.first_name} {message.last_name}
                </h3>
                <p className="text-gray-600">{message.email}</p>
                {message.phone && (
                  <p className="text-gray-600">{message.phone}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  message.status === 'new' ? 'bg-green-100 text-green-800' :
                  message.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {message.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {message.service_needed && (
              <p className="text-sm text-blue-600 mb-2">
                Service: {message.service_needed}
              </p>
            )}
            
            <p className="text-gray-700 mb-3">{message.message}</p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => updateMessageStatus(message.id, 'in-progress')}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => updateMessageStatus(message.id, 'resolved')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactMessages;
