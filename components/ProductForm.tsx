'use client'

import { useState, useRef, FormEvent, useEffect } from 'react'
import { supabase, type Category, type Product } from '@/utils/supabase/client'
import MultiImageUpload from './MultiImageUpload'

interface ImageFile {
    file: File
    preview: string
    id: string
}

interface ProductFormProps {
    categories: Category[]
    onSuccess: () => void
    editProduct?: Product | null
    onCancelEdit?: () => void
}

export default function ProductForm({ categories, onSuccess, editProduct, onCancelEdit }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        discount_percentage: '0',
        description: '',
        category_id: '',
    })

    const [imageFiles, setImageFiles] = useState<ImageFile[]>([])

    // Populate form when editing a product
    useEffect(() => {
        if (editProduct) {
            setFormData({
                title: editProduct.title,
                price: editProduct.price.toString(),
                discount_percentage: editProduct.discount_percentage.toString(),
                description: editProduct.description || '',
                category_id: editProduct.category_id || '',
            })
            setImageFiles([]) // Clear images when switching products
        } else {
            setImageFiles([]) // Clear images when canceling edit
        }
    }, [editProduct])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setUploadProgress(0)

        try {
            setUploadProgress(20)

            // Upload all images
            const uploadedImageUrls: { url: string; order: number }[] = []

            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i].file
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                    const filePath = `${fileName}`

                    const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(filePath, file)

                    if (uploadError) {
                        throw new Error(`Image ${i + 1} upload failed: ${uploadError.message}`)
                    }

                    // Get public URL
                    const { data: urlData } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(filePath)

                    uploadedImageUrls.push({ url: urlData.publicUrl, order: i })
                    setUploadProgress(20 + ((i + 1) / imageFiles.length) * 40)
                }
            }

            setUploadProgress(70)

            if (editProduct) {
                // Update existing product
                const updateData: any = {
                    title: formData.title,
                    price: parseFloat(formData.price),
                    discount_percentage: parseFloat(formData.discount_percentage),
                    description: formData.description || null,
                    category_id: formData.category_id || null,
                }

                // Update main image if first image was uploaded
                if (uploadedImageUrls.length > 0) {
                    updateData.image_url = uploadedImageUrls[0].url
                }

                const { error: updateError } = await supabase
                    .from('products')
                    .update(updateData)
                    .eq('id', editProduct.id)

                if (updateError) {
                    throw new Error(`Product update failed: ${updateError.message}`)
                }

                // Add new images to product_images table
                if (uploadedImageUrls.length > 0) {
                    const imageRecords = uploadedImageUrls.map((img) => ({
                        product_id: editProduct.id,
                        image_url: img.url,
                        display_order: img.order,
                    }))

                    const { error: imagesError } = await supabase
                        .from('product_images')
                        .insert(imageRecords)

                    if (imagesError) {
                        console.error('Failed to add some images:', imagesError)
                    }
                }

                alert('Product updated successfully!')
            } else {
                // Insert new product
                const { error: insertError, data: productData } = await supabase
                    .from('products')
                    .insert({
                        title: formData.title,
                        price: parseFloat(formData.price),
                        discount_percentage: parseFloat(formData.discount_percentage),
                        description: formData.description || null,
                        category_id: formData.category_id || null,
                        image_url: uploadedImageUrls.length > 0 ? uploadedImageUrls[0].url : null,
                        is_active: true,
                    })
                    .select()
                    .single()

                if (insertError || !productData) {
                    throw new Error(`Product creation failed: ${insertError?.message}`)
                }

                // Insert all images into product_images table
                if (uploadedImageUrls.length > 0) {
                    const imageRecords = uploadedImageUrls.map((img) => ({
                        product_id: productData.id,
                        image_url: img.url,
                        display_order: img.order,
                    }))

                    const { error: imagesError } = await supabase
                        .from('product_images')
                        .insert(imageRecords)

                    if (imagesError) {
                        console.error('Failed to add some images:', imagesError)
                    }
                }

                alert('Product added successfully!')
            }

            setUploadProgress(100)

            // Reset form
            setFormData({
                title: '',
                price: '',
                discount_percentage: '0',
                description: '',
                category_id: '',
            })
            setImageFiles([])

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            onSuccess()
            if (onCancelEdit) onCancelEdit()
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                {editProduct && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        ✕ Cancel
                    </button>
                )}
            </div>

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

            {/* Discount */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount (%) - Optional
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 10 for 10% off"
                />
                {parseFloat(formData.discount_percentage) > 0 && (
                    <p className="text-sm text-pink-600 mt-1">
                        Discounted price: LKR {(parseFloat(formData.price) * (1 - parseFloat(formData.discount_percentage) / 100)).toFixed(2)}
                    </p>
                )}
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
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Images (Up to 5)
                </label>
                <MultiImageUpload
                    images={imageFiles}
                    onChange={setImageFiles}
                    maxImages={5}
                />
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
                {loading ? (editProduct ? 'Updating Product...' : 'Adding Product...') : (editProduct ? 'Update Product' : 'Add Product')}
            </button>
        </form>
    )
}
