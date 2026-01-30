# 🌸 Folded Flora - Handmade Paper Flowers E-commerce Catalog

A lightweight, beautiful e-commerce catalog for handmade paper flowers built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Supabase**.

![Folded Flora](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Features

### 🛍️ Public Frontend (`/`)
- **Hero Section**: Beautiful landing page with brand messaging
- **Category Filtering**: Dynamic tabs to browse products by category
- **Product Grid**: Responsive grid layout with product cards
- **WhatsApp Integration**: "Order via WhatsApp" button with pre-filled message
- **Real-time Updates**: Products update dynamically from Supabase
- **Pastel Aesthetic**: Minimalist design with soft, pleasing colors

### 🔐 Admin Dashboard (`/admin`)
- **Supabase Authentication**: Secure login for business owner
- **Product Management**: Full CRUD operations
- **Image Upload**: Direct upload to Supabase Storage with progress bar
- **Status Toggle**: Mark products as "In Stock" or "Sold Out"
- **Category Management**: Organize products by categories
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd /home/hiddala/project/Folded_Flora
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. This will create:
   - `categories` table
   - `products` table
   - `product-images` storage bucket
   - Row Level Security policies
   - Sample categories (Bouquets, Gift Boxes, etc.)

### 3. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in your Supabase project settings under **API**.

### 4. Update WhatsApp Number

Edit `app/page.tsx` and update the WhatsApp number:

```typescript
const WHATSAPP_NUMBER = '94712345678' // Replace with your number
```

**Format**: Country code + number (no spaces, no + sign)  
Example: `94712345678` for Sri Lanka

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the store!

## 📁 Project Structure

```
Folded_Flora/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── globals.css            # Global styles with Tailwind
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Public catalog (homepage)
├── components/
│   ├── ProductCard.tsx        # Product display card
│   └── ProductForm.tsx        # Add product form
├── utils/
│   └── supabase/
│       └── client.ts          # Supabase client config
├── supabase-schema.sql        # Database schema
├── .env.local                 # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS config
└── package.json               # Dependencies
```

## 🗄️ Database Schema

### Categories Table
```sql
- id: UUID (Primary Key)
- name: VARCHAR(100)
- slug: VARCHAR(100) UNIQUE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Products Table
```sql
- id: UUID (Primary Key)
- created_at: TIMESTAMP
- title: VARCHAR(200)
- price: DECIMAL(10, 2)
- description: TEXT
- image_url: TEXT
- category_id: UUID (Foreign Key)
- is_active: BOOLEAN
- updated_at: TIMESTAMP
```

## 🔒 Authentication

The admin dashboard is protected using Supabase Auth. To create an admin user:

1. Go to your Supabase project → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Use these credentials to log in to `/admin`

## 📤 Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the pastel palette:

```javascript
colors: {
  pastel: {
    pink: '#FFB3D9',
    peach: '#FFDAB9',
    lavender: '#E6E6FA',
    mint: '#B9F5D8',
    cream: '#FFFDD0',
  },
}
```

### WhatsApp Message
Edit the message template in `components/ProductCard.tsx`:

```typescript
const message = encodeURIComponent(
  `Hi, I am interested in ${product.title} listed for LKR ${product.price.toFixed(2)}. Is it available?`
)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Hosting**: Vercel (recommended)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:
1. Check the Supabase documentation
2. Verify your environment variables
3. Ensure RLS policies are correctly set up
4. Check browser console for errors

---

Made with ❤️ for Folded Flora
