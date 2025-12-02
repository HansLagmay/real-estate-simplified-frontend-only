/**
 * Customer Portal - Home Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seed data if not exists
    if (!SeedData.exists()) {
        SeedData.init();
    }

    // Load statistics
    loadStats();

    // Load featured properties
    loadFeaturedProperties();

    // Setup search
    setupSearch();

    // Setup real-time sync across browser tabs
    setupStorageSync();
});

// Real-time sync across browser tabs
function setupStorageSync() {
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('realestate_')) {
            console.log('📡 Data updated in another tab, refreshing...');
            loadStats();
            loadFeaturedProperties();
        }
    });
}

function loadStats() {
    const properties = Storage.getProperties();
    const agents = Storage.getAgents();
    
    document.getElementById('totalProperties').textContent = properties.length;
    document.getElementById('soldProperties').textContent = properties.filter(p => p.status === 'sold').length;
    document.getElementById('totalAgents').textContent = agents.length;
}

function loadFeaturedProperties() {
    const properties = Storage.getProperties();
    const featured = properties.filter(p => p.status === 'available').slice(0, 6);
    
    const container = document.getElementById('featuredProperties');
    container.innerHTML = '';

    if (featured.length === 0) {
        // Show empty state
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🏠</div>
                <h3 class="empty-state-title">No Properties Available Yet</h3>
                <p>Check back soon for new listings!</p>
            </div>
        `;
        return;
    }

    featured.forEach(property => {
        container.appendChild(createPropertyCard(property));
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.onclick = () => viewProperty(property.id);

    const photos = Storage.getPhotosByProperty(property.id);
    const mainPhoto = photos.length > 0 ? photos[0].data : null;

    card.innerHTML = `
        <div class="property-card-image">
            ${mainPhoto 
                ? `<img src="${mainPhoto}" alt="${Utils.sanitizeHTML(property.title)}">`
                : `<div class="placeholder-image">🏠</div>`
            }
            <div class="property-card-badge">
                ${Utils.getStatusBadge(property.status)}
            </div>
        </div>
        <div class="property-card-content">
            <div class="property-card-price">${Utils.formatCurrency(property.price)}</div>
            <h3 class="property-card-title">${Utils.sanitizeHTML(property.title)}</h3>
            <p class="property-card-location">📍 ${Utils.sanitizeHTML(property.city)}, ${Utils.sanitizeHTML(property.state)}</p>
            <div class="property-card-features">
                <span>🛏️ ${property.bedrooms} Beds</span>
                <span>🚿 ${property.bathrooms} Baths</span>
                <span>📐 ${property.area.toLocaleString()} sq ft</span>
            </div>
        </div>
    `;

    return card;
}

function viewProperty(id) {
    window.location.href = `property-detail.html?id=${id}`;
}

function searchProperties() {
    const searchTerm = document.getElementById('heroSearch').value.trim();
    if (searchTerm) {
        window.location.href = `properties.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
        window.location.href = 'properties.html';
    }
}

function setupSearch() {
    const searchInput = document.getElementById('heroSearch');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProperties();
        }
    });
}
