// Header scroll effect with smooth transition
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const faders = document.querySelectorAll('.fade-in-section');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('is-visible');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero-content');
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Load default products if JSON file not found
        loadDefaultProducts();
    }
}

// Display products in the grid
function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${(index % 6) * 0.1 + 0.1}s`;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${product.meeshoLink ? `<a href="${product.meeshoLink}" class="buy-now-btn" target="_blank" rel="noopener noreferrer">View on Meesho 🛒</a>` : ''}
            </div>
        `;
        
        // Add hover effect
        productCard.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        productCard.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        productGrid.appendChild(productCard);
    });
}

// Load default products if JSON is not available
function loadDefaultProducts() {
    const defaultProducts = [
        {
            name: "Radiant Ruby Collection",
            description: "Elegant red glass bangles with golden accents, perfect for festive occasions",
            image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800",
            badge: "New Arrival",
            meeshoLink: "https://www.meesho.com/your-product-link-1"
        },
        {
            name: "Emerald Dreams Set",
            description: "Beautiful green glass bangles with intricate designs and shimmer finish",
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
            badge: "Best Seller",
            meeshoLink: "https://www.meesho.com/your-product-link-2"
        },
        {
            name: "Golden Sunset Collection",
            description: "Warm amber tones with gold leaf patterns, ideal for evening wear",
            image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
            badge: "",
            meeshoLink: "https://www.meesho.com/your-product-link-3"
        },
        {
            name: "Royal Sapphire Set",
            description: "Deep blue glass bangles adorned with silver detailing, truly regal",
            image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800",
            badge: "Premium",
            meeshoLink: "https://www.meesho.com/your-product-link-4"
        },
        {
            name: "Crystal Clear Elegance",
            description: "Transparent glass bangles with delicate sparkle, versatile and timeless",
            image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800",
            badge: "",
            meeshoLink: "https://www.meesho.com/your-product-link-5"
        },
        {
            name: "Rainbow Bliss Collection",
            description: "Multicolored glass bangles set, vibrant and fun for any celebration",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
            badge: "Trending",
            meeshoLink: "https://www.meesho.com/your-product-link-6"
        }
    ];
    
    displayProducts(defaultProducts);
}

// Initialize products when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});
