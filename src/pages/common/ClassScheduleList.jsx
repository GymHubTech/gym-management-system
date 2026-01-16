import { useState, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import { Badge, Modal } from '../../components/common';
import {
  Plus,
  Search,
  Edit,
  Trash,
  Calendar,
  Clock,
  Users,
  UserCog,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Alert } from '../../utils/alert';
import {
  useClassSchedules,
  useDeleteClassSchedule,
} from '../../hooks/useClassSchedules';
import { useClassAttendances } from '../../hooks/useClassAttendance';
import { useCoaches } from '../../hooks/useUsers';
import { formatDate, formatTimeFromDate } from '../../utils/formatters';
import ClassScheduleForm from './forms/ClassScheduleForm';
import { SCHEDULE_TYPE_LABELS, RECURRING_INTERVAL_LABELS } from '../../constants/classScheduleConstants';

const ClassScheduleList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCoach, setFilterCoach] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedScheduleForAttendance, setSelectedScheduleForAttendance] = useState(null);

  // Build query options
  const scheduleOptions = useMemo(() => {
    const filters = {};
    if (searchQuery) {
      filters.className = searchQuery;
    }
    if (filterCoach !== 'all') {
      filters.coachId = filterCoach;
    }

    return {
      page: currentPage,
      pagelimit: 10,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      relations: 'coach',
    };
  }, [currentPage, searchQuery, filterCoach]);

  // Fetch data from backend
  const { data: schedulesData, isLoading: loading } = useClassSchedules(scheduleOptions);
  const { data: coaches = [] } = useCoaches();
  const deleteMutation = useDeleteClassSchedule();

  const schedules = schedulesData?.data || [];
  const pagination = schedulesData || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  };

  const handleOpenModal = (schedule = null) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleFormSubmit = () => {
    handleCloseModal();
  };

  const handleOpenAttendanceModal = async (schedule) => {
    setSelectedScheduleForAttendance(schedule);
    setShowAttendanceModal(true);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    setSelectedScheduleForAttendance(null);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    const result = await Alert.confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(scheduleId);
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const getCapacityStatus = (schedule) => {
    const enrolled = schedule.attendanceCount || 0;
    const capacity = schedule.capacity || 0;
    const remaining = capacity - enrolled;

    if (remaining === 0) return { status: 'full', color: 'danger', text: 'Full' };
    if (remaining <= 3) return { status: 'low', color: 'warning', text: `${remaining} spots` };
    return { status: 'available', color: 'success', text: `${remaining} spots` };
  };


  if (loading) {
    return (
      <Layout title="Class Schedules" subtitle="Manage group class schedules">
        <div className="flex items-center justify-center h-64">
          <p className="text-dark-500">Loading class schedules...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Class Schedules" subtitle="Manage group class schedules">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-700 border border-dark-600 text-dark-50 placeholder-dark-400 rounded-lg focus:bg-dark-600 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            <select
              value={filterCoach}
              onChange={(e) => setFilterCoach(e.target.value)}
              className="px-4 py-2.5 bg-dark-700 border border-dark-600 text-dark-50 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all" className="bg-dark-700 text-dark-50">All Coaches</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id} className="bg-dark-700 text-dark-50">
                  {coach.firstname} {coach.lastname}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Class
          </button>
        </div>

        {/* Class Schedules List */}
        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-400">No class schedules found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const coach = schedule.coach;
              const capacityStatus = getCapacityStatus(schedule);
              const enrolled = schedule.attendanceCount || 0;
              const capacity = schedule.capacity || 0;

              return (
                <div
                  key={schedule.id}
                  className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-primary-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-dark-50">
                          {schedule.className}
                        </h3>
                        <Badge variant="default">
                          {SCHEDULE_TYPE_LABELS[schedule.scheduleType] || 'One-time'}
                        </Badge>
                        <Badge variant={capacityStatus.color}>
                          {capacityStatus.text}
                        </Badge>
                      </div>
                      {schedule.description && (
                        <p className="text-sm text-dark-300 mb-3">{schedule.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-dark-300">
                        <div className="flex items-center gap-1">
                          <UserCog className="w-4 h-4" />
                          {coach?.firstname} {coach?.lastname}
                        </div>
                        {schedule.startDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTimeFromDate(schedule.startDate)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {enrolled}/{capacity} enrolled
                        </div>
                      </div>
                      {schedule.scheduleType === 2 && schedule.recurringInterval && (
                        <div className="mt-2">
                          <p className="text-xs text-dark-400">
                            Repeats: {RECURRING_INTERVAL_LABELS[schedule.recurringInterval] || schedule.recurringInterval}
                            {schedule.numberOfSessions && ` (${schedule.numberOfSessions} sessions)`}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAttendanceModal(schedule)}
                        className="btn-secondary flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Attendance
                      </button>
                      <button
                        onClick={() => handleOpenModal(schedule)}
                        className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit class"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="p-2 text-dark-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Delete class"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-200">
            <div className="text-sm text-dark-300">
              Showing {pagination.from} to {pagination.to} of {pagination.total} classes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-dark-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-dark-300">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                disabled={currentPage === pagination.last_page}
                className="p-2 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-dark-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Class Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedSchedule ? 'Edit Class Schedule' : 'Create Class Schedule'}
        size="lg"
      >
        <ClassScheduleForm
          schedule={selectedSchedule}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={handleCloseAttendanceModal}
        title={`Mark Attendance - ${selectedScheduleForAttendance?.className}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-300">Enrolled:</span>
              <span className="text-dark-50 font-semibold">
                {selectedScheduleForAttendance?.attendanceCount || 0}/
                {selectedScheduleForAttendance?.capacity || 0}
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            <p className="text-sm text-dark-400 text-center py-4">
              Attendance marking will be implemented with enrolled members list
            </p>
          </div>

          <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-3">
            <p className="text-sm text-warning-500">
              ⚠️ Marking "Attended" will auto-deduct 1 session from member's PT package if applicable
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseAttendanceModal}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 btn-primary"
              disabled
            >
              Save Attendance
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ClassScheduleList;
