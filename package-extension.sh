#!/bin/bash

# Chrome Web Store Extension Packager
# This script creates a ZIP file ready for Chrome Web Store submission

echo "🚚 Packaging Amazon Free Shipping Highlighter for Chrome Web Store..."

# Create a temporary directory for packaging
TEMP_DIR="chrome-store-package"
ZIP_NAME="amazon-free-shipping-highlighter.zip"

# Clean up any existing package
rm -rf "$TEMP_DIR"
rm -f "$ZIP_NAME"

# Create temporary directory
mkdir -p "$TEMP_DIR"

# Copy required files for Chrome Web Store
echo "📁 Copying extension files..."
cp manifest.json "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"
cp icon16.png "$TEMP_DIR/"
cp icon48.png "$TEMP_DIR/"
cp icon128.png "$TEMP_DIR/"

# Create ZIP file
echo "📦 Creating ZIP package..."
cd "$TEMP_DIR"
zip -r "../$ZIP_NAME" .
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo "✅ Extension packaged successfully!"
echo "📦 Package created: $ZIP_NAME"
echo ""
echo "📋 Files included in package:"
echo "   - manifest.json"
echo "   - content.js"
echo "   - popup.html"
echo "   - popup.js"
echo "   - styles.css"
echo "   - icon16.png"
echo "   - icon48.png"
echo "   - icon128.png"
echo ""
echo "🚀 Next steps:"
echo "   1. Go to Chrome Web Store Developer Dashboard"
echo "   2. Upload $ZIP_NAME"
echo "   3. Fill in store listing information"
echo "   4. Add screenshots and promotional images"
echo "   5. Submit for review"
echo ""
echo "📖 See publishing-guide.md for detailed instructions" 