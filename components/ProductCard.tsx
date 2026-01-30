'use client'

import Image from 'next/image'
import { ProductWithImages } from '@/utils/supabase/client'
import { useState } from 'react'
import ProductDetailModal from './ProductDetailModal'

interface ProductCardProps {
    product: ProductWithImages
    whatsappNumber: string
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
    const [showDetailModal, setShowDetailModal] = useState(false)

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click
        const finalPrice = product.discount_percentage > 0
            ? product.price * (1 - product.discount_percentage / 100)
            : product.price

        const message = encodeURIComponent(
            `Hi, I am interested in ${product.title} listed for LKR ${finalPrice.toFixed(2)}. Is it available?`
        )
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    const hasDiscount = product.discount_percentage > 0
    const originalPrice = product.price
    const discountedPrice = hasDiscount ? product.price * (1 - product.discount_percentage / 100) : product.price

    return (
        <>
            <div
                className="card overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowDetailModal(true)}
            >
                {/* Product Image */}
                <div className="relative h-64 w-full overflow-hidden bg-purple-100/20">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-4xl">🌸</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    {!product.is_active && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Sold Out
                        </div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && product.is_active && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                            {product.discount_percentage}% OFF
                        </div>
                    )}

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            View Details
                        </span>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {product.title}
                    </h3>

                    {product.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            {hasDiscount ? (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                            LKR {discountedPrice.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                            {originalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-gray-900">
                                    LKR {originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleWhatsAppClick}
                            disabled={!product.is_active}
                            className={`
                                px-5 py-2.5 rounded-lg font-semibold transition-all duration-300
                                ${product.is_active
                                    ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            Order
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Detail Modal */}
            {showDetailModal && (
                <ProductDetailModal
                    product={product}
                    whatsappNumber={whatsappNumber}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </>
    )
}
