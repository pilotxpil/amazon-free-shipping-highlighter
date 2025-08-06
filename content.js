// Amazon Free Shipping to Israel Highlighter
// Content script that runs on Amazon pages

class FreeShippingHighlighter {
  constructor() {
    this.isEnabled = true;
    this.freeShippingKeywords = [
      'free shipping',
      'free delivery',
      'shipping included',
      'no shipping cost',
      'free standard shipping',
      'free expedited shipping'
    ];
    this.israelKeywords = [
      'israel',
      'israeli',
      'tel aviv',
      'jerusalem',
      'haifa',
      'beer sheva'
    ];
    this.init();
  }

  init() {
    console.log('Amazon Free Shipping Highlighter initialized');
    this.observePageChanges();
    this.scanPage();
  }

  // Observe DOM changes to handle dynamic content
  observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      if (this.isEnabled) {
        let shouldScan = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldScan = true;
          }
        });
        if (shouldScan) {
          setTimeout(() => this.scanPage(), 500);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Main scanning function
  scanPage() {
    if (!this.isEnabled) return;

    // Check if we're on a cart page
    if (this.isCartPage()) {
      this.scanCartPage();
    } else if (this.isProductPage()) {
      this.scanProductPage();
    } else if (this.isSearchPage()) {
      this.scanSearchPage();
    }
  }

  // Check if current page is cart page
  isCartPage() {
    return window.location.href.includes('/cart') || 
           document.querySelector('[data-name="Active Cart"]') ||
           document.querySelector('#sc-active-cart');
  }

  // Check if current page is product page
  isProductPage() {
    return window.location.href.includes('/dp/') || 
           document.querySelector('#productTitle');
  }

  // Check if current page is search results page
  isSearchPage() {
    return window.location.href.includes('/s?') || 
           document.querySelector('[data-component-type="s-search-results"]');
  }

  // Scan cart page for free shipping items
  scanCartPage() {
    console.log('Scanning cart page for free shipping items');
    
    // Look for cart items
    const cartItems = document.querySelectorAll('[data-name="Active Cart"] .sc-list-item, .sc-list-item, [data-asin]');
    
    cartItems.forEach((item, index) => {
      this.checkItemForFreeShipping(item, `cart-item-${index}`);
    });
  }

  // Scan product page for free shipping
  scanProductPage() {
    console.log('Scanning product page for free shipping');
    
    const productContainer = document.querySelector('#dp-container, #ppd');
    if (productContainer) {
      this.checkItemForFreeShipping(productContainer, 'product-page');
    }
  }

  // Scan search results page
  scanSearchPage() {
    console.log('Scanning search results for free shipping items');
    
    const searchResults = document.querySelectorAll('[data-component-type="s-search-result"], .s-result-item');
    
    searchResults.forEach((item, index) => {
      this.checkItemForFreeShipping(item, `search-result-${index}`);
    });
  }

  // Check individual item for free shipping
  checkItemForFreeShipping(item, itemId) {
    if (!item || item.hasAttribute('data-freeshipping-checked')) {
      return;
    }

    // Mark as checked to avoid duplicate processing
    item.setAttribute('data-freeshipping-checked', 'true');

    const itemText = item.textContent.toLowerCase();
    const hasFreeShipping = this.freeShippingKeywords.some(keyword => 
      itemText.includes(keyword)
    );

    const hasIsraelShipping = this.israelKeywords.some(keyword => 
      itemText.includes(keyword)
    );

    // Check for paid shipping keywords
    const paidShippingKeywords = [
      'shipping cost',
      'shipping fee',
      'delivery fee',
      'shipping charge',
      'delivery cost',
      'shipping & handling',
      's&h',
      'shipping and handling'
    ];

    const hasPaidShipping = paidShippingKeywords.some(keyword => 
      itemText.includes(keyword)
    );

    // Check for shipping information in specific elements
    const shippingElements = item.querySelectorAll('.a-text-bold, .a-size-base, .a-color-secondary, [data-testid="shipping-info"]');
    let foundFreeShipping = hasFreeShipping;
    let foundIsraelShipping = hasIsraelShipping;
    let foundPaidShipping = hasPaidShipping;

    shippingElements.forEach(element => {
      const elementText = element.textContent.toLowerCase();
      if (this.freeShippingKeywords.some(keyword => elementText.includes(keyword))) {
        foundFreeShipping = true;
      }
      if (this.israelKeywords.some(keyword => elementText.includes(keyword))) {
        foundIsraelShipping = true;
      }
      if (paidShippingKeywords.some(keyword => elementText.includes(keyword))) {
        foundPaidShipping = true;
      }
    });

    // Highlight based on shipping status
    if (foundFreeShipping) {
      this.highlightItem(item, itemId, foundIsraelShipping, 'free');
    } else if (foundPaidShipping) {
      this.highlightItem(item, itemId, false, 'paid');
    }
  }

  // Highlight item with appropriate border and background
  highlightItem(item, itemId, hasIsraelShipping, shippingType) {
    // Remove existing highlight classes
    item.classList.remove('freeshipping-highlight', 'freeshipping-israel', 'paidshipping-highlight');
    
    if (shippingType === 'free') {
      // Add highlight class for free shipping
      item.classList.add('freeshipping-highlight');
      
      // Add special class for Israel shipping if detected
      if (hasIsraelShipping) {
        item.classList.add('freeshipping-israel');
      }
    } else if (shippingType === 'paid') {
      // Add highlight class for paid shipping
      item.classList.add('paidshipping-highlight');
    }

    // Add visual indicator
    this.addShippingBadge(item, hasIsraelShipping, shippingType);
  }

  // Add a shipping badge to the item
  addShippingBadge(item, hasIsraelShipping, shippingType) {
    // Remove existing badges
    const existingBadges = item.querySelectorAll('.freeshipping-badge, .paidshipping-badge');
    existingBadges.forEach(badge => badge.remove());

    // Create new badge
    const badge = document.createElement('div');
    
    if (shippingType === 'free') {
      badge.className = 'freeshipping-badge';
      badge.textContent = hasIsraelShipping ? '🚚 Free Shipping to Israel' : '🚚 Free Shipping';
      badge.title = hasIsraelShipping ? 'This item has free shipping to Israel' : 'This item has free shipping';
    } else if (shippingType === 'paid') {
      badge.className = 'paidshipping-badge';
      badge.textContent = '💸 Paid Shipping';
      badge.title = 'This item has shipping costs';
    }

    // Insert badge at the top of the item
    if (item.firstChild) {
      item.insertBefore(badge, item.firstChild);
    } else {
      item.appendChild(badge);
    }
  }

  // Toggle highlighting on/off
  toggleHighlighting() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.removeAllHighlights();
    } else {
      this.scanPage();
    }
  }

  // Remove all highlights
  removeAllHighlights() {
    const highlightedItems = document.querySelectorAll('.freeshipping-highlight, .paidshipping-highlight');
    highlightedItems.forEach(item => {
      item.classList.remove('freeshipping-highlight', 'freeshipping-israel', 'paidshipping-highlight');
      const badges = item.querySelectorAll('.freeshipping-badge, .paidshipping-badge');
      badges.forEach(badge => badge.remove());
      item.removeAttribute('data-freeshipping-checked');
    });
  }
}

// Initialize the highlighter when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FreeShippingHighlighter();
  });
} else {
  new FreeShippingHighlighter();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    window.freeShippingHighlighter?.toggleHighlighting();
    sendResponse({ success: true });
  }
});

// Store reference globally for popup access
window.freeShippingHighlighter = new FreeShippingHighlighter(); 