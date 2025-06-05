
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye } from 'lucide-react';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: any;
  onPurchase: () => void;
}

const ProductCard = ({ product, onPurchase }: ProductCardProps) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to purchase items",
          variant: "destructive",
        });
        return;
      }

      // Create an order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: product.user_id,
          product_id: product.id,
          total_amount: product.price,
          status: 'pending'
        });

      if (orderError) throw orderError;

      // Mark product as sold
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_sold: true })
        .eq('id', product.id);

      if (updateError) throw updateError;

      toast({
        title: "Purchase successful!",
        description: "The seller will be notified. Check your orders for details.",
      });

      onPurchase();
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop';

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square overflow-hidden">
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
            <Badge className={getConditionColor(product.condition)}>
              {product.condition}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {product.brand && `${product.brand} `}
            {product.model && `${product.model} - `}
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handlePurchase}
                disabled={loading}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {loading ? 'Buying...' : 'Buy'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          onPurchase={handlePurchase}
          loading={loading}
        />
      )}
    </>
  );
};

export default ProductCard;
