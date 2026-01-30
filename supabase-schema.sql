-- ========================================
-- FOLDED FLORA DATABASE SCHEMA
-- ========================================
-- This file contains the complete database schema for the Folded Flora e-commerce catalog.
-- Run this in your Supabase SQL Editor to set up the database.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Table: categories
-- ========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ========================================
-- Table: products
-- ========================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  discount_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on both tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Categories: Public read access
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
TO public
USING (true);

-- Categories: Authenticated users can insert/update/delete
CREATE POLICY "Allow authenticated users to manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Products: Public can read active products
CREATE POLICY "Allow public read access to active products"
ON public.products
FOR SELECT
TO public
USING (is_active = true OR auth.role() = 'authenticated');

-- Products: Authenticated users (admin) can insert
CREATE POLICY "Allow authenticated users to insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Products: Authenticated users (admin) can update
CREATE POLICY "Allow authenticated users to update products"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Products: Authenticated users (admin) can delete
CREATE POLICY "Allow authenticated users to delete products"
ON public.products
FOR DELETE
TO authenticated
USING (true);

-- ========================================
-- Storage Bucket for Product Images
-- ========================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public can read images
CREATE POLICY "Allow public read access to product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Storage Policy: Authenticated users can upload images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Storage Policy: Authenticated users can update images
CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Storage Policy: Authenticated users can delete images
CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- ========================================
-- Seed Data (Optional)
-- ========================================

-- Insert default categories
INSERT INTO public.categories (name, slug) VALUES
  ('Bouquets', 'bouquets'),
  ('Gift Boxes', 'gift-boxes'),
  ('Single Flowers', 'single-flowers'),
  ('Decorations', 'decorations')
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- Functions and Triggers
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for categories table
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Verification Queries
-- ========================================
-- Run these to verify your setup:

-- SELECT * FROM public.categories;
-- SELECT * FROM public.products;
-- SELECT * FROM storage.buckets WHERE id = 'product-images';
