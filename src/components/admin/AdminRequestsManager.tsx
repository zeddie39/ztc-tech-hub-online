
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, CheckCircle } from 'lucide-react';

const AdminRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCost, setEditingCost] = useState<{id: string, cost: string} | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('repair_requests')
        .update({ status })
        .eq('id', id);

      if (!error) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateCost = async (id: string, cost: string) => {
    try {
      const { error } = await supabase
        .from('repair_requests')
        .update({ estimated_cost: cost })
        .eq('id', id);

      if (!error) {
        setEditingCost(null);
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating cost:', error);
    }
  };

  const deleteRequest = async (id: string) => {
    if (confirm('Are you sure you want to delete this repair request?')) {
      try {
        const { error } = await supabase
          .from('repair_requests')
          .delete()
          .eq('id', id);

        if (!error) {
          fetchRequests();
        }
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Loading repair requests...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Repair Requests</h2>

      <div className="space-y-4">
        {requests.map((request: any) => (
          <div key={request.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {request.device_type} - {request.brand} {request.model}
                </h3>
                <p className="text-sm text-gray-600">
                  Urgency: {request.urgency_level}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-3">
              <strong>Issue:</strong> {request.issue_description}
            </p>

            {request.notes && (
              <p className="text-gray-600 mb-3">
                <strong>Notes:</strong> {request.notes}
              </p>
            )}

            <div className="flex items-center mb-4">
              <strong className="mr-2">Estimated Cost:</strong>
              {editingCost?.id === request.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingCost.cost}
                    onChange={(e) => setEditingCost({id: request.id, cost: e.target.value})}
                    className="px-2 py-1 border rounded text-sm"
                    placeholder="Enter cost"
                  />
                  <button
                    onClick={() => updateCost(request.id, editingCost.cost)}
                    className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCost(null)}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{request.estimated_cost || 'Not set'}</span>
                  <button
                    onClick={() => setEditingCost({id: request.id, cost: request.estimated_cost || ''})}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => updateStatus(request.id, 'in_progress')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Start Work
              </button>
              <button
                onClick={() => updateStatus(request.id, 'completed')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </button>
              <button
                onClick={() => updateStatus(request.id, 'cancelled')}
                className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteRequest(request.id)}
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

export default AdminRequestsManager;
