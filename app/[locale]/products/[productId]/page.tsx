'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useReview } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import { getProductName, getProductDescription, getProductCategory, type Locale } from '@/utils/localization';
import toast from 'react-hot-toast';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { Review } from '@/types';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = useLocale() as Locale;
    const t = useTranslations('Product');
    const tCommon = useTranslations('Common');
    const productId = params.productId as string;

    const { user } = useAuth();
    const { getProductById, loading } = useProduct();
    const product = getProductById(productId);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { getUserReview, hasUserReviewed } = useReview();

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [canReview, setCanReview] = useState(false);

    // Initialize selections when product loads
    useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes[2] || product.sizes[0] || '');
            setSelectedColor(product.colors[0] || null);
        }
    }, [product]);

    // Check if user can review
    useEffect(() => {
        const checkUserReview = async () => {
            if (user && productId) {
                const reviewed = await hasUserReviewed(productId, user.id);
                const review = await getUserReview(productId, user.id);
                setCanReview(!reviewed);
                setUserReview(review);
            } else {
                setCanReview(false);
                setUserReview(null);
            }
        };
        checkUserReview();
    }, [user, productId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-500">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Product not found</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Check if product is not published
    if (!product.isPublished) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">This product is not available</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const isFavorite = isInWishlist(product.id);
    const displayPrice = product.salePrice || product.price;
    const originalPrice = product.salePrice ? product.price : null;

    // Get localized product data
    const productName = getProductName(product, locale);
    const productDescription = getProductDescription(product, locale);
    const productCategory = getProductCategory(product, locale);

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
        if (!selectedColor) {
            toast.error(t('selectColor'));
            return;
        }

        addToCart({
            productId: product.id,
            productName: productName,
            productImage: product.images[0],
            quantity,
            size: selectedSize,
            color: selectedColor.name,
            price: product.price,
            salePrice: product.salePrice
        });

        const message = quantity > 1 ? t('addedToCart', { quantity }) : t('addedToCartSingle', { quantity });
        toast.success(message);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-4">
            {/* Mobile Back Button */}
            <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="font-semibold text-gray-900">{t('productDetails')}</span>
            </div>

            {/* Desktop Layout: 2 Columns */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Product Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] md:aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                            <Image
                                src={product.images[0]}
                                alt={productName}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Mobile: Wishlist on Image */}
                            <div className="md:hidden absolute top-4 right-4">
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isFavorite ? 'bg-black text-white' : 'bg-white text-gray-700'
                                        }`}
                                >
                                    <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="bg-white md:bg-transparent rounded-t-3xl md:rounded-none -mt-6 md:mt-0 relative px-6 md:px-0 pt-6 md:pt-0">
                        {/* Product Name */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {productName}
                        </h1>

                        {/* Category */}
                        <p className="text-sm text-gray-500 mb-3">{productCategory}</p>

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
                            {(() => {
                                const description = product.description || product.description_en || product.description_th || '';
                                return (
                                    <>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {showFullDescription
                                                ? description
                                                : description.slice(0, 100)}
                                            {!showFullDescription && description.length > 100 && '...'}
                                        </p>
                                        {description.length > 100 && (
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="text-sm font-semibold text-gray-900 mt-1"
                                            >
                                                {showFullDescription ? 'Read Less' : 'Read More...'}
                                            </button>
                                        )}
                                    </>
                                );
                            })()}
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
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white py-4 rounded-full flex items-center justify-center gap-3 font-semibold text-lg hover:bg-gray-800 transition-colors"
                            >
                                <ShoppingCart size={24} />
                                <span>Add to Cart | ${displayPrice.toFixed(2)}</span>
                                {originalPrice && (
                                    <span className="line-through text-gray-400 text-sm">
                                        ${originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </button>

                            {/* Desktop: Wishlist Button */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`hidden md:flex w-14 h-14 rounded-full items-center justify-center border-2 transition-all ${isFavorite
                                    ? 'bg-black border-black text-white'
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                <Heart size={24} className={isFavorite ? 'fill-white' : ''} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="max-w-7xl mx-auto pt-6 pb-24 md:pb-8">
                    <div className="bg-white rounded-lg p-6 space-y-6">
                        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>

                        {/* Write Review Button / Form */}
                        {user ? (
                            <div>
                                {!showReviewForm && canReview && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Write a Review
                                    </button>
                                )}

                                {showReviewForm && canReview && (
                                    <ReviewForm
                                        productId={productId}
                                        onSuccess={() => {
                                            setShowReviewForm(false);
                                            setCanReview(false);
                                            // Refresh user review
                                            getUserReview(productId, user.id).then(setUserReview);
                                        }}
                                        onCancel={() => setShowReviewForm(false)}
                                    />
                                )}

                                {!canReview && userReview && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            You have already reviewed this product. You can edit or delete your review below.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    Please{' '}
                                    <button
                                        onClick={() => router.push(`/${locale}/login`)}
                                        className="text-black font-semibold underline"
                                    >
                                        sign in
                                    </button>{' '}
                                    to write a review.
                                </p>
                            </div>
                        )}

                        {/* Reviews List */}
                        <ReviewList productId={productId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
