import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Avatar, Badge, Modal } from '../../components/common';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { mockMembers, mockAppointments, mockTrainers, appointmentTypes } from '../../data/mockData';

const CustomerAppointments = () => {
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState(
    memberId ? mockMembers.find((m) => m.id === parseInt(memberId)) : null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter appointments
  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch = apt.member.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesMember = selectedMember ? apt.memberId === selectedMember.id : true;
    return matchesSearch && matchesStatus && matchesMember;
  });

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) {
      acc[apt.date] = [];
    }
    acc[apt.date].push(apt);
    return acc;
  }, {});

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-danger-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout
      title="Appointments"
      subtitle={
        selectedMember
          ? `Appointments for ${selectedMember.name}`
          : 'View and manage customer appointments'
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Appointments</p>
              <p className="text-3xl font-bold mt-1">
                {selectedMember
                  ? filteredAppointments.length
                  : mockAppointments.length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm">Confirmed</p>
              <p className="text-3xl font-bold mt-1">
                {filteredAppointments.filter((a) => a.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-success-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm">Pending</p>
              <p className="text-3xl font-bold mt-1">
                {filteredAppointments.filter((a) => a.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-warning-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Today</p>
              <p className="text-3xl font-bold mt-1">
                {filteredAppointments.filter((a) => a.date === '2024-12-09').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-accent-200" />
          </div>
        </div>
      </div>

      {/* Selected Member Info */}
      {selectedMember && (
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={selectedMember.avatar} name={selectedMember.name} size="lg" />
              <div>
                <h3 className="font-semibold text-dark-800">{selectedMember.name}</h3>
                <p className="text-sm text-dark-500">{selectedMember.membership}</p>
                <p className="text-xs text-dark-400">
                  Trainer: {selectedMember.trainer || 'None assigned'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="btn-secondary"
              >
                View All
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search appointments..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {!selectedMember && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {Object.keys(groupedAppointments)
          .sort()
          .map((date) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-800">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <p className="text-sm text-dark-500">
                    {groupedAppointments[date].length} appointments
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {groupedAppointments[date].map((apt) => {
                  const member = mockMembers.find((m) => m.id === apt.memberId);
                  const trainer = mockTrainers.find((t) => t.id === apt.trainerId);
                  
                  return (
                    <div
                      key={apt.id}
                      className="card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center px-4 py-2 bg-primary-50 rounded-lg min-w-[80px]">
                            <p className="text-lg font-bold text-primary-600">
                              {apt.time}
                            </p>
                            <p className="text-xs text-primary-500">
                              {apt.duration} min
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={member?.avatar}
                              name={apt.member}
                              size="md"
                            />
                            <div>
                              <p className="font-semibold text-dark-800">
                                {apt.member}
                              </p>
                              <p className="text-sm text-dark-500">{apt.type}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-dark-500">Trainer</p>
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={trainer?.avatar}
                                name={apt.trainer}
                                size="sm"
                              />
                              <span className="font-medium text-dark-700">
                                {apt.trainer}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusIcon(apt.status)}
                            <Badge
                              variant={
                                apt.status === 'confirmed'
                                  ? 'success'
                                  : apt.status === 'pending'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {apt.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            {apt.status === 'pending' && (
                              <>
                                <button className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors">
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors">
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-dark-100">
                          <p className="text-sm text-dark-500">
                            <span className="font-medium">Notes:</span> {apt.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {Object.keys(groupedAppointments).length === 0 && (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-600">No appointments found</h3>
            <p className="text-dark-400 mt-1">
              {selectedMember
                ? `${selectedMember.name} doesn't have any appointments yet`
                : 'No appointments match your search criteria'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4"
            >
              Schedule Appointment
            </button>
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Appointment"
        size="lg"
      >
        <form className="space-y-4">
          {!selectedMember && (
            <div>
              <label className="label">Select Member</label>
              <select className="input">
                <option value="">Select a member</option>
                {mockMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.membership}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Appointment Type</label>
            <select className="input">
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Assign Trainer</label>
            <select className="input">
              <option value="">Select a trainer</option>
              {mockTrainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name} - {trainer.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" className="input" />
            </div>
          </div>

          <div>
            <label className="label">Duration (minutes)</label>
            <select className="input">
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60" selected>60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Add any notes about this appointment..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="sendReminder" className="w-4 h-4" defaultChecked />
            <label htmlFor="sendReminder" className="text-sm text-dark-600">
              Send reminder notification to member
            </label>
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
              Schedule Appointment
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default CustomerAppointments;
