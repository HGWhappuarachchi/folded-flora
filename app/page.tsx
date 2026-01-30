'use client'

import { useEffect, useState } from 'react'
import { supabase, type ProductWithImages, type Category } from '@/utils/supabase/client'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

// WhatsApp number (remove country code + and spaces)
const WHATSAPP_NUMBER = '94771296311' // Update with actual number

export default function HomePage() {
    const [products, setProducts] = useState<ProductWithImages[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
        fetchProducts()
    }, [selectedCategory])

    async function fetchCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching categories:', error)
        } else {
            setCategories(data || [])
        }
    }

    async function fetchProducts() {
        setLoading(true)

        let query = supabase
            .from('products')
            .select(`
                *,
                product_images (
                    id,
                    image_url,
                    display_order
                )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (selectedCategory) {
            query = query.eq('category_id', selectedCategory)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching products:', error)
        } else {
            setProducts(data || [])
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                🌸 Folded Flora
                            </h1>
                            <p className="text-gray-600 mt-1">Handmade Paper Flowers</p>
                        </div>
                        <Link
                            href="/admin"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm text-pink-700 font-medium text-sm animate-fadeIn">
                        Handcrafted with love & care
                    </div>

                    <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight animate-scaleIn">
                        Beautiful Handmade<br />
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-size-200 animate-gradient bg-clip-text text-transparent">
                            Paper Flowers
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeIn animation-delay-500">
                        Everlasting beauty for your special moments. Crafted to perfection, ready to gift.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn animation-delay-1000">
                        <button
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>Browse Collection</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-full font-bold text-lg shadow-sm hover:border-pink-300 hover:text-pink-600 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>Custom Order</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`
              px-6 py-3 rounded-full font-semibold transition-all duration-300
              ${!selectedCategory
                                ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-gray-900 shadow-lg scale-105'
                                : 'bg-white/80 text-gray-700 hover:bg-white'
                            }
            `}
                    >
                        All Products
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`
                px-6 py-3 rounded-full font-semibold transition-all duration-300
                ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-gray-900 shadow-lg scale-105'
                                    : 'bg-white/80 text-gray-700 hover:bg-white'
                                }
              `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-600">No products available in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                whatsappNumber={WHATSAPP_NUMBER}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-white/70 backdrop-blur-md mt-20 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600">
                        © 2026 Folded Flora. All rights reserved. Made with ❤️
                    </p>
                </div>
            </footer>
        </div>
    )
}
