'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import products from '@/data/products';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;

    const product = products.find(p => p.id === productId);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const [selectedSize, setSelectedSize] = useState(product?.sizes[2] || 'L');
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    const isFavorite = isInWishlist(product.id);
    const displayPrice = product.salePrice || product.price;
    const originalPrice = product.salePrice ? product.price : null;

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!selectedColor) return;

        addToCart({
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            quantity,
            size: selectedSize,
            color: selectedColor.name,
            price: product.price,
            salePrice: product.salePrice
        });

        // Show success feedback (you can add a toast notification here)
        alert('Added to cart!');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Product Image */}
            <div className="relative aspect-[3/4] bg-gray-200">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Top Navigation */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleToggleFavorite}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isFavorite ? 'bg-black text-white' : 'bg-white text-gray-700'
                            }`}
                    >
                        <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-t-3xl -mt-6 relative px-6 pt-6">
                {/* Product Name */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                </h1>

                {/* Category */}
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="font-semibold text-gray-900">
                        {product.rating}
                    </span>
                    <span className="text-sm text-blue-500">
                        ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {showFullDescription
                            ? product.description
                            : product.description.slice(0, 100)}
                        {!showFullDescription && product.description.length > 100 && '...'}
                    </p>
                    {product.description.length > 100 && (
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-sm font-semibold text-gray-900 mt-1"
                        >
                            {showFullDescription ? 'Read Less' : 'Read More...'}
                        </button>
                    )}
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Size</h3>
                    <div className="flex gap-3">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${selectedSize === size
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selector */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
                    <div className="flex gap-3">
                        {product.colors.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => setSelectedColor(color)}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor?.hex === color.hex
                                    ? 'border-black scale-110'
                                    : 'border-gray-300'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.stock}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white py-4 rounded-full flex items-center justify-center gap-3 font-semibold text-lg hover:bg-gray-800 transition-colors mb-6"
                >
                    <ShoppingCart size={24} />
                    <span>Add to Cart | ${displayPrice.toFixed(2)}</span>
                    {originalPrice && (
                        <span className="line-through text-gray-400 text-sm">
                            ${originalPrice.toFixed(2)}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
