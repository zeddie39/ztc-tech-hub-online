
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProductGrid from '@/components/marketplace/ProductGrid';
import ProductForm from '@/components/marketplace/ProductForm';
import AuthRequired from '@/components/auth/AuthRequired';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Marketplace = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequired />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Device Marketplace</h1>
            <p className="text-gray-600 mt-2">Buy and sell quality tech devices</p>
          </div>
          <Button onClick={() => setShowSellForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Sell Device
          </Button>
        </div>

        {showSellForm && (
          <div className="mb-8">
            <ProductForm 
              onSuccess={() => {
                setShowSellForm(false);
                toast({
                  title: "Success",
                  description: "Your device has been listed for sale!",
                });
              }}
              onCancel={() => setShowSellForm(false)}
            />
          </div>
        )}

        <ProductGrid />
      </div>
    </div>
  );
};

export default Marketplace;
