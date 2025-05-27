/**
 * Ink Or Die Tattoos - Main JavaScript
 * Modern, performant, and accessible interactions
 */

// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let currentFilter = 'all';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFloatingGallery();
    initializePortfolio();

    initializeScrollEffects();
    initializeAnimations();
    initializeLightbox();
    initializeBusinessHours();
    
    console.log('🎨 Ink Or Die Tattoos website initialized successfully!');
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navigation
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // Add scrolled class for styling
                if (currentScrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                lastScrollY = currentScrollY;
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Mobile menu toggle (for future implementation)
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            console.log('Mobile menu toggle clicked');
            // Mobile menu implementation would go here
        });
    }
}

// ===== FLOATING GALLERY FUNCTIONALITY =====
function initializeFloatingGallery() {
    // Load images from the tattoos folder
    loadFloatingImages();
    
    async function loadFloatingImages() {
        const container = document.getElementById('floatingContainer');
        if (!container) return;
        
        // Available tattoo images
        const imageList = [
            'IMG_8684.jpeg',
            'IMG_8685.jpeg', 
            'IMG_8686.jpeg',
            'IMG_8687.jpeg',
            'IMG_8688.jpeg',
            'IMG_8689.jpeg',
            'IMG_8690.jpeg',
            'IMG_8691.jpeg'
        ];
        
        // Generate descriptions for each image
        const imageData = imageList.map((filename, index) => ({
            src: `/images/tattoos/${filename}`,
            title: generateImageTitle(filename),
            description: generateImageDescription(filename),
            id: `floating-${index}`
        }));
        
        // Clear container
        container.innerHTML = '';
        
        // Create floating images with progressive loading
        await createFloatingImagesProgressively(imageData, container);
        
        console.log(`🎨 Loaded ${imageData.length} floating images with performance optimization!`);
    }
    
    async function createFloatingImagesProgressively(imageData, container) {
        // Load first 4 images immediately (above the fold)
        const priorityImages = imageData.slice(0, 4);
        const deferredImages = imageData.slice(4);
        
        // Create priority images first
        priorityImages.forEach((image, index) => {
            createFloatingImage(image, index, container, true);
        });
        
        // Use requestAnimationFrame for smooth UI
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Load remaining images with slight delay to avoid blocking
        for (let i = 0; i < deferredImages.length; i++) {
            setTimeout(() => {
                const globalIndex = i + 4;
                createFloatingImage(deferredImages[i], globalIndex, container, false);
            }, i * 100); // 100ms delay between each image
        }
    }
    
    function createFloatingImage(imageData, index, container, isPriority = false) {
        const imageElement = document.createElement('div');
        imageElement.className = 'floating-image';
        imageElement.id = imageData.id;
        
        // Random positioning within container bounds
        const positions = getRandomPosition(index, container);
        imageElement.style.top = positions.top;
        imageElement.style.left = positions.left;
        
        // Create optimized image with performance features
        const img = createOptimizedImage(imageData, isPriority);
        
        imageElement.innerHTML = `
            <div class="image-info">
                <h4>${imageData.title}</h4>
                <p>${imageData.description}</p>
            </div>
        `;
        
        // Insert the optimized image
        imageElement.insertBefore(img, imageElement.firstChild);
        
        // Add click event using the existing lightbox system
        imageElement.addEventListener('click', () => openLightbox(imageData.src, imageData.title));
        
        container.appendChild(imageElement);
        
        // Add entrance animation
        requestAnimationFrame(() => {
            imageElement.style.opacity = '0';
            imageElement.style.transform = 'translateY(20px)';
            imageElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                imageElement.style.opacity = '1';
                imageElement.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    function createOptimizedImage(imageData, isPriority) {
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.title;
        
        // Performance optimizations
        if (isPriority) {
            img.loading = 'eager';
            img.fetchpriority = 'high';
        } else {
            img.loading = 'lazy';
            img.fetchpriority = 'low';
        }
        
        // Image optimization attributes
        img.decoding = 'async';
        
        // Placeholder while loading
        img.style.backgroundColor = '#f0f0f0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Handle load events for smooth appearance
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${imageData.src}`);
            this.style.backgroundColor = '#e0e0e0';
            this.style.opacity = '0.5';
        });
        
        return img;
    }
    
    function getRandomPosition(index, container) {
        const containerRect = container.getBoundingClientRect();
        const imageWidth = 200;
        const imageHeight = 250;
        const padding = 20;
        
        // Organized grid positions for cleaner layout
        const positions = [
            { top: '8%', left: '8%' },
            { top: '8%', left: '38%' },
            { top: '8%', left: '68%' },
            { top: '45%', left: '8%' },
            { top: '45%', left: '38%' },
            { top: '45%', left: '68%' },
            { top: '26%', left: '23%' },
            { top: '26%', left: '53%' }
        ];
        
        return positions[index % positions.length];
    }
    

    
    function generateImageTitle(filename) {
        const titles = [
            'Detailed Portrait Work',
            'Vibrant Color Design', 
            'Black & Gray Masterpiece',
            'Geometric Precision',
            'Realistic Portrait',
            'Custom Artwork',
            'Fine Line Work',
            'Bold Color Piece'
        ];
        
        const hash = filename.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        return titles[Math.abs(hash) % titles.length];
    }
    
    function generateImageDescription(filename) {
        const descriptions = [
            'Intricate details and expert shading',
            'Bold colors and striking composition',
            'Classic black and gray technique',
            'Precise geometric patterns',
            'Lifelike portrait artistry',
            'Unique custom design',
            'Delicate fine line technique',
            'Vibrant and eye-catching'
        ];
        
        const hash = filename.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        return descriptions[Math.abs(hash) % descriptions.length];
    }
    

}

// ===== PORTFOLIO FUNCTIONALITY =====
function initializePortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Preload portfolio images for better performance
    preloadPortfolioImages(portfolioItems);
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items with animation
            filterPortfolioItems(filter, portfolioItems);
            currentFilter = filter;
        });
    });
    
    // Initialize with all items visible
    showAllPortfolioItems(portfolioItems);
}

function preloadPortfolioImages(portfolioItems) {
    // Preload first few visible portfolio images
    const visibleItems = Array.from(portfolioItems).slice(0, 6);
    
    visibleItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img && img.src) {
            // Create image preloader
            const preloader = new Image();
            preloader.onload = () => {
                img.style.opacity = '1';
                img.classList.add('preloaded');
            };
            preloader.src = img.src;
            
            // Set initial opacity for smooth loading
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
}

function filterPortfolioItems(filter, items) {
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        // Add staggered animation delay
        setTimeout(() => {
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // Trigger reflow
                item.offsetHeight;
                
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        }, index * 100);
    });
}

function showAllPortfolioItems(items) {
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Trigger reflow
            item.offsetHeight;
            
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// ===== LIGHTBOX FUNCTIONALITY =====
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Close lightbox handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    
    if (lightbox && lightboxImage && lightboxTitle) {
        lightboxImage.src = imageSrc;
        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            lightboxImage.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 50);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (lightbox && lightboxImage) {
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImage.src = '';
        }, 300);
    }
}



// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    initializeBackToTop();
    initializeScrollAnimations();
    initializeImageLazyLoading();
}

function initializeImageLazyLoading() {
    // Enhanced lazy loading with Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .portfolio-item, .feature, .contact-card, .about-visual'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ===== GENERAL ANIMATIONS =====
function initializeAnimations() {
    // Hero images floating animation is handled by CSS
    // Add any additional JavaScript animations here
    
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const parallax = document.querySelector('.pattern-overlay');
                
                if (parallax) {
                    const speed = scrolled * 0.5;
                    parallax.style.transform = `translateY(${speed}px)`;
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // Skip to main content with keyboard
    if (e.altKey && e.key === 's') {
        const main = document.querySelector('main') || document.querySelector('#home');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Focus management for lightbox
    if (e.key === 'Tab') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            // Trap focus within lightbox
            const focusableElements = lightbox.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error occurred:', e.error);
    // You could send error reports to a logging service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Handle promise rejections
});

// ===== INSTAGRAM SHARE FUNCTIONALITY =====
function shareToInstagram() {
    // Create a beautiful portfolio compilation message
    const portfolioText = `🎨 Check out the incredible work at Ink Or Die Tattoos! 
    
✨ Female-owned tattoo studio in Decatur, GA
🌟 Custom designs & portrait work
💎 Professional artists & clean environment
📍 3407 Covington Dr, Decatur, GA 30032

Book your consultation today! 
📞 (404) 555-1234

#InkOrDieTattoos #DecaturTattoos #FemaleOwned #CustomTattoos #PortraitTattoos #TattooArt #GeorgiaInk #TattooStudio #InkMaster #TattooLife`;

    // Try to use Instagram's direct sharing if possible
    if (navigator.share) {
        navigator.share({
            title: 'Ink Or Die Tattoos - Amazing Portfolio!',
            text: portfolioText,
            url: window.location.href
        }).then(() => {
            showShareSuccess('Portfolio shared successfully!');
        }).catch((error) => {
            // Fallback to copy text
            fallbackInstagramShare(portfolioText);
        });
    } else {
        // Fallback for browsers without Web Share API
        fallbackInstagramShare(portfolioText);
    }
}

function fallbackInstagramShare(text) {
    // Copy text to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showInstagramShareModal();
        }).catch(() => {
            // Manual copy fallback
            copyToClipboardFallback(text);
            showInstagramShareModal();
        });
    } else {
        copyToClipboardFallback(text);
        showInstagramShareModal();
    }
}

function copyToClipboardFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Unable to copy text');
    }
    
    document.body.removeChild(textArea);
}

function showInstagramShareModal() {
    const modal = document.createElement('div');
    modal.className = 'instagram-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fab fa-instagram"></i>
                <h3>Share on Instagram</h3>
            </div>
            <div class="modal-body">
                <p>✅ Portfolio text copied to clipboard!</p>
                <p>Now you can:</p>
                <div class="share-steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span>Open Instagram app</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>Create a new post or story</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>Paste the copied text</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="open-instagram-btn" onclick="openInstagram()">
                        <i class="fab fa-instagram"></i>
                        Open Instagram
                    </button>
                    <button class="close-modal-btn" onclick="closeInstagramModal()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    addInstagramModalStyles();
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeInstagramModal();
        }
    }, 10000);
}

function openInstagram() {
    // Try to open Instagram app, fallback to web
    const instagramAppUrl = 'instagram://';
    const instagramWebUrl = 'https://www.instagram.com/';
    
    // Create hidden link to test app availability
    const link = document.createElement('a');
    link.href = instagramAppUrl;
    
    // Try app first, fallback to web
    setTimeout(() => {
        window.open(instagramWebUrl, '_blank');
    }, 500);
    
    try {
        window.location.href = instagramAppUrl;
    } catch (e) {
        window.open(instagramWebUrl, '_blank');
    }
    
    closeInstagramModal();
}

function closeInstagramModal() {
    const modal = document.querySelector('.instagram-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            // Remove styles
            const style = document.querySelector('#instagram-modal-styles');
            if (style) style.remove();
        }, 300);
    }
}

function addInstagramModalStyles() {
    if (document.querySelector('#instagram-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'instagram-modal-styles';
    style.textContent = `
        .instagram-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .instagram-modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow: auto;
            transform: scale(0.8);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instagram-modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            color: white;
            padding: 2rem;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        
        .modal-header i {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .modal-body p {
            text-align: center;
            margin-bottom: 1rem;
            color: #333;
        }
        
        .share-steps {
            margin: 1.5rem 0;
        }
        
        .step {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.8rem;
            margin-bottom: 0.5rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .step-number {
            width: 30px;
            height: 30px;
            background: linear-gradient(45deg, #f09433, #dc2743);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .open-instagram-btn {
            flex: 1;
            padding: 1rem;
            background: linear-gradient(45deg, #f09433, #dc2743);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .open-instagram-btn:hover {
            transform: translateY(-2px);
        }
        
        .close-modal-btn {
            flex: 1;
            padding: 1rem;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .close-modal-btn:hover {
            background: #4b5563;
        }
    `;
    
    document.head.appendChild(style);
}

function showShareSuccess(message) {
    // Simple success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(45deg, #22c55e, #16a34a);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
        z-index: 3000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== WEBSITE SHARE FUNCTIONALITY =====
function shareWebsite() {
    const websiteUrl = window.location.href;
    const shareTitle = "Ink Or Die Tattoos - Amazing Tattoo Studio in Decatur, GA";
    const shareText = `🎨 Check out Ink Or Die Tattoos! 

✨ Female-owned tattoo studio in Decatur, GA
🌟 Custom designs, portraits & cover-ups
💎 Professional artists & clean environment
📍 3407 Covington Dr, Decatur, GA 30032

Book your consultation today!
📞 (404) 555-1234

#InkOrDieTattoos #DecaturTattoos #FemaleOwned #CustomTattoos`;

    // Try native sharing first
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: websiteUrl
        }).then(() => {
            showShareSuccess('Website shared successfully!');
        }).catch((error) => {
            // Fallback to copy link
            fallbackWebsiteShare(websiteUrl, shareText);
        });
    } else {
        // Fallback for browsers without Web Share API
        fallbackWebsiteShare(websiteUrl, shareText);
    }
}

function fallbackWebsiteShare(url, text) {
    // Copy URL to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showWebsiteShareModal(url, text);
        }).catch(() => {
            // Manual copy fallback
            copyToClipboardFallback(url);
            showWebsiteShareModal(url, text);
        });
    } else {
        copyToClipboardFallback(url);
        showWebsiteShareModal(url, text);
    }
}

function showWebsiteShareModal(url, text) {
    const modal = document.createElement('div');
    modal.className = 'website-share-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-share-alt"></i>
                <h3>Share Website</h3>
            </div>
            <div class="modal-body">
                <p>✅ Website link copied to clipboard!</p>
                <div class="share-url-display">
                    <input type="text" value="${url}" readonly onclick="this.select()">
                    <button class="copy-btn" onclick="copyWebsiteUrl('${url}')">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <p>Share on your favorite platform:</p>
                <div class="share-platforms">
                    <button class="platform-btn facebook" onclick="shareOnFacebook('${url}', '${encodeURIComponent(text)}')">
                        <i class="fab fa-facebook-f"></i>
                        Facebook
                    </button>
                    <button class="platform-btn twitter" onclick="shareOnTwitter('${url}', '${encodeURIComponent(text)}')">
                        <i class="fab fa-twitter"></i>
                        Twitter
                    </button>
                    <button class="platform-btn whatsapp" onclick="shareOnWhatsApp('${url}', '${encodeURIComponent(text)}')">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </button>
                    <button class="platform-btn email" onclick="shareViaEmail('${url}', '${encodeURIComponent(text)}')">
                        <i class="fas fa-envelope"></i>
                        Email
                    </button>
                </div>
                <div class="modal-actions">
                    <button class="close-modal-btn" onclick="closeWebsiteShareModal()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    addWebsiteShareModalStyles();
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Auto close after 15 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeWebsiteShareModal();
        }
    }, 15000);
}

function shareOnFacebook(url, text) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    closeWebsiteShareModal();
}

function shareOnTwitter(url, text) {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank', 'width=600,height=400');
    closeWebsiteShareModal();
}

function shareOnWhatsApp(url, text) {
    window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, '_blank');
    closeWebsiteShareModal();
}

function shareViaEmail(url, text) {
    const subject = encodeURIComponent('Check out Ink Or Die Tattoos!');
    const body = encodeURIComponent(`${decodeURIComponent(text)}\n\nVisit: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    closeWebsiteShareModal();
}

function copyWebsiteUrl(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showShareSuccess('URL copied to clipboard!');
        });
    } else {
        copyToClipboardFallback(url);
        showShareSuccess('URL copied to clipboard!');
    }
}

function closeWebsiteShareModal() {
    const modal = document.querySelector('.website-share-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            const style = document.querySelector('#website-share-modal-styles');
            if (style) style.remove();
        }, 300);
    }
}

function addWebsiteShareModalStyles() {
    if (document.querySelector('#website-share-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'website-share-modal-styles';
    style.textContent = `
        .website-share-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .website-share-modal.show {
            opacity: 1;
        }
        
        .website-share-modal .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow: auto;
            transform: scale(0.8);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .website-share-modal.show .modal-content {
            transform: scale(1);
        }
        
        .website-share-modal .modal-header {
            background: var(--gradient-primary);
            color: white;
            padding: 2rem;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        
        .website-share-modal .modal-header i {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .website-share-modal .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .share-url-display {
            display: flex;
            gap: 0.5rem;
            margin: 1rem 0;
            padding: 0.8rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .share-url-display input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 0.9rem;
            color: #333;
        }
        
        .copy-btn {
            padding: 0.5rem;
            background: var(--accent-gold);
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .copy-btn:hover {
            background: #b8860b;
        }
        
        .share-platforms {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .platform-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.2s;
            color: white;
            font-weight: 600;
        }
        
        .platform-btn:hover {
            transform: translateY(-2px);
        }
        
        .platform-btn.facebook {
            background: #1877f2;
        }
        
        .platform-btn.twitter {
            background: #1da1f2;
        }
        
        .platform-btn.whatsapp {
            background: #25d366;
        }
        
        .platform-btn.email {
            background: #6b7280;
        }
        
        .platform-btn i {
            font-size: 1.5rem;
        }
    `;
    
    document.head.appendChild(style);
}

// ===== EXPORT FUNCTIONS FOR INLINE USAGE =====
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.shareToInstagram = shareToInstagram;
window.openInstagram = openInstagram;
window.closeInstagramModal = closeInstagramModal;
window.shareWebsite = shareWebsite;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareViaEmail = shareViaEmail;
window.copyWebsiteUrl = copyWebsiteUrl;
window.closeWebsiteShareModal = closeWebsiteShareModal;

// ===== BUSINESS HOURS FUNCTIONALITY =====
function initializeBusinessHours() {
    // Business hours configuration based on screenshot
    const businessHours = {
        1: { open: 11, close: 20 }, // Monday: 11AM-8PM
        2: { open: 11, close: 20 }, // Tuesday: 11AM-8PM
        3: { open: 11, close: 20 }, // Wednesday: 11AM-8PM
        4: { open: 11, close: 20 }, // Thursday: 11AM-8PM
        5: { open: 11, close: 20 }, // Friday: 11AM-8PM
        6: { open: 11, close: 20 }, // Saturday: 11AM-8PM
        0: { open: 13, close: 18 }  // Sunday: 1PM-6PM
    };
    
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
        updateBusinessStatus();
        
        // Update every minute
        setInterval(updateBusinessStatus, 60000);
    }, 100);
    
    function updateBusinessStatus() {
        const now = new Date();
        const currentDay = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour + (currentMinute / 60);
        
        const todayHours = businessHours[currentDay];
        const status = getBusinessStatus(currentTime, todayHours, now);
        
        updateBannerDisplay(status, now);
        updateBackToTopStatus(status);
    }
    
    function getBusinessStatus(currentTime, todayHours, now) {
        if (!todayHours) {
            return { type: 'closed', message: 'Closed Today' };
        }
        
        const { open, close } = todayHours;
        const closingSoonThreshold = close - 1; // 1 hour before closing
        const openingSoonThreshold = open - 1; // 1 hour before opening
        
        if (currentTime >= open && currentTime < close) {
            if (currentTime >= closingSoonThreshold) {
                const minutesUntilClose = Math.round((close - currentTime) * 60);
                return { 
                    type: 'closing-soon', 
                    message: `Closing in ${minutesUntilClose} minutes`,
                    nextChange: `Closes at ${formatTime(close)}`
                };
            }
            return { 
                type: 'open', 
                message: 'We\'re Open!',
                nextChange: `Closes at ${formatTime(close)}`
            };
        } else if (currentTime >= openingSoonThreshold && currentTime < open) {
            const minutesUntilOpen = Math.round((open - currentTime) * 60);
            return { 
                type: 'opening-soon', 
                message: `Opening in ${minutesUntilOpen} minutes`,
                nextChange: `Opens at ${formatTime(open)}`
            };
        } else {
            const nextOpenTime = getNextOpenTime(now, businessHours);
            return { 
                type: 'closed', 
                message: 'Currently Closed',
                nextChange: nextOpenTime
            };
        }
    }
    
    function getNextOpenTime(now, businessHours) {
        const currentDay = now.getDay();
        const currentTime = now.getHours() + (now.getMinutes() / 60);
        
        // Check if we can open today
        const todayHours = businessHours[currentDay];
        if (todayHours && currentTime < todayHours.open) {
            return `Opens today at ${formatTime(todayHours.open)}`;
        }
        
        // Find next opening day
        for (let i = 1; i <= 7; i++) {
            const nextDay = (currentDay + i) % 7;
            const nextDayHours = businessHours[nextDay];
            if (nextDayHours) {
                const dayName = getDayName(nextDay);
                return `Next open: ${dayName} at ${formatTime(nextDayHours.open)}`;
            }
        }
        
        return 'Check back soon';
    }
    
    function updateBannerDisplay(status, now) {
        const banner = document.getElementById('statusBanner');
        
        if (banner) {
            const statusText = banner.querySelector('.status-text');
            const currentTimeEl = banner.querySelector('.current-time');
            const nextChangeEl = banner.querySelector('.next-change');
            
            if (statusText && currentTimeEl && nextChangeEl) {
                // Update banner classes
                banner.className = `status-banner visible ${status.type}`;
                
                // Update content
                statusText.textContent = status.message;
                currentTimeEl.textContent = formatCurrentTime(now);
                nextChangeEl.textContent = status.nextChange || '';
            }
        }
    }
    
    function updateBackToTopStatus(status) {
        const backToTop = document.getElementById('backToTop');
        const tooltip = document.getElementById('statusTooltip');
        
        if (backToTop) {
            // Update back-to-top button with store status classes
            const currentClasses = backToTop.className.split(' ').filter(cls => 
                !['open', 'closed', 'closing-soon', 'opening-soon'].includes(cls)
            );
            backToTop.className = [...currentClasses, status.type].join(' ');
            
            if (tooltip) {
                let tooltipText = '';
                switch (status.type) {
                    case 'open':
                        tooltipText = '🟢 We\'re Open!';
                        break;
                    case 'closing-soon':
                        tooltipText = '🟡 Closing Soon';
                        break;
                    case 'closed':
                        tooltipText = '🔴 Currently Closed';
                        break;
                    case 'opening-soon':
                        tooltipText = '🔵 Opening Soon';
                        break;
                }
                
                tooltip.textContent = tooltipText;
            }
        }
    }
    
    function formatTime(hour) {
        if (hour === 12) return '12PM';
        if (hour === 0) return '12AM';
        if (hour > 12) return `${hour - 12}PM`;
        return `${hour}AM`;
    }
    
    function formatCurrentTime(now) {
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    function getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }
}

// ===== LOADING COMPLETE =====
window.addEventListener('load', () => {
    console.log('🚀 Ink Or Die Tattoos website fully loaded and ready!');
    
    // Hide any loading indicators
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Trigger any post-load animations
    document.body.classList.add('loaded');
});