
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Tag } from 'lucide-react';

interface ProductModalProps {
  product: any;
  onClose: () => void;
  onPurchase: () => void;
  loading: boolean;
}

const ProductModal = ({ product, onClose, onPurchase, loading }: ProductModalProps) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop'];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={displayImages[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {displayImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {displayImages.slice(1, 4).map((image: string, index: number) => (
                  <div key={index} className="aspect-square overflow-hidden rounded">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition}
                </Badge>
                <Badge variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
              </div>
              
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${product.price}
              </div>

              {(product.brand || product.model) && (
                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                  {product.brand && <span><strong>Brand:</strong> {product.brand}</span>}
                  {product.model && <span><strong>Model:</strong> {product.model}</span>}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <div className="space-y-1">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Listed on {new Date(product.created_at).toLocaleDateString()}
            </div>

            <Button
              onClick={onPurchase}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : `Buy for $${product.price}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
