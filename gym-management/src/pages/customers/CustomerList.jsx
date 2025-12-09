import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Avatar, Badge, Modal } from '../../components/common';
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Activity,
  UserPlus,
} from 'lucide-react';
import { mockMembers, mockTrainers } from '../../data/mockData';

const CustomerList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Filter members
  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || member.membershipStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowActionMenu(null);
  };

  return (
    <Layout title="Customer Management" subtitle="Manage all gym members and their information">
      {/* Action Bar */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:bg-white focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleViewMember(member)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={member.avatar}
                  name={member.name}
                  size="lg"
                  status={member.membershipStatus === 'active' ? 'online' : 'offline'}
                />
                <div>
                  <h3 className="font-semibold text-dark-800">{member.name}</h3>
                  <p className="text-sm text-dark-500">{member.membership}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionMenu(showActionMenu === member.id ? null : member.id);
                  }}
                  className="p-2 text-dark-400 hover:bg-dark-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showActionMenu === member.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-dark-100 py-1 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customers/bills?id=${member.id}`);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-600 hover:bg-dark-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      Bills & Payment
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customers/progress?id=${member.id}`);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-600 hover:bg-dark-50"
                    >
                      <Activity className="w-4 h-4" />
                      Progress Tracking
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customers/appointments?id=${member.id}`);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-600 hover:bg-dark-50"
                    >
                      <Calendar className="w-4 h-4" />
                      Appointments
                    </button>
                    <hr className="my-1 border-dark-100" />
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Mail className="w-4 h-4" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Phone className="w-4 h-4" />
                {member.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Calendar className="w-4 h-4" />
                Expires: {member.membershipExpiry}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-100">
              <Badge
                variant={
                  member.membershipStatus === 'active'
                    ? 'success'
                    : member.membershipStatus === 'expiring'
                    ? 'warning'
                    : 'danger'
                }
              >
                {member.membershipStatus}
              </Badge>
              {member.balance > 0 && (
                <span className="text-sm font-medium text-danger-600">
                  Due: ${member.balance}
                </span>
              )}
              {member.trainer && (
                <span className="text-xs text-dark-400">
                  Trainer: {member.trainer}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Member Detail Modal */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="Member Details"
        size="lg"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-dark-50 rounded-xl">
              <Avatar src={selectedMember.avatar} name={selectedMember.name} size="xl" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark-800">{selectedMember.name}</h3>
                <p className="text-dark-500">{selectedMember.membership}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      selectedMember.membershipStatus === 'active'
                        ? 'success'
                        : selectedMember.membershipStatus === 'expiring'
                        ? 'warning'
                        : 'danger'
                    }
                    size="lg"
                  >
                    {selectedMember.membershipStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-50 rounded-xl">
                <p className="text-sm text-dark-500 mb-1">Email</p>
                <p className="font-medium text-dark-800">{selectedMember.email}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-xl">
                <p className="text-sm text-dark-500 mb-1">Phone</p>
                <p className="font-medium text-dark-800">{selectedMember.phone}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-xl">
                <p className="text-sm text-dark-500 mb-1">Join Date</p>
                <p className="font-medium text-dark-800">{selectedMember.joinDate}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-xl">
                <p className="text-sm text-dark-500 mb-1">Expiry Date</p>
                <p className="font-medium text-dark-800">{selectedMember.membershipExpiry}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-xl">
                <p className="text-sm text-dark-500 mb-1">Assigned Trainer</p>
                <p className="font-medium text-dark-800">{selectedMember.trainer || 'None'}</p>
              </div>
              <div className="p-4 bg-dark-50 rounded-xl">
                <p className="text-sm text-dark-500 mb-1">Total Visits</p>
                <p className="font-medium text-dark-800">{selectedMember.totalVisits}</p>
              </div>
            </div>

            {selectedMember.balance > 0 && (
              <div className="p-4 bg-danger-50 rounded-xl border border-danger-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-danger-600">Outstanding Balance</p>
                    <p className="text-2xl font-bold text-danger-700">${selectedMember.balance}</p>
                  </div>
                  <button className="btn-danger">Record Payment</button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedMember(null);
                  navigate(`/customers/bills?id=${selectedMember.id}`);
                }}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Bills & Payment
              </button>
              <button
                onClick={() => {
                  setSelectedMember(null);
                  navigate(`/customers/progress?id=${selectedMember.id}`);
                }}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Progress
              </button>
              <button
                onClick={() => {
                  setSelectedMember(null);
                  navigate(`/customers/appointments?id=${selectedMember.id}`);
                }}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Appointments
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Member"
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
              <input type="text" className="input" placeholder="Smith" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="john@email.com" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" placeholder="+1 234 567 8901" />
          </div>
          <div>
            <label className="label">Membership Plan</label>
            <select className="input">
              <option>Select a plan</option>
              <option>Basic Monthly - $49.99</option>
              <option>Premium Monthly - $89.99</option>
              <option>Quarterly - $199.99</option>
              <option>Premium Annual - $799.99</option>
              <option>Personal Training Package - $299.99</option>
            </select>
          </div>
          <div>
            <label className="label">Assign Trainer (Optional)</label>
            <select className="input">
              <option>No trainer</option>
              {mockTrainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name} - {trainer.specialization}
                </option>
              ))}
            </select>
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
              Add Member
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default CustomerList;
