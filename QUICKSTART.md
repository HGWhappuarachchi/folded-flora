# 🚀 Quick Start Guide - Folded Flora

## ✅ What's Been Set Up

Your Folded Flora e-commerce catalog is **fully configured** and ready to deploy! Here's what you have:

### 📦 **Deliverables (All Complete)**

1. ✅ **Supabase SQL Schema** (`supabase-schema.sql`)
   - Categories table
   - Products table
   - Storage bucket for images
   - Row Level Security policies
   - Sample data

2. ✅ **Utils Configuration** (`utils/supabase/client.ts`)
   - Supabase client setup
   - TypeScript type definitions

3. ✅ **Public Catalog** (`app/page.tsx`)
   - Hero section
   - Category filtering
   - Product grid
   - WhatsApp ordering integration

4. ✅ **Admin Dashboard** (`app/admin/page.tsx`)
   - Authentication (Supabase Auth)
   - Product management (CRUD)
   - Status toggling
   - Responsive design

5. ✅ **ProductForm Component** (`components/ProductForm.tsx`)
   - Image upload to Supabase Storage
   - Form validation
   - Progress tracking

6. ✅ **ProductCard Component** (`components/ProductCard.tsx`)
   - Product display
   - WhatsApp button integration
   - Sold-out status handling

---

## 🎯 Next Steps (In Order)

### Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Open the SQL Editor and run the entire contents of `supabase-schema.sql`
4. Navigate to Settings → API and copy:
   - Project URL
   - `anon` `public` key

**📖 Detailed guide**: See `SUPABASE_SETUP.md`

### Step 2: Configure Environment Variables (1 minute)

1. Open `.env.local` in this project
2. Replace the placeholder values with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

### Step 3: Create an Admin User (2 minutes)

1. In Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter your email and password
4. Check "Auto Confirm User"
5. Click "Create user"

### Step 4: Update WhatsApp Number (1 minute)

1. Open `app/page.tsx`
2. Find line 9:
   ```typescript
   const WHATSAPP_NUMBER = '94712345678' // Update with actual number
   ```
3. Replace with your WhatsApp number in format: `{country_code}{number}`
   - Example: `94712345678` (Sri Lanka)
   - Example: `14155552671` (USA)

### Step 5: Run the Development Server (10 seconds)

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing Your Setup

### Public Catalog ([http://localhost:3000](http://localhost:3000))
- ✅ Should load without errors
- ✅ Should show category tabs
- ✅ "No products" message is normal (you haven't added any yet)

### Admin Dashboard ([http://localhost:3000/admin](http://localhost:3000/admin))
- ✅ Should show login screen
- ✅ Log in with your admin credentials
- ✅ Should show the dashboard with "Add Product" form

### Add Your First Product
1. Fill in the product form:
   - Title: "Red Rose Bouquet"
   - Price: 2500
   - Description: "Beautiful handmade paper roses"
   - Category: Select "Bouquets"
   - Upload an image
2. Click "Add Product"
3. Go back to homepage
4. Your product should appear! 🎉

### Test WhatsApp Integration
1. Click "Order via WhatsApp" on a product
2. Should open WhatsApp with pre-filled message

---

## 🎨 Customization Options

### Change Colors
Edit `app/globals.css` to customize the pastel color scheme:

```css
body {
  background: linear-gradient(to bottom right, #FFFDD0, #FFDAB9, #FFB3D9);
}
```

### Change WhatsApp Message
Edit `components/ProductCard.tsx` line 13-15

### Add More Categories
Run this in Supabase SQL Editor:

```sql
INSERT INTO categories (name, slug) VALUES
  ('Centerpieces', 'centerpieces'),
  ('Wall Art', 'wall-art');
```

---

## 🚀 Deployment to Vercel (Free)

### Prerequisites
- Push your code to GitHub
- Create account at [vercel.com](https://vercel.com)

### Steps
1. Import your GitHub repository in Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click "Deploy"
4. Your site will be live in ~1 minute at `your-project.vercel.app`

---

## 📚 File Structure Overview

```
Folded_Flora/
├── app/
│   ├── admin/page.tsx          # Admin dashboard
│   ├── globals.css             # Custom styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Public catalog
├── components/
│   ├── ProductCard.tsx         # Product display component
│   └── ProductForm.tsx         # Product upload form
├── utils/
│   └── supabase/
│       └── client.ts           # Supabase configuration
├── supabase-schema.sql         # Database schema
├── .env.local                  # Environment variables (NOT in git)
├── SUPABASE_SETUP.md           # Detailed Supabase setup guide
└── README.md                  # Full documentation
```

---

## 🆘 Troubleshooting

### "Invalid Supabase credentials" error
- ✅ Check `.env.local` has correct URL and key
- ✅ Restart dev server with `npm run dev`

### Can't log in to admin
- ✅ Verify user exists in Supabase → Authentication → Users
- ✅ Check "Auto Confirm User" was enabled
- ✅ Try resetting password in Supabase dashboard

### Can't upload images
- ✅ Verify `product-images` bucket exists in Supabase → Storage
- ✅ Check RLS policies were created (re-run schema SQL)
- ✅ Must be logged in as admin

### Products don't show on homepage
- ✅ Check `is_active` is set to `true` in products table
- ✅ Verify products exist in Supabase Table Editor

---

## 📞 Support Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## ✨ Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Public Catalog | ✅ Ready | `/` |
| Category Filtering | ✅ Ready | `/` |
| WhatsApp Ordering | ✅ Ready | `ProductCard.tsx` |
| Admin Login | ✅ Ready | `/admin` |
| Add Products | ✅ Ready | `/admin` |
| Upload Images | ✅ Ready | `ProductForm.tsx` |
| Toggle Status | ✅ Ready | `/admin` |
| Delete Products | ✅ Ready | `/admin` |
| Mobile Responsive | ✅ Ready | All pages |
| Pastel Design | ✅ Ready | `globals.css` |

---

**🎉 Congratulations! Your Folded Flora catalog is ready to launch!**

*Just complete Steps 1-5 above and you'll be live in under 10 minutes.*
