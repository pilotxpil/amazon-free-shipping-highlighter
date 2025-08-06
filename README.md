# Amazon Free Shipping to Israel Highlighter

A Chrome extension that automatically highlights products with free shipping to Israel on Amazon.com.

## Features

- 🚚 **Automatic Detection**: Scans Amazon pages for free shipping information
- 🟢 **Green Highlighting**: Products with free shipping get green borders
- 🔵 **Blue Highlighting**: Special highlighting for products with free shipping to Israel
- 📍 **Badge System**: Clear shipping badges on highlighted products
- 🔄 **Dynamic Updates**: Works with Amazon's dynamic content loading
- 🎯 **Multiple Pages**: Works on cart, product, and search result pages

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list

### Method 2: Install from Chrome Web Store (Coming Soon)

*This extension will be available on the Chrome Web Store soon.*

## Usage

1. **Install the extension** using one of the methods above
2. **Navigate to Amazon.com** (any page)
3. **The extension will automatically start** highlighting products with free shipping
4. **Click the extension icon** in your toolbar to:
   - Toggle highlighting on/off
   - See the current status
   - View usage information

## How It Works

The extension scans Amazon pages for keywords related to free shipping, including:
- "free shipping"
- "free delivery"
- "shipping included"
- "no shipping cost"
- "free standard shipping"
- "free expedited shipping"

For Israel-specific shipping, it also looks for:
- "israel"
- "israeli"
- "tel aviv"
- "jerusalem"
- "haifa"
- "beer sheva"

## Supported Pages

- **Shopping Cart**: Highlights items in your cart with free shipping
- **Product Pages**: Highlights individual products with free shipping
- **Search Results**: Highlights products in search results with free shipping

## Visual Indicators

- **Green Border**: Product has free shipping
- **Blue Border**: Product has free shipping to Israel
- **Shipping Badge**: Clear label showing shipping status
- **Hover Effects**: Enhanced visual feedback on mouse hover

## Technical Details

- **Manifest Version**: 3 (Latest Chrome extension standard)
- **Permissions**: Only requires access to Amazon.com
- **Content Script**: Automatically injects on Amazon pages
- **Mutation Observer**: Detects dynamic content changes
- **Responsive Design**: Works on desktop and mobile Amazon layouts

## Development

### File Structure
```
├── manifest.json      # Extension configuration
├── content.js         # Main content script
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality
├── styles.css         # Highlighting styles
└── README.md          # This file
```

### Customization

You can modify the extension by editing:
- `content.js`: Change detection logic and keywords
- `styles.css`: Modify highlighting colors and effects
- `popup.html/js`: Customize the popup interface

## Troubleshooting

**Extension not working?**
1. Make sure you're on Amazon.com
2. Check that the extension is enabled in `chrome://extensions/`
3. Try refreshing the page
4. Check the browser console for any error messages

**Not highlighting products?**
1. Some products may not have explicit free shipping text
2. Amazon's layout may have changed (extension will be updated)
3. Try navigating to a different Amazon page

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 