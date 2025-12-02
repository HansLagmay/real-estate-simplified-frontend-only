/**
 * Admin Portal JavaScript
 */

let currentUser = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let uploadedPhotos = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seed data if not exists
    if (!SeedData.exists()) {
        SeedData.init();
    }

    // Check if already logged in
    checkAuth();

    // Setup navigation
    setupNavigation();

    // Setup real-time sync across browser tabs
    setupStorageSync();
});

// Real-time sync across browser tabs
function setupStorageSync() {
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('realestate_')) {
            console.log('📡 Data updated in another tab, refreshing...');
            refreshCurrentPage();
        }
    });
}

function refreshCurrentPage() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateToPage(hash);
}

// Authentication
function checkAuth() {
    const user = Auth.getCurrentUser();
    if (user && user.role === 'admin') {
        currentUser = user;
        showApp();
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    const result = Auth.login(email, password);
    
    if (result.success) {
        if (result.user.role === 'admin') {
            currentUser = result.user;
            showApp();
        } else {
            errorDiv.textContent = 'Access denied. Admin privileges required.';
            errorDiv.classList.remove('hidden');
            Auth.logout();
        }
    } else {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove('hidden');
    }
}

function logout() {
    Auth.logout();
    currentUser = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').classList.add('hidden');
}

function showApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    document.getElementById('currentUserName').textContent = currentUser.name || currentUser.firstName + ' ' + currentUser.lastName;
    
    // Load initial data
    loadDashboard();
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        navigateToPage(hash);
    });

    // Check initial hash
    const initialHash = window.location.hash.slice(1) || 'dashboard';
    navigateToPage(initialHash);
}

function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page data
        switch(pageName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'inquiries':
                loadInquiries();
                break;
            case 'calendar':
                loadCalendar();
                break;
            case 'properties':
                loadProperties();
                break;
            case 'agents':
                loadAgents();
                break;
            case 'reports':
                loadReports();
                break;
        }
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageName);
    });
}

// Dashboard
function loadDashboard() {
    const properties = Storage.getProperties();
    const inquiries = Storage.getInquiries();
    const appointments = Storage.getAppointments();

    // Update stats
    document.getElementById('statTotalProperties').textContent = properties.length;
    document.getElementById('statSoldProperties').textContent = properties.filter(p => p.status === 'sold').length;
    document.getElementById('statPendingInquiries').textContent = inquiries.filter(i => i.status === 'pending').length;
    document.getElementById('statUpcomingAppointments').textContent = appointments.filter(a => a.status === 'scheduled').length;

    // Show/hide empty state based on data
    const emptyState = document.getElementById('dashboardEmptyState');
    const activitySection = document.getElementById('dashboardActivity');
    
    if (properties.length === 0 && inquiries.length === 0) {
        // Show empty state
        if (emptyState) emptyState.classList.remove('hidden');
        if (activitySection) activitySection.classList.add('hidden');
    } else {
        // Hide empty state
        if (emptyState) emptyState.classList.add('hidden');
        if (activitySection) activitySection.classList.remove('hidden');
    }

    // Load recent inquiries
    const recentInquiries = inquiries.slice(-5).reverse();
    const inquiriesContainer = document.getElementById('recentInquiries');
    
    if (recentInquiries.length === 0) {
        inquiriesContainer.innerHTML = '<p class="empty-list">No inquiries yet. Add properties to get started.</p>';
    } else {
        inquiriesContainer.innerHTML = recentInquiries.map(inquiry => {
            const property = Storage.getPropertyById(inquiry.propertyId);
            return `
                <div class="activity-item">
                    <div class="activity-icon">📧</div>
                    <div class="activity-content">
                        <div class="activity-title">${Utils.sanitizeHTML(inquiry.customerName)}</div>
                        <div class="activity-meta">
                            ${property ? Utils.sanitizeHTML(property.title) : 'Unknown Property'} • 
                            ${Utils.getRelativeTime(inquiry.createdAt)}
                        </div>
                    </div>
                    ${Utils.getStatusBadge(inquiry.status)}
                </div>
            `;
        }).join('');
    }

    // Load upcoming appointments
    const upcoming = appointments
        .filter(a => a.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    const appointmentsContainer = document.getElementById('upcomingAppointments');
    
    if (upcoming.length === 0) {
        appointmentsContainer.innerHTML = '<p class="empty-list">No upcoming appointments</p>';
    } else {
        appointmentsContainer.innerHTML = upcoming.map(apt => {
            const property = Storage.getPropertyById(apt.propertyId);
            const agent = Storage.getUserById(apt.agentId);
            return `
                <div class="activity-item">
                    <div class="activity-icon">📅</div>
                    <div class="activity-content">
                        <div class="activity-title">${Utils.sanitizeHTML(apt.customerName)}</div>
                        <div class="activity-meta">
                            ${property ? Utils.sanitizeHTML(property.title) : 'Unknown'} • 
                            ${Utils.formatDateShort(apt.date)} at ${Utils.formatTime(apt.time)}
                        </div>
                        <div class="activity-meta">
                            Agent: ${agent ? Utils.sanitizeHTML(agent.name || (agent.firstName + ' ' + agent.lastName)) : 'Unassigned'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Inquiries
function loadInquiries() {
    const statusFilter = document.getElementById('inquiryStatusFilter').value;
    let inquiries = Storage.getInquiries();
    
    if (statusFilter) {
        inquiries = inquiries.filter(i => i.status === statusFilter);
    }

    const tableBody = document.getElementById('inquiriesTable');
    
    if (inquiries.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No inquiries found</td></tr>';
        return;
    }

    tableBody.innerHTML = inquiries.map(inquiry => {
        const property = Storage.getPropertyById(inquiry.propertyId);
        const agent = inquiry.assignedTo ? Storage.getUserById(inquiry.assignedTo) : null;
        
        return `
            <tr>
                <td>${Utils.getPriorityBadge(inquiry.priority)}</td>
                <td>
                    <strong>${Utils.sanitizeHTML(inquiry.customerName)}</strong><br>
                    <small>${Utils.sanitizeHTML(inquiry.customerEmail)}</small>
                </td>
                <td>${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</td>
                <td>${Utils.formatDateShort(inquiry.createdAt)}</td>
                <td>${Utils.getStatusBadge(inquiry.status)}</td>
                <td>${agent ? Utils.sanitizeHTML(agent.name) : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewInquiry('${inquiry.id}')">View</button>
                    ${inquiry.status === 'pending' ? `
                        <button class="btn btn-sm btn-primary" onclick="showAssignModal('${inquiry.id}')">Assign</button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function filterInquiries() {
    loadInquiries();
}

function viewInquiry(id) {
    const inquiry = Storage.getInquiryById(id);
    const property = Storage.getPropertyById(inquiry.propertyId);
    const agent = inquiry.assignedTo ? Storage.getUserById(inquiry.assignedTo) : null;

    const content = document.getElementById('viewInquiryContent');
    content.innerHTML = `
        <div class="inquiry-details">
            <div class="detail-row">
                <span class="detail-label">Priority</span>
                <span class="detail-value">${Utils.getPriorityBadge(inquiry.priority)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value">${Utils.getStatusBadge(inquiry.status)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Customer</span>
                <span class="detail-value">${Utils.sanitizeHTML(inquiry.customerName)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">${Utils.sanitizeHTML(inquiry.customerEmail)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${Utils.sanitizeHTML(inquiry.customerPhone)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Property</span>
                <span class="detail-value">${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Assigned To</span>
                <span class="detail-value">${agent ? Utils.sanitizeHTML(agent.name) : 'Not assigned'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${Utils.formatDate(inquiry.createdAt)}</span>
            </div>
        </div>
        <div class="inquiry-message">
            <h4>Message</h4>
            <p>${Utils.sanitizeHTML(inquiry.message)}</p>
        </div>
    `;

    document.getElementById('viewInquiryModal').classList.remove('hidden');
}

function closeViewInquiryModal() {
    document.getElementById('viewInquiryModal').classList.add('hidden');
}

function showAssignModal(inquiryId) {
    document.getElementById('assignInquiryId').value = inquiryId;
    
    // Populate agent dropdown
    const agents = Storage.getAgents();
    const select = document.getElementById('assignAgentSelect');
    select.innerHTML = '<option value="">Choose an agent...</option>' +
        agents.map(agent => `<option value="${agent.id}">${Utils.sanitizeHTML(agent.name)}</option>`).join('');
    
    document.getElementById('assignAgentModal').classList.remove('hidden');
}

function closeAssignModal() {
    document.getElementById('assignAgentModal').classList.add('hidden');
}

function confirmAssignment() {
    const inquiryId = document.getElementById('assignInquiryId').value;
    const agentId = document.getElementById('assignAgentSelect').value;

    if (!agentId) {
        Utils.showNotification('Please select an agent', 'warning');
        return;
    }

    Storage.updateInquiry(inquiryId, {
        assignedTo: agentId,
        status: 'assigned'
    });

    closeAssignModal();
    loadInquiries();
    Utils.showNotification('Inquiry assigned successfully', 'success');
}

// Calendar
function loadCalendar() {
    // Populate agent filter
    const agents = Storage.getAgents();
    const agentFilter = document.getElementById('calendarAgentFilter');
    const currentValue = agentFilter.value;
    agentFilter.innerHTML = '<option value="">All Agents</option>' +
        agents.map(agent => `<option value="${agent.id}">${Utils.sanitizeHTML(agent.name)}</option>`).join('');
    agentFilter.value = currentValue;

    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    const agentFilter = document.getElementById('calendarAgentFilter').value;
    
    let appointments = Storage.getAppointments();
    if (agentFilter) {
        appointments = appointments.filter(a => a.agentId === agentFilter);
    }

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    let html = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button class="btn btn-secondary" onclick="prevMonth()">&lt; Prev</button>
                <button class="btn btn-secondary" onclick="nextMonth()">Next &gt;</button>
            </div>
            <h2 class="calendar-title">${monthNames[currentMonth]} ${currentYear}</h2>
            <button class="btn btn-secondary" onclick="goToToday()">Today</button>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
    `;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">
            <div class="calendar-day-number">${prevMonthDays - i}</div>
        </div>`;
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const dayAppointments = appointments.filter(a => a.date === dateStr);

        html += `<div class="calendar-day ${isToday ? 'today' : ''}">
            <div class="calendar-day-number">${day}</div>
            ${dayAppointments.map(apt => {
                const agent = Storage.getUserById(apt.agentId);
                return `<div class="calendar-event ${apt.status}" title="${Utils.sanitizeHTML(apt.customerName)} - ${Utils.formatTime(apt.time)}">
                    ${Utils.formatTime(apt.time)} - ${Utils.sanitizeHTML(apt.customerName)}
                    ${agent ? `<br><small>${Utils.sanitizeHTML(agent.name)}</small>` : ''}
                </div>`;
            }).join('')}
        </div>`;
    }

    // Next month days
    const remainingDays = 42 - (startingDay + totalDays);
    for (let day = 1; day <= remainingDays; day++) {
        html += `<div class="calendar-day other-month">
            <div class="calendar-day-number">${day}</div>
        </div>`;
    }

    html += '</div>';
    container.innerHTML = html;
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function goToToday() {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    renderCalendar();
}

// Properties
function loadProperties() {
    filterProperties();
}

function filterProperties() {
    const searchTerm = document.getElementById('propertySearch').value.toLowerCase();
    const statusFilter = document.getElementById('propertyStatusFilter').value;
    
    let properties = Storage.getProperties();
    
    if (searchTerm) {
        properties = properties.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.city.toLowerCase().includes(searchTerm) ||
            p.address.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        properties = properties.filter(p => p.status === statusFilter);
    }

    const container = document.getElementById('propertiesGrid');
    
    if (properties.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No properties found</p></div>';
        return;
    }

    container.innerHTML = properties.map(property => {
        const photos = Storage.getPhotosByProperty(property.id);
        const mainPhoto = photos.length > 0 ? photos[0].data : null;

        return `
            <div class="property-card property-card-admin">
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
                        <span>🛏️ ${property.bedrooms}</span>
                        <span>🚿 ${property.bathrooms}</span>
                        <span>📐 ${property.area.toLocaleString()} sqft</span>
                    </div>
                </div>
                <div class="property-card-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editProperty('${property.id}')">Edit</button>
                    ${property.status === 'available' 
                        ? `<button class="btn btn-sm btn-success" onclick="showMarkSoldModal('${property.id}')">Mark Sold</button>`
                        : ''
                    }
                    <button class="btn btn-sm btn-danger" onclick="deleteProperty('${property.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function showAddPropertyModal() {
    document.getElementById('propertyModalTitle').textContent = 'Add Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    document.getElementById('photoPreview').innerHTML = '';
    uploadedPhotos = [];
    document.getElementById('propertyModal').classList.remove('hidden');
}

function editProperty(id) {
    const property = Storage.getPropertyById(id);
    if (!property) return;

    document.getElementById('propertyModalTitle').textContent = 'Edit Property';
    document.getElementById('propertyId').value = property.id;
    document.getElementById('propertyTitle').value = property.title;
    document.getElementById('propertyType').value = property.type;
    document.getElementById('propertyPrice').value = property.price;
    document.getElementById('propertyStatus').value = property.status;
    document.getElementById('propertyBedrooms').value = property.bedrooms;
    document.getElementById('propertyBathrooms').value = property.bathrooms;
    document.getElementById('propertyArea').value = property.area;
    document.getElementById('propertyAddress').value = property.address;
    document.getElementById('propertyCity').value = property.city;
    document.getElementById('propertyState').value = property.state;
    document.getElementById('propertyZip').value = property.zipCode;
    document.getElementById('propertyDescription').value = property.description || '';
    document.getElementById('propertyFeatures').value = property.features ? property.features.join(', ') : '';

    // Load existing photos
    uploadedPhotos = Storage.getPhotosByProperty(id);
    renderPhotoPreview();

    document.getElementById('propertyModal').classList.remove('hidden');
}

function closePropertyModal() {
    document.getElementById('propertyModal').classList.add('hidden');
    uploadedPhotos = [];
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    
    Promise.all(
        Array.from(files).map(async file => {
            try {
                const base64 = await Utils.readFileAsBase64(file);
                return {
                    id: Storage.generateId('photo'),
                    data: base64,
                    name: file.name,
                    isNew: true
                };
            } catch (error) {
                console.error('Error uploading photo:', error);
                return null;
            }
        })
    ).then(results => {
        const validPhotos = results.filter(photo => photo !== null);
        uploadedPhotos.push(...validPhotos);
        renderPhotoPreview();
    });
}

function renderPhotoPreview() {
    const container = document.getElementById('photoPreview');
    container.innerHTML = uploadedPhotos.map((photo, index) => `
        <div class="photo-preview-item">
            <img src="${photo.data}" alt="Photo ${index + 1}">
            <button type="button" onclick="removePhoto(${index})">&times;</button>
        </div>
    `).join('');
}

function removePhoto(index) {
    uploadedPhotos.splice(index, 1);
    renderPhotoPreview();
}

function saveProperty(event) {
    event.preventDefault();

    const id = document.getElementById('propertyId').value;
    const propertyData = {
        title: document.getElementById('propertyTitle').value,
        type: document.getElementById('propertyType').value,
        price: parseFloat(document.getElementById('propertyPrice').value),
        status: document.getElementById('propertyStatus').value,
        bedrooms: parseInt(document.getElementById('propertyBedrooms').value),
        bathrooms: parseInt(document.getElementById('propertyBathrooms').value),
        area: parseInt(document.getElementById('propertyArea').value),
        address: document.getElementById('propertyAddress').value,
        city: document.getElementById('propertyCity').value,
        state: document.getElementById('propertyState').value,
        zipCode: document.getElementById('propertyZip').value,
        description: document.getElementById('propertyDescription').value,
        features: document.getElementById('propertyFeatures').value
            .split(',')
            .map(f => f.trim())
            .filter(f => f)
    };

    let savedProperty;
    if (id) {
        savedProperty = Storage.updateProperty(id, propertyData);
        
        // Remove old photos and add new ones
        const oldPhotos = Storage.getPhotosByProperty(id);
        oldPhotos.forEach(photo => Storage.deletePhoto(photo.id));
    } else {
        savedProperty = Storage.addProperty(propertyData);
    }

    // Save photos
    uploadedPhotos.forEach(photo => {
        if (photo.isNew || !id) {
            Storage.addPhoto({
                propertyId: savedProperty.id,
                data: photo.data,
                name: photo.name
            });
        }
    });

    closePropertyModal();
    loadProperties();
    Utils.showNotification(id ? 'Property updated successfully' : 'Property added successfully', 'success');
}

function deleteProperty(id) {
    Utils.showConfirm('Are you sure you want to delete this property?', () => {
        // Delete associated photos
        const photos = Storage.getPhotosByProperty(id);
        photos.forEach(photo => Storage.deletePhoto(photo.id));
        
        Storage.deleteProperty(id);
        loadProperties();
        Utils.showNotification('Property deleted successfully', 'success');
    });
}

function showMarkSoldModal(propertyId) {
    const property = Storage.getPropertyById(propertyId);
    document.getElementById('soldPropertyId').value = propertyId;
    document.getElementById('salePrice').value = property.price;
    document.getElementById('saleDate').value = Utils.getTodayDate();

    // Populate agent dropdown
    const agents = Storage.getAgents();
    document.getElementById('saleAgent').innerHTML = '<option value="">Select agent...</option>' +
        agents.map(agent => `<option value="${agent.id}">${Utils.sanitizeHTML(agent.name)}</option>`).join('');

    document.getElementById('markSoldModal').classList.remove('hidden');
}

function closeMarkSoldModal() {
    document.getElementById('markSoldModal').classList.add('hidden');
    document.getElementById('markSoldForm').reset();
}

function confirmMarkSold(event) {
    event.preventDefault();

    const propertyId = document.getElementById('soldPropertyId').value;
    const saleData = {
        propertyId: propertyId,
        buyerName: document.getElementById('buyerName').value,
        buyerEmail: document.getElementById('buyerEmail').value,
        buyerPhone: document.getElementById('buyerPhone').value,
        price: parseFloat(document.getElementById('salePrice').value),
        agentId: document.getElementById('saleAgent').value,
        date: document.getElementById('saleDate').value,
        commission: parseFloat(document.getElementById('salePrice').value) * 0.03,
        notes: document.getElementById('saleNotes').value
    };

    Storage.addSale(saleData);
    closeMarkSoldModal();
    loadProperties();
    loadDashboard();
    Utils.showNotification('Property marked as sold', 'success');
}

// Agents
function loadAgents() {
    const agents = Storage.getAgents();
    const container = document.getElementById('agentsGrid');

    if (agents.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No agents found</p></div>';
        return;
    }

    container.innerHTML = agents.map(agent => {
        const inquiries = Storage.getInquiriesByAgent(agent.id);
        const appointments = Storage.getAppointmentsByAgent(agent.id);
        const sales = Storage.getSalesByAgent(agent.id);

        return `
            <div class="agent-card">
                <div class="agent-card-header">
                    <div class="agent-avatar">👤</div>
                    <div class="agent-name">${Utils.sanitizeHTML(agent.name)}</div>
                    <div class="agent-specialization">${Utils.sanitizeHTML(agent.specialization || 'General')}</div>
                </div>
                <div class="agent-card-body">
                    <div class="agent-stats">
                        <div>
                            <div class="agent-stat-value">${inquiries.length}</div>
                            <div class="agent-stat-label">Inquiries</div>
                        </div>
                        <div>
                            <div class="agent-stat-value">${appointments.length}</div>
                            <div class="agent-stat-label">Appointments</div>
                        </div>
                        <div>
                            <div class="agent-stat-value">${sales.length}</div>
                            <div class="agent-stat-label">Sales</div>
                        </div>
                    </div>
                    <div class="agent-contact">
                        <p>📧 ${Utils.sanitizeHTML(agent.email)}</p>
                        <p>📞 ${Utils.sanitizeHTML(agent.phone)}</p>
                    </div>
                </div>
                <div class="agent-card-footer">
                    <button class="btn btn-sm btn-secondary" onclick="editAgent('${agent.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAgent('${agent.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function showAddAgentModal() {
    document.getElementById('agentModalTitle').textContent = 'Add Agent';
    document.getElementById('agentForm').reset();
    document.getElementById('agentId').value = '';
    document.getElementById('agentPassword').required = true;
    document.getElementById('agentModal').classList.remove('hidden');
}

function editAgent(id) {
    const agent = Storage.getUserById(id);
    if (!agent) return;

    document.getElementById('agentModalTitle').textContent = 'Edit Agent';
    document.getElementById('agentId').value = agent.id;
    document.getElementById('agentName').value = agent.name;
    document.getElementById('agentEmail').value = agent.email;
    document.getElementById('agentPhone').value = agent.phone;
    document.getElementById('agentPassword').value = '';
    document.getElementById('agentPassword').required = false;
    document.getElementById('agentSpecialization').value = agent.specialization || 'Residential';

    document.getElementById('agentModal').classList.remove('hidden');
}

function closeAgentModal() {
    document.getElementById('agentModal').classList.add('hidden');
}

function saveAgent(event) {
    event.preventDefault();

    const id = document.getElementById('agentId').value;
    const agentData = {
        name: document.getElementById('agentName').value,
        email: document.getElementById('agentEmail').value,
        phone: document.getElementById('agentPhone').value,
        specialization: document.getElementById('agentSpecialization').value,
        role: 'agent'
    };

    const password = document.getElementById('agentPassword').value;
    if (password) {
        agentData.password = password;
    }

    if (id) {
        Storage.updateUser(id, agentData);
    } else {
        if (!password) {
            Utils.showNotification('Password is required for new agents', 'danger');
            return;
        }
        Storage.addUser(agentData);
    }

    closeAgentModal();
    loadAgents();
    Utils.showNotification(id ? 'Agent updated successfully' : 'Agent added successfully', 'success');
}

function deleteAgent(id) {
    Utils.showConfirm('Are you sure you want to delete this agent?', () => {
        Storage.deleteUser(id);
        loadAgents();
        Utils.showNotification('Agent deleted successfully', 'success');
    });
}

// Reports
function loadReports() {
    const sales = Storage.getSales();
    
    // Calculate stats
    const totalSales = sales.reduce((sum, sale) => sum + sale.price, 0);
    const totalCommission = sales.reduce((sum, sale) => sum + (sale.commission || 0), 0);
    const avgPrice = sales.length > 0 ? totalSales / sales.length : 0;

    document.getElementById('reportTotalSales').textContent = Utils.formatCurrency(totalSales);
    document.getElementById('reportSalesCount').textContent = sales.length;
    document.getElementById('reportAvgPrice').textContent = Utils.formatCurrency(avgPrice);
    document.getElementById('reportTotalCommission').textContent = Utils.formatCurrency(totalCommission);

    // Render sales table
    const tableBody = document.getElementById('salesTable');
    
    if (sales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No sales recorded</td></tr>';
        return;
    }

    tableBody.innerHTML = sales.map(sale => {
        const property = Storage.getPropertyById(sale.propertyId);
        const agent = Storage.getUserById(sale.agentId);
        
        return `
            <tr>
                <td>${Utils.formatDateShort(sale.date)}</td>
                <td>${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</td>
                <td>
                    ${Utils.sanitizeHTML(sale.buyerName)}<br>
                    <small>${Utils.sanitizeHTML(sale.buyerEmail)}</small>
                </td>
                <td>${agent ? Utils.sanitizeHTML(agent.name) : 'Unknown'}</td>
                <td><strong>${Utils.formatCurrency(sale.price)}</strong></td>
                <td>${Utils.formatCurrency(sale.commission || 0)}</td>
            </tr>
        `;
    }).join('');
}

function exportSalesCSV() {
    const sales = Storage.getSales();
    
    if (sales.length === 0) {
        Utils.showNotification('No sales data to export', 'warning');
        return;
    }

    const csvData = sales.map(sale => {
        const property = Storage.getPropertyById(sale.propertyId);
        const agent = Storage.getUserById(sale.agentId);
        
        return {
            Date: sale.date,
            Property: property ? property.title : 'Unknown',
            'Buyer Name': sale.buyerName,
            'Buyer Email': sale.buyerEmail,
            'Buyer Phone': sale.buyerPhone,
            Agent: agent ? (agent.name || agent.firstName + ' ' + agent.lastName) : 'Unknown',
            Price: sale.price,
            Commission: sale.commission || 0,
            Notes: sale.notes || ''
        };
    });

    const columns = [
        { key: 'Date', label: 'Date' },
        { key: 'Property', label: 'Property' },
        { key: 'Buyer Name', label: 'Buyer Name' },
        { key: 'Buyer Email', label: 'Buyer Email' },
        { key: 'Buyer Phone', label: 'Buyer Phone' },
        { key: 'Agent', label: 'Agent' },
        { key: 'Price', label: 'Price' },
        { key: 'Commission', label: 'Commission' },
        { key: 'Notes', label: 'Notes' }
    ];

    const csv = Utils.generateCSV(csvData, columns);
    Utils.downloadCSV(csv, `sales-report-${Utils.getTodayDate()}.csv`);
    Utils.showNotification('Sales report exported successfully', 'success');
}

// Sample Data Management
function loadSampleData() {
    if (typeof SampleData !== 'undefined' && SampleData.load) {
        if (SampleData.load()) {
            Utils.showNotification('✅ Sample data loaded successfully!', 'success');
            loadDashboard();
            location.reload();
        }
    } else {
        Utils.showNotification('Sample data module not loaded', 'danger');
    }
}

function clearAllData() {
    if (!confirm('⚠️ Clear ALL data? This will remove all properties, inquiries, appointments, and sales. This cannot be undone!')) {
        return;
    }
    
    // Clear all data except users
    localStorage.setItem('realestate_properties', JSON.stringify([]));
    localStorage.setItem('realestate_inquiries', JSON.stringify([]));
    localStorage.setItem('realestate_appointments', JSON.stringify([]));
    localStorage.setItem('realestate_sales', JSON.stringify([]));
    localStorage.setItem('realestate_photos', JSON.stringify([]));
    
    Utils.showNotification('🗑️ All data cleared successfully!', 'success');
    location.reload();
}
