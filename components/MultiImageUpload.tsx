'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageFile {
    file: File
    preview: string
    id: string
}

interface MultiImageUploadProps {
    images: ImageFile[]
    onChange: (images: ImageFile[]) => void
    maxImages?: number
}

export default function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        const newImages: ImageFile[] = []
        const remainingSlots = maxImages - images.length

        Array.from(files).slice(0, remainingSlots).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const preview = URL.createObjectURL(file)
                newImages.push({
                    file,
                    preview,
                    id: Math.random().toString(36).substring(7),
                })
            }
        })

        onChange([...images, ...newImages])
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const removeImage = (id: string) => {
        const updatedImages = images.filter((img) => img.id !== id)
        onChange(updatedImages)
    }

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...images]
        const [movedImage] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedImage)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                    ${dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}
                    ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => images.length < maxImages && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    disabled={images.length >= maxImages}
                />

                <div className="space-y-3">
                    <div className="text-5xl flex justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-700">
                            {images.length >= maxImages
                                ? `Maximum ${maxImages} images reached`
                                : 'Click or drag images here'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {images.length}/{maxImages} images uploaded
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={img.id}
                            className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200"
                        >
                            {/* Image Preview */}
                            <div className="relative aspect-square">
                                <Image
                                    src={img.preview}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="200px"
                                />

                                {/* Order Badge */}
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                    {index + 1}
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-2">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                                        {/* Move Left */}
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => moveImage(index, index - 1)}
                                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                                                title="Move left"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img.id)}
                                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                            title="Remove"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Move Right */}
                                        {index < images.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => moveImage(index, index + 1)}
                                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                                                title="Move right"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Image Info */}
                            <div className="p-2 bg-gray-50">
                                <p className="text-xs text-gray-600 truncate">
                                    {img.file.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {(img.file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 italic">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>First image will be the main product image. Drag to reorder or use arrow buttons.</p>
                </div>
            )}
        </div>
    )
}
