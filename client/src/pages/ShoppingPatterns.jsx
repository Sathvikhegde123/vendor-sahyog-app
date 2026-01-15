import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  MapPin,
  CreditCard,
  Smartphone,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import api from '../utils/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ShoppingPatterns() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [period, setPeriod] = useState('daily');

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const [categoryAnalysis, setCategoryAnalysis] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [locationAnalysis, setLocationAnalysis] = useState([]);
  const [paymentMethodAnalysis, setPaymentMethodAnalysis] = useState([]);
  const [purchaseChannelAnalysis, setPurchaseChannelAnalysis] = useState([]);
  const [timeTrends, setTimeTrends] = useState([]);
  const [customerBehavior, setCustomerBehavior] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [dateRange, period]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      params.append('period', period);

      const queryString = params.toString();
      const suffix = queryString ? `?${queryString}` : '';

      const [
        dashboardRes,
        categoryRes,
        peakHoursRes,
        locationRes,
        paymentRes,
        channelRes,
        trendsRes,
        behaviorRes,
      ] = await Promise.all([
        api.get(`/shopping-patterns/dashboard${suffix}`),
        api.get(`/shopping-patterns/category-analysis${suffix}`),
        api.get(`/shopping-patterns/peak-hours${suffix}`),
        api.get(`/shopping-patterns/location-analysis${suffix}`),
        api.get(`/shopping-patterns/payment-method${suffix}`),
        api.get(`/shopping-patterns/purchase-channel${suffix}`),
        api.get(`/shopping-patterns/time-trends${suffix}`),
        api.get(`/shopping-patterns/customer-behavior${suffix}`),
      ]);

      setDashboardStats(dashboardRes.data);
      setCategoryAnalysis(categoryRes.data);
      setPeakHours(peakHoursRes.data);
      setLocationAnalysis(locationRes.data);
      setPaymentMethodAnalysis(paymentRes.data);
      setPurchaseChannelAnalysis(channelRes.data);
      setTimeTrends(trendsRes.data);
      setCustomerBehavior(behaviorRes.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            Customer Shopping Patterns
          </h1>
          <p className="text-gray-600 mt-2">Analyze transactions, footfall, and trend insights</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trend Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
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

        {loading && !dashboardStats ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600 mt-2">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Stats */}
            {dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(dashboardStats.totalRevenue)}
                      </p>
                    </div>
                    <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {dashboardStats.totalTransactions}
                      </p>
                    </div>
                    <ShoppingCart className="w-12 h-12 text-blue-600 opacity-20" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(dashboardStats.averageOrderValue)}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Unique Customers</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {dashboardStats.uniqueCustomers}
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-orange-600 opacity-20" />
                  </div>
                </div>
              </div>
            )}

            {/* Category Analysis */}
            {categoryAnalysis.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Category-wise Spending</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="totalSpend" fill="#3b82f6" name="Total Spend" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Time Trends */}
            {timeTrends.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trends</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="transactionCount"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Peak Hours */}
            {peakHours.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Peak Hours Analysis</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hourLabel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="transactionCount" fill="#f59e0b" name="Transactions" />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Payment Method & Purchase Channel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {paymentMethodAnalysis.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ method, percentage }) => `${method}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {paymentMethodAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {purchaseChannelAnalysis.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Channels</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={purchaseChannelAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ channel, percentage }) => `${channel}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {purchaseChannelAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Location Analysis */}
            {locationAnalysis.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location-based Analysis
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {locationAnalysis.slice(0, 10).map((location, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {location.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {location.transactionCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                            {formatCurrency(location.totalRevenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {location.uniqueCustomers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatCurrency(location.averageRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customer Behavior */}
            {customerBehavior && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Behavior Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerBehavior.summary?.totalCustomers || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Repeat Customers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerBehavior.summary?.repeatCustomers || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Repeat Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerBehavior.summary?.repeatCustomerRate?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Avg Transactions/Customer</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerBehavior.summary?.avgTransactionsPerCustomer?.toFixed(1) || 0}
                    </p>
                  </div>
                </div>

                {customerBehavior.customers && customerBehavior.customers.length > 0 && (
                  <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Customers by Spend</h3>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spend</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Spend</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customerBehavior.customers.slice(0, 10).map((customer, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{customer.customerName || 'Anonymous'}</div>
                              <div className="text-xs text-gray-500">{customer.customerId || 'No ID'}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-900">{customer.transactionCount}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {formatCurrency(customer.totalSpend)}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {formatCurrency(customer.averageSpend)}
                            </td>
                            <td className="px-6 py-4">
                              {customer.isRepeatCustomer ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Repeat
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                  New
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Top Categories */}
            {dashboardStats?.topCategories && dashboardStats.topCategories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Categories</h2>
                <div className="space-y-3">
                  {dashboardStats.topCategories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{cat.category}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(cat.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
