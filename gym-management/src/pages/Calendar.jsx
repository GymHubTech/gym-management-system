import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Avatar, Badge, Modal } from '../components/common';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Calendar as CalendarIcon,
  Filter,
  List,
  Grid,
} from 'lucide-react';
import { mockAppointments, mockMembers, mockTrainers, appointmentTypes } from '../data/mockData';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTrainer, setFilterTrainer] = useState('all');

  // Navigate months
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockAppointments.filter((apt) => {
      const matchesDate = apt.date === dateStr;
      const matchesTrainer = filterTrainer === 'all' || apt.trainerId === parseInt(filterTrainer);
      return matchesDate && matchesTrainer;
    });
  };

  // Selected date appointments
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout title="Calendar" subtitle="Manage appointments and schedules">
      {/* Header Actions */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-dark-800 min-w-[180px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterTrainer}
              onChange={(e) => setFilterTrainer(e.target.value)}
              className="px-4 py-2 bg-dark-50 border border-dark-200 rounded-lg focus:border-primary-500 outline-none text-sm"
            >
              <option value="all">All Trainers</option>
              {mockTrainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-dark-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-dark-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-dark-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 card">
          {viewMode === 'month' ? (
            <>
              {/* Week Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-dark-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[100px] p-2 border border-dark-100 rounded-lg cursor-pointer transition-all ${
                        !isCurrentMonth ? 'bg-dark-50 opacity-50' : 'bg-white'
                      } ${isSelected ? 'ring-2 ring-primary-500' : ''} ${
                        isToday ? 'bg-primary-50' : ''
                      } hover:bg-dark-50`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday
                            ? 'w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center'
                            : isCurrentMonth
                            ? 'text-dark-800'
                            : 'text-dark-400'
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${
                              apt.status === 'confirmed'
                                ? 'bg-success-100 text-success-700'
                                : apt.status === 'pending'
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-dark-100 text-dark-600'
                            }`}
                          >
                            {apt.time} {apt.member.split(' ')[0]}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-dark-500 text-center">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* List View */
            <div className="space-y-4">
              {mockAppointments
                .filter((apt) =>
                  filterTrainer === 'all' || apt.trainerId === parseInt(filterTrainer)
                )
                .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
                .map((apt) => {
                  const member = mockMembers.find((m) => m.id === apt.memberId);
                  const trainer = mockTrainers.find((t) => t.id === apt.trainerId);
                  
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-dark-50 rounded-xl hover:bg-dark-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center px-3 py-2 bg-white rounded-lg shadow-sm min-w-[70px]">
                          <p className="text-xs text-dark-500">
                            {format(new Date(apt.date), 'MMM d')}
                          </p>
                          <p className="text-lg font-bold text-primary-600">
                            {apt.time}
                          </p>
                        </div>
                        <Avatar src={member?.avatar} name={apt.member} size="md" />
                        <div>
                          <p className="font-semibold text-dark-800">{apt.member}</p>
                          <p className="text-sm text-dark-500">
                            {apt.type} • {apt.duration} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-dark-500">Trainer</p>
                          <p className="font-medium text-dark-700">{apt.trainer}</p>
                        </div>
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
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-800">
                {format(selectedDate, 'EEEE, MMM d')}
              </h3>
              <Badge variant="primary">{selectedDateAppointments.length} appointments</Badge>
            </div>

            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDateAppointments.map((apt) => {
                  const member = mockMembers.find((m) => m.id === apt.memberId);
                  const trainer = mockTrainers.find((t) => t.id === apt.trainerId);
                  
                  return (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-xl border-l-4 ${
                        apt.status === 'confirmed'
                          ? 'bg-success-50 border-success-500'
                          : apt.status === 'pending'
                          ? 'bg-warning-50 border-warning-500'
                          : 'bg-dark-50 border-dark-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary-600">{apt.time}</span>
                        <Badge
                          size="sm"
                          variant={
                            apt.status === 'confirmed'
                              ? 'success'
                              : apt.status === 'pending'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar src={member?.avatar} name={apt.member} size="sm" />
                        <div>
                          <p className="font-medium text-dark-800">{apt.member}</p>
                          <p className="text-xs text-dark-500">{apt.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dark-500">
                        <User className="w-4 h-4" />
                        <span>{apt.trainer}</span>
                        <span className="text-dark-300">•</span>
                        <Clock className="w-4 h-4" />
                        <span>{apt.duration} min</span>
                      </div>
                      {apt.notes && (
                        <p className="text-xs text-dark-500 mt-2 pt-2 border-t border-dark-200">
                          {apt.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-dark-300 mx-auto mb-3" />
                <p className="text-dark-500">No appointments on this day</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                >
                  Schedule one →
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <span className="text-dark-600">Total Appointments</span>
                <span className="font-bold text-dark-800">
                  {mockAppointments.filter((apt) =>
                    apt.date.startsWith(format(currentDate, 'yyyy-MM'))
                  ).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <span className="text-dark-600">Confirmed</span>
                <span className="font-bold text-success-600">
                  {mockAppointments.filter(
                    (apt) =>
                      apt.date.startsWith(format(currentDate, 'yyyy-MM')) &&
                      apt.status === 'confirmed'
                  ).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <span className="text-dark-600">Pending</span>
                <span className="font-bold text-warning-600">
                  {mockAppointments.filter(
                    (apt) =>
                      apt.date.startsWith(format(currentDate, 'yyyy-MM')) &&
                      apt.status === 'pending'
                  ).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Appointment"
        size="lg"
      >
        <form className="space-y-4">
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
              <input
                type="date"
                className="input"
                defaultValue={format(selectedDate, 'yyyy-MM-dd')}
              />
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
            <input type="checkbox" id="sendReminderCal" className="w-4 h-4" defaultChecked />
            <label htmlFor="sendReminderCal" className="text-sm text-dark-600">
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

export default Calendar;
