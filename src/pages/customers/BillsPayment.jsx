import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Avatar, Badge, Modal } from '../../components/common';
import {
  Search,
  Plus,
  Download,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  Send,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { mockMembers, mockPayments, mockMembershipPlans } from '../../data/mockData';

const BillsPayment = () => {
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(
    memberId ? mockMembers.find((m) => m.id === parseInt(memberId)) : null
  );

  // Calculate summary
  const totalCollected = mockPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = mockPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = mockMembers.reduce((sum, m) => sum + m.balance, 0);

  // Filter payments
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.member
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || payment.status === filterStatus;
    const matchesMember = selectedMember
      ? payment.memberId === selectedMember.id
      : true;
    return matchesSearch && matchesStatus && matchesMember;
  });

  return (
    <Layout
      title="Bills & Payment"
      subtitle={
        selectedMember
          ? `Payment history for ${selectedMember.name}`
          : 'Manage invoices and payments'
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm">Total Collected</p>
              <p className="text-3xl font-bold mt-1">${totalCollected.toLocaleString()}</p>
              <p className="text-success-100 text-xs mt-1">This month</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold mt-1">${totalPending.toLocaleString()}</p>
              <p className="text-warning-100 text-xs mt-1">Awaiting confirmation</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger-100 text-sm">Outstanding</p>
              <p className="text-3xl font-bold mt-1">${totalOutstanding.toLocaleString()}</p>
              <p className="text-danger-100 text-xs mt-1">Total balance due</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold mt-1">{mockPayments.length}</p>
              <p className="text-primary-100 text-xs mt-1">This month</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Receipt className="w-8 h-8" />
            </div>
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
                <Badge
                  variant={
                    selectedMember.membershipStatus === 'active'
                      ? 'success'
                      : selectedMember.membershipStatus === 'expiring'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {selectedMember.membershipStatus}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              {selectedMember.balance > 0 ? (
                <div>
                  <p className="text-sm text-dark-500">Balance Due</p>
                  <p className="text-2xl font-bold text-danger-600">
                    ${selectedMember.balance}
                  </p>
                </div>
              ) : (
                <Badge variant="success" size="lg">
                  No Balance Due
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                Generate Invoice
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          {!selectedMember && (
            <div className="flex items-center gap-2">
              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Record Payment
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50">
                <th className="table-header">Member</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Type</th>
                <th className="table-header">Method</th>
                <th className="table-header">Date</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredPayments.map((payment) => {
                const member = mockMembers.find((m) => m.id === payment.memberId);
                return (
                  <tr key={payment.id} className="hover:bg-dark-50">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar src={member?.avatar} name={payment.member} size="sm" />
                        <span className="font-medium">{payment.member}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-semibold text-dark-800">
                        ${payment.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="table-cell">{payment.type}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        {payment.method === 'Credit Card' && (
                          <CreditCard className="w-4 h-4 text-dark-400" />
                        )}
                        {payment.method === 'Cash' && (
                          <Banknote className="w-4 h-4 text-dark-400" />
                        )}
                        {payment.method}
                      </div>
                    </td>
                    <td className="table-cell">{payment.date}</td>
                    <td className="table-cell">
                      <Badge
                        variant={
                          payment.status === 'completed'
                            ? 'success'
                            : payment.status === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Members with Outstanding Balance */}
      {!selectedMember && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">
            Members with Outstanding Balance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMembers
              .filter((m) => m.balance > 0)
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-danger-50 border border-danger-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={member.avatar} name={member.name} size="md" />
                    <div>
                      <p className="font-medium text-dark-800">{member.name}</p>
                      <p className="text-sm text-dark-500">{member.membership}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-danger-600">
                      ${member.balance}
                    </p>
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        size="md"
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
            <label className="label">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input type="number" className="input pl-10" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="label">Payment Type</label>
            <select className="input">
              <option>Membership Renewal</option>
              <option>Monthly Subscription</option>
              <option>PT Package</option>
              <option>Add-on Service</option>
              <option>Outstanding Balance</option>
            </select>
          </div>
          <div>
            <label className="label">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center justify-center gap-2 p-3 border border-dark-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors [&:has(input:checked)]:border-primary-500 [&:has(input:checked)]:bg-primary-50">
                <input type="radio" name="method" value="cash" className="hidden" />
                <Banknote className="w-5 h-5" />
                <span>Cash</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border border-dark-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors [&:has(input:checked)]:border-primary-500 [&:has(input:checked)]:bg-primary-50">
                <input type="radio" name="method" value="card" className="hidden" />
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border border-dark-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors [&:has(input:checked)]:border-primary-500 [&:has(input:checked)]:bg-primary-50">
                <input type="radio" name="method" value="transfer" className="hidden" />
                <Receipt className="w-5 h-5" />
                <span>Transfer</span>
              </label>
            </div>
          </div>
          <div>
            <label className="label">Notes (Optional)</label>
            <textarea className="input" rows={3} placeholder="Add any notes..." />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-success">
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Generate Invoice"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="label">Invoice For</label>
            <select className="input">
              <option>Membership Renewal</option>
              <option>Personal Training Package</option>
              <option>Outstanding Balance</option>
              <option>Custom Amount</option>
            </select>
          </div>
          <div>
            <label className="label">Membership Plan</label>
            <select className="input">
              {mockMembershipPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Discount (Optional)</label>
            <div className="relative">
              <input type="number" className="input pr-10" placeholder="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                %
              </span>
            </div>
          </div>
          <div>
            <label className="label">Due Date</label>
            <input type="date" className="input" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="sendEmail" className="w-4 h-4" />
            <label htmlFor="sendEmail" className="text-sm text-dark-600">
              Send invoice via email
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowInvoiceModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default BillsPayment;
