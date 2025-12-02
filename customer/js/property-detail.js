/**
 * Customer Portal - Property Detail JavaScript
 */

let currentProperty = null;
let currentImageIndex = 0;
let propertyImages = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seed data if not exists
    if (!SeedData.exists()) {
        SeedData.init();
    }

    // Get property ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (!propertyId) {
        showError('Property not found');
        return;
    }

    loadPropertyDetails(propertyId);
});

function loadPropertyDetails(propertyId) {
    currentProperty = Storage.getPropertyById(propertyId);
    
    if (!currentProperty) {
        showError('Property not found');
        return;
    }

    // Load property images
    propertyImages = Storage.getPhotosByProperty(propertyId);

    // Update page title and breadcrumb
    document.title = `${currentProperty.title} - Real Estate Simplified`;
    document.getElementById('propertyBreadcrumb').textContent = currentProperty.title;

    // Render property details
    renderPropertyDetails();
}

function renderPropertyDetails() {
    const container = document.getElementById('propertyDetail');
    const mainPhoto = propertyImages.length > 0 ? propertyImages[0].data : null;

    container.innerHTML = `
        <!-- Header -->
        <div class="property-detail-header">
            <div class="property-detail-title">
                <h1>${Utils.sanitizeHTML(currentProperty.title)}</h1>
                <div class="property-detail-location">
                    📍 ${Utils.sanitizeHTML(currentProperty.address)}, ${Utils.sanitizeHTML(currentProperty.city)}, ${Utils.sanitizeHTML(currentProperty.state)} ${Utils.sanitizeHTML(currentProperty.zipCode)}
                </div>
            </div>
            <div>
                <div class="property-detail-price">${Utils.formatCurrency(currentProperty.price)}</div>
                ${Utils.getStatusBadge(currentProperty.status)}
            </div>
        </div>

        <!-- Gallery -->
        <div class="property-gallery">
            <div class="gallery-main" id="galleryMain">
                ${mainPhoto 
                    ? `<img src="${mainPhoto}" alt="${Utils.sanitizeHTML(currentProperty.title)}" id="mainImage">`
                    : `<div class="placeholder-image">🏠</div>`
                }
            </div>
            ${propertyImages.length > 1 ? `
                <div class="gallery-thumbnails" id="galleryThumbnails">
                    ${propertyImages.map((photo, index) => `
                        <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
                            <img src="${photo.data}" alt="Thumbnail ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <!-- Content Grid -->
        <div class="property-content">
            <!-- Main Info -->
            <div class="property-info">
                <!-- Specs -->
                <div class="property-specs">
                    <div class="spec-item">
                        <div class="spec-icon">🛏️</div>
                        <div class="spec-value">${currentProperty.bedrooms}</div>
                        <div class="spec-label">Bedrooms</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-icon">🚿</div>
                        <div class="spec-value">${currentProperty.bathrooms}</div>
                        <div class="spec-label">Bathrooms</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-icon">📐</div>
                        <div class="spec-value">${currentProperty.area.toLocaleString()}</div>
                        <div class="spec-label">Sq Ft</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-icon">🏷️</div>
                        <div class="spec-value">${currentProperty.type}</div>
                        <div class="spec-label">Type</div>
                    </div>
                </div>

                <!-- Description -->
                <div class="property-description-section">
                    <h2>About This Property</h2>
                    <p class="property-description">${Utils.sanitizeHTML(currentProperty.description)}</p>
                </div>

                <!-- Features -->
                ${currentProperty.features && currentProperty.features.length > 0 ? `
                    <div class="property-features">
                        <h2>Features & Amenities</h2>
                        <ul class="features-list">
                            ${currentProperty.features.map(feature => `
                                <li>${Utils.sanitizeHTML(feature)}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                <!-- Location -->
                <div class="property-location-section mt-4">
                    <h2>Location</h2>
                    <p>
                        <strong>Address:</strong> ${Utils.sanitizeHTML(currentProperty.address)}<br>
                        <strong>City:</strong> ${Utils.sanitizeHTML(currentProperty.city)}, ${Utils.sanitizeHTML(currentProperty.state)} ${Utils.sanitizeHTML(currentProperty.zipCode)}
                    </p>
                </div>
            </div>

            <!-- Inquiry Card -->
            <div class="inquiry-card">
                <div class="card">
                    <div class="card-body">
                        <h3>Interested in this property?</h3>
                        <div class="property-price">${Utils.formatCurrency(currentProperty.price)}</div>
                        
                        ${currentProperty.status === 'available' ? `
                            <button class="btn btn-primary btn-block" onclick="openInquiryModal()">
                                📧 Send Inquiry
                            </button>
                            <button class="btn btn-outline btn-block" onclick="scheduleViewing()">
                                📅 Schedule Viewing
                            </button>
                        ` : `
                            <div class="alert alert-warning">
                                This property has been sold.
                            </div>
                        `}

                        <div class="contact-info">
                            <p>📞 Call: (555) 123-4567</p>
                            <p>✉️ Email: info@realestate.com</p>
                            <p>🏢 Office Hours: Mon-Sat 9am-6pm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Similar Properties -->
        <div class="similar-properties">
            <h2>Similar Properties</h2>
            <div class="property-grid" id="similarProperties"></div>
        </div>
    `;

    // Load similar properties
    loadSimilarProperties();
}

function changeImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    if (mainImage && propertyImages[index]) {
        mainImage.src = propertyImages[index].data;
    }

    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function loadSimilarProperties() {
    const allProperties = Storage.getProperties();
    const similar = allProperties
        .filter(p => 
            p.id !== currentProperty.id && 
            p.status === 'available' &&
            (p.type === currentProperty.type || p.city === currentProperty.city)
        )
        .slice(0, 3);

    const container = document.getElementById('similarProperties');
    
    if (similar.length === 0) {
        container.innerHTML = '<p class="text-muted">No similar properties found.</p>';
        return;
    }

    similar.forEach(property => {
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

function showError(message) {
    const container = document.getElementById('propertyDetail');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">😔</div>
            <h3 class="empty-state-title">${message}</h3>
            <p>The property you're looking for doesn't exist or has been removed.</p>
            <a href="properties.html" class="btn btn-primary mt-3">Browse Properties</a>
        </div>
    `;
}

// Inquiry Modal Functions
function openInquiryModal() {
    document.getElementById('inquiryPropertyId').value = currentProperty.id;
    document.getElementById('inquiryModal').classList.remove('hidden');
}

function closeInquiryModal() {
    document.getElementById('inquiryModal').classList.add('hidden');
    document.getElementById('inquiryForm').reset();
    clearValidationErrors();
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

function scheduleViewing() {
    openInquiryModal();
    document.getElementById('inquiryMessage').value = 'I would like to schedule a viewing for this property.';
}

function submitInquiry(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('inquiryName').value.trim();
    const email = document.getElementById('inquiryEmail').value.trim();
    const phone = document.getElementById('inquiryPhone').value.trim();
    const message = document.getElementById('inquiryMessage').value.trim();
    const propertyId = document.getElementById('inquiryPropertyId').value;

    // Validate
    let isValid = true;
    clearValidationErrors();

    if (!name) {
        showFieldError('nameError', 'Please enter your name');
        isValid = false;
    }

    if (!email) {
        showFieldError('emailError', 'Please enter your email');
        isValid = false;
    } else if (!Utils.isValidEmail(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!phone) {
        showFieldError('phoneError', 'Please enter your phone number');
        isValid = false;
    } else if (!Utils.isValidPhone(phone)) {
        showFieldError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }

    if (!message) {
        showFieldError('messageError', 'Please enter a message');
        isValid = false;
    }

    if (!isValid) return;

    // Save inquiry to localStorage
    const inquiry = Storage.addInquiry({
        propertyId: propertyId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message: message
    });

    console.log('Inquiry saved:', inquiry);

    // Close inquiry modal and show success
    closeInquiryModal();
    document.getElementById('successModal').classList.remove('hidden');
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearValidationErrors() {
    const errors = document.querySelectorAll('.invalid-feedback');
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}
