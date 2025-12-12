/**
 * Customer Form Model
 * Defines the structure and initial state for customer form data
 */

/**
 * Get initial customer form data
 * @returns {Object} Initial form state
 */
export const getInitialCustomerFormData = () => ({
  firstName: '',
  lastName: '',
  gender: 'Male',
  dateOfBirth: '',
  photo: '',
  phoneNumber: '',
  email: '',
  address: '',
  medicalNotes: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  bloodType: '',
  allergies: '',
  currentMedications: '',
  medicalConditions: '',
  doctorName: '',
  doctorPhone: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  emergencyContactRelationship: '',
  emergencyContactAddress: '',
});

/**
 * Map customer data from API to form data
 * @param {Object} customer - Customer object from API
 * @param {Function} formatDateForInput - Function to format date for input field
 * @returns {Object} Form data object
 */
export const mapCustomerToFormData = (customer, formatDateForInput) => {
  if (!customer) return getInitialCustomerFormData();
  
  return {
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    gender: customer.gender || '',
    dateOfBirth: formatDateForInput ? formatDateForInput(customer.dateOfBirth) : (customer.dateOfBirth || ''),
    photo: customer.photo || '',
    phoneNumber: customer.phoneNumber || '',
    email: customer.email || '',
    address: customer.address || '',
    medicalNotes: customer.medicalNotes || '',
    emergencyContactName: customer.emergencyContactName || '',
    emergencyContactPhone: customer.emergencyContactPhone || '',
    bloodType: customer.bloodType || '',
    allergies: customer.allergies || '',
    currentMedications: customer.currentMedications || '',
    medicalConditions: customer.medicalConditions || '',
    doctorName: customer.doctorName || '',
    doctorPhone: customer.doctorPhone || '',
    insuranceProvider: customer.insuranceProvider || '',
    insurancePolicyNumber: customer.insurancePolicyNumber || '',
    emergencyContactRelationship: customer.emergencyContactRelationship || '',
    emergencyContactAddress: customer.emergencyContactAddress || '',
  };
};

