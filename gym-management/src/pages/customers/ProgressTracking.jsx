import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Avatar, Badge, Modal } from '../../components/common';
import {
  Search,
  Plus,
  Scale,
  Ruler,
  Activity,
  Camera,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { mockMembers, mockProgressLogs } from '../../data/mockData';

const ProgressTracking = () => {
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(
    memberId ? mockMembers.find((m) => m.id === parseInt(memberId)) : null
  );
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Get progress logs for selected member
  const memberLogs = selectedMember
    ? mockProgressLogs.filter((log) => log.memberId === selectedMember.id)
    : [];

  // Weight chart data
  const weightData = memberLogs.map((log) => ({
    date: log.date,
    weight: log.weight,
    bodyFat: log.bodyFat,
  }));

  // Filter members for search
  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout
      title="Progress Tracking"
      subtitle={
        selectedMember
          ? `Tracking progress for ${selectedMember.name}`
          : 'Track member fitness progress and measurements'
      }
    >
      {!selectedMember ? (
        // Member Selection View
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">
            Select a Member to Track
          </h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="flex items-center gap-4 p-4 bg-dark-50 rounded-xl hover:bg-dark-100 transition-colors cursor-pointer"
              >
                <Avatar src={member.avatar} name={member.name} size="lg" />
                <div>
                  <p className="font-semibold text-dark-800">{member.name}</p>
                  <p className="text-sm text-dark-500">{member.membership}</p>
                  <p className="text-xs text-dark-400">
                    Trainer: {member.trainer || 'None'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Progress Tracking View
        <div className="space-y-6">
          {/* Member Header */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar src={selectedMember.avatar} name={selectedMember.name} size="xl" />
                <div>
                  <h3 className="text-xl font-bold text-dark-800">
                    {selectedMember.name}
                  </h3>
                  <p className="text-dark-500">{selectedMember.membership}</p>
                  <p className="text-sm text-dark-400">
                    Trainer: {selectedMember.trainer || 'None assigned'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="btn-secondary"
                >
                  Change Member
                </button>
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Photos
                </button>
                <button
                  onClick={() => setShowAddLogModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Progress Log
                </button>
              </div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card border-l-4 border-l-primary-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Scale className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Current Weight</p>
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0]?.weight || '--'} kg
                  </p>
                  {memberLogs.length > 1 && (
                    <div className="flex items-center gap-1 mt-1">
                      {memberLogs[0].weight < memberLogs[1].weight ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-success-500" />
                          <span className="text-xs text-success-600">
                            -{(memberLogs[1].weight - memberLogs[0].weight).toFixed(1)} kg
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 text-warning-500" />
                          <span className="text-xs text-warning-600">
                            +{(memberLogs[0].weight - memberLogs[1].weight).toFixed(1)} kg
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-l-accent-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-100 rounded-xl">
                  <Activity className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Body Fat %</p>
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0]?.bodyFat || '--'}%
                  </p>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-l-success-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success-100 rounded-xl">
                  <Target className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Goal</p>
                  <p className="text-2xl font-bold text-dark-800">Lose 5kg</p>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-l-warning-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Last Update</p>
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0]?.date || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-dark-800 mb-4">
                Weight Progress
              </h3>
              <div className="h-64">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#0ea5e9"
                        fill="#0ea5e9"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-400">
                    No progress data available
                  </div>
                )}
              </div>
            </div>

            {/* Body Fat Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-dark-800 mb-4">
                Body Fat Progress
              </h3>
              <div className="h-64">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bodyFat"
                        stroke="#d946ef"
                        strokeWidth={2}
                        dot={{ fill: '#d946ef', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-400">
                    No progress data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">
              Body Measurements
            </h3>
            {memberLogs[0]?.measurements ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-dark-50 rounded-xl text-center">
                  <Ruler className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0].measurements.chest} cm
                  </p>
                  <p className="text-sm text-dark-500">Chest</p>
                </div>
                <div className="p-4 bg-dark-50 rounded-xl text-center">
                  <Ruler className="w-6 h-6 text-accent-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0].measurements.waist} cm
                  </p>
                  <p className="text-sm text-dark-500">Waist</p>
                </div>
                <div className="p-4 bg-dark-50 rounded-xl text-center">
                  <Ruler className="w-6 h-6 text-success-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0].measurements.arms} cm
                  </p>
                  <p className="text-sm text-dark-500">Arms</p>
                </div>
                <div className="p-4 bg-dark-50 rounded-xl text-center">
                  <Ruler className="w-6 h-6 text-warning-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-dark-800">
                    {memberLogs[0].measurements.thighs} cm
                  </p>
                  <p className="text-sm text-dark-500">Thighs</p>
                </div>
              </div>
            ) : (
              <p className="text-dark-400 text-center py-8">
                No measurements recorded yet
              </p>
            )}
          </div>

          {/* Progress Log History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">
              Progress Log History
            </h3>
            <div className="space-y-4">
              {memberLogs.length > 0 ? (
                memberLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-dark-50 rounded-xl border-l-4 border-primary-500"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-dark-400" />
                          <span className="font-medium text-dark-800">{log.date}</span>
                          <span className="text-sm text-dark-400">
                            by {log.trainer}
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <span>
                            <strong>Weight:</strong> {log.weight} kg
                          </span>
                          <span>
                            <strong>Body Fat:</strong> {log.bodyFat}%
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-dark-500 mt-2 flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5" />
                            {log.notes}
                          </p>
                        )}
                      </div>
                      <button className="text-primary-500 hover:text-primary-600 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-dark-400 text-center py-8">
                  No progress logs recorded yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Progress Log Modal */}
      <Modal
        isOpen={showAddLogModal}
        onClose={() => setShowAddLogModal(false)}
        title="Add Progress Log"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Weight (kg)</label>
              <input type="number" step="0.1" className="input" placeholder="82.5" />
            </div>
            <div>
              <label className="label">Body Fat %</label>
              <input type="number" step="0.1" className="input" placeholder="18.5" />
            </div>
          </div>
          <div>
            <label className="label">Body Measurements (cm)</label>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <input type="number" className="input" placeholder="Chest" />
                <p className="text-xs text-dark-400 mt-1">Chest</p>
              </div>
              <div>
                <input type="number" className="input" placeholder="Waist" />
                <p className="text-xs text-dark-400 mt-1">Waist</p>
              </div>
              <div>
                <input type="number" className="input" placeholder="Arms" />
                <p className="text-xs text-dark-400 mt-1">Arms</p>
              </div>
              <div>
                <input type="number" className="input" placeholder="Thighs" />
                <p className="text-xs text-dark-400 mt-1">Thighs</p>
              </div>
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Add trainer notes about progress, workout performance, etc."
            />
          </div>
          <div>
            <label className="label">Upload Photos (Optional)</label>
            <div className="border-2 border-dashed border-dark-200 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Camera className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500">Click to upload progress photos</p>
              <p className="text-xs text-dark-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddLogModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Save Progress Log
            </button>
          </div>
        </form>
      </Modal>

      {/* Progress Photos Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Progress Photos"
        size="xl"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-dark-500">Before & After comparison photos</p>
            <button className="btn-primary flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Upload New Photo
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-dark-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-dark-400">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p>No before photo</p>
                </div>
              </div>
              <p className="text-sm text-dark-500 mt-2">Before - Start Date</p>
            </div>
            <div className="text-center">
              <div className="bg-dark-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-dark-400">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p>No after photo</p>
                </div>
              </div>
              <p className="text-sm text-dark-500 mt-2">After - Current</p>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ProgressTracking;
