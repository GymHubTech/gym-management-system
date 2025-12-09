# FitPro Gym Management System

A modern, responsive gym management system UI built with React.js and Tailwind CSS.

![FitPro Gym Management](https://via.placeholder.com/800x400?text=FitPro+Gym+Management)

## Features

### Admin Panel
- **Dashboard** - Overview of gym statistics, revenue, memberships, and daily activities
- **Check-In System** - Walk-in and appointment-based member check-ins
- **Customer Management** - Complete member profiles with:
  - Bills & Payment management
  - Progress Tracking with measurements and charts
  - Appointment scheduling
- **Membership Plans** - Create and manage membership packages
- **Expense List** - Track and categorize gym expenses
- **Calendar** - Visual calendar for appointments and schedules
- **Reports** - Collection and Expense reports with charts
- **User Management** - Manage staff, trainers, and permissions
- **Notifications** - System alerts and reminders

### Trainer/Staff Panel
- **Dashboard** - Personal overview of assigned members and appointments
- **Check-In System** - Check-in assigned members
- **My Customers** - View and manage assigned members
- **Progress Tracking** - Update member measurements and notes
- **Appointments** - Manage personal training schedule
- **Calendar** - Personal appointment calendar
- **My Collection** - Track personal earnings and commission
- **Notifications** - Personal alerts and reminders

## Tech Stack

- **React.js** - Frontend framework
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Recharts** - Charts and data visualization
- **Lucide React** - Icon library
- **date-fns** - Date manipulation
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gym-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
gym-management/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── StatCard.jsx
│   │   └── layout/          # Layout components
│   │       ├── Header.jsx
│   │       ├── Layout.jsx
│   │       └── Sidebar.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── data/
│   │   └── mockData.js      # Mock data for demo
│   ├── pages/
│   │   ├── admin/           # Admin-specific pages
│   │   ├── trainer/         # Trainer-specific pages
│   │   ├── customers/       # Customer management pages
│   │   ├── reports/         # Report pages
│   │   └── ...              # Other pages
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Demo Features

### Role Switching
The demo includes a role switcher in the header that allows you to toggle between:
- **Admin View** - Full access to all features
- **Trainer View** - Limited access based on trainer permissions

### Mock Data
All data is simulated using mock data located in `src/data/mockData.js`. This includes:
- Members
- Trainers
- Membership plans
- Payments
- Appointments
- Expenses
- Progress logs

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`. The main colors are:
- `primary` - Main brand color (blue)
- `accent` - Secondary accent color (purple)
- `success` - Success states (green)
- `warning` - Warning states (orange)
- `danger` - Error/danger states (red)
- `dark` - Neutral/gray shades

### Components
Reusable components are located in `src/components/common/`:
- `StatCard` - Statistics display cards
- `DataTable` - Searchable, sortable data tables
- `Modal` - Modal dialogs
- `Badge` - Status badges
- `Avatar` - User avatars

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
