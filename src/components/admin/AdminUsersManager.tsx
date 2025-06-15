import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminUsersManager = () => {
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setUserProfiles(data);
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!editingProfile) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...editingProfile, updated_at: new Date().toISOString() })
        .eq('id', editingProfile.id);

      if (!error) {
        setEditingProfile(null);
        fetchUserProfiles();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const deleteProfile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user profile?')) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', id);

        if (!error) {
          fetchUserProfiles();
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  const filteredProfiles = userProfiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (profile.full_name && profile.full_name.toLowerCase().includes(searchLower)) ||
      (profile.position && profile.position.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <div className="p-6">Loading user profiles...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Profiles</h2>
        <Input
          placeholder="Search by name or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="space-y-4">
        {filteredProfiles.map((profile: any) => (
          <div key={profile.id} className="bg-white border rounded-lg p-4 shadow-sm">
            {editingProfile?.id === profile.id ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editingProfile.full_name || ''}
                  onChange={(e) => setEditingProfile({...editingProfile, full_name: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={editingProfile.position || ''}
                  onChange={(e) => setEditingProfile({...editingProfile, position: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={editingProfile.whatsapp_number || ''}
                  onChange={(e) => setEditingProfile({...editingProfile, whatsapp_number: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={editingProfile.linkedin_url || ''}
                  onChange={(e) => setEditingProfile({...editingProfile, linkedin_url: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Bio"
                  value={editingProfile.bio || ''}
                  onChange={(e) => setEditingProfile({...editingProfile, bio: e.target.value})}
                  className="px-3 py-2 border rounded col-span-2"
                  rows={3}
                />
                <div className="col-span-2 flex space-x-2">
                  <button
                    onClick={updateProfile}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProfile(null)}
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
                    <h3 className="font-semibold text-lg">
                      {profile.full_name || 'No name set'}
                    </h3>
                    <p className="text-gray-600">{profile.position || 'No position set'}</p>
                    {profile.whatsapp_number && (
                      <p className="text-sm text-green-600">
                        WhatsApp: {profile.whatsapp_number}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      profile.is_ceo 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {profile.is_ceo ? 'CEO' : 'User'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-gray-700 mb-3">{profile.bio}</p>
                )}

                {profile.linkedin_url && (
                  <p className="text-blue-600 mb-3">
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </p>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProfile(profile)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProfile(profile.id)}
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

export default AdminUsersManager;
