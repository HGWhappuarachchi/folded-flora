'use client'

import { useState, useRef, FormEvent } from 'react'
import { supabase, type Category } from '@/utils/supabase/client'

interface ProductFormProps {
    categories: Category[]
    onSuccess: () => void
}

export default function ProductForm({ categories, onSuccess }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category_id: '',
        image: null as File | null,
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setUploadProgress(0)

        try {
            let imageUrl = null

            // Upload image if provided
            if (formData.image) {
                const fileExt = formData.image.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `${fileName}`

                setUploadProgress(30)

                const { error: uploadError, data } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, formData.image)

                if (uploadError) {
                    throw new Error(`Image upload failed: ${uploadError.message}`)
                }

                setUploadProgress(60)

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                imageUrl = urlData.publicUrl
            }

            setUploadProgress(80)

            // Insert product into database
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    title: formData.title,
                    price: parseFloat(formData.price),
                    description: formData.description || null,
                    category_id: formData.category_id || null,
                    image_url: imageUrl,
                    is_active: true,
                })

            if (insertError) {
                throw new Error(`Product creation failed: ${insertError.message}`)
            }

            setUploadProgress(100)

            // Reset form
            setFormData({
                title: '',
                price: '',
                description: '',
                category_id: '',
                image: null,
            })

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            alert('Product added successfully!')
            onSuccess()
        } catch (error) {
            console.error('Error adding product:', error)
            alert(error instanceof Error ? error.message : 'Failed to add product')
        } finally {
            setLoading(false)
            setUploadProgress(0)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Product</h2>

            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Title *
                </label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Rose Bouquet"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (LKR) *
                </label>
                <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 1500.00"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Brief description of the product..."
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                </label>
                <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="input-field"
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-300 file:text-gray-800 hover:file:bg-purple-300 transition-all"
                />
                {formData.image && (
                    <p className="text-sm text-gray-600 mt-2">
                        Selected: {formData.image.name}
                    </p>
                )}
            </div>

            {/* Progress Bar */}
            {loading && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-gradient-to-r from-pink-300 to-purple-300 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`
          w-full btn-primary
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                {loading ? 'Adding Product...' : 'Add Product'}
            </button>
        </form>
    )
}
