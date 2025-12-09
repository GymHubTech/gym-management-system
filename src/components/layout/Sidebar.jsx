import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  CreditCard,
  Activity,
  CalendarDays,
  Receipt,
  FileBarChart,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  Dumbbell,
  LogOut,
  UserCog,
  Wallet,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['customers', 'reports']);

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  const adminMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/check-in', icon: UserCheck, label: 'Check-In System' },
    {
      label: 'Customers',
      icon: Users,
      key: 'customers',
      children: [
        { path: '/customers', label: 'Customer List' },
        { path: '/customers/bills', label: 'Bills & Payment' },
        { path: '/customers/progress', label: 'Progress Tracking' },
        { path: '/customers/appointments', label: 'Appointments' },
      ],
    },
    { path: '/membership-plans', icon: CreditCard, label: 'Membership Plans' },
    { path: '/expenses', icon: Receipt, label: 'Expense List' },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    {
      label: 'Reports',
      icon: FileBarChart,
      key: 'reports',
      children: [
        { path: '/reports/collection', label: 'Collection Report' },
        { path: '/reports/expense', label: 'Expense Report' },
      ],
    },
    { path: '/users', icon: UserCog, label: 'User Management' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const trainerMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/check-in', icon: UserCheck, label: 'Check-In System' },
    {
      label: 'My Customers',
      icon: Users,
      key: 'customers',
      children: [
        { path: '/customers', label: 'Customer List' },
        { path: '/customers/progress', label: 'Progress Tracking' },
        { path: '/customers/appointments', label: 'Appointments' },
      ],
    },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { path: '/reports/my-collection', icon: Wallet, label: 'My Collection' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const menuItems = isAdmin ? adminMenuItems : trainerMenuItems;

  const isMenuActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-dark-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-100">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-dark-800">FitPro Gym</h1>
          <p className="text-xs text-dark-400">{isAdmin ? 'Admin Panel' : 'Trainer Panel'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`sidebar-item w-full justify-between ${
                      isMenuActive(item) ? 'text-primary-600 bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {expandedMenus.includes(item.key) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenus.includes(item.key) && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-dark-200 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `sidebar-item text-sm ${isActive ? 'active' : ''}`
                            }
                          >
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-dark-100 p-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark-800 truncate">{user.name}</p>
            <p className="text-xs text-dark-400 capitalize">{user.role}</p>
          </div>
          <button className="p-2 text-dark-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
