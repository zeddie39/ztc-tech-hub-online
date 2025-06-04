
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const AdminTeamManager = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
    specialties: '',
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index');

      if (data) {
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (!error) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);

        if (!error) {
          fetchTeamMembers();
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const updateMember = async () => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update(editingMember)
        .eq('id', editingMember.id);

      if (!error) {
        setEditingMember(null);
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const addMember = async () => {
    try {
      const specialtiesArray = newMember.specialties 
        ? newMember.specialties.split(',').map(s => s.trim())
        : [];

      const { error } = await supabase
        .from('team_members')
        .insert({
          ...newMember,
          specialties: specialtiesArray,
          order_index: teamMembers.length,
        });

      if (!error) {
        setShowAddForm(false);
        setNewMember({
          name: '',
          position: '',
          bio: '',
          image_url: '',
          linkedin_url: '',
          twitter_url: '',
          github_url: '',
          specialties: '',
        });
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading team members...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Position"
              value={newMember.position}
              onChange={(e) => setNewMember({...newMember, position: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newMember.image_url}
              onChange={(e) => setNewMember({...newMember, image_url: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Specialties (comma separated)"
              value={newMember.specialties}
              onChange={(e) => setNewMember({...newMember, specialties: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <textarea
              placeholder="Bio"
              value={newMember.bio}
              onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
              className="px-3 py-2 border rounded col-span-2"
              rows={3}
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={addMember}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Member
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {teamMembers.map((member: any) => (
          <div key={member.id} className="bg-white border rounded-lg p-4 shadow-sm">
            {editingMember?.id === member.id ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  value={editingMember.position}
                  onChange={(e) => setEditingMember({...editingMember, position: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <textarea
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({...editingMember, bio: e.target.value})}
                  className="px-3 py-2 border rounded col-span-2"
                  rows={3}
                />
                <div className="col-span-2 flex space-x-2">
                  <button
                    onClick={updateMember}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingMember(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{member.bio}</p>

                {member.specialties && member.specialties.length > 0 && (
                  <div className="mb-3">
                    <strong>Specialties:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.specialties.map((specialty: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(member.id, member.is_active)}
                    className={`px-3 py-1 rounded text-sm ${
                      member.is_active 
                        ? 'bg-orange-500 hover:bg-orange-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    {member.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeamManager;
