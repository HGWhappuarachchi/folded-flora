import { createClient } from '@supabase/supabase-js'

// Supabase URL and Keys from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fqlaadogvhjrcznlpaxb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-hn-wyg6rL7BwZGLXRZW4A_CWWB1r9n'

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
})

// Type definitions for our database schema
export type Category = {
    id: string
    name: string
    slug: string
    created_at: string
    updated_at: string
}

export type Product = {
    id: string
    created_at: string
    title: string
    price: number
    discount_percentage: number
    description: string | null
    image_url: string | null
    category_id: string | null
    is_active: boolean
    updated_at: string
}

export type ProductImage = {
    id: string
    product_id: string
    image_url: string
    display_order: number
    created_at: string
}

export type ProductWithCategory = Product & {
    categories: Category | null
}

export type ProductWithImages = Product & {
    product_images: ProductImage[]
}
