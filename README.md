# Glass Hut Website

Welcome to the Glass Hut website! This is a beautiful, animated website for showcasing glass bangle collections.

## 📁 File Structure

```
glass-hut-website/
│
├── index.html              # Main HTML file
├── README.md              # This file
│
├── css/
│   └── style.css          # All website styles
│
├── js/
│   └── main.js            # All JavaScript functionality
│
├── images/
│   ├── logo/              # Logo images go here
│   │   └── glass-hut-logo.png
│   ├── products/          # Product images go here
│   │   ├── radiant-ruby.jpg
│   │   ├── emerald-dreams.jpg
│   │   ├── golden-sunset.jpg
│   │   ├── royal-sapphire.jpg
│   │   ├── crystal-clear.jpg
│   │   └── rainbow-bliss.jpg
│   └── banners/           # Banner images (if needed)
│
└── data/
    └── products.json      # Product data (EASY TO EDIT!)
```

## 🎨 How to Add New Collections/Products

### Method 1: Edit JSON File (Recommended - EASIEST!)

1. Open `data/products.json`
2. Add a new product entry like this:

```json
{
  "id": 7,
  "name": "Your Collection Name",
  "description": "Description of your bangles",
  "price": "1,599",
  "image": "images/products/your-image.jpg",
  "badge": "New Arrival",
  "category": "traditional",
  "meeshoLink": "https://www.meesho.com/your-product-link"
}
```

3. Save the file
4. Upload your product image to `images/products/`
5. Done! The website will automatically display the new product with "Buy Now" button

### 🛒 Meesho Integration

Your website includes **"Buy Now" buttons** that redirect to your Meesho product pages!

**How it works:**
1. Customers browse your beautiful website
2. Click "Buy Now" on products they like
3. Redirected to your Meesho product page
4. Complete purchase on Meesho

**See full guide:** [MEESHO-INTEGRATION-GUIDE.md](MEESHO-INTEGRATION-GUIDE.md)

### Badge Options:
- "New Arrival" - Shows a gold badge
- "Best Seller" - Shows a gold badge
- "Premium" - Shows a gold badge
- "Trending" - Shows a gold badge
- "" - No badge (leave empty)

### Category Options:
- "traditional" - Traditional designs
- "colorful" - Colorful collections
- "premium" - Premium range
- "modern" - Modern styles

## 📸 How to Add Product Images

1. Prepare your image:
   - Recommended size: 800x800 pixels
   - Format: JPG or PNG
   - Name it descriptively (e.g., `pink-paradise-collection.jpg`)

2. Upload to `images/products/`

3. Update the `products.json` file with the image path:
   ```json
   "image": "images/products/pink-paradise-collection.jpg"
   ```

## 🎯 How to Change Logo

1. Replace `images/logo/glass-hut-logo.png` with your logo
2. Keep the same filename OR update `index.html`:
   - Find: `<img src="images/logo/glass-hut-logo.png"`
   - Replace with your logo filename

## 🚀 How to Upload to GitHub Pages

### Step 1: Create GitHub Account
- Go to https://github.com
- Sign up for free

### Step 2: Create Repository
1. Click "New Repository"
2. Name it: `glass-hut` (or any name)
3. Make it Public
4. Click "Create Repository"

### Step 3: Upload Files
1. Click "uploading an existing file"
2. Drag and drop ALL files and folders
3. Click "Commit changes"

### Step 4: Enable GitHub Pages
1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main → /root
4. Click Save

### Step 5: View Your Website
- Your site will be live at: `https://yourusername.github.io/glass-hut`
- Wait 2-3 minutes for deployment

## 🌐 Alternative: Upload to AWS S3 (12 months free)

1. Create AWS account at https://aws.amazon.com
2. Go to S3 service
3. Create bucket named `glass-hut-website`
4. Upload all files
5. Enable Static Website Hosting
6. Make bucket public
7. Access via S3 URL

## 💡 Tips

### Adding Multiple Products at Once:
Just add multiple product objects in `products.json`:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Collection 1",
      ...
    },
    {
      "id": 2,
      "name": "Collection 2",
      ...
    }
  ]
}
```

### Product Display Order:
- Products appear in the order listed in `products.json`
- First product = top-left position
- Rearrange JSON to change display order

### Removing Products:
- Simply delete the product object from `products.json`
- Or comment it out with `//` (JavaScript style)

## 🎨 Customization

### Change Colors:
Edit `css/style.css`:
- Gold color: Search for `#d4af37` and replace
- Background: Search for gradient values

### Change Fonts:
Edit `css/style.css`:
- Find: `font-family: 'Segoe UI'`
- Replace with your preferred font

### Change Text:
Edit `index.html`:
- Hero title, tagline, about section, etc.

## 📞 Support

For any issues or questions:
- Check if all files are uploaded
- Verify image paths are correct
- Check browser console for errors (F12)

## ✅ Checklist Before Going Live

- [ ] Logo uploaded and displays correctly
- [ ] All product images uploaded
- [ ] `products.json` updated with correct paths
- [ ] Tested on mobile and desktop
- [ ] Social media links updated
- [ ] Contact information added

## 🎉 You're Ready!

Your website is now ready to go live. Just upload to GitHub Pages or AWS S3!
