# Real Estate Simplified - Frontend-Only Platform

A complete real estate management platform with three portals (Customer, Admin, Agent) built entirely with HTML, CSS, and JavaScript using localStorage for data persistence.

## 📋 Overview

### Purpose
This is a **frontend-only demonstration** of a real estate management system. It showcases how a complete real estate platform works without requiring a backend server. All data is stored in the browser's localStorage.

### What Works
- ✅ Property browsing and searching
- ✅ Property detail pages with image galleries
- ✅ Customer inquiry submission
- ✅ Admin dashboard with statistics
- ✅ Inquiry assignment to agents
- ✅ Shared calendar across all agents
- ✅ Appointment scheduling with conflict detection
- ✅ Property CRUD operations
- ✅ Photo upload (base64 in localStorage)
- ✅ Mark properties as sold
- ✅ Sales reports with CSV export
- ✅ Agent management
- ✅ Priority system for inquiries

### Limitations
This is a frontend-only demo - see [Limitations](#-limitations) section for details on what differs from a full-stack implementation.

---

## 🚀 Quick Start

### Option 1: Direct File Opening
1. Clone or download this repository
2. Open `index.html` in your browser
3. You'll be redirected to the Customer Portal

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```
Then open `http://localhost:8080` in your browser.

### Reset Data
To reset all data to seed values, open the browser console (F12) and run:
```javascript
SeedData.init(true);
location.reload();
```

---

## 🔐 Login Credentials

### Admin Portal
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |

### Agent Portal
| Agent | Email | Password |
|-------|-------|----------|
| Sarah Johnson | agent1@company.com | agent123 |
| Michael Chen | agent2@company.com | agent123 |
| Emily Davis | agent3@company.com | agent123 |

---

## 📱 Portal URLs

| Portal | Path | Description |
|--------|------|-------------|
| Customer | `/customer/index.html` | Browse properties, submit inquiries |
| Admin | `/admin/index.html` | Manage everything |
| Agent | `/agent/index.html` | View assigned work, schedule viewings |

---

## 👤 User Flows

### Customer Flow

#### 1. Browse Properties
1. Open the Customer Portal (`/customer/index.html`)
2. Click "Properties" in the navigation
3. Use filters (type, price, bedrooms, status) to narrow down results
4. Click any property card to view details

#### 2. View Property Details
1. Click on a property card
2. View the image gallery (click thumbnails to switch images)
3. Review specifications (bedrooms, bathrooms, area)
4. Read property description and features

#### 3. Submit an Inquiry
1. On a property detail page, click "Send Inquiry"
2. Fill in your name, email, phone, and message
3. Click "Send Inquiry"
4. See success confirmation
5. Your inquiry is saved and visible in Admin Portal

### Admin Flow

#### 1. Login
1. Navigate to `/admin/index.html`
2. Enter: `admin@company.com` / `admin123`
3. Click "Login"

#### 2. View Dashboard
- See total properties, sold count, pending inquiries, upcoming viewings
- View recent inquiries and upcoming appointments

#### 3. Manage Inquiries
1. Click "Inquiries" in the sidebar
2. View all inquiries with priority levels
3. Click "Assign" to assign to an agent
4. Select an agent from the dropdown

#### 4. View Shared Calendar
1. Click "Calendar" in the sidebar
2. See all appointments from all agents
3. Filter by agent using the dropdown
4. Navigate months with Prev/Next buttons

#### 5. Manage Properties
1. Click "Properties" in the sidebar
2. Click "+ Add Property" to create new
3. Fill in all details and upload photos
4. Click "Save Property"
5. Use "Edit" to modify, "Mark Sold" to record a sale, "Delete" to remove

#### 6. Upload Property Photos
1. Edit an existing property or create new
2. Click the file input under "Photos"
3. Select one or more images
4. Preview appears below the input
5. Click "Save Property" to store images (as base64)

#### 7. Mark Property as Sold
1. On Properties page, click "Mark Sold"
2. Enter buyer details (name, email, phone)
3. Confirm sale price
4. Select the agent who made the sale
5. Enter sale date
6. Click "Confirm Sale"

#### 8. View Sales Reports
1. Click "Reports" in the sidebar
2. View total sales, properties sold, average price, commission
3. See sales history table
4. Click "Export CSV" to download report

#### 9. Manage Agents
1. Click "Agents" in the sidebar
2. View agent cards with statistics
3. Click "+ Add Agent" to create new
4. Fill in details and click "Save Agent"
5. Use "Edit" to modify, "Delete" to remove

### Agent Flow

#### 1. Login
1. Navigate to `/agent/index.html`
2. Enter: `agent1@company.com` / `agent123`
3. Click "Login"

#### 2. View Dashboard
- See your assigned inquiries, upcoming viewings, completed viewings, sales
- View recent inquiries and today's schedule

#### 3. View Assigned Inquiries
1. Click "My Inquiries" in the sidebar
2. See all inquiries assigned to you
3. View customer contact information
4. Click "View" to see full details
5. Click "Schedule" to create a viewing appointment

#### 4. Schedule a Viewing
1. On inquiry row, click "Schedule"
2. Select date (must be today or future)
3. Select time slot
4. Add optional notes
5. Click "Schedule Viewing"
6. If conflict detected, error message appears

#### 5. View Shared Calendar
1. Click "Shared Calendar" in the sidebar
2. See ALL agents' appointments (not just yours)
3. Your appointments have a colored border
4. Other agents' appointments are slightly transparent
5. Click any appointment to view details

#### 6. Mark Viewing Complete
1. Click on your scheduled appointment in calendar
2. View appointment details
3. Click "Mark Completed"
4. Appointment status updates

#### 7. View My Sales
1. Click "My Sales" in the sidebar
2. View total sales value, properties sold, commission
3. See detailed sales history table

---

## ⚙️ How It Works

### Data Storage (localStorage)

All data is stored in the browser's localStorage using these keys:

```javascript
realestate_properties    // Array of property objects
realestate_appointments  // Array of appointment objects
realestate_users         // Array of user objects (admin + agents)
realestate_inquiries     // Array of inquiry objects
realestate_sales         // Array of sale records
realestate_photos        // Array of photo objects (base64)
realestate_current_user  // Currently logged in user
```

### Conflict Detection Logic

When scheduling an appointment, the system checks:

```javascript
// Conflict exists if:
// 1. Same property ID
// 2. Same date
// 3. Same time
// 4. Status is not 'cancelled'

function hasAppointmentConflict(propertyId, date, time, excludeId) {
    return appointments.some(a => 
        a.propertyId === propertyId &&
        a.date === date &&
        a.time === time &&
        a.id !== excludeId &&
        a.status !== 'cancelled'
    );
}
```

This prevents double-booking the same property at the same time, even across different agents.

### Priority System

Inquiries are automatically assigned priorities based on creation order:

```javascript
// New inquiry gets priority = pending count + 1
function calculatePriority(inquiries) {
    const pending = inquiries.filter(i => 
        i.status === 'pending' || i.status === 'assigned'
    );
    return pending.length + 1;
}

// When inquiry is cancelled/completed, recalculate all
function recalculatePriorities() {
    const pending = inquiries
        .filter(i => i.status === 'pending' || i.status === 'assigned')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    pending.forEach((inq, index) => {
        inq.priority = index + 1;
    });
}
```

### Photo Upload Process

Photos are converted to base64 and stored in localStorage:

```javascript
// 1. User selects file
// 2. FileReader converts to base64
async function readFileAsBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// 3. Base64 string stored in photos array
{
    id: "photo_123",
    propertyId: "prop_001",
    data: "data:image/jpeg;base64,/9j/4AAQ...",
    name: "house-front.jpg"
}
```

### CSV Export

Client-side CSV generation:

```javascript
function generateCSV(data, columns) {
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(item => 
        columns.map(c => item[c.key] || '').join(',')
    );
    return [headers, ...rows].join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
```

---

## 🧪 Testing Scenarios

### Test 1: Complete Inquiry Flow

```
1. Open Customer Portal
2. Browse to any available property
3. Click "Send Inquiry"
4. Fill form with test data:
   - Name: John Test
   - Email: john@test.com
   - Phone: 555-123-4567
   - Message: I'm interested in this property
5. Submit inquiry
6. Open Admin Portal (login as admin)
7. Go to Inquiries
8. Verify new inquiry appears with priority number
9. Click "Assign" and select an agent
10. Open Agent Portal (login as that agent)
11. Go to My Inquiries
12. Verify the assigned inquiry appears
```

### Test 2: Calendar Conflict Detection

```
1. Login to Agent Portal as agent1@company.com
2. Go to My Inquiries
3. Click "Schedule" on any inquiry
4. Select tomorrow's date, 10:00 AM
5. Click "Schedule Viewing" - should succeed
6. Open new browser tab/window
7. Login to Agent Portal as agent2@company.com
8. Go to My Inquiries
9. Click "Schedule" on an inquiry for SAME property
10. Select same date (tomorrow), 10:00 AM
11. Click "Schedule Viewing"
12. Should see error: "Time conflict!"
13. Select different time (11:00 AM)
14. Should now succeed
```

### Test 3: Priority System

```
1. Open Customer Portal
2. Submit 3 inquiries to different properties:
   - First inquiry
   - Second inquiry
   - Third inquiry
3. Open Admin Portal
4. Go to Inquiries
5. Verify priorities are 1, 2, 3 in order
6. Assign middle inquiry (priority 2) to an agent
7. Login to Agent Portal
8. Schedule and complete the viewing
9. Mark inquiry as completed
10. Check Admin Portal - priorities should recalculate
```

### Test 4: Photo Upload and Gallery

```
1. Login to Admin Portal
2. Go to Properties
3. Click "+ Add Property"
4. Fill in basic details
5. Click file input under Photos
6. Select 3 images from your computer
7. Verify previews appear
8. Click "Save Property"
9. Open Customer Portal
10. Navigate to the new property
11. Verify main image displays
12. Click thumbnails to switch images
13. Verify all 3 images are accessible
```

### Test 5: Sales Report Export

```
1. Login to Admin Portal
2. Go to Properties
3. Find an available property
4. Click "Mark Sold"
5. Fill in buyer details:
   - Buyer: Test Buyer
   - Email: buyer@test.com
   - Phone: 555-999-8888
   - Price: 500000
   - Agent: Sarah Johnson
   - Date: Today
6. Click "Confirm Sale"
7. Go to Reports
8. Verify sale appears in table
9. Click "Export CSV"
10. Open downloaded file
11. Verify all data is present
```

---

## 📊 Limitations

### Frontend-Only vs Full-Stack Comparison

| Feature | Frontend-Only | Full-Stack |
|---------|---------------|------------|
| Data Storage | localStorage (browser) | Database (PostgreSQL, MySQL) |
| Multi-user Sync | ❌ No real-time sync | ✅ Real-time updates |
| Authentication | Mock (stored in localStorage) | ✅ Secure JWT/Sessions |
| Email Notifications | ❌ Not possible | ✅ SMTP integration |
| SMS Alerts | ❌ Not possible | ✅ Twilio/similar |
| Data Persistence | Browser-only | ✅ Server database |
| Photo Storage | Base64 in localStorage | ✅ Cloud storage (S3) |
| Storage Limit | ~5-10MB | ✅ Unlimited |
| Security | ❌ Client-side only | ✅ Server validation |
| Search Performance | Client-side filtering | ✅ Database indexes |
| User Sessions | Single browser | ✅ Any device |
| Password Reset | ❌ Not possible | ✅ Email flow |
| Audit Logs | ❌ No server logs | ✅ Complete audit trail |
| API Access | ❌ None | ✅ REST/GraphQL |
| Concurrent Users | ❌ Single browser | ✅ Unlimited |

### Known Limitations

1. **Data Loss**: Clearing browser data deletes all information
2. **No Cross-Device Sync**: Data only exists in the browser where it was created
3. **Photo Size**: Large photos may hit localStorage limits (~5MB)
4. **Security**: All data is accessible via browser dev tools
5. **No Notifications**: Cannot send emails or SMS
6. **Single User**: Changes don't sync between browsers/tabs

---

## 📁 File Structure

```
/
├── index.html                 # Redirects to customer portal
├── README.md                  # This documentation
│
├── /customer                  # Customer Portal
│   ├── index.html            # Home page
│   ├── properties.html       # Property listings
│   ├── property-detail.html  # Single property view
│   ├── /css
│   │   └── customer.css      # Customer-specific styles
│   └── /js
│       ├── customer.js       # Home page logic
│       ├── properties.js     # Listings logic
│       └── property-detail.js # Detail page logic
│
├── /admin                     # Admin Portal
│   ├── index.html            # Single-page app
│   ├── /css
│   │   └── admin.css         # Admin-specific styles
│   └── /js
│       └── admin.js          # All admin logic
│
├── /agent                     # Agent Portal
│   ├── index.html            # Single-page app
│   ├── /css
│   │   └── agent.css         # Agent-specific styles
│   └── /js
│       └── agent.js          # All agent logic
│
├── /shared                    # Shared modules
│   ├── storage.js            # localStorage CRUD operations
│   ├── auth.js               # Authentication helpers
│   └── utils.js              # Utility functions
│
├── /data                      # Seed data
│   └── seed.js               # Initial data (15 properties, 4 users, etc.)
│
├── /assets                    # Static assets
│   ├── /css
│   │   └── shared.css        # Common styles
│   ├── /js                   # (empty - shared JS in /shared)
│   └── /images               # (empty - photos stored as base64)
│
└── /screenshots               # Documentation screenshots
```

---

## 🔧 Troubleshooting

### Issue: "Data not loading"

**Cause**: Seed data not initialized
**Solution**: Open console (F12) and run:
```javascript
SeedData.init(true);
location.reload();
```

### Issue: "Cannot login"

**Cause**: Users not in localStorage
**Solution**: Reset data with `SeedData.init(true)` or check credentials above

### Issue: "Photos not uploading"

**Cause**: localStorage quota exceeded
**Solution**: 
1. Delete some existing photos
2. Use smaller images (<500KB each)
3. Clear browser data and reinitialize

### Issue: "Calendar empty"

**Cause**: No appointments scheduled
**Solution**: Assign an inquiry to an agent, then schedule a viewing

### Issue: "Changes not saving"

**Cause**: localStorage disabled or full
**Solution**: 
1. Check if private/incognito mode
2. Enable localStorage in browser settings
3. Clear browser storage

### Issue: "Page not found"

**Cause**: Direct file access vs server
**Solution**: 
1. Use a local web server
2. Or ensure paths are correct when opening files directly

---

## 🛠️ Development

### Modifying Seed Data

Edit `/data/seed.js` to change:
- `users` - Admin and agent accounts
- `properties` - Property listings
- `inquiries` - Pre-populated inquiries
- `appointments` - Scheduled viewings
- `sales` - Sale records

### Adding New Features

1. Add UI in the appropriate HTML file
2. Add styles in the portal's CSS file
3. Add logic in the portal's JS file
4. Update `Storage` module if new data types needed

### Storage Module API

```javascript
// Properties
Storage.getProperties()
Storage.addProperty(data)
Storage.updateProperty(id, data)
Storage.deleteProperty(id)

// Users
Storage.getUsers()
Storage.getAgents()
Storage.getUserById(id)
Storage.addUser(data)
Storage.updateUser(id, data)

// Inquiries
Storage.getInquiries()
Storage.addInquiry(data)
Storage.updateInquiry(id, data)
Storage.getInquiriesByAgent(agentId)

// Appointments
Storage.getAppointments()
Storage.addAppointment(data)  // Returns error if conflict
Storage.updateAppointment(id, data)
Storage.hasAppointmentConflict(propertyId, date, time)

// Sales
Storage.getSales()
Storage.addSale(data)
Storage.getSalesByAgent(agentId)

// Photos
Storage.getPhotosByProperty(propertyId)
Storage.addPhoto(data)
Storage.deletePhoto(id)
```

---

## 📜 License

This project is for demonstration purposes. Feel free to use and modify for learning.

---

## 🙏 Credits

Built as a demonstration of frontend-only application architecture for real estate management systems.
