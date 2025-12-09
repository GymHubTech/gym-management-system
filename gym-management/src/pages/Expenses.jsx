import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Badge, Modal } from '../components/common';
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash,
  Receipt,
  Upload,
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
} from 'lucide-react';
import {
  PieChart as RechartPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { mockExpenses, expenseCategories } from '../data/mockData';

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses
    .filter((exp) => exp.status === 'paid')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses
    .filter((exp) => exp.status === 'pending')
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Expense by category
  const expenseByCategory = expenseCategories.map((cat) => ({
    name: cat,
    value: expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0),
  })).filter((cat) => cat.value > 0);

  const categoryColors = [
    '#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#6366f1'
  ];

  // Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  return (
    <Layout title="Expense List" subtitle="Track and manage gym expenses">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Expenses</p>
              <p className="text-3xl font-bold mt-1">
                ${totalExpenses.toLocaleString()}
              </p>
              <p className="text-primary-100 text-xs mt-1">This month</p>
            </div>
            <DollarSign className="w-10 h-10 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm">Paid</p>
              <p className="text-3xl font-bold mt-1">
                ${paidExpenses.toLocaleString()}
              </p>
            </div>
            <Receipt className="w-10 h-10 text-success-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm">Pending</p>
              <p className="text-3xl font-bold mt-1">
                ${pendingExpenses.toLocaleString()}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-warning-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Transactions</p>
              <p className="text-3xl font-bold mt-1">{expenses.length}</p>
            </div>
            <PieChart className="w-10 h-10 text-accent-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Expense by Category Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">
            Expenses by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPie>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={categoryColors[index % categoryColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </RechartPie>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseByCategory.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                />
                <span className="text-dark-600">{item.name}</span>
                <span className="text-dark-400 ml-auto">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">
            Monthly Expense Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: 'Jul', amount: 19500 },
                  { month: 'Aug', amount: 21000 },
                  { month: 'Sep', amount: 18500 },
                  { month: 'Oct', amount: 22000 },
                  { month: 'Nov', amount: 23000 },
                  { month: 'Dec', amount: totalExpenses },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:bg-white focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all">All Categories</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50">
                <th className="table-header">Date</th>
                <th className="table-header">Category</th>
                <th className="table-header">Description</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Status</th>
                <th className="table-header">Receipt</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-dark-50">
                  <td className="table-cell">{expense.date}</td>
                  <td className="table-cell">
                    <Badge variant="default">{expense.category}</Badge>
                  </td>
                  <td className="table-cell font-medium">{expense.description}</td>
                  <td className="table-cell">
                    <span className="font-semibold text-dark-800">
                      ${expense.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="table-cell">
                    <Badge
                      variant={expense.status === 'paid' ? 'success' : 'warning'}
                    >
                      {expense.status}
                    </Badge>
                  </td>
                  <td className="table-cell">
                    {expense.receipt ? (
                      <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm">
                        <Receipt className="w-4 h-4" />
                        View
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 text-dark-400 hover:text-dark-600 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-dark-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Expense"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="label">Category</label>
            <select className="input">
              <option value="">Select category</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Description</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Monthly gym rent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount ($)</label>
              <input type="number" className="input" placeholder="0.00" />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" />
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="paid"
                  defaultChecked
                  className="w-4 h-4 text-primary-600"
                />
                <span>Paid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  className="w-4 h-4 text-primary-600"
                />
                <span>Pending</span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">Upload Receipt (Optional)</label>
            <div className="border-2 border-dashed border-dark-200 rounded-xl p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-dark-300 mx-auto mb-2" />
              <p className="text-sm text-dark-500">Click to upload receipt</p>
              <p className="text-xs text-dark-400 mt-1">PNG, JPG, PDF up to 10MB</p>
            </div>
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
              Add Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedExpense(null);
        }}
        title="Edit Expense"
        size="md"
      >
        {selectedExpense && (
          <form className="space-y-4">
            <div>
              <label className="label">Category</label>
              <select className="input" defaultValue={selectedExpense.category}>
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Description</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedExpense.description}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Amount ($)</label>
                <input
                  type="number"
                  className="input"
                  defaultValue={selectedExpense.amount}
                />
              </div>
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  className="input"
                  defaultValue={selectedExpense.date}
                />
              </div>
            </div>

            <div>
              <label className="label">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editStatus"
                    value="paid"
                    defaultChecked={selectedExpense.status === 'paid'}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Paid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editStatus"
                    value="pending"
                    defaultChecked={selectedExpense.status === 'pending'}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Pending</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedExpense(null);
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

export default Expenses;
