// Amazon Free Shipping to Israel Highlighter
// Content script that runs on Amazon pages

class FreeShippingHighlighter {
  constructor() {
    this.isEnabled = true;
    this.affiliateId = 'ambaco-20';
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
    console.log('Affiliate ID set to:', this.affiliateId);
    this.ensureAffiliateIdInUrl();
    this.observePageChanges();
    this.setupClickInterception();
    this.setupPeriodicCheck();
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
          setTimeout(() => {
            this.scanPage();
            this.addAffiliateIdToLinks();
            this.ensureAffiliateIdInUrl();
          }, 500);
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

    // Add affiliate ID to links first
    this.addAffiliateIdToLinks();

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
    
    // Look for the product details section with a-box-group class
    const productDetailsContainer = document.querySelector('.a-box-group');
    if (productDetailsContainer) {
      this.checkItemForFreeShipping(productDetailsContainer, 'product-page');
    } else {
      // Fallback to other product containers if a-box-group is not found
      const productContainer = document.querySelector('#dp-container, #ppd, #centerCol');
      if (productContainer) {
        this.checkItemForFreeShipping(productContainer, 'product-page');
      }
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
    
    // Debug logging for product pages
    if (itemId === 'product-page') {
      console.log('Checking product page for shipping info...');
      console.log('Item text preview:', itemText.substring(0, 200) + '...');
    }
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
    // For product pages, focus on shipping-related sections
    const shippingSelectors = [
      '.a-box-group', // Product details box
      '[data-testid="shipping-info"]', // Shipping info test ID
      '.a-section', // Amazon sections
      '.a-text-bold', // Bold text elements
      '.a-size-base', // Base size text
      '.a-color-secondary', // Secondary color text
      '#delivery-block', // Delivery block
      '.delivery-block', // Delivery block class
      '.shipping-info', // Shipping info class
      '.a-box-information' // Information boxes
    ];
    
    const shippingElements = item.querySelectorAll(shippingSelectors.join(', '));
    let foundFreeShipping = hasFreeShipping;
    let foundIsraelShipping = hasIsraelShipping;
    let foundPaidShipping = hasPaidShipping;

    shippingElements.forEach(element => {
      const elementText = element.textContent.toLowerCase();
      
      // Only consider elements that actually contain shipping-related keywords
      const hasShippingContext = this.freeShippingKeywords.some(keyword => elementText.includes(keyword)) ||
                                this.israelKeywords.some(keyword => elementText.includes(keyword)) ||
                                paidShippingKeywords.some(keyword => elementText.includes(keyword));
      
      if (hasShippingContext) {
        if (this.freeShippingKeywords.some(keyword => elementText.includes(keyword))) {
          foundFreeShipping = true;
        }
        if (this.israelKeywords.some(keyword => elementText.includes(keyword))) {
          foundIsraelShipping = true;
        }
        if (paidShippingKeywords.some(keyword => elementText.includes(keyword))) {
          foundPaidShipping = true;
        }
      }
    });

    // Debug logging for product pages
    if (itemId === 'product-page') {
      console.log('Shipping detection results:');
      console.log('- Found free shipping:', foundFreeShipping);
      console.log('- Found Israel shipping:', foundIsraelShipping);
      console.log('- Found paid shipping:', foundPaidShipping);
    }

    // Highlight based on shipping status
    // Be more conservative - only highlight if we're confident
    if (foundFreeShipping && !foundPaidShipping) {
      this.highlightItem(item, itemId, foundIsraelShipping, 'free');
    } else if (foundPaidShipping && !foundFreeShipping) {
      this.highlightItem(item, itemId, false, 'paid');
    } else if (foundFreeShipping && foundPaidShipping) {
      // If both are found, prioritize free shipping but note the conflict
      console.log('Conflicting shipping info detected - prioritizing free shipping');
      this.highlightItem(item, itemId, foundIsraelShipping, 'free');
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


  // Add affiliate ID to Amazon links
  addAffiliateIdToLinks() {
    if (!this.affiliateId) return;

    // Find all Amazon links on the page (more comprehensive selectors)
    const amazonLinks = document.querySelectorAll(`
      a[href*="amazon.com"],
      a[href*="amazon.co.uk"],
      a[href*="amazon.de"],
      a[href*="amazon.fr"],
      a[href*="amazon.it"],
      a[href*="amazon.es"],
      a[href*="amazon.ca"],
      a[href*="amazon.com.au"],
      a[href*="amazon.co.jp"],
      a[href*="amazon.in"],
      a[href*="amazon.com.br"],
      a[href*="amazon.com.mx"]
    `);
    
    amazonLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !link.hasAttribute('data-affiliate-processed')) {
        // Mark as processed to avoid duplicate processing
        link.setAttribute('data-affiliate-processed', 'true');
        
        // Check if link already has an affiliate ID
        if (!href.includes('tag=') && !href.includes('linkCode=')) {
          try {
            const url = new URL(href, window.location.origin);
            url.searchParams.set('tag', this.affiliateId);
            link.setAttribute('href', url.toString());
          } catch (e) {
            // Handle relative URLs or malformed URLs
            if (href.startsWith('/')) {
              const url = new URL(href, 'https://www.amazon.com');
              url.searchParams.set('tag', this.affiliateId);
              link.setAttribute('href', url.toString());
            }
          }
        }
      }
    });

    // Also handle form actions and other elements that might contain Amazon URLs
    this.addAffiliateIdToForms();
    this.addAffiliateIdToDataAttributes();
  }

  // Add affiliate ID to form actions
  addAffiliateIdToForms() {
    const forms = document.querySelectorAll('form[action*="amazon.com"]');
    forms.forEach(form => {
      const action = form.getAttribute('action');
      if (action && !action.includes('tag=') && !action.includes('linkCode=')) {
        try {
          const url = new URL(action, window.location.origin);
          url.searchParams.set('tag', this.affiliateId);
          form.setAttribute('action', url.toString());
        } catch (e) {
          // Handle relative URLs
          if (action.startsWith('/')) {
            const url = new URL(action, 'https://www.amazon.com');
            url.searchParams.set('tag', this.affiliateId);
            form.setAttribute('action', url.toString());
          }
        }
      }
    });
  }

  // Add affiliate ID to data attributes that might contain Amazon URLs
  addAffiliateIdToDataAttributes() {
    const elementsWithDataUrls = document.querySelectorAll('[data-url*="amazon.com"], [data-href*="amazon.com"]');
    elementsWithDataUrls.forEach(element => {
      const dataUrl = element.getAttribute('data-url') || element.getAttribute('data-href');
      if (dataUrl && !dataUrl.includes('tag=') && !dataUrl.includes('linkCode=')) {
        try {
          const url = new URL(dataUrl, window.location.origin);
          url.searchParams.set('tag', this.affiliateId);
          if (element.hasAttribute('data-url')) {
            element.setAttribute('data-url', url.toString());
          }
          if (element.hasAttribute('data-href')) {
            element.setAttribute('data-href', url.toString());
          }
        } catch (e) {
          // Handle relative URLs
          if (dataUrl.startsWith('/')) {
            const url = new URL(dataUrl, 'https://www.amazon.com');
            url.searchParams.set('tag', this.affiliateId);
            if (element.hasAttribute('data-url')) {
              element.setAttribute('data-url', url.toString());
            }
            if (element.hasAttribute('data-href')) {
              element.setAttribute('data-href', url.toString());
            }
          }
        }
      }
    });
  }

  // Ensure affiliate ID is in the current page URL
  ensureAffiliateIdInUrl() {
    if (this.isAmazonUrl(window.location.href)) {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('tag') && !url.searchParams.has('linkCode')) {
        url.searchParams.set('tag', this.affiliateId);
        // Update the URL without reloading the page
        window.history.replaceState({}, '', url.toString());
      }
    }
  }

  // Setup click event interception to catch all Amazon link clicks
  setupClickInterception() {
    // Intercept clicks on the document
    document.addEventListener('click', (event) => {
      const target = event.target;
      let link = target.closest('a');
      
      // If no link found, check if target is a link itself
      if (!link && target.tagName === 'A') {
        link = target;
      }
      
      if (link && link.href && this.isAmazonUrl(link.href)) {
        // Check if the link already has our affiliate ID
        if (!link.href.includes('tag=' + this.affiliateId) && !link.href.includes('linkCode=')) {
          event.preventDefault();
          
          // Add affiliate ID to the URL
          const url = new URL(link.href);
          url.searchParams.set('tag', this.affiliateId);
          
          // Navigate to the new URL
          window.location.href = url.toString();
        }
      }
    }, true); // Use capture phase to intercept before other handlers

    // Also intercept form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.action && this.isAmazonUrl(form.action)) {
        if (!form.action.includes('tag=' + this.affiliateId) && !form.action.includes('linkCode=')) {
          const url = new URL(form.action);
          url.searchParams.set('tag', this.affiliateId);
          form.action = url.toString();
        }
      }
    }, true);
  }

  // Setup periodic check to ensure all Amazon links have affiliate ID
  setupPeriodicCheck() {
    // Check every 2 seconds for new Amazon links
    setInterval(() => {
      if (this.isEnabled) {
        this.addAffiliateIdToLinks();
        this.ensureAffiliateIdInUrl();
      }
    }, 2000);
  }

  // Check if a URL is an Amazon URL
  isAmazonUrl(url) {
    const amazonDomains = [
      'amazon.com',
      'amazon.co.uk',
      'amazon.de',
      'amazon.fr',
      'amazon.it',
      'amazon.es',
      'amazon.ca',
      'amazon.com.au',
      'amazon.co.jp',
      'amazon.in',
      'amazon.com.br',
      'amazon.com.mx'
    ];
    
    try {
      const urlObj = new URL(url);
      return amazonDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (e) {
      return false;
    }
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