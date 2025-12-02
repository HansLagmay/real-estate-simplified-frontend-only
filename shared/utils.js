/**
 * Utility Functions
 * Common helper functions used across the platform
 */

const Utils = {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Format date short
    formatDateShort(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    },

    // Format time
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(date);
    },

    // Format date for input fields (YYYY-MM-DD)
    formatDateForInput(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    },

    // Get relative time (e.g., "2 hours ago")
    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) {
            return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
        } else if (diffHour > 0) {
            return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
        } else if (diffMin > 0) {
            return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
        } else {
            return 'Just now';
        }
    },

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone
    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    },

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Generate CSV from array of objects
    generateCSV(data, columns) {
        const headers = columns.map(col => col.label).join(',');
        const rows = data.map(item => 
            columns.map(col => {
                let value = item[col.key];
                // Handle nested properties
                if (col.key.includes('.')) {
                    const keys = col.key.split('.');
                    value = keys.reduce((obj, key) => obj && obj[key], item);
                }
                // Format value for CSV
                if (typeof value === 'string' && value.includes(',')) {
                    value = `"${value}"`;
                }
                return value || '';
            }).join(',')
        );
        return [headers, ...rows].join('\n');
    },

    // Download CSV
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Read file as base64
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show notification/toast
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        container.appendChild(notification);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    // Show confirmation dialog
    showConfirm(message, onConfirm, onCancel = null) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal confirm-modal">
                <div class="modal-header">
                    <h3>Confirm Action</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="confirmCancel">Cancel</button>
                    <button class="btn btn-danger" id="confirmOk">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#confirmOk').addEventListener('click', () => {
            modal.remove();
            if (onConfirm) onConfirm();
        });

        modal.querySelector('#confirmCancel').addEventListener('click', () => {
            modal.remove();
            if (onCancel) onCancel();
        });
    },

    // Get status badge HTML
    getStatusBadge(status) {
        const statusColors = {
            available: 'success',
            sold: 'danger',
            pending: 'warning',
            active: 'success',
            inactive: 'secondary',
            scheduled: 'info',
            completed: 'success',
            cancelled: 'danger',
            assigned: 'primary'
        };
        const color = statusColors[status] || 'secondary';
        return `<span class="badge badge-${color}">${status}</span>`;
    },

    // Get priority badge HTML
    getPriorityBadge(priority) {
        let color = 'secondary';
        if (priority <= 2) color = 'danger';
        else if (priority <= 5) color = 'warning';
        else color = 'info';
        return `<span class="badge badge-${color}">Priority ${priority}</span>`;
    },

    // Parse URL hash for SPA navigation
    parseHash() {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/');
        return {
            page: parts[0] || 'dashboard',
            id: parts[1] || null
        };
    },

    // Navigate to hash
    navigateTo(page, id = null) {
        window.location.hash = id ? `${page}/${id}` : page;
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Get today's date in YYYY-MM-DD format
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    },

    // Get time slots for scheduling
    getTimeSlots() {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 17) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        return slots;
    },

    // Calculate statistics from data
    calculateStats(data, field) {
        if (!data.length) return { total: 0, min: 0, max: 0, avg: 0 };
        
        const values = data.map(item => parseFloat(item[field]) || 0);
        const total = values.reduce((sum, val) => sum + val, 0);
        
        return {
            total,
            min: Math.min(...values),
            max: Math.max(...values),
            avg: total / values.length
        };
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
