/**
 * Customer Portal - Properties List JavaScript
 */

let allProperties = [];
let filteredProperties = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seed data if not exists
    if (!SeedData.exists()) {
        SeedData.init();
    }

    // Load properties
    loadProperties();

    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        document.getElementById('searchInput').value = searchQuery;
        applyFilters();
    }

    // Setup real-time search
    setupSearch();
});

function loadProperties() {
    allProperties = Storage.getProperties();
    filteredProperties = [...allProperties];
    displayProperties(filteredProperties);
}

function displayProperties(properties) {
    const container = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');

    container.innerHTML = '';
    resultsCount.textContent = `${properties.length} properties found`;

    if (properties.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyState.classList.add('hidden');

    properties.forEach(property => {
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

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const typeFilter = document.getElementById('typeFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const bedroomsFilter = document.getElementById('bedroomsFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const sortSelect = document.getElementById('sortSelect').value;

    filteredProperties = allProperties.filter(property => {
        // Search filter
        if (searchTerm) {
            const searchable = [
                property.title,
                property.city,
                property.state,
                property.address,
                property.type,
                property.description
            ].join(' ').toLowerCase();
            
            if (!searchable.includes(searchTerm)) {
                return false;
            }
        }

        // Type filter
        if (typeFilter && property.type !== typeFilter) {
            return false;
        }

        // Price filter
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            if (property.price < min || property.price > max) {
                return false;
            }
        }

        // Bedrooms filter
        if (bedroomsFilter !== '') {
            if (property.bedrooms < parseInt(bedroomsFilter)) {
                return false;
            }
        }

        // Status filter
        if (statusFilter && property.status !== statusFilter) {
            return false;
        }

        return true;
    });

    // Apply sorting
    switch (sortSelect) {
        case 'price-low':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'bedrooms':
            filteredProperties.sort((a, b) => b.bedrooms - a.bedrooms);
            break;
        case 'newest':
        default:
            filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    displayProperties(filteredProperties);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('bedroomsFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortSelect').value = 'newest';
    
    filteredProperties = [...allProperties];
    displayProperties(filteredProperties);
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 300);
    });
}
