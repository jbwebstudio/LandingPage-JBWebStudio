/**
 * Blog Article Modern - JavaScript functionality
 * Handles modern blog article interactions and enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog article functionality
    initBlogArticle();
    initReadingProgress();
    initSmoothScrolling();
    initTableOfContents();
});

/**
 * Initialize blog article functionality
 */
function initBlogArticle() {
    // Add reading time calculation
    calculateReadingTime();
    
    // Initialize code syntax highlighting if needed
    initCodeHighlighting();
    
    // Initialize image lazy loading
    initImageLazyLoading();
}

/**
 * Calculate and display reading time
 */
function calculateReadingTime() {
    const article = document.querySelector('article, .blog-content, .article-content');
    if (!article) return;
    
    const text = article.textContent || article.innerText;
    const wordsPerMinute = 200; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    // Find reading time element and update it
    const readingTimeElement = document.querySelector('.reading-time, .article-meta .time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min de lectura`;
    }
}

/**
 * Initialize reading progress indicator
 */
function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        const article = document.querySelector('article, .blog-content, .article-content');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const progress = Math.min(
            Math.max((scrollTop - articleTop + windowHeight / 3) / articleHeight, 0),
            1
        );
        
        progressBar.style.width = `${progress * 100}%`;
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize table of contents if present
 */
function initTableOfContents() {
    const toc = document.querySelector('.table-of-contents, .toc');
    if (!toc) return;
    
    const headings = document.querySelectorAll('h2, h3, h4');
    if (headings.length === 0) return;
    
    // Generate table of contents
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = `toc-${heading.tagName.toLowerCase()}`;
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    toc.appendChild(tocList);
}

/**
 * Initialize code syntax highlighting
 */
function initCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code, .code-block');
    
    codeBlocks.forEach(block => {
        // Add copy button to code blocks
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copiar código';
        
        copyButton.addEventListener('click', function() {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
        
        const wrapper = block.closest('pre') || block;
        wrapper.style.position = 'relative';
        wrapper.appendChild(copyButton);
    });
}

/**
 * Initialize image lazy loading
 */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Share functionality
 */
function shareArticle(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Export functions for global use
window.shareArticle = shareArticle;