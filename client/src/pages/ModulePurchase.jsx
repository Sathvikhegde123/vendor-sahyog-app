import { useState, useEffect } from 'react';
import { ShoppingCart, Check, X, Package, Calendar, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const AVAILABLE_MODULES = [
  {
    code: 'KRI',
    name: 'Risk Assessment (KRI)',
    description: 'Key Risk Indicators module for comprehensive risk assessment and monitoring',
    price: 5000,
    billingCycle: 'MONTHLY',
    features: ['AI-powered risk analysis', 'Structured and text input modes', 'Risk scoring', 'Historical tracking'],
  },
  {
    code: 'SITE_RISK',
    name: 'Site Risk Management',
    description: 'Site-specific risk assessment and management system',
    price: 8000,
    billingCycle: 'MONTHLY',
    features: ['Site risk evaluation', 'AI risk analysis', 'Document management', 'Risk mitigation tracking'],
  },
  {
    code: 'BCM',
    name: 'Business Continuity Management',
    description: 'Business Continuity Planning and Policy management',
    price: 10000,
    billingCycle: 'MONTHLY',
    features: ['BCP policy generation', 'AI-powered policy analysis', 'Compliance tracking', 'Document storage'],
  },
  {
    code: 'INTERNAL_AUDIT',
    name: 'Internal Audit',
    description: 'Internal audit management and tracking system',
    price: 7000,
    billingCycle: 'MONTHLY',
    features: ['Audit planning', 'Finding management', 'Employee assignment', 'Status tracking'],
  },
  {
    code: 'SHOPPING_PATTERNS',
    name: 'Shopping Patterns Analytics',
    description: 'Customer shopping pattern analysis and visualization',
    price: 6000,
    billingCycle: 'MONTHLY',
    features: ['Pattern analysis', 'Revenue trends', 'Customer behavior insights', 'Category analytics'],
  },
];

export default function ModulePurchase() {
  const [purchasedModules, setPurchasedModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    licenseDurationMonths: 12,
    paymentMode: 'UPI',
  });

  useEffect(() => {
    fetchPurchasedModules();
  }, []);

  const fetchPurchasedModules = async () => {
    try {
      const res = await api.get('/billing/my-modules');
      setPurchasedModules(res.data);
    } catch (err) {
      console.error('Failed to fetch purchased modules', err);
    }
  };

  const isModulePurchased = (moduleCode) => {
    return purchasedModules.some(
      (mod) =>
        mod.moduleCode === moduleCode &&
        mod.license.status === 'ACTIVE' &&
        new Date(mod.license.endDate) >= new Date()
    );
  };

  const handlePurchaseClick = (module) => {
    setSelectedModule(module);
    setFormData({
      licenseDurationMonths: 12,
      paymentMode: 'UPI',
    });
    setShowModal(true);
    setError(null);
    setSuccess(null);
  };

  const handlePurchase = async () => {
    if (!selectedModule) return;

    setPurchasing(selectedModule.code);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/billing/purchase', {
        moduleCode: selectedModule.code,
        moduleName: selectedModule.name,
        pricing: {
          amount: selectedModule.price,
          currency: 'INR',
          billingCycle: selectedModule.billingCycle,
        },
        licenseDurationMonths: parseInt(formData.licenseDurationMonths),
        paymentMode: formData.paymentMode,
      });

      setSuccess(response.data.message || 'Module purchased successfully!');
      await fetchPurchasedModules();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to purchase module');
    } finally {
      setPurchasing(null);
    }
  };

  const calculateTotal = () => {
    if (!selectedModule) return 0;
    return selectedModule.price * formData.licenseDurationMonths;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            Purchase Modules
          </h1>
          <p className="text-gray-600 mt-2">Browse and purchase modules to enhance your platform</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_MODULES.map((module) => {
            const isPurchased = isModulePurchased(module.code);
            const purchasedModule = purchasedModules.find((m) => m.moduleCode === module.code);

            return (
              <div
                key={module.code}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Module Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{module.name}</h3>
                    {isPurchased && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Purchased
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">₹{module.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">/{module.billingCycle.toLowerCase()}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4 flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                  <ul className="space-y-1">
                    {module.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Purchase Info or Button */}
                {isPurchased && purchasedModule ? (
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        Valid until: {new Date(purchasedModule.license.endDate).toLocaleDateString()}
                      </p>
                      <p>Status: {purchasedModule.license.status}</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchaseClick(module)}
                    className="mt-auto w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Purchase Module
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Modal */}
      {showModal && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Purchase Module</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Module Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedModule.name}</h3>
                <p className="text-sm text-gray-600">{selectedModule.description}</p>
              </div>

              {/* License Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Duration (Months)
                </label>
                <select
                  value={formData.licenseDurationMonths}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseDurationMonths: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="WALLET">Wallet</option>
                </select>
              </div>

              {/* Total */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Monthly Price:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{selectedModule.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.licenseDurationMonths} months
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing === selectedModule.code}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {purchasing === selectedModule.code ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Confirm Purchase
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
