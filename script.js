// Global Variables and Data Storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// Products Data
const products = {
    chicken: [
        { id: 'c1', name: 'Whole Chicken (Without cutting)', price: 720, icon: 'fa-drumstick-bite' },
        { id: 'c2', name: 'Whole Chicken (Boti cut)', price: 800, icon: 'fa-drumstick-bite' },
        { id: 'c3', name: 'Chicken Drumsticks', price: 100, icon: 'fa-drumstick-bite' },
        { id: 'c4', name: 'Chicken Breast', price: 590, icon: 'fa-drumstick-bite' },
        { id: 'c5', name: 'Chicken Wings (2pcs)', price: 230, icon: 'fa-drumstick-bite' },
        { id: 'c6', name: 'Boneless Chicken (500gm)', price: 500, icon: 'fa-drumstick-bite' },
        { id: 'c7', name: 'Minced Chicken (250gm)', price: 400, icon: 'fa-drumstick-bite' }
    ],
    mutton: [
        { id: 'm1', name: 'Mutton Chops', price: 1200, icon: 'fa-bone' },
        { id: 'm2', name: 'Mutton Leg (1kg)', price: 1500, icon: 'fa-bone' },
        { id: 'm3', name: 'Mutton Ribs', price: 1100, icon: 'fa-bone' },
        { id: 'm4', name: 'Boneless Mutton (500gm)', price: 800, icon: 'fa-bone' },
        { id: 'm5', name: 'Mutton Keema (500gm)', price: 750, icon: 'fa-bone' },
        { id: 'm6', name: 'Mutton Shoulder', price: 1400, icon: 'fa-bone' }
    ],
    beef: [
        { id: 'b1', name: 'Beef Steak (1kg)', price: 1000, icon: 'fa-hamburger' },
        { id: 'b2', name: 'Beef Ribs', price: 900, icon: 'fa-hamburger' },
        { id: 'b3', name: 'Boneless Beef (1kg)', price: 850, icon: 'fa-hamburger' },
        { id: 'b4', name: 'Beef Keema (500gm)', price: 500, icon: 'fa-hamburger' },
        { id: 'b5', name: 'Beef Shank', price: 700, icon: 'fa-hamburger' },
        { id: 'b6', name: 'Beef Boti (500gm)', price: 600, icon: 'fa-hamburger' }
    ],
    frozen: [
        { id: 'f1', name: 'French Fries (1kg)', price: 300, icon: 'fa-utensils' },
        { id: 'f2', name: 'Fish Fillets (500gm)', price: 800, icon: 'fa-fish' },
        { id: 'f3', name: 'Frozen Prawns (500gm)', price: 1200, icon: 'fa-fish' },
        { id: 'f4', name: 'Chicken Nuggets (500gm)', price: 450, icon: 'fa-utensils' },
        { id: 'f5', name: 'Frozen Vegetables Mix (1kg)', price: 250, icon: 'fa-leaf' },
        { id: 'f6', name: 'Fish Fingers (500gm)', price: 600, icon: 'fa-fish' }
    ]
};

// Utility Functions
function goBack() {
    window.history.back();
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const panel = document.getElementById('mobileMenuPanel');
    const hamburger = document.getElementById('hamburgerBtn');
    
    panel.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (panel.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const panel = document.getElementById('mobileMenuPanel');
    const hamburger = document.getElementById('hamburgerBtn');
    
    panel.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const panel = document.getElementById('mobileMenuPanel');
    const hamburger = document.getElementById('hamburgerBtn');
    
    if (panel && hamburger && panel.classList.contains('active')) {
        if (!panel.contains(event.target) && !hamburger.contains(event.target)) {
            closeMobileMenu();
        }
    }
});

function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
    }
}

// Review Functions
function toggleReviewForm() {
    const form = document.getElementById('review-form');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

// Star Rating System
document.addEventListener('DOMContentLoaded', function() {
    const starRating = document.querySelector('.star-rating');
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        let selectedRating = 0;

        stars.forEach(star => {
            star.addEventListener('click', function() {
                selectedRating = parseInt(this.getAttribute('data-value'));
                starRating.setAttribute('data-rating', selectedRating);
                updateStars(selectedRating);
            });

            star.addEventListener('mouseenter', function() {
                const hoverValue = parseInt(this.getAttribute('data-value'));
                updateStars(hoverValue);
            });
        });

        starRating.addEventListener('mouseleave', function() {
            updateStars(selectedRating);
        });

        function updateStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('far');
                    star.classList.add('fas', 'active');
                } else {
                    star.classList.remove('fas', 'active');
                    star.classList.add('far');
                }
            });
        }
    }

    // Load reviews
    loadReviews();
});

function submitReview() {
    const name = document.getElementById('reviewer-name').value.trim();
    const text = document.getElementById('review-text').value.trim();
    const rating = parseInt(document.querySelector('.star-rating').getAttribute('data-rating'));

    if (!name || !text || rating === 0) {
        alert('Please fill all fields and select a rating');
        return;
    }

    const review = {
        id: Date.now(),
        name: name,
        text: text,
        rating: rating,
        date: new Date().toLocaleDateString()
    };

    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Add review to page with animation
    addReviewToPage(review, true);

    // Reset form
    document.getElementById('reviewer-name').value = '';
    document.getElementById('review-text').value = '';
    document.querySelector('.star-rating').setAttribute('data-rating', '0');
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });

    toggleReviewForm();
}

function loadReviews() {
    const container = document.querySelector('.reviews-container');
    if (container) {
        reviews.forEach(review => addReviewToPage(review, false));
    }
}

function addReviewToPage(review, animate) {
    const container = document.querySelector('.reviews-container');
    if (!container) return;

    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();

    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card glass-card slide-in';
    if (animate) {
        reviewCard.style.animationDelay = '0s';
    }

    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-avatar">${initials}</div>
            <div class="reviewer-info">
                <h4>${review.name}</h4>
                <div class="stars">${stars}</div>
            </div>
        </div>
        <p class="review-text">${review.text}</p>
    `;

    container.appendChild(reviewCard);

    if (animate) {
        setTimeout(() => {
            reviewCard.style.animation = 'none';
        }, 600);
    }
}

// Save and load cart
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Smooth scroll for navigation
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
    observer.observe(el);
});

// Initialize page
updateCartCount();
