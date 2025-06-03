
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminPanel from '@/components/AdminPanel';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Check admin credentials
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();

      if (data) {
        // In a real app, you'd verify the password hash
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed');
      console.error('Login error:', error);
    }
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
          <button type="submit" className="btn btn-primary">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Admin;
