import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Avatar, Badge, Modal } from '../components/common';
import {
  Search,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  QrCode,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { mockMembers, mockCheckIns, mockAppointments } from '../data/mockData';

const CheckIn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInType, setCheckInType] = useState('walk-in');
  const [todayCheckIns, setTodayCheckIns] = useState(mockCheckIns);

  // Filter members based on search
  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery)
  );

  const handleQuickCheckIn = (member) => {
    if (member.membershipStatus === 'expired') {
      alert('Cannot check in: Membership expired');
      return;
    }
    setSelectedMember(member);
    setShowCheckInModal(true);
  };

  const confirmCheckIn = () => {
    const newCheckIn = {
      id: todayCheckIns.length + 1,
      member: selectedMember.name,
      memberId: selectedMember.id,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: checkInType,
      status: 'checked-in',
    };
    setTodayCheckIns([newCheckIn, ...todayCheckIns]);
    setShowCheckInModal(false);
    setSelectedMember(null);
  };

  const handleCheckOut = (checkInId) => {
    setTodayCheckIns(
      todayCheckIns.map((c) =>
        c.id === checkInId ? { ...c, status: 'checked-out' } : c
      )
    );
  };

  // Today's appointments
  const todayAppointments = mockAppointments.filter((apt) => apt.date === '2024-12-09');

  return (
    <Layout title="Check-In System" subtitle="Manage walk-in and appointment check-ins">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Check-In Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Member */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">Quick Check-In</h3>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search member by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <p className="text-center text-dark-400 py-8">No members found</p>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-dark-50 rounded-xl hover:bg-dark-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={member.avatar}
                          name={member.name}
                          size="lg"
                          status={member.membershipStatus === 'active' ? 'online' : 'offline'}
                        />
                        <div>
                          <p className="font-semibold text-dark-800">{member.name}</p>
                          <p className="text-sm text-dark-500">{member.membership}</p>
                          <div className="flex items-center gap-2 mt-1">
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
                              <Badge variant="danger">Balance: ${member.balance}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickCheckIn(member)}
                        disabled={member.membershipStatus === 'expired'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          member.membershipStatus === 'expired'
                            ? 'bg-dark-200 text-dark-400 cursor-not-allowed'
                            : 'bg-success-500 text-white hover:bg-success-600'
                        }`}
                      >
                        <UserCheck className="w-5 h-5" />
                        Check In
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="flex flex-col items-center justify-center py-12 text-dark-400">
                <QrCode className="w-16 h-16 mb-4 text-dark-300" />
                <p className="text-lg font-medium">Search for a member to check in</p>
                <p className="text-sm">Or scan their membership QR code</p>
              </div>
            )}
          </div>

          {/* Today's Check-In History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-800">Today's Check-In History</h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-dark-600 hover:bg-dark-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-dark-600 hover:bg-dark-100 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-50">
                    <th className="table-header">Member</th>
                    <th className="table-header">Time</th>
                    <th className="table-header">Type</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {todayCheckIns.map((checkIn) => {
                    const member = mockMembers.find((m) => m.id === checkIn.memberId);
                    return (
                      <tr key={checkIn.id} className="hover:bg-dark-50">
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={member?.avatar}
                              name={checkIn.member}
                              size="sm"
                            />
                            <span className="font-medium">{checkIn.member}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-dark-400" />
                            {checkIn.time}
                          </div>
                        </td>
                        <td className="table-cell">
                          <Badge variant={checkIn.type === 'appointment' ? 'accent' : 'default'}>
                            {checkIn.type}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <Badge
                            variant={
                              checkIn.status === 'checked-in'
                                ? 'success'
                                : checkIn.status === 'expected'
                                ? 'primary'
                                : 'default'
                            }
                          >
                            {checkIn.status}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          {checkIn.status === 'checked-in' && (
                            <button
                              onClick={() => handleCheckOut(checkIn.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                            >
                              <UserX className="w-4 h-4" />
                              Check Out
                            </button>
                          )}
                          {checkIn.status === 'expected' && (
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-success-600 hover:bg-success-50 rounded-lg transition-colors">
                              <UserCheck className="w-4 h-4" />
                              Check In
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Appointments & Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">Today's Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-dark-700">Checked In</span>
                </div>
                <span className="text-xl font-bold text-success-600">
                  {todayCheckIns.filter((c) => c.status === 'checked-in').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span className="text-dark-700">Expected</span>
                </div>
                <span className="text-xl font-bold text-primary-600">
                  {todayCheckIns.filter((c) => c.status === 'expected').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-dark-500" />
                  <span className="text-dark-700">Checked Out</span>
                </div>
                <span className="text-xl font-bold text-dark-600">
                  {todayCheckIns.filter((c) => c.status === 'checked-out').length}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">Upcoming Appointments</h3>
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-dark-50 rounded-lg border-l-4 border-primary-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-dark-800">{apt.member}</span>
                    <span className="text-sm font-semibold text-primary-600">{apt.time}</span>
                  </div>
                  <p className="text-sm text-dark-500">{apt.type}</p>
                  <p className="text-xs text-dark-400 mt-1">with {apt.trainer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Members */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">Blocked Check-Ins</h3>
            <div className="space-y-3">
              {mockMembers
                .filter((m) => m.membershipStatus === 'expired')
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-danger-50 rounded-lg"
                  >
                    <Avatar src={member.avatar} name={member.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-800 truncate">{member.name}</p>
                      <p className="text-xs text-danger-600">Membership expired</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      <Modal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Confirm Check-In"
        size="md"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-dark-50 rounded-xl">
              <Avatar src={selectedMember.avatar} name={selectedMember.name} size="xl" />
              <div>
                <h4 className="text-xl font-semibold text-dark-800">{selectedMember.name}</h4>
                <p className="text-dark-500">{selectedMember.membership}</p>
                <Badge
                  variant={
                    selectedMember.membershipStatus === 'active' ? 'success' : 'warning'
                  }
                  size="lg"
                >
                  {selectedMember.membershipStatus}
                </Badge>
              </div>
            </div>

            <div>
              <label className="label">Check-In Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="checkInType"
                    value="walk-in"
                    checked={checkInType === 'walk-in'}
                    onChange={(e) => setCheckInType(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Walk-In</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="checkInType"
                    value="appointment"
                    checked={checkInType === 'appointment'}
                    onChange={(e) => setCheckInType(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Appointment</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-dark-500">Check-In Time</p>
                <p className="font-semibold text-dark-800">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button onClick={confirmCheckIn} className="flex-1 btn-success">
                <UserCheck className="w-5 h-5 mr-2" />
                Confirm Check-In
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default CheckIn;
