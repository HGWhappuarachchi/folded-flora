-- Add support for multiple images per product
-- Run this in your Supabase SQL Editor

-- Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id, display_order);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public can read images
CREATE POLICY "Allow public read access to product images"
ON public.product_images
FOR SELECT
TO public
USING (true);

-- Authenticated users can manage images
CREATE POLICY "Allow authenticated users to insert product images"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product images"
ON public.product_images
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product images"
ON public.product_images
FOR DELETE
TO authenticated
USING (true);
