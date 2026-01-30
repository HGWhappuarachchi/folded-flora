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
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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
            setEditingProduct(null) // Clear edit mode if deleting the product being edited
        }
    }

    function handleEdit(product: Product) {
        setEditingProduct(product)
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleSuccessAndClearEdit() {
        fetchProducts()
        setEditingProduct(null)
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
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-white/50 animate-scaleIn">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Sign in to manage your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-bold">
                                Folded Flora Store
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none"
                                    placeholder="admin@foldedflora.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {authLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-500 hover:text-pink-600 font-medium text-sm transition-colors flex items-center justify-center gap-1 mx-auto group"
                        >
                            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                            Back to Store
                        </button>
                    </div>
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
                            onSuccess={handleSuccessAndClearEdit}
                            editProduct={editingProduct}
                            onCancelEdit={() => setEditingProduct(null)}
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
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-xl font-bold text-gray-900">
                                                            LKR {product.price.toFixed(2)}
                                                        </p>
                                                        {product.discount_percentage > 0 && (
                                                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-semibold">
                                                                {product.discount_percentage}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                                                    >
                                                        Edit
                                                    </button>
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
                                                        {product.is_active ? 'Active' : 'Inactive'}
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
