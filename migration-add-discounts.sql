-- Migration to add discount_percentage to existing products table
-- Run this in your Supabase SQL Editor if you already have a products table

-- Add the discount_percentage column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5, 2) DEFAULT 0 
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Update existing products to have 0% discount
UPDATE public.products 
SET discount_percentage = 0 
WHERE discount_percentage IS NULL;
