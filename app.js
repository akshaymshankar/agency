// Metro Media House - Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollReveal();
    initTestimonialsCarousel();
    initFAQAccordion();
    initCTAButtons();
    initVideoInteractions();
});

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .stat-card, .video-card, .process-card, .problem-card, .testimonial-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stagger animation for grid items
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const totalSlides = 3;
    let autoplayInterval;
    let isAutoplayActive = true;
    
    // Update carousel position and indicators
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    // Go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Start autoplay
    function startAutoplay() {
        if (isAutoplayActive) {
            autoplayInterval = setInterval(nextSlide, 5000);
        }
    }
    
    // Stop autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        setTimeout(() => {
            if (isAutoplayActive) startAutoplay();
        }, 8000);
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        setTimeout(() => {
            if (isAutoplayActive) startAutoplay();
        }, 8000);
    });
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoplay();
            setTimeout(() => {
                if (isAutoplayActive) startAutoplay();
            }, 8000);
        });
    });
    
    // Pause autoplay on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            isAutoplayActive = false;
            stopAutoplay();
        });
        carousel.addEventListener('mouseleave', () => {
            isAutoplayActive = true;
            startAutoplay();
        });
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isSwipe = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwipe = true;
        stopAutoplay();
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isSwipe) return;
        currentX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', () => {
        if (!isSwipe) return;
        isSwipe = false;
        
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        setTimeout(() => {
            if (isAutoplayActive) startAutoplay();
        }, 8000);
    });
    
    // Initialize carousel
    updateCarousel();
    startAutoplay();
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                
                if (otherItem !== item) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('active');
                }
            });
            
            // Toggle current item with smooth animation
            if (isOpen) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
}

// CTA Button Interactions
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        // Add click effects
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.toLowerCase();
            
            if (buttonText.includes('book') || buttonText.includes('call') || buttonText.includes('discovery')) {
                e.preventDefault();
                showBookingModal();
            }
        });
        
        // Add ripple effect on click
        button.addEventListener('click', createRippleEffect);
    });
}

// Create ripple effect for buttons
function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Add ripple animation keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Video Interactions
function initVideoInteractions() {
    const videoCards = document.querySelectorAll('.video-card');
    const playButtons = document.querySelectorAll('.play-button-overlay');
    
    // Video card hover effects
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const playButton = card.querySelector('.play-button-overlay');
            if (playButton) {
                playButton.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const playButton = card.querySelector('.play-button-overlay');
            if (playButton) {
                playButton.style.transform = 'scale(1)';
            }
        });
        
        card.addEventListener('click', () => {
            showVideoModal(card);
        });
    });
    
    // Animate timer bars
    const timerBars = document.querySelectorAll('.timer-progress');
    timerBars.forEach((bar, index) => {
        const widths = ['30%', '45%', '60%', '75%'];
        setTimeout(() => {
            bar.style.width = widths[index % widths.length];
        }, 100 * index);
    });
}

// Booking Modal
function showBookingModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 18px;
        text-align: center;
        max-width: 500px;
        margin: 0 20px;
        transform: translateY(20px);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 16px;">
            Book Your Strategy Call
        </h3>
        <p style="color: #666; margin-bottom: 32px; line-height: 1.6;">
            Ready to build your profitable personal brand? Our team will reach out to schedule your free discovery call within 24 hours.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="confirm-btn" style="background: #f59e0b; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                Confirm Booking
            </button>
            <button class="cancel-btn" style="background: #f8f9fa; color: #666; border: 1px solid #e5e7eb; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                Cancel
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animate in
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    });
    
    // Event listeners
    const confirmBtn = modalContent.querySelector('.confirm-btn');
    const cancelBtn = modalContent.querySelector('.cancel-btn');
    
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        showSuccessMessage();
    });
    
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Video Modal
function showVideoModal(videoCard) {
    const caption = videoCard.querySelector('.video-caption')?.textContent || 'Video Content';
    const duration = videoCard.querySelector('.duration')?.textContent || '0:00';
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 18px;
        text-align: center;
        max-width: 600px;
        margin: 0 20px;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; margin-bottom: 24px; position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="width: 80px; height: 80px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
            </div>
        </div>
        <h4 style="font-size: 18px; font-weight: 700; color: #111; margin-bottom: 8px;">${caption}</h4>
        <p style="color: #666; margin-bottom: 24px;">Duration: ${duration}</p>
        <p style="color: #666; margin-bottom: 32px; font-size: 14px;">
            This is a demo preview. In a real implementation, the actual video content would play here.
        </p>
        <button class="close-btn" style="background: #f59e0b; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer;">
            Close
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animate in
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    });
    
    // Event listeners
    const closeBtn = modalContent.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Close modal with animation
function closeModal(modal) {
    const modalContent = modal.querySelector('div');
    modal.style.opacity = '0';
    modalContent.style.transform = modalContent.style.transform.includes('scale') ? 'scale(0.9)' : 'translateY(20px)';
    
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    message.textContent = 'Booking confirmed! We\'ll contact you soon.';
    document.body.appendChild(message);
    
    requestAnimationFrame(() => {
        message.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        message.style.transform = 'translateX(100%)';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Header background change on scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Initialize header scroll effect
initHeaderScroll();

// Intersection Observer for staggered animations
function initStaggeredAnimations() {
    const animatedSections = document.querySelectorAll('.stats-container, .video-showcase, .problems-grid');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = Array.from(entry.target.children);
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    animatedSections.forEach(section => {
        const children = Array.from(section.children);
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        staggerObserver.observe(section);
    });
}

// Initialize staggered animations
initStaggeredAnimations();

// Performance optimization
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};
// Add smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Existing code stays the same...
    
    // Add smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Throttled scroll handler for performance
const handleScroll = throttle(() => {
    // Add any scroll-dependent functionality here
}, 16);

window.addEventListener('scroll', handleScroll, { passive: true });
