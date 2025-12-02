/**
 * Seed Data
 * Initial data for the real estate platform
 * EMPTY SYSTEM - Only user accounts are preset
 */

const SeedData = {
    // 4 Users: 1 Admin + 3 Agents (ONLY preset data)
    users: [
        {
            id: 1,
            email: 'admin@company.com',
            password: 'admin123',
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            name: 'Admin User',
            phone: '555-100-0001',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 2,
            email: 'agent1@company.com',
            password: 'agent123',
            role: 'agent',
            firstName: 'Carlos',
            lastName: 'Reyes',
            name: 'Carlos Reyes',
            phone: '555-200-0001',
            avatar: null,
            specialization: 'Residential',
            createdAt: '2024-01-02T00:00:00Z'
        },
        {
            id: 3,
            email: 'agent2@company.com',
            password: 'agent123',
            role: 'agent',
            firstName: 'Maria',
            lastName: 'Lopez',
            name: 'Maria Lopez',
            phone: '555-200-0002',
            avatar: null,
            specialization: 'Commercial',
            createdAt: '2024-01-03T00:00:00Z'
        },
        {
            id: 4,
            email: 'agent3@company.com',
            password: 'agent123',
            role: 'agent',
            firstName: 'Ana',
            lastName: 'Garcia',
            name: 'Ana Garcia',
            phone: '555-200-0003',
            avatar: null,
            specialization: 'Luxury',
            createdAt: '2024-01-04T00:00:00Z'
        }
    ],

    // Everything else starts EMPTY
    properties: [],
    inquiries: [],
    appointments: [],
    sales: [],

    // Initialize data in localStorage (EMPTY except users)
    init(force = false) {
        // Check if data already exists
        const existingUsers = localStorage.getItem('realestate_users');
        
        if (existingUsers && !force) {
            console.log('Seed data already exists. Use init(true) to force reinitialize.');
            return false;
        }

        // Clear existing data
        localStorage.removeItem('realestate_properties');
        localStorage.removeItem('realestate_users');
        localStorage.removeItem('realestate_inquiries');
        localStorage.removeItem('realestate_appointments');
        localStorage.removeItem('realestate_sales');
        localStorage.removeItem('realestate_photos');

        // Set seed data - ONLY users, everything else empty
        localStorage.setItem('realestate_users', JSON.stringify(this.users));
        localStorage.setItem('realestate_properties', JSON.stringify([]));
        localStorage.setItem('realestate_inquiries', JSON.stringify([]));
        localStorage.setItem('realestate_appointments', JSON.stringify([]));
        localStorage.setItem('realestate_sales', JSON.stringify([]));
        localStorage.setItem('realestate_photos', JSON.stringify({}));

        console.log('✅ Empty system initialized successfully!');
        console.log('Users:', this.users.length);
        console.log('Properties: 0 (empty)');
        console.log('Inquiries: 0 (empty)');
        console.log('Appointments: 0 (empty)');
        console.log('Sales: 0 (empty)');

        return true;
    },

    // Check if seed data exists
    exists() {
        return !!localStorage.getItem('realestate_users');
    },

    // Clear all data except users
    clearAllData() {
        if (!confirm('⚠️ Clear ALL data? This cannot be undone!')) return false;
        
        localStorage.removeItem('realestate_properties');
        localStorage.removeItem('realestate_appointments');
        localStorage.removeItem('realestate_photos');
        localStorage.removeItem('realestate_inquiries');
        localStorage.removeItem('realestate_sales');
        
        // Reinitialize with empty data but keep users
        localStorage.setItem('realestate_properties', JSON.stringify([]));
        localStorage.setItem('realestate_inquiries', JSON.stringify([]));
        localStorage.setItem('realestate_appointments', JSON.stringify([]));
        localStorage.setItem('realestate_sales', JSON.stringify([]));
        localStorage.setItem('realestate_photos', JSON.stringify({}));
        
        console.log('✅ All data cleared!');
        return true;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeedData;
}
