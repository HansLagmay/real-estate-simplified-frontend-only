/**
 * Seed Data
 * Initial data for the real estate platform
 */

const SeedData = {
    // 4 Users: 1 Admin + 3 Agents
    users: [
        {
            id: 'user_001',
            email: 'admin@company.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            phone: '555-100-0001',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 'user_002',
            email: 'agent1@company.com',
            password: 'agent123',
            name: 'Sarah Johnson',
            role: 'agent',
            phone: '555-200-0001',
            avatar: null,
            specialization: 'Residential',
            createdAt: '2024-01-02T00:00:00Z'
        },
        {
            id: 'user_003',
            email: 'agent2@company.com',
            password: 'agent123',
            name: 'Michael Chen',
            role: 'agent',
            phone: '555-200-0002',
            avatar: null,
            specialization: 'Commercial',
            createdAt: '2024-01-03T00:00:00Z'
        },
        {
            id: 'user_004',
            email: 'agent3@company.com',
            password: 'agent123',
            name: 'Emily Davis',
            role: 'agent',
            phone: '555-200-0003',
            avatar: null,
            specialization: 'Luxury',
            createdAt: '2024-01-04T00:00:00Z'
        }
    ],

    // 15 Properties
    properties: [
        {
            id: 'prop_001',
            title: 'Modern Downtown Apartment',
            type: 'apartment',
            status: 'available',
            price: 450000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            address: '123 Main Street, Apt 501',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            description: 'Beautiful modern apartment in the heart of downtown. Features floor-to-ceiling windows, hardwood floors, and stunning city views. Walking distance to restaurants, shops, and public transit.',
            features: ['Gym', 'Doorman', 'Rooftop Terrace', 'In-unit Laundry', 'Parking'],
            images: [],
            createdAt: '2024-01-10T00:00:00Z'
        },
        {
            id: 'prop_002',
            title: 'Spacious Family Home',
            type: 'house',
            status: 'available',
            price: 750000,
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            address: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            description: 'Perfect family home in a quiet neighborhood. Large backyard, updated kitchen, and excellent school district. Two-car garage and plenty of storage.',
            features: ['Pool', 'Large Backyard', 'Two-car Garage', 'Home Office', 'Updated Kitchen'],
            images: [],
            createdAt: '2024-01-11T00:00:00Z'
        },
        {
            id: 'prop_003',
            title: 'Luxury Penthouse Suite',
            type: 'penthouse',
            status: 'available',
            price: 2500000,
            bedrooms: 3,
            bathrooms: 3,
            area: 3500,
            address: '789 Skyline Drive, PH1',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101',
            description: 'Stunning penthouse with panoramic ocean views. Private elevator, chef\'s kitchen, and wraparound terrace. Ultimate luxury living.',
            features: ['Ocean View', 'Private Elevator', 'Smart Home', 'Wine Cellar', 'Concierge Service'],
            images: [],
            createdAt: '2024-01-12T00:00:00Z'
        },
        {
            id: 'prop_004',
            title: 'Cozy Studio Apartment',
            type: 'studio',
            status: 'available',
            price: 225000,
            bedrooms: 0,
            bathrooms: 1,
            area: 500,
            address: '321 Park Lane, Unit 12',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            description: 'Efficient studio apartment perfect for young professionals. Modern finishes, great natural light, and convenient location near public transit.',
            features: ['Natural Light', 'Modern Finishes', 'Pet Friendly', 'Near Transit'],
            images: [],
            createdAt: '2024-01-13T00:00:00Z'
        },
        {
            id: 'prop_005',
            title: 'Victorian Townhouse',
            type: 'townhouse',
            status: 'available',
            price: 850000,
            bedrooms: 3,
            bathrooms: 2,
            area: 2200,
            address: '555 Heritage Row',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94101',
            description: 'Beautifully restored Victorian townhouse with original details. Modern amenities while preserving historic charm. Private garden and garage parking.',
            features: ['Historic Details', 'Private Garden', 'Garage', 'Renovated Kitchen', 'High Ceilings'],
            images: [],
            createdAt: '2024-01-14T00:00:00Z'
        },
        {
            id: 'prop_006',
            title: 'Beachfront Condo',
            type: 'condo',
            status: 'available',
            price: 620000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1400,
            address: '100 Ocean Boulevard, Unit 305',
            city: 'San Diego',
            state: 'CA',
            zipCode: '92101',
            description: 'Direct beachfront condo with stunning sunset views. Resort-style amenities including pool, spa, and fitness center. Perfect for beach lovers.',
            features: ['Beachfront', 'Pool', 'Spa', 'Fitness Center', 'Balcony'],
            images: [],
            createdAt: '2024-01-15T00:00:00Z'
        },
        {
            id: 'prop_007',
            title: 'Mountain Retreat Cabin',
            type: 'cabin',
            status: 'available',
            price: 380000,
            bedrooms: 2,
            bathrooms: 1,
            area: 1100,
            address: '1 Pine Ridge Road',
            city: 'Aspen',
            state: 'CO',
            zipCode: '81611',
            description: 'Charming mountain cabin with ski-in/ski-out access. Cozy fireplace, vaulted ceilings, and breathtaking mountain views.',
            features: ['Ski Access', 'Fireplace', 'Mountain Views', 'Hot Tub', 'Deck'],
            images: [],
            createdAt: '2024-01-16T00:00:00Z'
        },
        {
            id: 'prop_008',
            title: 'Urban Loft',
            type: 'loft',
            status: 'available',
            price: 520000,
            bedrooms: 1,
            bathrooms: 1,
            area: 1600,
            address: '200 Industrial Way, Loft 8',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11201',
            description: 'Converted warehouse loft with exposed brick and industrial charm. Open floor plan, 16-foot ceilings, and tons of natural light.',
            features: ['Exposed Brick', 'High Ceilings', 'Open Floor Plan', 'Industrial Style', 'Large Windows'],
            images: [],
            createdAt: '2024-01-17T00:00:00Z'
        },
        {
            id: 'prop_009',
            title: 'Suburban Ranch Home',
            type: 'house',
            status: 'sold',
            price: 420000,
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            address: '789 Maple Street',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
            description: 'Classic ranch home on a large lot. Open concept living, updated bathrooms, and a spacious three-car garage.',
            features: ['Large Lot', 'Three-car Garage', 'Open Concept', 'Updated Bathrooms', 'Covered Patio'],
            images: [],
            soldDate: '2024-02-15T00:00:00Z',
            createdAt: '2024-01-18T00:00:00Z'
        },
        {
            id: 'prop_010',
            title: 'High-Rise City Condo',
            type: 'condo',
            status: 'available',
            price: 890000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1350,
            address: '500 Tower Place, Unit 4502',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            description: 'Luxurious high-rise condo with panoramic city and water views. Premium finishes, concierge service, and steps from everything.',
            features: ['City Views', 'Concierge', 'Fitness Center', 'Rooftop Pool', 'Valet Parking'],
            images: [],
            createdAt: '2024-01-19T00:00:00Z'
        },
        {
            id: 'prop_011',
            title: 'Country Estate',
            type: 'estate',
            status: 'available',
            price: 1850000,
            bedrooms: 5,
            bathrooms: 4,
            area: 4500,
            address: '1000 Country Lane',
            city: 'Nashville',
            state: 'TN',
            zipCode: '37201',
            description: 'Magnificent country estate on 10 acres. Grand entrance, chef\'s kitchen, wine cellar, and equestrian facilities.',
            features: ['10 Acres', 'Horse Stables', 'Wine Cellar', 'Guest House', 'Pool'],
            images: [],
            createdAt: '2024-01-20T00:00:00Z'
        },
        {
            id: 'prop_012',
            title: 'Downtown Micro Unit',
            type: 'studio',
            status: 'sold',
            price: 195000,
            bedrooms: 0,
            bathrooms: 1,
            area: 350,
            address: '55 City Center, Unit 901',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            description: 'Efficiently designed micro unit with Murphy bed and built-in storage. Perfect for minimalist living in the heart of the city.',
            features: ['Murphy Bed', 'Built-in Storage', 'City Center', 'Bike Storage', 'Rooftop Access'],
            images: [],
            soldDate: '2024-03-01T00:00:00Z',
            createdAt: '2024-01-21T00:00:00Z'
        },
        {
            id: 'prop_013',
            title: 'Lakefront Cottage',
            type: 'cottage',
            status: 'available',
            price: 475000,
            bedrooms: 3,
            bathrooms: 2,
            area: 1650,
            address: '25 Lakeshore Drive',
            city: 'Lake Tahoe',
            state: 'CA',
            zipCode: '96150',
            description: 'Charming lakefront cottage with private dock. Cozy interior, wraparound porch, and stunning lake views from every room.',
            features: ['Private Dock', 'Lake Views', 'Wraparound Porch', 'Fireplace', 'Boat Access'],
            images: [],
            createdAt: '2024-01-22T00:00:00Z'
        },
        {
            id: 'prop_014',
            title: 'Modern Smart Home',
            type: 'house',
            status: 'available',
            price: 980000,
            bedrooms: 4,
            bathrooms: 3,
            area: 3200,
            address: '800 Tech Valley Road',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95101',
            description: 'State-of-the-art smart home with fully integrated automation. Solar panels, EV charging, and sustainable design throughout.',
            features: ['Smart Home', 'Solar Panels', 'EV Charging', 'Home Theater', 'Sustainable Design'],
            images: [],
            createdAt: '2024-01-23T00:00:00Z'
        },
        {
            id: 'prop_015',
            title: 'Historic Brownstone',
            type: 'townhouse',
            status: 'available',
            price: 1250000,
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            address: '150 Brooklyn Heights',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11201',
            description: 'Stunning historic brownstone with meticulous restoration. Original details preserved with modern updates. Garden level apartment perfect for rental income.',
            features: ['Historic', 'Garden Apartment', 'Original Details', 'Renovated', 'Rental Income Potential'],
            images: [],
            createdAt: '2024-01-24T00:00:00Z'
        }
    ],

    // 10 Inquiries
    inquiries: [
        {
            id: 'inq_001',
            propertyId: 'prop_001',
            customerName: 'John Smith',
            customerEmail: 'john.smith@email.com',
            customerPhone: '555-111-0001',
            message: 'I am very interested in this apartment. Can I schedule a viewing this week?',
            status: 'assigned',
            assignedTo: 'user_002',
            priority: 1,
            createdAt: '2024-02-01T10:00:00Z'
        },
        {
            id: 'inq_002',
            propertyId: 'prop_002',
            customerName: 'Mary Johnson',
            customerEmail: 'mary.johnson@email.com',
            customerPhone: '555-111-0002',
            message: 'Looking for a family home. Is this property near good schools?',
            status: 'assigned',
            assignedTo: 'user_002',
            priority: 2,
            createdAt: '2024-02-02T14:30:00Z'
        },
        {
            id: 'inq_003',
            propertyId: 'prop_003',
            customerName: 'Robert Williams',
            customerEmail: 'r.williams@email.com',
            customerPhone: '555-111-0003',
            message: 'Interested in the penthouse. What are the HOA fees?',
            status: 'assigned',
            assignedTo: 'user_004',
            priority: 3,
            createdAt: '2024-02-03T09:15:00Z'
        },
        {
            id: 'inq_004',
            propertyId: 'prop_005',
            customerName: 'Jennifer Brown',
            customerEmail: 'jen.brown@email.com',
            customerPhone: '555-111-0004',
            message: 'Love the Victorian style! Is the price negotiable?',
            status: 'pending',
            assignedTo: null,
            priority: 4,
            createdAt: '2024-02-04T16:45:00Z'
        },
        {
            id: 'inq_005',
            propertyId: 'prop_006',
            customerName: 'David Lee',
            customerEmail: 'david.lee@email.com',
            customerPhone: '555-111-0005',
            message: 'Relocating to San Diego. Need info on the area.',
            status: 'assigned',
            assignedTo: 'user_003',
            priority: 5,
            createdAt: '2024-02-05T11:00:00Z'
        },
        {
            id: 'inq_006',
            propertyId: 'prop_007',
            customerName: 'Lisa Anderson',
            customerEmail: 'lisa.a@email.com',
            customerPhone: '555-111-0006',
            message: 'Looking for a vacation home. Is this available for short-term rental?',
            status: 'pending',
            assignedTo: null,
            priority: 6,
            createdAt: '2024-02-06T13:20:00Z'
        },
        {
            id: 'inq_007',
            propertyId: 'prop_010',
            customerName: 'James Wilson',
            customerEmail: 'j.wilson@email.com',
            customerPhone: '555-111-0007',
            message: 'Moving to Seattle for work. Very interested in this condo.',
            status: 'assigned',
            assignedTo: 'user_003',
            priority: 7,
            createdAt: '2024-02-07T08:30:00Z'
        },
        {
            id: 'inq_008',
            propertyId: 'prop_011',
            customerName: 'Patricia Taylor',
            customerEmail: 'p.taylor@email.com',
            customerPhone: '555-111-0008',
            message: 'Looking for an estate with horse facilities. This seems perfect!',
            status: 'pending',
            assignedTo: null,
            priority: 8,
            createdAt: '2024-02-08T15:00:00Z'
        },
        {
            id: 'inq_009',
            propertyId: 'prop_013',
            customerName: 'Thomas Martinez',
            customerEmail: 't.martinez@email.com',
            customerPhone: '555-111-0009',
            message: 'Interested in lakefront property. Does it have year-round access?',
            status: 'assigned',
            assignedTo: 'user_004',
            priority: 9,
            createdAt: '2024-02-09T10:45:00Z'
        },
        {
            id: 'inq_010',
            propertyId: 'prop_014',
            customerName: 'Nancy Garcia',
            customerEmail: 'n.garcia@email.com',
            customerPhone: '555-111-0010',
            message: 'Love smart home tech! Would like to see this property.',
            status: 'pending',
            assignedTo: null,
            priority: 10,
            createdAt: '2024-02-10T12:15:00Z'
        }
    ],

    // 5 Appointments
    appointments: [
        {
            id: 'apt_001',
            propertyId: 'prop_001',
            agentId: 'user_002',
            customerName: 'John Smith',
            customerEmail: 'john.smith@email.com',
            customerPhone: '555-111-0001',
            date: '2024-03-15',
            time: '10:00',
            status: 'scheduled',
            notes: 'First-time buyer, very interested',
            inquiryId: 'inq_001',
            createdAt: '2024-02-12T00:00:00Z'
        },
        {
            id: 'apt_002',
            propertyId: 'prop_002',
            agentId: 'user_002',
            customerName: 'Mary Johnson',
            customerEmail: 'mary.johnson@email.com',
            customerPhone: '555-111-0002',
            date: '2024-03-16',
            time: '14:00',
            status: 'scheduled',
            notes: 'Looking for family home near schools',
            inquiryId: 'inq_002',
            createdAt: '2024-02-12T00:00:00Z'
        },
        {
            id: 'apt_003',
            propertyId: 'prop_003',
            agentId: 'user_004',
            customerName: 'Robert Williams',
            customerEmail: 'r.williams@email.com',
            customerPhone: '555-111-0003',
            date: '2024-03-17',
            time: '11:00',
            status: 'completed',
            notes: 'Luxury buyer, pre-approved for financing',
            inquiryId: 'inq_003',
            createdAt: '2024-02-13T00:00:00Z'
        },
        {
            id: 'apt_004',
            propertyId: 'prop_006',
            agentId: 'user_003',
            customerName: 'David Lee',
            customerEmail: 'david.lee@email.com',
            customerPhone: '555-111-0005',
            date: '2024-03-18',
            time: '15:30',
            status: 'scheduled',
            notes: 'Relocating from out of state',
            inquiryId: 'inq_005',
            createdAt: '2024-02-14T00:00:00Z'
        },
        {
            id: 'apt_005',
            propertyId: 'prop_010',
            agentId: 'user_003',
            customerName: 'James Wilson',
            customerEmail: 'j.wilson@email.com',
            customerPhone: '555-111-0007',
            date: '2024-03-19',
            time: '09:30',
            status: 'scheduled',
            notes: 'Corporate relocation',
            inquiryId: 'inq_007',
            createdAt: '2024-02-15T00:00:00Z'
        }
    ],

    // Sales data
    sales: [
        {
            id: 'sale_001',
            propertyId: 'prop_009',
            agentId: 'user_002',
            buyerName: 'William Thompson',
            buyerEmail: 'w.thompson@email.com',
            buyerPhone: '555-222-0001',
            price: 420000,
            date: '2024-02-15',
            commission: 12600,
            notes: 'First-time buyer, smooth closing',
            createdAt: '2024-02-15T00:00:00Z'
        },
        {
            id: 'sale_002',
            propertyId: 'prop_012',
            agentId: 'user_003',
            buyerName: 'Amanda Clark',
            buyerEmail: 'a.clark@email.com',
            buyerPhone: '555-222-0002',
            price: 195000,
            date: '2024-03-01',
            commission: 5850,
            notes: 'Cash buyer, quick closing',
            createdAt: '2024-03-01T00:00:00Z'
        }
    ],

    // Initialize data in localStorage
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

        // Set seed data
        localStorage.setItem('realestate_properties', JSON.stringify(this.properties));
        localStorage.setItem('realestate_users', JSON.stringify(this.users));
        localStorage.setItem('realestate_inquiries', JSON.stringify(this.inquiries));
        localStorage.setItem('realestate_appointments', JSON.stringify(this.appointments));
        localStorage.setItem('realestate_sales', JSON.stringify(this.sales));
        localStorage.setItem('realestate_photos', JSON.stringify([]));

        console.log('Seed data initialized successfully!');
        console.log('Users:', this.users.length);
        console.log('Properties:', this.properties.length);
        console.log('Inquiries:', this.inquiries.length);
        console.log('Appointments:', this.appointments.length);
        console.log('Sales:', this.sales.length);

        return true;
    },

    // Check if seed data exists
    exists() {
        return !!localStorage.getItem('realestate_users');
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeedData;
}
