// Open Graph Image Generator Script
// This script provides instructions for creating OG images

console.log(`
===========================================
Open Graph Image Generation Guide
===========================================

To create professional OG images for your app:

Option 1: Use Figma (Recommended)
----------------------------------
1. Create a 1200x630px canvas
2. Add your branding:
   - App name: "Second Semester"
   - Tagline: "학습, 일정, 할 일을 한눈에"
   - Background: Gradient (purple to blue)
   - Icons: Book, Calendar, CheckSquare
3. Export as PNG to /public/og-image.png

Option 2: Use Canva
-------------------
1. Search for "Open Graph" template (1200x630)
2. Customize with your brand colors
3. Download and save to /public/og-image.png

Option 3: Use Online Tools
--------------------------
- https://www.opengraph.xyz/
- https://ogimage.gallery/
- https://og-playground.vercel.app/

Current OG Image Requirements:
------------------------------
- Size: 1200x630px
- Format: PNG or JPG
- Location: /public/og-image.png
- Max file size: 8MB (recommended < 300KB)

Page-Specific Images (Optional):
--------------------------------
- /public/og-dashboard.png (Dashboard page)
- /public/og-attendance.png (Attendance page)
- /public/og-todos.png (Todos page)
- /public/og-report.png (Report page)

Design Tips:
-----------
1. Use high contrast text
2. Keep text large and readable
3. Include your logo/branding
4. Use consistent color scheme
5. Test on both light and dark backgrounds

===========================================
`);

// You can also use this with a library like @vercel/og or canvas
// For now, this serves as a guide for manual creation
