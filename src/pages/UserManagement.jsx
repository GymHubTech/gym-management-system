import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Avatar, Badge, Modal } from '../components/common';
import {
  Search,
  Plus,
  Edit,
  Trash,
  Shield,
  Key,
  Mail,
  Phone,
  MoreVertical,
  UserCog,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { mockTrainers } from '../data/mockData';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock users data
  const users = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@gym.com',
      phone: '+1 234 567 0001',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      role: 'admin',
      status: 'active',
      permissions: ['all'],
      lastLogin: '2024-12-09 08:30',
    },
    ...mockTrainers.map((trainer) => ({
      ...trainer,
      role: 'trainer',
      permissions: ['customers', 'appointments', 'progress', 'calendar'],
      lastLogin: '2024-12-09 07:00',
    })),
    {
      id: 10,
      name: 'Front Desk Staff',
      email: 'frontdesk@gym.com',
      phone: '+1 234 567 0010',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
      role: 'staff',
      status: 'active',
      permissions: ['checkin', 'customers_view'],
      lastLogin: '2024-12-08 18:00',
    },
    {
      id: 11,
      name: 'Accountant',
      email: 'accounts@gym.com',
      phone: '+1 234 567 0011',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      role: 'accountant',
      status: 'inactive',
      permissions: ['billing', 'expenses', 'reports'],
      lastLogin: '2024-12-05 14:00',
    },
  ];

  const roles = [
    { value: 'admin', label: 'Administrator', color: 'danger' },
    { value: 'trainer', label: 'Trainer', color: 'primary' },
    { value: 'staff', label: 'Staff', color: 'success' },
    { value: 'accountant', label: 'Accountant', color: 'warning' },
  ];

  const permissionsList = [
    { key: 'all', label: 'Full Access' },
    { key: 'customers', label: 'Customer Management' },
    { key: 'customers_view', label: 'View Customers Only' },
    { key: 'billing', label: 'Bills & Payments' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'progress', label: 'Progress Tracking' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'reports', label: 'Reports' },
    { key: 'checkin', label: 'Check-In System' },
  ];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const roleInfo = roles.find((r) => r.value === role);
    return (
      <Badge variant={roleInfo?.color || 'default'}>
        {roleInfo?.label || role}
      </Badge>
    );
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  return (
    <Layout title="User Management" subtitle="Manage users and their access permissions">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold mt-1">{users.length}</p>
            </div>
            <Users className="w-10 h-10 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm">Active</p>
              <p className="text-3xl font-bold mt-1">
                {users.filter((u) => u.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-success-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm">Trainers</p>
              <p className="text-3xl font-bold mt-1">
                {users.filter((u) => u.role === 'trainer').length}
              </p>
            </div>
            <UserCog className="w-10 h-10 text-warning-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm">Admins</p>
              <p className="text-3xl font-bold mt-1">
                {users.filter((u) => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="w-10 h-10 text-danger-200" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:bg-white focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50">
                <th className="table-header">User</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
                <th className="table-header">Last Login</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-dark-50">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="md" />
                      <div>
                        <p className="font-medium text-dark-800">{user.name}</p>
                        <p className="text-xs text-dark-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm">
                        <Mail className="w-3.5 h-3.5 text-dark-400" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="w-3.5 h-3.5 text-dark-400" />
                        {user.phone}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">{getRoleBadge(user.role)}</td>
                  <td className="table-cell">
                    <Badge
                      variant={user.status === 'active' ? 'success' : 'default'}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="table-cell text-sm text-dark-500">
                    {user.lastLogin}
                  </td>
                  <td className="table-cell">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionMenu(
                            showActionMenu === user.id ? null : user.id
                          )
                        }
                        className="p-2 text-dark-400 hover:bg-dark-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {showActionMenu === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-dark-100 py-1 z-10">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-600 hover:bg-dark-50"
                          >
                            <Edit className="w-4 h-4" />
                            Edit User
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-600 hover:bg-dark-50">
                            <Key className="w-4 h-4" />
                            Reset Password
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-600 hover:bg-dark-50">
                            <Shield className="w-4 h-4" />
                            Permissions
                          </button>
                          <hr className="my-1 border-dark-100" />
                          {user.status === 'active' ? (
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warning-600 hover:bg-warning-50">
                              <XCircle className="w-4 h-4" />
                              Deactivate
                            </button>
                          ) : (
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-success-600 hover:bg-success-50">
                              <CheckCircle className="w-4 h-4" />
                              Activate
                            </button>
                          )}
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50">
                            <Trash className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input type="text" className="input" placeholder="John" />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input type="text" className="input" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="john@gym.com" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input">
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Permissions</label>
            <div className="grid grid-cols-2 gap-2 p-4 bg-dark-50 rounded-lg">
              {permissionsList.map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-dark-600">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Temporary Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
            />
            <p className="text-xs text-dark-400 mt-1">
              User will be required to change password on first login
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <form className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-dark-50 rounded-xl">
              <Avatar src={selectedUser.avatar} name={selectedUser.name} size="xl" />
              <div>
                <h3 className="font-semibold text-dark-800">{selectedUser.name}</h3>
                <p className="text-sm text-dark-500">{selectedUser.email}</p>
                {getRoleBadge(selectedUser.role)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  className="input"
                  defaultValue={selectedUser.name.split(' ')[0]}
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  className="input"
                  defaultValue={selectedUser.name.split(' ')[1] || ''}
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                defaultValue={selectedUser.email}
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                className="input"
                defaultValue={selectedUser.phone}
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" defaultValue={selectedUser.role}>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" defaultValue={selectedUser.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="label">Permissions</label>
              <div className="grid grid-cols-2 gap-2 p-4 bg-dark-50 rounded-lg">
                {permissionsList.map((perm) => (
                  <label
                    key={perm.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      defaultChecked={
                        selectedUser.permissions?.includes(perm.key) ||
                        selectedUser.permissions?.includes('all')
                      }
                    />
                    <span className="text-sm text-dark-600">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
};

export default UserManagement;
