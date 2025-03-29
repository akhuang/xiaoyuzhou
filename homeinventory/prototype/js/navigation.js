// Common JavaScript functionality for the Home Inventory App

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set current time in status bar
    updateTime();
    setInterval(updateTime, 60000);
    
    // Initialize any interactive elements
    initializeInteractiveElements();
});

// Update time in status bar
function updateTime() {
    const timeElement = document.querySelector('.status-bar .time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Handle navigation items click
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // In a real app, this would navigate to the respective page
            // For our prototype, we'll just log the navigation
            console.log(`Navigating to ${this.getAttribute('data-page')}`);
        });
    });
    
    // Handle search input
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            console.log(`Searching for: ${this.value}`);
            // In a real app, this would trigger search functionality
        });
    }
    
    // Handle FAB button click
    const fabButton = document.querySelector('.fab');
    if (fabButton) {
        fabButton.addEventListener('click', function(e) {
            console.log('FAB button clicked');
            // In a real app, this would open the add item form
        });
    }
    
    // Handle scan button click
    const scanButton = document.querySelector('.scan-button');
    if (scanButton) {
        scanButton.addEventListener('click', function(e) {
            console.log('Scan button clicked');
            // In a real app, this would open the barcode scanner
        });
    }
    
    // Handle tabs switching
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // In a real app, this would switch the tab content
                console.log(`Tab switched to: ${this.textContent.trim()}`);
            });
        });
    }
}

// Function to generate random data for charts (for demo purposes)
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

// Function to format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Function to calculate days remaining
function daysRemaining(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Simulate item data for demo purposes
function getSimulatedItems() {
    return [
        {
            id: 1,
            name: 'Organic Milk',
            category: 'Food',
            expiryDate: '2025-04-15',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            name: 'Wireless Headphones',
            category: 'Electronics',
            warrantyDate: '2026-03-20',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 3,
            name: 'Paracetamol',
            category: 'Medicine',
            expiryDate: '2025-06-30',
            quantity: 15,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 4,
            name: 'Kids T-Shirt (Size 5)',
            category: 'Clothing',
            season: 'Summer',
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 5,
            name: 'Building Blocks',
            category: 'Kids',
            recommendedAge: '3-5 years',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        }
    ];
}

// Function to render items in a container
function renderItems(containerId, items, limit = items.length) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const itemsToRender = items.slice(0, limit);
    
    itemsToRender.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        
        let expiryInfo = '';
        if (item.expiryDate) {
            const days = daysRemaining(item.expiryDate);
            let badgeClass = 'badge-primary';
            if (days < 5) badgeClass = 'badge-danger';
            else if (days < 10) badgeClass = 'badge-warning';
            expiryInfo = `<div class="badge ${badgeClass}">${days} days left</div>`;
        }
        
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <div class="item-meta">
                    <i class="fa-solid fa-layer-group"></i> ${item.category} · 
                    <i class="fa-solid fa-cubes"></i> ${item.quantity}
                </div>
                ${expiryInfo}
            </div>
        `;
        
        container.appendChild(itemElement);
    });
}

// Simulate shopping list data
function getSimulatedShoppingList() {
    return [
        { id: 1, name: 'Milk', category: 'Food', quantity: 2, urgent: false },
        { id: 2, name: 'Eggs', category: 'Food', quantity: 1, urgent: true },
        { id: 3, name: 'Batteries', category: 'Electronics', quantity: 4, urgent: false },
        { id: 4, name: 'Allergy Medicine', category: 'Medicine', quantity: 1, urgent: true }
    ];
}

// Function to render the shopping list
function renderShoppingList(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        
        const urgentBadge = item.urgent ? 
            `<div class="badge badge-danger">Urgent</div>` : '';
        
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="flex justify-between items-center">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-quantity">x${item.quantity}</div>
                </div>
                <div class="item-meta">
                    <i class="fa-solid fa-layer-group"></i> ${item.category}
                    ${urgentBadge}
                </div>
            </div>
            <div class="checkbox">
                <i class="fa-regular fa-square"></i>
            </div>
        `;
        
        container.appendChild(itemElement);
    });
}

// Function to initialize charts
function initializeCharts() {
    // This is a placeholder function - in a real app, this would use Chart.js or similar
    console.log('Charts initialized');
}