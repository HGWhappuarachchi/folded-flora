'use client'

import { useEffect, useState } from 'react'
import { supabase, type Product, type Category } from '@/utils/supabase/client'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

// WhatsApp number (remove country code + and spaces)
const WHATSAPP_NUMBER = '94771296311' // Update with actual number

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([])
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
            .select('*')
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
                            Admin
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Beautiful Handmade<br />Paper Flowers 🌺
                </h2>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Each piece is carefully crafted with love. Perfect for gifts, decorations, and special occasions.
                </p>
                <button
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-primary text-lg"
                >
                    Browse Collection
                </button>
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
