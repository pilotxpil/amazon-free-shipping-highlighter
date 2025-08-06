# Chrome Web Store Publishing Guide

## Prerequisites
1. **Google Developer Account**: You need a Google account and must pay a one-time $5 registration fee
2. **Extension Files**: All your extension files are ready
3. **Store Assets**: Screenshots and promotional images

## Step 1: Create a Developer Account
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the $5 registration fee (one-time)
4. Accept the developer agreement

## Step 2: Prepare Your Extension Package
1. **Create a ZIP file** containing these files:
   ```
   amazon-free-shipping-highlighter.zip
   ├── manifest.json
   ├── content.js
   ├── popup.html
   ├── popup.js
   ├── styles.css
   ├── icon16.png
   ├── icon48.png
   └── icon128.png
   ```

2. **Exclude these files** from the ZIP:
   - README.md
   - .gitignore
   - store-assets/ (folder)
   - create-icons.html
   - generate-icons.html
   - icon.svg
   - Any other development files

## Step 3: Create Store Assets

### Required Images:
1. **Icon (128x128 PNG)**: `store-assets/icon-128.png` ✅ (already copied)
2. **Screenshot 1 (1280x800 PNG)**: Take a screenshot of your extension working on Amazon cart
3. **Screenshot 2 (1280x800 PNG)**: Take a screenshot of your extension on product pages
4. **Small Promotional Tile (440x280 PNG)**: Create a promotional image
5. **Large Promotional Tile (920x680 PNG)**: Create a larger promotional image

### How to Create Screenshots:
1. **Load your extension** in Chrome
2. **Go to Amazon.com** and add some items to cart
3. **Take screenshots** showing the green/red/blue highlighting
4. **Use browser dev tools** to set viewport to 1280x800
5. **Save as PNG** files

## Step 4: Submit to Chrome Web Store

### 1. Upload Package
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click "Add new item"
3. Upload your ZIP file
4. Fill in the store listing information

### 2. Store Listing Information
- **Item name**: "Amazon Free Shipping to Israel Highlighter"
- **Short description**: "Highlight products with free shipping to Israel on Amazon.com"
- **Detailed description**: Use the content from `store-listing.md`
- **Category**: "Shopping"
- **Language**: English

### 3. Images
- **Icon**: Upload `store-assets/icon-128.png`
- **Screenshots**: Upload your 2 screenshots
- **Promotional images**: Upload your promotional tiles

### 4. Privacy Policy
- **Privacy policy URL**: Link to your GitHub repository or create a simple webpage
- **Single purpose**: Yes (only highlights shipping information)
- **Data usage**: No personal data collected

### 5. Additional Information
- **Homepage URL**: Your GitHub repository URL
- **Support site**: Your GitHub repository URL
- **Store listing language**: English

## Step 5: Review and Submit
1. **Review all information** carefully
2. **Test your extension** one more time
3. **Submit for review**
4. **Wait for approval** (usually 1-3 business days)

## Step 6: After Publication
1. **Monitor reviews** and user feedback
2. **Update the extension** as needed
3. **Respond to user questions**
4. **Maintain the extension**

## Common Issues and Solutions

### Rejection Reasons:
- **Missing privacy policy**: Create and link a privacy policy
- **Poor description**: Use the detailed description provided
- **Low-quality screenshots**: Take clear, high-resolution screenshots
- **Functionality issues**: Test thoroughly before submitting

### Tips for Approval:
- **Clear description** of what the extension does
- **High-quality screenshots** showing the extension in action
- **Professional appearance** with good icons and images
- **No misleading claims** about functionality

## Post-Publication Checklist
- [ ] Extension is live on Chrome Web Store
- [ ] Update README.md with store link
- [ ] Monitor user reviews and feedback
- [ ] Plan future updates and improvements
- [ ] Consider adding analytics (optional) to track usage

## Support and Maintenance
- **User support**: Respond to reviews and issues
- **Updates**: Keep the extension working with Amazon's changes
- **Features**: Consider adding new features based on user feedback

---

**Good luck with your Chrome Web Store submission!** 🚀 