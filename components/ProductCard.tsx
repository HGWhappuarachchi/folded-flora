'use client'

import Image from 'next/image'
import { Product } from '@/utils/supabase/client'

interface ProductCardProps {
    product: Product
    whatsappNumber: string
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(
            `Hi, I am interested in ${product.title} listed for LKR ${product.price.toFixed(2)}. Is it available?`
        )
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="card overflow-hidden group">
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
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sold Out
                    </div>
                )}
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
                    <div>
                        <span className="text-2xl font-bold text-gray-900">
                            LKR {product.price.toFixed(2)}
                        </span>
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
                        Order via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    )
}
