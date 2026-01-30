'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Product, type Category } from '@/utils/supabase/client'
import ProductForm from '@/components/ProductForm'
import Image from 'next/image'

export default function AdminPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    // Authentication
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authLoading, setAuthLoading] = useState(false)

    useEffect(() => {
        checkUser()
    }, [])

    useEffect(() => {
        if (user) {
            fetchCategories()
            fetchProducts()
        }
    }, [user])

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
    }

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault()
        setAuthLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(`Sign in failed: ${error.message}`)
        } else {
            setUser(data.user)
        }

        setAuthLoading(false)
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        setUser(null)
        router.push('/')
    }

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
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching products:', error)
        } else {
            setProducts(data || [])
        }
    }

    async function toggleProductStatus(productId: string, currentStatus: boolean) {
        const { error } = await supabase
            .from('products')
            .update({ is_active: !currentStatus })
            .eq('id', productId)

        if (error) {
            alert(`Failed to update status: ${error.message}`)
        } else {
            fetchProducts()
        }
    }

    async function deleteProduct(productId: string) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (error) {
            alert(`Failed to delete product: ${error.message}`)
        } else {
            alert('Product deleted successfully!')
            fetchProducts()
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
            </div>
        )
    }

    // Login screen
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-2">🌸 Admin Login</h1>
                    <p className="text-gray-600 text-center mb-6">Folded Flora Dashboard</p>

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="admin@foldedflora.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full btn-primary"
                        >
                            {authLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        ← Back to Store
                    </button>
                </div>
            </div>
        )
    }

    // Admin Dashboard
    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your products</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/')}
                                className="btn-secondary"
                            >
                                View Store
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Product Form */}
                    <div className="lg:col-span-1">
                        <ProductForm
                            categories={categories}
                            onSuccess={fetchProducts}
                        />
                    </div>

                    {/* Products List */}
                    <div className="lg:col-span-2">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                All Products ({products.length})
                            </h2>

                            {products.length === 0 ? (
                                <p className="text-gray-600 text-center py-8">No products yet. Add your first product!</p>
                            ) : (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-pink-300 transition-all"
                                        >
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-purple-100/20 flex-shrink-0">
                                                    {product.image_url ? (
                                                        <Image
                                                            src={product.image_url}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="96px"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-3xl">
                                                            🌸
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {product.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-1">
                                                        {product.description || 'No description'}
                                                    </p>
                                                    <p className="text-xl font-bold text-gray-900 mt-1">
                                                        LKR {product.price.toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => toggleProductStatus(product.id, product.is_active)}
                                                        className={`
                              px-4 py-2 rounded-lg font-semibold text-sm transition-all
                              ${product.is_active
                                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                                : 'bg-gray-400 text-white hover:bg-gray-500'
                                                            }
                            `}
                                                    >
                                                        {product.is_active ? 'In Stock' : 'Sold Out'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
