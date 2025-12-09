import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Badge, Modal } from '../components/common';
import {
  Plus,
  Edit,
  Trash,
  Check,
  Star,
  Users,
  DollarSign,
  Calendar,
  Award,
} from 'lucide-react';
import { mockMembershipPlans } from '../data/mockData';

const MembershipPlans = () => {
  const [plans, setPlans] = useState(mockMembershipPlans);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const totalActiveMembers = plans.reduce((sum, plan) => sum + plan.activeMembers, 0);
  const monthlyRevenue = plans.reduce(
    (sum, plan) => sum + plan.price * plan.activeMembers,
    0
  );

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  return (
    <Layout
      title="Membership Plans"
      subtitle="Manage gym membership packages and pricing"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Plans</p>
              <p className="text-3xl font-bold mt-1">{plans.length}</p>
            </div>
            <Award className="w-10 h-10 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm">Active Members</p>
              <p className="text-3xl font-bold mt-1">{totalActiveMembers}</p>
            </div>
            <Users className="w-10 h-10 text-success-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Est. Monthly Revenue</p>
              <p className="text-3xl font-bold mt-1">
                ${monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-accent-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm">Most Popular</p>
              <p className="text-xl font-bold mt-1">Premium Monthly</p>
            </div>
            <Star className="w-10 h-10 text-warning-200" />
          </div>
        </div>
      </div>

      {/* Add Plan Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card relative overflow-hidden ${
              plan.popular ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4">
                <Badge variant="primary">Popular</Badge>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-dark-800">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold text-primary-600">
                  ${plan.price}
                </span>
                <span className="text-dark-500">
                  / {plan.duration} {plan.durationUnit}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-success-600" />
                  </div>
                  <span className="text-sm text-dark-600">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-dark-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-dark-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{plan.activeMembers} active members</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors">
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Membership Plan"
        size="lg"
      >
        <form className="space-y-4">
          <div>
            <label className="label">Plan Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Premium Monthly"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price ($)</label>
              <input type="number" className="input" placeholder="99.99" />
            </div>
            <div>
              <label className="label">Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="input flex-1"
                  placeholder="1"
                  min="1"
                />
                <select className="input w-32">
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Features (one per line)</label>
            <textarea
              className="input"
              rows={5}
              placeholder="Gym Access&#10;Locker Room&#10;All Equipment&#10;Group Classes"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="popular" className="w-4 h-4" />
            <label htmlFor="popular" className="text-sm text-dark-600">
              Mark as popular plan
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
              Create Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPlan(null);
        }}
        title="Edit Membership Plan"
        size="lg"
      >
        {selectedPlan && (
          <form className="space-y-4">
            <div>
              <label className="label">Plan Name</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedPlan.name}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price ($)</label>
                <input
                  type="number"
                  className="input"
                  defaultValue={selectedPlan.price}
                />
              </div>
              <div>
                <label className="label">Duration</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input flex-1"
                    defaultValue={selectedPlan.duration}
                    min="1"
                  />
                  <select
                    className="input w-32"
                    defaultValue={selectedPlan.durationUnit}
                  >
                    <option value="month">Month(s)</option>
                    <option value="months">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Features (one per line)</label>
              <textarea
                className="input"
                rows={5}
                defaultValue={selectedPlan.features.join('\n')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editPopular"
                className="w-4 h-4"
                defaultChecked={selectedPlan.popular}
              />
              <label htmlFor="editPopular" className="text-sm text-dark-600">
                Mark as popular plan
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPlan(null);
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

export default MembershipPlans;
