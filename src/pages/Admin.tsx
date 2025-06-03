
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminPanel from '@/components/AdminPanel';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check admin credentials
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();

      if (data) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create admin user record
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          email: signUpData.email,
          full_name: signUpData.fullName,
          password_hash: signUpData.password, // In production, this should be properly hashed
          role: 'admin',
          is_active: true
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Admin account created successfully! You can now log in.",
      });
      
      setShowSignUp(false);
      setSignUpData({ email: '', password: '', fullName: '', confirmPassword: '' });
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Failed to create account. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>{showSignUp ? 'Create Admin Account' : 'Admin Login'}</h1>
        
        {!showSignUp ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="error">{error}</p>}
            
            <div className="auth-switch">
              <p>Need an admin account? 
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Full Name"
              value={signUpData.fullName}
              onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
              required
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={signUpData.password}
              onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signUpData.confirmPassword}
              onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
              required
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
            {error && <p className="error">{error}</p>}
            
            <div className="auth-switch">
              <p>Already have an account? 
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => setShowSignUp(false)}
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Admin;
