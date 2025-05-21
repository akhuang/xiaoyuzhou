// Xiaohongshu App Prototype Navigation

// Current date and time for status bar
function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    document.querySelectorAll('.status-bar-time').forEach(el => {
        el.textContent = `${hours}:${minutes}`;
    });
}

// Initialize status bar and navigation
function initApp() {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Set active tab based on current page
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    
    document.querySelectorAll('.tab-item').forEach(tab => {
        const tabHref = tab.getAttribute('data-page');
        if (tabHref === filename) {
            tab.classList.add('active');
        }
    });

    // Add click events to tabs for prototype navigation
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                window.location.href = page;
            }
        });
    });
    
    // Handle back button
    document.querySelectorAll('.nav-back').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    });
    
    // Handle search input focus
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // In a real app, this would show the search page or suggestions
            console.log('Search focused');
        });
    });
    
    // Handle like buttons
    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) { // Not liked
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--primary-color)';
                
                // Update like count
                const countEl = this.querySelector('.action-count');
                if (countEl) {
                    const count = parseInt(countEl.textContent) + 1;
                    countEl.textContent = count;
                }
            } else { // Already liked
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                
                // Update like count
                const countEl = this.querySelector('.action-count');
                if (countEl) {
                    const count = parseInt(countEl.textContent) - 1;
                    countEl.textContent = count;
                }
            }
        });
    });
    
    // Handle follow buttons
    document.querySelectorAll('.btn-follow').forEach(btn => {
        btn.addEventListener('click', function() {
            if (btn.classList.contains('btn-outline')) {
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-primary');
                btn.textContent = '已关注'; // Following
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline');
                btn.textContent = '关注'; // Follow
            }
        });
    });
    
    // Add animation to posts when they come into view
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.post-card:not(.animate-fade-in)');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardBottom = card.getBoundingClientRect().bottom;
            
            if (cardTop < window.innerHeight && cardBottom > 0) {
                card.classList.add('animate-fade-in');
            }
        });
    };
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
