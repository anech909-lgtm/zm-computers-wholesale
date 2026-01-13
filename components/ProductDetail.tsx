
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetail: (id: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onBack: () => void;
  // Added onQuickView to props to satisfy ProductCard requirements
  onQuickView: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, onAddToCart, onViewDetail, onToggleWishlist, isWishlisted, onBack, onQuickView }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const activePrice = product.numericDiscountPrice || product.numericPrice;
  const totalPrice = activePrice * quantity;

  const handleAdd = () => {
    setIsAdding(true);
    setShowConfirmation(true);
    onAddToCart(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
    
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `ZM Computers - ${product.name}`,
      text: `Industrial Grade Computing: Check out the ${product.name} at ZM Computers.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch (err) {
      console.debug('Share cancelled or failed', err);
    }
  };

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  return (
    <div className="pt-48 pb-32 px-6 md:px-12 bg-black min-h-screen relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/4 right-0 w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.03)_0%,transparent_70%)] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="group flex items-center space-x-6 mb-20 text-[10px] font-black uppercase tracking-[0.6em] text-gray-500 hover:text-white transition-all reveal"
        >
          <div className="w-14 h-14 glass rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all border border-white/5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </div>
          <span>Back to Sourcing</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-32 items-start mb-48">
          {/* Image Showcase */}
          <div className="reveal opacity-0 translate-y-10 scale-95 transition-all duration-1000">
            <div className="relative glass rounded-[4rem] p-6 border border-white/5 shadow-2xl overflow-hidden group">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-black/40">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-[3s] group-hover:scale-110"
                />
              </div>
              
              {product.isSale && (
                <div className="absolute top-12 right-12 bg-red-600 text-white font-black px-8 py-3 rounded-full uppercase tracking-[0.4em] text-[10px] animate-pulse shadow-2xl">
                  Inventory Sale
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-6 mt-12">
              {[1,2,3,4].map((i) => (
                <div key={i} className="aspect-square glass rounded-[2rem] p-2 border border-white/5 cursor-pointer hover:border-red-600/50 transition-all group overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover rounded-[1.5rem] opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-16 reveal opacity-0 translate-y-10 scale-95 transition-all duration-1000 delay-200">
            <div>
              <div className="flex items-center space-x-6 mb-10">
                <span className="text-red-500 font-black uppercase tracking-[0.6em] text-[10px]">{product.category}</span>
                <div className="w-20 h-[1px] bg-red-600/30" />
                <span className="text-gray-600 text-[10px] uppercase tracking-[0.6em] font-black italic">ZM-REF-{product.id}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-white mb-10 leading-[0.9] tracking-tighter">{product.name}</h1>
              <p className="text-gray-500 text-2xl leading-relaxed max-w-xl font-light">
                The pinnacle of {product.category.toLowerCase()} engineering. Designed for extreme performance and absolute reliability in Pakistani institutional environments.
              </p>
            </div>

            <div className="flex items-end space-x-8">
              {product.isSale && product.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm line-through uppercase tracking-[0.4em] font-black mb-3 italic opacity-50">MSRP {product.price}</span>
                  <span className="text-7xl font-black text-red-600 tracking-tighter">{product.discountPrice}</span>
                </div>
              ) : (
                <span className="text-7xl font-black text-white tracking-tighter">{product.price}</span>
              )}
              <div className="px-6 py-2 glass rounded-2xl border border-red-600/20 mb-2">
                <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.6em]">PKR WHOLESALE DIRECT</span>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Technical Specifications</h4>
              <div className="grid grid-cols-2 gap-6">
                {product.specs.map((spec) => (
                  <div key={spec} className="glass p-6 rounded-[2rem] border border-white/5 flex items-center space-x-5 group hover:border-red-600/40 transition-all duration-500">
                    <div className="w-2 h-2 bg-red-600 rounded-full group-hover:animate-ping" />
                    <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-8 md:space-y-0">
                <div className="space-y-5">
                  <span className="text-white font-black uppercase tracking-[0.5em] text-[10px] block opacity-50">Order Volume</span>
                  <div className="flex items-center glass border border-white/10 rounded-full p-2 h-20 w-fit">
                    <button 
                      onClick={() => adjustQuantity(-1)}
                      className="w-16 h-full flex items-center justify-center text-white hover:text-red-500 transition-all text-2xl font-light"
                    >
                      －
                    </button>
                    <input 
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 bg-transparent text-center text-white font-black text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button 
                      onClick={() => adjustQuantity(1)}
                      className="w-16 h-full flex items-center justify-center text-white hover:text-red-500 transition-all text-2xl font-light"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-gray-600 text-[9px] uppercase font-black tracking-[0.5em] mb-3">Est. Batch Value</p>
                  <p className="text-5xl font-black text-white tracking-tighter">Rs. {totalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 relative">
                  {showConfirmation && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 animate-added-badge">
                      <div className="glass px-10 py-3 rounded-full border border-red-600/30 flex items-center space-x-3 shadow-2xl backdrop-blur-3xl">
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">+{quantity} Infrastructure Optimized</span>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleAdd}
                    disabled={isAdding}
                    className={`flex-[3] relative overflow-hidden group flex items-center justify-center space-x-6 py-8 px-10 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] transition-all duration-700 shadow-2xl transform active:scale-95 ${
                      isAdding 
                      ? 'bg-white text-black scale-[1.03]' 
                      : 'bg-red-600 text-white hover:bg-white hover:text-black hover:scale-[1.02]'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 z-0 ${isAdding ? 'translate-x-0' : ''}`} />
                    <span className="relative z-10 flex items-center space-x-4">
                      {isAdding ? (
                        <>
                          <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          <span>Added to Order</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          <span>Add to Wholesale Order</span>
                        </>
                      )}
                    </span>
                  </button>

                  <div className="flex space-x-4 flex-1">
                    <button 
                      onClick={() => onToggleWishlist(product)}
                      className={`flex-1 py-8 glass rounded-[2.5rem] flex items-center justify-center transition-all duration-700 border group ${isWishlisted ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-white/5 text-white hover:border-red-600/40 hover:scale-105'}`}
                      title="Add to Wishlist"
                    >
                      <svg 
                        className={`w-8 h-8 transition-all duration-700 ${isWishlisted ? 'fill-current scale-110' : 'group-hover:scale-110'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    <button 
                      onClick={handleShare}
                      className="flex-1 py-8 glass rounded-[2.5rem] flex items-center justify-center transition-all duration-700 border border-white/5 text-white hover:border-red-600/40 hover:scale-105 relative"
                      title="Share Product"
                    >
                      {shareFeedback && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full border border-white/20 whitespace-nowrap animate-fade-in">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white">Link Copied</span>
                        </div>
                      )}
                      <svg className="w-7 h-7 hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button className="w-full py-8 glass text-gray-400 font-black text-[10px] uppercase tracking-[0.5em] rounded-[2.5rem] hover:bg-white/5 hover:text-white transition-all border border-white/5 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="flex items-center justify-center space-x-3 relative z-10">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Request Custom Infrastructure Quote</span>
                  </span>
                </button>
              </div>
            </div>
            
            <p className="text-[9px] text-gray-700 text-center uppercase tracking-[0.5em] font-bold">
              * Lead time: 5-7 business days for nationwide shipping. Bulk discounts apply for orders over 10 units. NTN/STRN verification mandatory for authorized wholesale.
            </p>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="reveal mt-64 border-t border-white/5 pt-48">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
              <div className="space-y-6">
                <span className="text-red-500 font-black uppercase tracking-[0.6em] text-[10px] block">Recommendations</span>
                <h2 className="text-4xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">Complementary <br /><span className="italic">Infrastructure</span></h2>
              </div>
              <p className="text-gray-500 text-xl max-w-sm mt-10 md:mt-0 font-light italic">
                Architectural hardware designed to scale perfectly with your existing selection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map((relProduct, idx) => (
                <div 
                  key={relProduct.id} 
                  className="reveal opacity-0 translate-y-10 scale-95 transition-all duration-1000" 
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Fixed missing onQuickView prop */}
                  <ProductCard 
                    product={relProduct} 
                    onAddToCart={(p) => onAddToCart(p, 1)} 
                    onViewDetail={onViewDetail}
                    onQuickView={onQuickView}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes added-badge {
          0% { transform: translate(-50%, 0); opacity: 0; }
          20% { transform: translate(-50%, -20px); opacity: 1; }
          80% { transform: translate(-50%, -30px); opacity: 1; }
          100% { transform: translate(-50%, -40px); opacity: 0; }
        }
        .animate-added-badge {
          animation: added-badge 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
