import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, ShoppingCart, CreditCard, User, Mail, Phone, MapPin, DollarSign, TrendingUp, Package, X, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';

export default function Billing() {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    transactionDate: '',
    purchaseChannel: 'ONLINE',
    paymentMethod: 'CARD',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    demographics: {
      ageGroup: '25-35',
      gender: 'Male',
      location: '',
      incomeBracket: 'Mid'
    },
    items: [{ productId: '', productName: '', category: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    totalAmount: 0,
    discountApplied: 0,
    finalAmountPaid: 0,
    rfmMetrics: {
      recencyDays: null,
      frequencyCount: null,
      totalSpendLifetime: null
    },
    behaviorSignals: {
      repeatPurchase: false,
      cartSizeCategory: 'SMALL',
      purchaseIntentScore: 50
    },
    meta: {
      platform: 'Web',
      device: ''
    }
  });

  useEffect(() => {
    fetchBillings();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discountApplied]);

  const fetchBillings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/customer-billing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch billings');
      const data = await response.json();
      setBillings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const total = formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      finalAmountPaid: total - (prev.discountApplied || 0)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? parseFloat(value) || 0 : newItems[index].quantity;
      const price = field === 'unitPrice' ? parseFloat(value) || 0 : newItems[index].unitPrice;
      newItems[index].totalPrice = qty * price;
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', productName: '', category: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/customer-billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          discountApplied: parseFloat(formData.discountApplied) || 0,
          rfmMetrics: {
            recencyDays: formData.rfmMetrics.recencyDays ? parseInt(formData.rfmMetrics.recencyDays) : null,
            frequencyCount: formData.rfmMetrics.frequencyCount ? parseInt(formData.rfmMetrics.frequencyCount) : null,
            totalSpendLifetime: formData.rfmMetrics.totalSpendLifetime ? parseFloat(formData.rfmMetrics.totalSpendLifetime) : null
          },
          behaviorSignals: {
            ...formData.behaviorSignals,
            purchaseIntentScore: parseInt(formData.behaviorSignals.purchaseIntentScore) || 50
          }
        })
      });

      if (!response.ok) throw new Error('Failed to create billing');

      await fetchBillings();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      transactionDate: '',
      purchaseChannel: 'ONLINE',
      paymentMethod: 'CARD',
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      demographics: {
        ageGroup: '25-35',
        gender: 'Male',
        location: '',
        incomeBracket: 'Mid'
      },
      items: [{ productId: '', productName: '', category: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      totalAmount: 0,
      discountApplied: 0,
      finalAmountPaid: 0,
      rfmMetrics: {
        recencyDays: null,
        frequencyCount: null,
        totalSpendLifetime: null
      },
      behaviorSignals: {
        repeatPurchase: false,
        cartSizeCategory: 'SMALL',
        purchaseIntentScore: 50
      },
      meta: {
        platform: 'Web',
        device: ''
      }
    });
  };

  const filteredBillings = billings.filter(bill => {
    const matchesSearch =
      (bill.invoiceNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (bill.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (bill.customerId?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesChannel = filterChannel === 'ALL' || bill.purchaseChannel === filterChannel;

    return matchesSearch && matchesChannel;
  });

  const totalRevenue = billings.reduce((sum, bill) => sum + (bill.finalAmountPaid || 0), 0);
  const avgOrderValue = billings.length > 0 ? totalRevenue / billings.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600" />
            Customer Billing
          </h1>
          <p className="text-gray-600 mt-2">Manage customer transactions and invoices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Billings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{billings.length}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{avgOrderValue.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full md:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice, customer name, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="ALL">All Channels</option>
                  <option value="ONLINE">Online</option>
                  <option value="IN_STORE">Offline</option>
                  <option value="APP">App</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchBillings}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Billing
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Billings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Loading billings...
                    </td>
                  </tr>
                ) : filteredBillings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No billings found
                    </td>
                  </tr>
                ) : (
                  filteredBillings.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bill.invoiceNumber || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{bill.customerName || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{bill.customerId || 'No ID'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {bill.transactionDate ? new Date(bill.transactionDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bill.purchaseChannel === 'ONLINE' ? 'bg-blue-100 text-blue-800' :
                            bill.purchaseChannel === 'IN_STORE' ? 'bg-gray-100 text-gray-800' :
                              'bg-purple-100 text-purple-800'
                          }`}>
                          {bill.purchaseChannel || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bill.items?.length || 0} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">₹{bill.finalAmountPaid?.toLocaleString() || 0}</div>
                        {bill.discountApplied > 0 && (
                          <div className="text-xs text-green-600">-₹{bill.discountApplied}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedBilling(bill);
                            setViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Billing</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Invoice Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Invoice Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date *</label>
                      <input
                        type="date"
                        name="transactionDate"
                        value={formData.transactionDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Channel</label>
                      <select
                        name="purchaseChannel"
                        value={formData.purchaseChannel}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ONLINE">Online</option>
                        <option value="IN_STORE">Offline</option>
                        <option value="APP">App</option>
                        <option value="PARTNER">Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CARD">Card</option>
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="NET_BANKING">Net Banking</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                      <input
                        type="text"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                      <select
                        name="demographics.ageGroup"
                        value={formData.demographics.ageGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="18-24">18-24</option>
                        <option value="25-35">25-35</option>
                        <option value="36-45">36-45</option>
                        <option value="46-60">46-60</option>
                        <option value="60+">60+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="demographics.gender"
                        value={formData.demographics.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="demographics.location"
                        value={formData.demographics.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Income Bracket</label>
                      <select
                        name="demographics.incomeBracket"
                        value={formData.demographics.incomeBracket}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Mid">Mid</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Items
                    </h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-6 gap-2">
                            <input
                              type="text"
                              placeholder="Product ID"
                              value={item.productId}
                              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Product Name"
                              value={item.productName}
                              onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Category"
                              value={item.category}
                              onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              placeholder="Unit Price"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="px-2 py-1 bg-gray-50 rounded text-sm font-semibold text-gray-900 flex items-center justify-center">
                              ₹{item.totalPrice}
                            </div>
                          </div>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                      <input
                        type="number"
                        value={formData.totalAmount}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                      <input
                        type="number"
                        name="discountApplied"
                        value={formData.discountApplied}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Final Amount</label>
                      <input
                        type="number"
                        value={formData.finalAmountPaid}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 font-bold text-green-800"
                      />
                    </div>
                  </div>
                </div>

                {/* RFM Metrics */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    RFM Metrics (Optional)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recency (Days)</label>
                      <input
                        type="number"
                        name="rfmMetrics.recencyDays"
                        value={formData.rfmMetrics.recencyDays || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency Count</label>
                      <input
                        type="number"
                        name="rfmMetrics.frequencyCount"
                        value={formData.rfmMetrics.frequencyCount || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lifetime Spend</label>
                      <input
                        type="number"
                        name="rfmMetrics.totalSpendLifetime"
                        value={formData.rfmMetrics.totalSpendLifetime || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Behavior Signals */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Behavior Signals</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="behaviorSignals.repeatPurchase"
                          checked={formData.behaviorSignals.repeatPurchase}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            behaviorSignals: { ...prev.behaviorSignals, repeatPurchase: e.target.checked }
                          }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Repeat Purchase</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cart Size</label>
                      <select
                        name="behaviorSignals.cartSizeCategory"
                        value={formData.behaviorSignals.cartSizeCategory}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          behaviorSignals: { ...prev.behaviorSignals, cartSizeCategory: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SMALL">Small</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LARGE">Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intent Score (0-100)</label>
                      <input
                        type="number"
                        name="behaviorSignals.purchaseIntentScore"
                        value={formData.behaviorSignals.purchaseIntentScore}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          behaviorSignals: { ...prev.behaviorSignals, purchaseIntentScore: e.target.value }
                        }))}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Additional Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                      <select
                        name="meta.platform"
                        value={formData.meta.platform}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Web">Web</option>
                        <option value="Android">Android</option>
                        <option value="iOS">iOS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                      <input
                        type="text"
                        name="meta.device"
                        value={formData.meta.device}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Billing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewModal && selectedBilling && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Invoice Details</h2>
                <button onClick={() => setViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Invoice Header */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Invoice Number</p>
                      <p className="text-lg font-bold text-gray-900">{selectedBilling.invoiceNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedBilling.transactionDate ? new Date(selectedBilling.transactionDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {selectedBilling.customerName && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedBilling.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ID:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedBilling.customerId || 'N/A'}</span>
                      </div>
                      {selectedBilling.customerEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{selectedBilling.customerEmail}</span>
                        </div>
                      )}
                      {selectedBilling.customerPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{selectedBilling.customerPhone}</span>
                        </div>
                      )}
                      {selectedBilling.demographics?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{selectedBilling.demographics.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Items
                  </h3>
                  <div className="space-y-2">
                    {selectedBilling.items?.map((item, index) => (
                      <div key={item._id || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">{item.category} • {item.productId || 'No ID'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.totalPrice?.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{item.quantity} × ₹{item.unitPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">₹{selectedBilling.totalAmount?.toLocaleString()}</span>
                    </div>
                    {selectedBilling.discountApplied > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-₹{selectedBilling.discountApplied?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                      <span className="text-gray-900">Total Paid</span>
                      <span className="text-blue-600">₹{selectedBilling.finalAmountPaid?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Channel</p>
                    <span className={`inline-block px-2 py-1 text-sm font-semibold rounded ${selectedBilling.purchaseChannel === 'ONLINE' ? 'bg-blue-100 text-blue-800' :
                        selectedBilling.purchaseChannel === 'OFFLINE' ? 'bg-gray-100 text-gray-800' :
                          'bg-purple-100 text-purple-800'
                      }`}>
                      {selectedBilling.purchaseChannel || 'N/A'}
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900">{selectedBilling.paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                {/* RFM Metrics */}
                {(selectedBilling.rfmMetrics?.recencyDays || selectedBilling.rfmMetrics?.frequencyCount) && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      RFM Metrics
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Recency</p>
                        <p className="text-lg font-bold text-gray-900">{selectedBilling.rfmMetrics.recencyDays || 'N/A'} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Frequency</p>
                        <p className="text-lg font-bold text-gray-900">{selectedBilling.rfmMetrics.frequencyCount || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Lifetime Spend</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{selectedBilling.rfmMetrics.totalSpendLifetime?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}