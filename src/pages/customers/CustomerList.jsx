import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Avatar, Badge } from '../../components/common';
import {
  Search,
  Plus,
  Edit,
  Trash,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Download,
} from 'lucide-react';
import { customerService } from '../../services/customerService';
import { Alert, Toast } from '../../utils/alert';
import { getInitialCustomerFormData, mapCustomerToFormData } from '../../models/customerModel';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form state
  const [formData, setFormData] = useState(getInitialCustomerFormData());

  // Fetch customers on component mount and when page changes
  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const result = await customerService.getAll(currentPage);
      setCustomers(result.data || []);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Toast.error(`Failed to load customers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date to human readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format date to YYYY-MM-DD for date input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter customers (client-side filtering for search)
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter((customer) => {
      const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
      const email = (customer.email || '').toLowerCase();
      const phone = (customer.phoneNumber || '').toLowerCase();
      
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [customers, searchQuery]);

  const handleOpenModal = (customer = null) => {
    if (customer) {
      // Edit mode
      setSelectedCustomer(customer);
      setFormData(mapCustomerToFormData(customer, formatDateForInput));
    } else {
      // Create mode
      setSelectedCustomer(null);
      setFormData(getInitialCustomerFormData());
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setFormData(getInitialCustomerFormData());
  };

  const handleSaveSuccess = () => {
    fetchCustomers();
  };

  const handleDeleteCustomer = async (customerId) => {
    const result = await Alert.confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      await customerService.delete(customerId);
      Alert.success('Deleted!', 'Customer has been deleted.', {
        timer: 2000,
        showConfirmButton: false
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      Alert.error('Error!', error.message || 'Failed to delete customer');
    }
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  if (loading && customers.length === 0) {
    return (
      <Layout title="Customer Management" subtitle="Manage all gym members and their information">
        <div className="flex items-center justify-center h-64">
          <p className="text-dark-500">Loading customers...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Customer Management" subtitle="Manage all gym members and their information">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <p className="text-primary-100 text-sm">Total Members</p>
          <p className="text-3xl font-bold mt-1">{pagination?.total || customers.length || 0}</p>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <p className="text-success-100 text-sm">Active</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <p className="text-warning-100 text-sm">Expiring Soon</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white">
          <p className="text-danger-100 text-sm">Expired</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:bg-white focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button> */}
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50">
                <th className="table-header">Customer</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Gender</th>
                <th className="table-header">Date of Birth</th>
                <th className="table-header">Address</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredCustomers.map((customer) => {
                const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
                return (
                  <tr 
                    key={customer.id} 
                    onClick={() => handleViewCustomer(customer.id)}
                    className="hover:bg-dark-50 cursor-pointer transition-colors"
                  >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <Avatar
                          src={customer.photo}
                          name={fullName}
                        size="md"
                      />
                      <div>
                          <p className="font-semibold text-dark-800 hover:text-primary-600 transition-colors">{fullName || 'N/A'}</p>
                          {customer.email && (
                            <p className="text-xs text-dark-400">{customer.email}</p>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1">
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-dark-600">
                            <Phone className="w-3.5 h-3.5 text-dark-400" />
                            {customer.phoneNumber}
                          </div>
                        )}
                        {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-dark-600">
                        <Mail className="w-3.5 h-3.5 text-dark-400" />
                            {customer.email}
                      </div>
                        )}
                    </div>
                  </td>
                  <td className="table-cell">
                      {customer.gender ? (
                        <Badge variant="default">{customer.gender}</Badge>
                      ) : (
                        <span className="text-dark-400">-</span>
                      )}
                  </td>
                  <td className="table-cell">
                      {customer.dateOfBirth ? (
                        <div className="flex items-center gap-1 text-sm text-dark-600">
                          <Calendar className="w-3.5 h-3.5 text-dark-400" />
                          {formatDate(customer.dateOfBirth)}
                        </div>
                      ) : (
                        <span className="text-dark-400">-</span>
                      )}
                  </td>
                  <td className="table-cell">
                      <span className="text-sm text-dark-600">
                        {customer.address || '-'}
                      </span>
                  </td>
                  <td className="table-cell">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View customer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(customer)}
                          className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-2 text-dark-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          title="Delete customer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-dark-400">No customers found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-200">
            <div className="text-sm text-dark-600">
              Showing {pagination.from} to {pagination.to} of {pagination.total} customers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-dark-600">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.lastPage, prev + 1))}
                disabled={currentPage === pagination.lastPage}
                className="p-2 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <CustomerForm
        isOpen={showModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        selectedCustomer={selectedCustomer}
        onSaveSuccess={handleSaveSuccess}
      />
    </Layout>
  );
};

export default CustomerList;
