
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminAuth from '@/components/auth/AdminAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

// Add: helper for logging state transitions
const debug = (...args: any[]) => console.log('[Admin debug]', ...args);

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    debug('Admin page mounted, initializing session and auth state listener...');
    
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        debug('Auth state change event:', event, session);
        setUser(session?.user || null);
        setError('');
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      debug('Initial session check result:', { session, error });
      if (error) {
        setError(error.message);
      }
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      debug('Cleaned up auth subscription.');
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      debug('User logged out successfully');
    } catch (error) {
      debug('Logout error:', error);
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
    debug('Displaying error:', error);
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

  // If not authenticated, show login prompt (do NOT redirect to /)
  if (!user) {
    debug('User not authenticated, showing AdminAuth prompt');
    return <AdminAuth onAuthSuccess={setUser} />;
  }

  debug('Authenticated as user', user);
  return <AdminDashboard user={user} onLogout={handleLogout} />;
};

export default Admin;

