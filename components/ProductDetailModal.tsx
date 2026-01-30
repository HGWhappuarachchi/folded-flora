'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProductWithImages } from '@/utils/supabase/client'

interface ProductDetailModalEnhancedProps {
    product: ProductWithImages
    whatsappNumber: string
    onClose: () => void
}

export default function ProductDetailModalEnhanced({ product, whatsappNumber, onClose }: ProductDetailModalEnhancedProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    // Get all images (product_images + main image_url as fallback)
    const allImages = product.product_images && product.product_images.length > 0
        ? product.product_images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
        : product.image_url
            ? [product.image_url]
            : []

    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    const handleWhatsAppClick = () => {
        const finalPrice = product.discount_percentage > 0
            ? product.price * (1 - product.discount_percentage / 100)
            : product.price

        const message = encodeURIComponent(
            `Hi, I am interested in ${product.title} listed for LKR ${finalPrice.toFixed(2)}. Is it available?`
        )
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    const originalPrice = product.price
    const hasDiscount = product.discount_percentage > 0
    const discountedPrice = hasDiscount ? product.price * (1 - product.discount_percentage / 100) : product.price

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-red-50 hover:text-red-600 transition-all hover:rotate-90 duration-300 group"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6 text-gray-700 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
                    {/* Left Side - Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-2xl group">
                            {allImages.length > 0 ? (
                                <>
                                    <Image
                                        src={allImages[selectedImageIndex]}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />

                                    {/* Image Navigation Arrows */}
                                    {allImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-400 text-9xl">🌸</span>
                                </div>
                            )}

                            {/* Status Badge */}
                            {!product.is_active && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse">
                                    Sold Out
                                </div>
                            )}

                            {/* Discount Badge */}
                            {hasDiscount && product.is_active && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-size-200 animate-gradient text-white px-5 py-2 rounded-full text-base font-bold shadow-xl flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {product.discount_percentage}% OFF
                                </div>
                            )}

                            {/* Image Counter */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    {selectedImageIndex + 1} / {allImages.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`
                                            relative aspect-square rounded-lg overflow-hidden transition-all duration-300
                                            ${selectedImageIndex === index
                                                ? 'ring-4 ring-pink-500 scale-105 shadow-lg'
                                                : 'ring-2 ring-gray-300 hover:ring-pink-300 hover:scale-105 opacity-70 hover:opacity-100'
                                            }
                                        `}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Title */}
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                {product.title}
                            </h2>

                            {/* Price */}
                            <div className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-200">
                                {hasDiscount ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-size-200 animate-gradient bg-clip-text text-transparent">
                                                LKR {discountedPrice.toFixed(2)}
                                            </span>
                                            <span className="text-2xl text-gray-400 line-through">
                                                LKR {originalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                                Save LKR {(originalPrice - discountedPrice).toFixed(2)}
                                            </div>
                                            <span className="text-green-600 font-semibold flex items-center gap-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {product.discount_percentage}% Discount Applied!
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        LKR {originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-gray-200 my-6"></div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Product Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200 sm:col-span-2">
                                        <span className="text-gray-600 font-semibold block mb-1">Availability:</span>
                                        <p className={`font-bold text-lg ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.is_active ? 'In Stock' : 'Sold Out'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mt-6">
                            <button
                                onClick={handleWhatsAppClick}
                                disabled={!product.is_active}
                                className={`
                                    w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2
                                    ${product.is_active
                                        ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-500 bg-size-200 animate-gradient text-white hover:shadow-2xl hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                {product.is_active ? (
                                    <>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Order via WhatsApp
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Currently Unavailable
                                    </>
                                )}
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-4 px-6 rounded-2xl font-semibold text-lg text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
