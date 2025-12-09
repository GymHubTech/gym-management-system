import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Badge } from '../components/common';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Filter,
  Check,
  Trash,
  Clock,
  Calendar,
  DollarSign,
  User,
  Mail,
} from 'lucide-react';
import { mockNotifications } from '../data/mockData';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    ...mockNotifications,
    {
      id: 6,
      type: 'success',
      title: 'Check-In Successful',
      message: 'John Smith checked in at 08:30 AM',
      time: '5 hours ago',
      read: true,
      category: 'checkin',
    },
    {
      id: 7,
      type: 'info',
      title: 'Appointment Reminder',
      message: 'You have 3 appointments scheduled for tomorrow',
      time: '6 hours ago',
      read: true,
      category: 'appointment',
    },
    {
      id: 8,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Protein shake inventory is running low',
      time: '1 day ago',
      read: true,
      category: 'inventory',
    },
    {
      id: 9,
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out the new progress tracking charts!',
      time: '2 days ago',
      read: true,
      category: 'system',
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-warning-100';
      case 'success':
        return 'bg-success-100';
      case 'danger':
        return 'bg-danger-100';
      default:
        return 'bg-primary-100';
    }
  };

  return (
    <Layout title="Notifications" subtitle="Stay updated with important alerts and messages">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total</p>
              <p className="text-3xl font-bold mt-1">{notifications.length}</p>
            </div>
            <Bell className="w-10 h-10 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm">Unread</p>
              <p className="text-3xl font-bold mt-1">{unreadCount}</p>
            </div>
            <Mail className="w-10 h-10 text-danger-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm">Alerts</p>
              <p className="text-3xl font-bold mt-1">
                {notifications.filter((n) => n.type === 'warning').length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-warning-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-1">
                {notifications.filter((n) => n.type === 'success').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-success-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-dark-800">
                All Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge variant="danger">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-dark-50 border border-dark-200 rounded-lg focus:border-primary-500 outline-none"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="warning">Alerts</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                    !notification.read ? 'bg-primary-50/50' : 'bg-dark-50'
                  } hover:bg-dark-100`}
                >
                  <div className={`p-2 rounded-lg ${getIconBg(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-dark-800">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-dark-500 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                      <Clock className="w-3.5 h-3.5" />
                      {notification.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-dark-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-dark-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-dark-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-600">
                No notifications
              </h3>
              <p className="text-dark-400 mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">
              Notification Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-dark-800">Appointment Reminders</p>
                    <p className="text-xs text-dark-500">
                      Get notified before appointments
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning-500" />
                  <div>
                    <p className="font-medium text-dark-800">Membership Expiry</p>
                    <p className="text-xs text-dark-500">
                      Alert when memberships are expiring
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-success-500" />
                  <div>
                    <p className="font-medium text-dark-800">Payment Alerts</p>
                    <p className="text-xs text-dark-500">
                      Notify on new payments & dues
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-accent-500" />
                  <div>
                    <p className="font-medium text-dark-800">New Registrations</p>
                    <p className="text-xs text-dark-500">
                      Alert on new member sign-ups
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-dark-800">Email Notifications</p>
                    <p className="text-xs text-dark-500">
                      Also send notifications via email
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 text-left bg-dark-50 rounded-lg hover:bg-dark-100 transition-colors">
                <Settings className="w-5 h-5 text-dark-400" />
                <span className="text-dark-700">Advanced Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-dark-50 rounded-lg hover:bg-dark-100 transition-colors">
                <Bell className="w-5 h-5 text-dark-400" />
                <span className="text-dark-700">Manage Alert Rules</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors">
                <Trash className="w-5 h-5 text-danger-500" />
                <span className="text-danger-600">Delete All Notifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
