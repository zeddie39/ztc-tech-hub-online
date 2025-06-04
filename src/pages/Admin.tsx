
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminAuth from '@/components/auth/AdminAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('Admin page mounted, checking session...');
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check result:', { session, error });
        
        if (error) {
          console.error('Session error:', error);
          setError(error.message);
        }
        
        setUser(session?.user || null);
      } catch (err) {
        console.error('Error checking session:', err);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user || null);
        setError('');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminAuth onAuthSuccess={setUser} />;
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />;
};

export default Admin;
