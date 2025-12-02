/**
 * Storage Module
 * Handles all localStorage operations for the real estate platform
 */

const STORAGE_KEYS = {
    PROPERTIES: 'realestate_properties',
    APPOINTMENTS: 'realestate_appointments',
    USERS: 'realestate_users',
    PHOTOS: 'realestate_photos',
    INQUIRIES: 'realestate_inquiries',
    SALES: 'realestate_sales',
    CURRENT_USER: 'realestate_current_user'
};

const Storage = {
    // Generic CRUD operations
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    // Properties
    getProperties() {
        return this.get(STORAGE_KEYS.PROPERTIES) || [];
    },

    setProperties(properties) {
        return this.set(STORAGE_KEYS.PROPERTIES, properties);
    },

    getPropertyById(id) {
        const properties = this.getProperties();
        return properties.find(p => p.id === id);
    },

    addProperty(property) {
        const properties = this.getProperties();
        property.id = this.generateId('prop');
        property.createdAt = new Date().toISOString();
        properties.push(property);
        this.setProperties(properties);
        return property;
    },

    updateProperty(id, updates) {
        const properties = this.getProperties();
        const index = properties.findIndex(p => p.id === id);
        if (index !== -1) {
            properties[index] = { ...properties[index], ...updates, updatedAt: new Date().toISOString() };
            this.setProperties(properties);
            return properties[index];
        }
        return null;
    },

    deleteProperty(id) {
        const properties = this.getProperties();
        const filtered = properties.filter(p => p.id !== id);
        this.setProperties(filtered);
        return filtered.length !== properties.length;
    },

    // Users
    getUsers() {
        return this.get(STORAGE_KEYS.USERS) || [];
    },

    setUsers(users) {
        return this.set(STORAGE_KEYS.USERS, users);
    },

    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    },

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    },

    addUser(user) {
        const users = this.getUsers();
        user.id = this.generateId('user');
        user.createdAt = new Date().toISOString();
        users.push(user);
        this.setUsers(users);
        return user;
    },

    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.setUsers(users);
            return users[index];
        }
        return null;
    },

    deleteUser(id) {
        const users = this.getUsers();
        const filtered = users.filter(u => u.id !== id);
        this.setUsers(filtered);
        return filtered.length !== users.length;
    },

    getAgents() {
        return this.getUsers().filter(u => u.role === 'agent');
    },

    // Inquiries
    getInquiries() {
        return this.get(STORAGE_KEYS.INQUIRIES) || [];
    },

    setInquiries(inquiries) {
        return this.set(STORAGE_KEYS.INQUIRIES, inquiries);
    },

    getInquiryById(id) {
        const inquiries = this.getInquiries();
        return inquiries.find(i => i.id === id);
    },

    addInquiry(inquiry) {
        const inquiries = this.getInquiries();
        inquiry.id = this.generateId('inq');
        inquiry.createdAt = new Date().toISOString();
        inquiry.status = 'pending';
        inquiry.priority = this.calculatePriority(inquiries);
        inquiries.push(inquiry);
        this.setInquiries(inquiries);
        return inquiry;
    },

    updateInquiry(id, updates) {
        const inquiries = this.getInquiries();
        const index = inquiries.findIndex(i => i.id === id);
        if (index !== -1) {
            inquiries[index] = { ...inquiries[index], ...updates };
            this.setInquiries(inquiries);
            return inquiries[index];
        }
        return null;
    },

    deleteInquiry(id) {
        const inquiries = this.getInquiries();
        const filtered = inquiries.filter(i => i.id !== id);
        this.setInquiries(filtered);
        this.recalculatePriorities();
        return filtered.length !== inquiries.length;
    },

    calculatePriority(inquiries) {
        const pending = inquiries.filter(i => i.status === 'pending' || i.status === 'assigned');
        return pending.length + 1;
    },

    recalculatePriorities() {
        const inquiries = this.getInquiries();
        const pending = inquiries
            .filter(i => i.status === 'pending' || i.status === 'assigned')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        pending.forEach((inq, index) => {
            inq.priority = index + 1;
        });
        
        this.setInquiries(inquiries);
    },

    getInquiriesByAgent(agentId) {
        return this.getInquiries().filter(i => i.assignedTo === agentId);
    },

    // Appointments
    getAppointments() {
        return this.get(STORAGE_KEYS.APPOINTMENTS) || [];
    },

    setAppointments(appointments) {
        return this.set(STORAGE_KEYS.APPOINTMENTS, appointments);
    },

    getAppointmentById(id) {
        const appointments = this.getAppointments();
        return appointments.find(a => a.id === id);
    },

    addAppointment(appointment) {
        // Check for conflicts first
        if (this.hasAppointmentConflict(appointment.propertyId, appointment.date, appointment.time)) {
            return { error: 'Time conflict: This property already has an appointment at this date and time.' };
        }
        
        const appointments = this.getAppointments();
        appointment.id = this.generateId('apt');
        appointment.createdAt = new Date().toISOString();
        appointment.status = 'scheduled';
        appointments.push(appointment);
        this.setAppointments(appointments);
        return appointment;
    },

    updateAppointment(id, updates) {
        const appointments = this.getAppointments();
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            // Check for conflicts if date/time is being updated
            if (updates.date || updates.time) {
                const appointment = appointments[index];
                const newDate = updates.date || appointment.date;
                const newTime = updates.time || appointment.time;
                const newPropertyId = updates.propertyId || appointment.propertyId;
                
                if (this.hasAppointmentConflict(newPropertyId, newDate, newTime, id)) {
                    return { error: 'Time conflict: This property already has an appointment at this date and time.' };
                }
            }
            
            appointments[index] = { ...appointments[index], ...updates };
            this.setAppointments(appointments);
            return appointments[index];
        }
        return null;
    },

    deleteAppointment(id) {
        const appointments = this.getAppointments();
        const filtered = appointments.filter(a => a.id !== id);
        this.setAppointments(filtered);
        return filtered.length !== appointments.length;
    },

    hasAppointmentConflict(propertyId, date, time, excludeId = null) {
        const appointments = this.getAppointments();
        return appointments.some(a => 
            a.propertyId === propertyId &&
            a.date === date &&
            a.time === time &&
            a.id !== excludeId &&
            a.status !== 'cancelled'
        );
    },

    getAppointmentsByAgent(agentId) {
        return this.getAppointments().filter(a => a.agentId === agentId);
    },

    getAppointmentsByProperty(propertyId) {
        return this.getAppointments().filter(a => a.propertyId === propertyId);
    },

    // Sales
    getSales() {
        return this.get(STORAGE_KEYS.SALES) || [];
    },

    setSales(sales) {
        return this.set(STORAGE_KEYS.SALES, sales);
    },

    addSale(sale) {
        const sales = this.getSales();
        sale.id = this.generateId('sale');
        sale.createdAt = new Date().toISOString();
        sales.push(sale);
        this.setSales(sales);
        
        // Mark property as sold
        this.updateProperty(sale.propertyId, { status: 'sold', soldDate: sale.date });
        
        return sale;
    },

    getSalesByAgent(agentId) {
        return this.getSales().filter(s => s.agentId === agentId);
    },

    // Photos
    getPhotos() {
        return this.get(STORAGE_KEYS.PHOTOS) || [];
    },

    setPhotos(photos) {
        return this.set(STORAGE_KEYS.PHOTOS, photos);
    },

    addPhoto(photo) {
        const photos = this.getPhotos();
        photo.id = this.generateId('photo');
        photo.uploadedAt = new Date().toISOString();
        photos.push(photo);
        this.setPhotos(photos);
        return photo;
    },

    getPhotosByProperty(propertyId) {
        return this.getPhotos().filter(p => p.propertyId === propertyId);
    },

    deletePhoto(id) {
        const photos = this.getPhotos();
        const filtered = photos.filter(p => p.id !== id);
        this.setPhotos(filtered);
        return filtered.length !== photos.length;
    },

    // Current User (Session)
    getCurrentUser() {
        return this.get(STORAGE_KEYS.CURRENT_USER);
    },

    setCurrentUser(user) {
        return this.set(STORAGE_KEYS.CURRENT_USER, user);
    },

    clearCurrentUser() {
        return this.remove(STORAGE_KEYS.CURRENT_USER);
    },

    // Utility
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Clear all data (for testing)
    clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    // Export all data as JSON
    exportData() {
        return {
            properties: this.getProperties(),
            users: this.getUsers(),
            inquiries: this.getInquiries(),
            appointments: this.getAppointments(),
            sales: this.getSales(),
            photos: this.getPhotos()
        };
    },

    // Import data from JSON
    importData(data) {
        if (data.properties) this.setProperties(data.properties);
        if (data.users) this.setUsers(data.users);
        if (data.inquiries) this.setInquiries(data.inquiries);
        if (data.appointments) this.setAppointments(data.appointments);
        if (data.sales) this.setSales(data.sales);
        if (data.photos) this.setPhotos(data.photos);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Storage, STORAGE_KEYS };
}
