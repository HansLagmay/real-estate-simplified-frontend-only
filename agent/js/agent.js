/**
 * Agent Portal JavaScript
 */

let currentUser = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seed data if not exists
    if (!SeedData.exists()) {
        SeedData.init();
    }

    // Check if already logged in
    checkAuth();

    // Setup navigation
    setupNavigation();
});

// Authentication
function checkAuth() {
    const user = Auth.getCurrentUser();
    if (user && user.role === 'agent') {
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
        if (result.user.role === 'agent') {
            currentUser = result.user;
            showApp();
        } else {
            errorDiv.textContent = 'Access denied. Agent privileges required.';
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
    document.getElementById('currentUserName').textContent = currentUser.name;
    
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
            case 'sales':
                loadSales();
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
    if (!currentUser) return;

    const myInquiries = Storage.getInquiriesByAgent(currentUser.id);
    const myAppointments = Storage.getAppointmentsByAgent(currentUser.id);
    const mySales = Storage.getSalesByAgent(currentUser.id);

    // Update stats
    document.getElementById('statMyInquiries').textContent = myInquiries.length;
    document.getElementById('statMyAppointments').textContent = myAppointments.filter(a => a.status === 'scheduled').length;
    document.getElementById('statCompletedViewings').textContent = myAppointments.filter(a => a.status === 'completed').length;
    document.getElementById('statMySales').textContent = mySales.length;

    // Load recent inquiries
    const recentInquiries = myInquiries.slice(-5).reverse();
    const inquiriesContainer = document.getElementById('recentInquiries');
    
    if (recentInquiries.length === 0) {
        inquiriesContainer.innerHTML = '<p class="empty-list">No inquiries assigned to you</p>';
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
                    ${Utils.getPriorityBadge(inquiry.priority)}
                </div>
            `;
        }).join('');
    }

    // Load today's schedule
    const today = Utils.getTodayDate();
    const todayAppointments = myAppointments.filter(a => a.date === today && a.status === 'scheduled');
    const scheduleContainer = document.getElementById('todaySchedule');
    
    if (todayAppointments.length === 0) {
        scheduleContainer.innerHTML = '<p class="empty-list">No appointments scheduled for today</p>';
    } else {
        scheduleContainer.innerHTML = todayAppointments.map(apt => {
            const property = Storage.getPropertyById(apt.propertyId);
            return `
                <div class="activity-item">
                    <div class="activity-icon">📅</div>
                    <div class="activity-content">
                        <div class="activity-title">${Utils.sanitizeHTML(apt.customerName)}</div>
                        <div class="activity-meta">
                            ${property ? Utils.sanitizeHTML(property.title) : 'Unknown'} • 
                            ${Utils.formatTime(apt.time)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Inquiries
function loadInquiries() {
    if (!currentUser) return;

    const myInquiries = Storage.getInquiriesByAgent(currentUser.id);
    const tableBody = document.getElementById('inquiriesTable');
    
    if (myInquiries.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No inquiries assigned to you</td></tr>';
        return;
    }

    tableBody.innerHTML = myInquiries.map(inquiry => {
        const property = Storage.getPropertyById(inquiry.propertyId);
        const hasAppointment = Storage.getAppointments().some(a => a.inquiryId === inquiry.id);
        
        return `
            <tr>
                <td>${Utils.getPriorityBadge(inquiry.priority)}</td>
                <td><strong>${Utils.sanitizeHTML(inquiry.customerName)}</strong></td>
                <td>
                    📧 ${Utils.sanitizeHTML(inquiry.customerEmail)}<br>
                    📞 ${Utils.sanitizeHTML(inquiry.customerPhone)}
                </td>
                <td>${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</td>
                <td>${Utils.formatDateShort(inquiry.createdAt)}</td>
                <td>${Utils.getStatusBadge(inquiry.status)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewInquiry('${inquiry.id}')">View</button>
                    ${!hasAppointment && property && property.status === 'available' 
                        ? `<button class="btn btn-sm btn-primary" onclick="showScheduleModal('${inquiry.id}')">Schedule</button>`
                        : ''
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function viewInquiry(id) {
    const inquiry = Storage.getInquiryById(id);
    const property = Storage.getPropertyById(inquiry.propertyId);

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
                <span class="detail-label">Property</span>
                <span class="detail-value">${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</span>
            </div>
            ${property ? `
                <div class="detail-row">
                    <span class="detail-label">Property Price</span>
                    <span class="detail-value">${Utils.formatCurrency(property.price)}</span>
                </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${Utils.formatDate(inquiry.createdAt)}</span>
            </div>
        </div>
        
        <div class="contact-card">
            <h4>Customer Contact Information</h4>
            <div class="contact-item">👤 ${Utils.sanitizeHTML(inquiry.customerName)}</div>
            <div class="contact-item">📧 <a href="mailto:${Utils.sanitizeHTML(inquiry.customerEmail)}">${Utils.sanitizeHTML(inquiry.customerEmail)}</a></div>
            <div class="contact-item">📞 <a href="tel:${Utils.sanitizeHTML(inquiry.customerPhone)}">${Utils.sanitizeHTML(inquiry.customerPhone)}</a></div>
        </div>
        
        <div class="inquiry-message">
            <h4>Customer Message</h4>
            <p>${Utils.sanitizeHTML(inquiry.message)}</p>
        </div>
    `;

    document.getElementById('viewInquiryModal').classList.remove('hidden');
}

function closeViewInquiryModal() {
    document.getElementById('viewInquiryModal').classList.add('hidden');
}

function showScheduleModal(inquiryId) {
    const inquiry = Storage.getInquiryById(inquiryId);
    const property = Storage.getPropertyById(inquiry.propertyId);

    document.getElementById('scheduleInquiryId').value = inquiryId;
    document.getElementById('schedulePropertyId').value = inquiry.propertyId;
    document.getElementById('schedulePropertyName').value = property ? property.title : 'Unknown';
    document.getElementById('scheduleCustomerName').value = inquiry.customerName;
    document.getElementById('scheduleDate').value = '';
    document.getElementById('scheduleDate').min = Utils.getTodayDate();
    document.getElementById('scheduleError').classList.add('hidden');

    // Populate time slots
    const timeSelect = document.getElementById('scheduleTime');
    timeSelect.innerHTML = '<option value="">Select time...</option>';
    Utils.getTimeSlots().forEach(slot => {
        timeSelect.innerHTML += `<option value="${slot}">${Utils.formatTime(slot)}</option>`;
    });

    document.getElementById('scheduleModal').classList.remove('hidden');
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').classList.add('hidden');
    document.getElementById('scheduleForm').reset();
}

function confirmSchedule(event) {
    event.preventDefault();

    const inquiryId = document.getElementById('scheduleInquiryId').value;
    const propertyId = document.getElementById('schedulePropertyId').value;
    const date = document.getElementById('scheduleDate').value;
    const time = document.getElementById('scheduleTime').value;
    const notes = document.getElementById('scheduleNotes').value;
    const errorDiv = document.getElementById('scheduleError');

    // Check for conflicts
    if (Storage.hasAppointmentConflict(propertyId, date, time)) {
        errorDiv.textContent = 'Time conflict! This property already has an appointment at this date and time.';
        errorDiv.classList.remove('hidden');
        return;
    }

    const inquiry = Storage.getInquiryById(inquiryId);
    
    const appointment = Storage.addAppointment({
        propertyId: propertyId,
        agentId: currentUser.id,
        customerName: inquiry.customerName,
        customerEmail: inquiry.customerEmail,
        customerPhone: inquiry.customerPhone,
        date: date,
        time: time,
        notes: notes,
        inquiryId: inquiryId
    });

    if (appointment.error) {
        errorDiv.textContent = appointment.error;
        errorDiv.classList.remove('hidden');
        return;
    }

    // Update inquiry status
    Storage.updateInquiry(inquiryId, { status: 'scheduled' });

    closeScheduleModal();
    loadInquiries();
    Utils.showNotification('Viewing scheduled successfully', 'success');
}

// Calendar
function loadCalendar() {
    // Populate agent filter
    const agents = Storage.getAgents();
    const agentFilter = document.getElementById('calendarAgentFilter');
    const currentValue = agentFilter.value;
    agentFilter.innerHTML = '<option value="">All Agents</option>' +
        agents.map(agent => `<option value="${agent.id}">${Utils.sanitizeHTML(agent.name)}${agent.id === currentUser.id ? ' (Me)' : ''}</option>`).join('');
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
                const isMine = apt.agentId === currentUser.id;
                const property = Storage.getPropertyById(apt.propertyId);
                return `<div class="calendar-event ${apt.status} ${isMine ? 'mine' : 'other'}" 
                            onclick="viewAppointment('${apt.id}')"
                            title="${Utils.sanitizeHTML(apt.customerName)} - ${Utils.formatTime(apt.time)}${!isMine ? ' (' + (agent ? agent.name : 'Unknown') + ')' : ''}">
                    ${Utils.formatTime(apt.time)} - ${property ? Utils.sanitizeHTML(Utils.truncateText(property.title, 15)) : 'Unknown'}
                    ${!isMine && agent ? `<br><small>${Utils.sanitizeHTML(agent.name)}</small>` : ''}
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

function viewAppointment(id) {
    const apt = Storage.getAppointmentById(id);
    if (!apt) return;

    const property = Storage.getPropertyById(apt.propertyId);
    const agent = Storage.getUserById(apt.agentId);
    const isMine = apt.agentId === currentUser.id;

    const content = document.getElementById('viewAppointmentContent');
    content.innerHTML = `
        <div class="appointment-details">
            <div class="detail-row">
                <span class="detail-label">Property</span>
                <span class="detail-value">${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${Utils.formatDate(apt.date)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${Utils.formatTime(apt.time)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value">${Utils.getStatusBadge(apt.status)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Agent</span>
                <span class="detail-value">${agent ? Utils.sanitizeHTML(agent.name) : 'Unknown'}${isMine ? ' (You)' : ''}</span>
            </div>
        </div>
        
        <div class="contact-card">
            <h4>Customer Contact</h4>
            <div class="contact-item">👤 ${Utils.sanitizeHTML(apt.customerName)}</div>
            <div class="contact-item">📧 <a href="mailto:${Utils.sanitizeHTML(apt.customerEmail)}">${Utils.sanitizeHTML(apt.customerEmail)}</a></div>
            <div class="contact-item">📞 <a href="tel:${Utils.sanitizeHTML(apt.customerPhone)}">${Utils.sanitizeHTML(apt.customerPhone)}</a></div>
        </div>
        
        ${apt.notes ? `
            <div class="inquiry-message">
                <h4>Notes</h4>
                <p>${Utils.sanitizeHTML(apt.notes)}</p>
            </div>
        ` : ''}
    `;

    const actionsDiv = document.getElementById('viewAppointmentActions');
    if (isMine && apt.status === 'scheduled') {
        actionsDiv.innerHTML = `
            <button class="btn btn-success" onclick="markCompleted('${apt.id}')">Mark Completed</button>
            <button class="btn btn-danger" onclick="cancelAppointment('${apt.id}')">Cancel</button>
        `;
    } else {
        actionsDiv.innerHTML = '';
    }

    document.getElementById('viewAppointmentModal').classList.remove('hidden');
}

function closeViewAppointmentModal() {
    document.getElementById('viewAppointmentModal').classList.add('hidden');
}

function markCompleted(id) {
    Storage.updateAppointment(id, { status: 'completed' });
    closeViewAppointmentModal();
    renderCalendar();
    loadDashboard();
    Utils.showNotification('Viewing marked as completed', 'success');
}

function cancelAppointment(id) {
    Utils.showConfirm('Are you sure you want to cancel this appointment?', () => {
        Storage.updateAppointment(id, { status: 'cancelled' });
        closeViewAppointmentModal();
        renderCalendar();
        loadDashboard();
        Utils.showNotification('Appointment cancelled', 'info');
    });
}

// Sales
function loadSales() {
    if (!currentUser) return;

    const mySales = Storage.getSalesByAgent(currentUser.id);
    
    // Calculate stats
    const totalSales = mySales.reduce((sum, sale) => sum + sale.price, 0);
    const totalCommission = mySales.reduce((sum, sale) => sum + (sale.commission || 0), 0);

    document.getElementById('myTotalSales').textContent = Utils.formatCurrency(totalSales);
    document.getElementById('myPropertiesSold').textContent = mySales.length;
    document.getElementById('myTotalCommission').textContent = Utils.formatCurrency(totalCommission);

    // Render sales table
    const tableBody = document.getElementById('salesTable');
    
    if (mySales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No sales recorded yet</td></tr>';
        return;
    }

    tableBody.innerHTML = mySales.map(sale => {
        const property = Storage.getPropertyById(sale.propertyId);
        
        return `
            <tr>
                <td>${Utils.formatDateShort(sale.date)}</td>
                <td>${property ? Utils.sanitizeHTML(property.title) : 'Unknown'}</td>
                <td>
                    ${Utils.sanitizeHTML(sale.buyerName)}<br>
                    <small>${Utils.sanitizeHTML(sale.buyerEmail)}</small>
                </td>
                <td><strong>${Utils.formatCurrency(sale.price)}</strong></td>
                <td class="text-success">${Utils.formatCurrency(sale.commission || 0)}</td>
            </tr>
        `;
    }).join('');
}
