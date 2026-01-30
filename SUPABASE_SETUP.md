# 📋 Supabase Setup Guide for Folded Flora

Follow these steps to set up your Supabase backend for the Folded Flora e-commerce catalog.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended) or email
4. Click **"New project"**
5. Fill in the details:
   - **Name**: `folded-flora` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your location
   - **Pricing Plan**: Select **Free** tier
6. Click **"Create new project"**
7. Wait 2-3 minutes for the project to initialize

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the `supabase-schema.sql` file from this project
4. **Copy the entire contents** of the file
5. **Paste it** into the SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)
7. You should see a success message

**What this does:**
- Creates `categories` and `products` tables
- Sets up Row Level Security (RLS) policies
- Creates the `product-images` storage bucket
- Inserts sample categories (Bouquets, Gift Boxes, etc.)
- Sets up automatic timestamp updates

## Step 3: Verify the Setup

### Check Tables
1. Click **"Table Editor"** in the left sidebar
2. You should see two tables:
   - ✅ `categories` (with 4 sample categories)
   - ✅ `products` (empty initially)

### Check Storage
1. Click **"Storage"** in the left sidebar
2. You should see a bucket called:
   - ✅ `product-images` (public bucket)

## Step 4: Get Your API Credentials

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **API Keys**:
     - `anon` `public` key (safe to use in browser)
     - `service_role` key (⚠️ SECRET - never expose this)

4. Copy the **Project URL** and **anon public** key

## Step 5: Configure Your App

1. Open `.env.local` in your project root
2. Update with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Save the file**

⚠️ **IMPORTANT**: Never commit `.env.local` to Git! It's already in `.gitignore`.

## Step 6: Create an Admin User

To access the `/admin` dashboard, you need a user account:

1. In Supabase dashboard, click **"Authentication"** in the left sidebar
2. Click **"Users"** tab
3. Click **"Add user"** → **"Create new user"**
4. Fill in:
   - **Email**: Your admin email (e.g., `admin@foldedflora.com`)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: ✅ Yes (check this box)
5. Click **"Create user"**

You can now use these credentials to log in to `/admin`.

## Step 7: Test the Connection

1. Run your Next.js app:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. You should see:
   - ✅ The website loads successfully
   - ✅ Category tabs appear (Bouquets, Gift Boxes, etc.)
   - ✅ "No products available" message (normal - you haven't added any yet)

4. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
   - ✅ You should see a login screen
   - ✅ Log in with your admin credentials
   - ✅ You should see the admin dashboard

## Step 8: Add Your First Product

1. In the admin dashboard, fill in the product form:
   - **Title**: e.g., "Red Rose Bouquet"
   - **Price**: e.g., 2500
   - **Description**: e.g., "Beautiful handmade paper roses"
   - **Category**: Select "Bouquets"
   - **Image**: Upload a product photo

2. Click **"Add Product"**

3. Go back to the homepage ([http://localhost:3000](http://localhost:3000))

4. You should see your product! 🎉

## Troubleshooting

### "Missing Supabase environment variables" Error
- ✅ Check that `.env.local` exists in your project root
- ✅ Verify the file has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ **Restart your dev server** after changing `.env.local`

### Can't See Products on Homepage
- ✅ Check that products exist in Supabase (Table Editor → products)
- ✅ Verify `is_active` is set to `true`
- ✅ Check browser console for errors (F12)

### Can't Upload Images
- ✅ Verify the `product-images` bucket exists in Storage
- ✅ Check that RLS policies were created (see SQL schema)
- ✅ Ensure you're logged in as an admin

### "Row Level Security" Errors
- ✅ Re-run the entire `supabase-schema.sql` file
- ✅ Make sure you're logged in when trying to add/edit products

## Storage Bucket Permissions (If Needed)

If image uploads fail, manually set bucket to public:

1. Go to **Storage** → **Policies** → **product-images**
2. Ensure these policies exist:
   - **SELECT**: `Allow public read access to product images`
   - **INSERT**: `Allow authenticated users to upload product images`
   - **UPDATE**: `Allow authenticated users to update product images`
   - **DELETE**: `Allow authenticated users to delete product images`

If missing, re-run the SQL schema.

## Next Steps

✅ **Configure WhatsApp Number**: Edit `app/page.tsx` and update `WHATSAPP_NUMBER`  
✅ **Customize Colors**: Edit `tailwind.config.js` to match your brand  
✅ **Add Products**: Use the admin dashboard to populate your catalog  
✅ **Deploy to Vercel**: See README.md for deployment instructions  

---

🎉 **Congratulations!** Your Folded Flora backend is ready!
