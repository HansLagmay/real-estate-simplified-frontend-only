/**
 * Sample Data
 * Optional sample data for testing (15 properties, 10 inquiries)
 */

const SampleData = {
    // 15 Sample Properties
    properties: [
        {
            id: 'prop_001',
            title: '3BR House Makati',
            type: 'house',
            status: 'available',
            price: 8500000,
            bedrooms: 3,
            bathrooms: 2,
            area: 150,
            address: '123 Ayala Avenue',
            city: 'Makati',
            state: 'Metro Manila',
            zipCode: '1226',
            description: 'Beautiful 3-bedroom house in the heart of Makati. Modern design with excellent amenities.',
            features: ['Parking', 'Garden', 'Security', 'Near Schools'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_002',
            title: 'Modern Condo BGC',
            type: 'condo',
            status: 'available',
            price: 12000000,
            bedrooms: 2,
            bathrooms: 2,
            area: 80,
            address: '456 High Street',
            city: 'Taguig',
            state: 'Metro Manila',
            zipCode: '1634',
            description: 'Premium 2-bedroom condo in BGC with stunning city views. Fully furnished.',
            features: ['Pool', 'Gym', 'Concierge', 'Smart Home'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_003',
            title: 'Luxury Villa Alabang',
            type: 'house',
            status: 'available',
            price: 35000000,
            bedrooms: 5,
            bathrooms: 4,
            area: 400,
            address: '789 Alabang Hills',
            city: 'Muntinlupa',
            state: 'Metro Manila',
            zipCode: '1780',
            description: 'Magnificent 5-bedroom villa with pool and landscaped gardens.',
            features: ['Pool', 'Garden', 'Maid Room', 'Home Theater', 'Wine Cellar'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_004',
            title: 'Studio Unit Ortigas',
            type: 'studio',
            status: 'available',
            price: 3500000,
            bedrooms: 0,
            bathrooms: 1,
            area: 30,
            address: '321 Exchange Road',
            city: 'Pasig',
            state: 'Metro Manila',
            zipCode: '1605',
            description: 'Cozy studio unit perfect for young professionals. Near business district.',
            features: ['Gym', 'Near MRT', 'Laundry', 'Security'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_005',
            title: 'Beach House Batangas',
            type: 'house',
            status: 'available',
            price: 15000000,
            bedrooms: 4,
            bathrooms: 3,
            area: 250,
            address: '100 Seaside Boulevard',
            city: 'Batangas City',
            state: 'Batangas',
            zipCode: '4200',
            description: 'Stunning beachfront property with private access. Perfect vacation home.',
            features: ['Beach Access', 'Deck', 'BBQ Area', 'Parking'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_006',
            title: '2BR Condo Eastwood',
            type: 'condo',
            status: 'available',
            price: 6500000,
            bedrooms: 2,
            bathrooms: 1,
            area: 65,
            address: '555 Eastwood Ave',
            city: 'Quezon City',
            state: 'Metro Manila',
            zipCode: '1110',
            description: 'Modern 2-bedroom condo in Eastwood City. Walking distance to malls and restaurants.',
            features: ['Pool', 'Gym', 'Near Mall', 'Pet Friendly'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_007',
            title: 'Penthouse Rockwell',
            type: 'penthouse',
            status: 'available',
            price: 85000000,
            bedrooms: 4,
            bathrooms: 4,
            area: 350,
            address: '1 Power Plant Mall',
            city: 'Makati',
            state: 'Metro Manila',
            zipCode: '1210',
            description: 'Ultra-luxury penthouse with panoramic views. Private elevator and rooftop terrace.',
            features: ['Private Elevator', 'Rooftop', 'Wine Room', 'Smart Home', 'Concierge'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_008',
            title: 'Townhouse Quezon City',
            type: 'townhouse',
            status: 'available',
            price: 9500000,
            bedrooms: 3,
            bathrooms: 2,
            area: 120,
            address: '88 Congressional Avenue',
            city: 'Quezon City',
            state: 'Metro Manila',
            zipCode: '1126',
            description: 'Spacious 3-bedroom townhouse with parking for 2 cars. Great for families.',
            features: ['Parking', 'Garden', 'Near Schools', 'Quiet Neighborhood'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_009',
            title: 'Farm House Tagaytay',
            type: 'house',
            status: 'available',
            price: 22000000,
            bedrooms: 3,
            bathrooms: 2,
            area: 500,
            address: '777 Ridge Road',
            city: 'Tagaytay',
            state: 'Cavite',
            zipCode: '4120',
            description: 'Charming farm house with breathtaking Taal Lake views. Perfect weekend getaway.',
            features: ['Lake View', 'Garden', 'Fireplace', 'Cool Climate'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_010',
            title: '1BR Condo Bonifacio Global',
            type: 'condo',
            status: 'available',
            price: 7800000,
            bedrooms: 1,
            bathrooms: 1,
            area: 45,
            address: '30th Street Corner 9th',
            city: 'Taguig',
            state: 'Metro Manila',
            zipCode: '1634',
            description: 'Prime 1-bedroom unit in BGC. Ideal for investment or personal use.',
            features: ['Pool', 'Gym', 'Near Offices', 'Furnished'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_011',
            title: 'Executive House Forbes Park',
            type: 'house',
            status: 'available',
            price: 150000000,
            bedrooms: 6,
            bathrooms: 5,
            area: 800,
            address: '1 Forbes Park',
            city: 'Makati',
            state: 'Metro Manila',
            zipCode: '1219',
            description: 'Prestigious executive home in Forbes Park. The epitome of luxury living.',
            features: ['Pool', 'Guest House', 'Staff Quarters', 'Garden', 'Security'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_012',
            title: 'Loft Type Condo Mandaluyong',
            type: 'loft',
            status: 'available',
            price: 8200000,
            bedrooms: 1,
            bathrooms: 2,
            area: 75,
            address: '999 EDSA Greenfields',
            city: 'Mandaluyong',
            state: 'Metro Manila',
            zipCode: '1550',
            description: 'Unique loft-type condo with high ceilings. Modern industrial design.',
            features: ['High Ceiling', 'Industrial Design', 'Near MRT', 'Gym'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_013',
            title: 'Resort Style House Antipolo',
            type: 'house',
            status: 'available',
            price: 18000000,
            bedrooms: 4,
            bathrooms: 3,
            area: 300,
            address: '50 Hilltop Road',
            city: 'Antipolo',
            state: 'Rizal',
            zipCode: '1870',
            description: 'Resort-inspired home with infinity pool overlooking the city.',
            features: ['Infinity Pool', 'City View', 'Garden', 'Outdoor Kitchen'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_014',
            title: 'Commercial Space Makati CBD',
            type: 'commercial',
            status: 'available',
            price: 45000000,
            bedrooms: 0,
            bathrooms: 2,
            area: 200,
            address: '123 Gil Puyat Avenue',
            city: 'Makati',
            state: 'Metro Manila',
            zipCode: '1227',
            description: 'Prime commercial space in Makati CBD. Ideal for office or retail.',
            features: ['Corner Lot', 'High Foot Traffic', 'Parking', 'Security'],
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: 'prop_015',
            title: 'Starter Home Cavite',
            type: 'house',
            status: 'available',
            price: 2800000,
            bedrooms: 2,
            bathrooms: 1,
            area: 60,
            address: '500 Molino Boulevard',
            city: 'Bacoor',
            state: 'Cavite',
            zipCode: '4102',
            description: 'Affordable starter home perfect for young families. Near main roads.',
            features: ['Parking', 'Near Market', 'Quiet Area', 'Community'],
            images: [],
            createdAt: new Date().toISOString()
        }
    ],

    // 10 Sample Inquiries
    inquiries: [
        {
            id: 'inq_001',
            propertyId: 'prop_001',
            customerName: 'Juan Cruz',
            customerEmail: 'juan.cruz@email.com',
            customerPhone: '0917-123-4567',
            message: 'I am very interested in this property. Can I schedule a viewing this week?',
            status: 'pending',
            assignedTo: null,
            priority: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_002',
            propertyId: 'prop_002',
            customerName: 'Maria Santos',
            customerEmail: 'maria.santos@email.com',
            customerPhone: '0918-234-5678',
            message: 'Looking for a condo in BGC. Is this unit available for immediate occupancy?',
            status: 'pending',
            assignedTo: null,
            priority: 2,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_003',
            propertyId: 'prop_003',
            customerName: 'Roberto Reyes',
            customerEmail: 'roberto.r@email.com',
            customerPhone: '0919-345-6789',
            message: 'Interested in the villa. What are the terms for payment?',
            status: 'pending',
            assignedTo: null,
            priority: 3,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_004',
            propertyId: 'prop_005',
            customerName: 'Ana Garcia',
            customerEmail: 'ana.garcia@email.com',
            customerPhone: '0920-456-7890',
            message: 'Looking for a beach property. Is this near public beaches?',
            status: 'pending',
            assignedTo: null,
            priority: 4,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_005',
            propertyId: 'prop_006',
            customerName: 'Pedro Lim',
            customerEmail: 'pedro.lim@email.com',
            customerPhone: '0921-567-8901',
            message: 'Relocating to Manila for work. Is this available for rent-to-own?',
            status: 'pending',
            assignedTo: null,
            priority: 5,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_006',
            propertyId: 'prop_007',
            customerName: 'Carmen Dela Cruz',
            customerEmail: 'carmen.dc@email.com',
            customerPhone: '0922-678-9012',
            message: 'Looking for a premium property. Is the price negotiable?',
            status: 'pending',
            assignedTo: null,
            priority: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_007',
            propertyId: 'prop_008',
            customerName: 'Jose Mendoza',
            customerEmail: 'jose.m@email.com',
            customerPhone: '0923-789-0123',
            message: 'Looking for a family home. Is there a school nearby?',
            status: 'pending',
            assignedTo: null,
            priority: 7,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_008',
            propertyId: 'prop_009',
            customerName: 'Rosa Tan',
            customerEmail: 'rosa.tan@email.com',
            customerPhone: '0924-890-1234',
            message: 'Interested in a vacation home in Tagaytay. How far from town center?',
            status: 'pending',
            assignedTo: null,
            priority: 8,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_009',
            propertyId: 'prop_010',
            customerName: 'Miguel Aquino',
            customerEmail: 'miguel.a@email.com',
            customerPhone: '0925-901-2345',
            message: 'Looking for investment property. What is the rental yield?',
            status: 'pending',
            assignedTo: null,
            priority: 9,
            createdAt: new Date().toISOString()
        },
        {
            id: 'inq_010',
            propertyId: 'prop_015',
            customerName: 'Elena Villanueva',
            customerEmail: 'elena.v@email.com',
            customerPhone: '0926-012-3456',
            message: 'First-time homebuyer. Do you offer financing assistance?',
            status: 'pending',
            assignedTo: null,
            priority: 10,
            createdAt: new Date().toISOString()
        }
    ],

    // Load sample data into localStorage
    load() {
        if (!confirm('📦 Load sample data (15 properties, 10 inquiries)? Current data will be kept.')) {
            return false;
        }

        // Get existing data
        const existingProperties = JSON.parse(localStorage.getItem('realestate_properties') || '[]');
        const existingInquiries = JSON.parse(localStorage.getItem('realestate_inquiries') || '[]');

        // Merge with sample data (avoid duplicates by checking IDs)
        const existingPropertyIds = new Set(existingProperties.map(p => p.id));
        const existingInquiryIds = new Set(existingInquiries.map(i => i.id));

        const newProperties = this.properties.filter(p => !existingPropertyIds.has(p.id));
        const newInquiries = this.inquiries.filter(i => !existingInquiryIds.has(i.id));

        // Save merged data
        localStorage.setItem('realestate_properties', JSON.stringify([...existingProperties, ...newProperties]));
        localStorage.setItem('realestate_inquiries', JSON.stringify([...existingInquiries, ...newInquiries]));

        console.log('✅ Sample data loaded successfully!');
        console.log(`Added ${newProperties.length} new properties`);
        console.log(`Added ${newInquiries.length} new inquiries`);

        return true;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SampleData;
}
