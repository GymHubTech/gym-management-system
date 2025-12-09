import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Trainer Pages
import TrainerDashboard from './pages/trainer/Dashboard';

// Shared Pages
import CheckIn from './pages/CheckIn';
import CustomerList from './pages/customers/CustomerList';
import BillsPayment from './pages/customers/BillsPayment';
import ProgressTracking from './pages/customers/ProgressTracking';
import CustomerAppointments from './pages/customers/Appointments';
import MembershipPlans from './pages/MembershipPlans';
import Expenses from './pages/Expenses';
import Calendar from './pages/Calendar';
import CollectionReport from './pages/reports/CollectionReport';
import ExpenseReport from './pages/reports/ExpenseReport';
import MyCollection from './pages/reports/MyCollection';
import UserManagement from './pages/UserManagement';
import Notifications from './pages/Notifications';

// Dashboard component that renders based on user role
const Dashboard = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <TrainerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Check-In System */}
          <Route path="/check-in" element={<CheckIn />} />

          {/* Customer Management */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/bills" element={<BillsPayment />} />
          <Route path="/customers/progress" element={<ProgressTracking />} />
          <Route path="/customers/appointments" element={<CustomerAppointments />} />

          {/* Membership Plans (Admin Only) */}
          <Route path="/membership-plans" element={<MembershipPlans />} />

          {/* Expenses (Admin Only) */}
          <Route path="/expenses" element={<Expenses />} />

          {/* Calendar */}
          <Route path="/calendar" element={<Calendar />} />

          {/* Reports */}
          <Route path="/reports/collection" element={<CollectionReport />} />
          <Route path="/reports/expense" element={<ExpenseReport />} />
          <Route path="/reports/my-collection" element={<MyCollection />} />

          {/* User Management (Admin Only) */}
          <Route path="/users" element={<UserManagement />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
