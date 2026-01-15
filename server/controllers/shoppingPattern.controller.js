import CustomerBilling from "../models/customerBilling.js";
import ShoppingPattern from "../models/ShoppingPatternModule.js";

/**
 * Get overall dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const totalRevenue = bills.reduce((sum, bill) => sum + (bill.finalAmountPaid || 0), 0);
    const totalTransactions = bills.length;
    const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const uniqueCustomers = new Set(bills.map(bill => bill.customerId).filter(Boolean)).size;

    // Get top categories
    const categorySpending = {};
    bills.forEach(bill => {
      if (bill.items && bill.items.length > 0) {
        bill.items.forEach(item => {
          const category = item.category || "Other";
          categorySpending[category] = (categorySpending[category] || 0) + (item.totalPrice || 0);
        });
      }
    });

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    res.json({
      totalRevenue,
      totalTransactions,
      averageOrderValue,
      uniqueCustomers,
      topCategories,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

/**
 * Get category-wise spending analysis
 */
export const getCategoryAnalysis = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const categoryData = {};
    const categoryCounts = {};

    bills.forEach(bill => {
      if (bill.items && bill.items.length > 0) {
        bill.items.forEach(item => {
          const category = item.category || "Other";
          categoryData[category] = (categoryData[category] || 0) + (item.totalPrice || 0);
          categoryCounts[category] = (categoryCounts[category] || 0) + (item.quantity || 1);
        });
      }
    });

    const result = Object.entries(categoryData).map(([category, totalSpend]) => ({
      category,
      totalSpend,
      transactionCount: categoryCounts[category] || 0,
      averageSpend: categoryCounts[category] > 0 ? totalSpend / categoryCounts[category] : 0,
    }));

    res.json(result.sort((a, b) => b.totalSpend - a.totalSpend));
  } catch (error) {
    console.error("Category analysis error:", error);
    res.status(500).json({ error: "Failed to fetch category analysis" });
  }
};

/**
 * Get peak hours analysis
 */
export const getPeakHoursAnalysis = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    // Initialize hours (0-23)
    const hourData = {};
    for (let i = 0; i < 24; i++) {
      hourData[i] = { hour: i, count: 0, revenue: 0 };
    }

    bills.forEach(bill => {
      if (bill.transactionDate) {
        const hour = new Date(bill.transactionDate).getHours();
        hourData[hour].count += 1;
        hourData[hour].revenue += bill.finalAmountPaid || 0;
      }
    });

    const result = Object.values(hourData).map(data => ({
      hour: data.hour,
      hourLabel: `${data.hour}:00`,
      transactionCount: data.count,
      revenue: data.revenue,
      averageRevenue: data.count > 0 ? data.revenue / data.count : 0,
    }));

    res.json(result);
  } catch (error) {
    console.error("Peak hours analysis error:", error);
    res.status(500).json({ error: "Failed to fetch peak hours analysis" });
  }
};

/**
 * Get location-based patterns
 */
export const getLocationAnalysis = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const locationData = {};

    bills.forEach(bill => {
      const location = bill.demographics?.location || bill.meta?.ipLocation || "Unknown";
      if (!locationData[location]) {
        locationData[location] = {
          location,
          transactionCount: 0,
          totalRevenue: 0,
          uniqueCustomers: new Set(),
        };
      }
      locationData[location].transactionCount += 1;
      locationData[location].totalRevenue += bill.finalAmountPaid || 0;
      if (bill.customerId) {
        locationData[location].uniqueCustomers.add(bill.customerId);
      }
    });

    const result = Object.values(locationData).map(data => ({
      location: data.location,
      transactionCount: data.transactionCount,
      totalRevenue: data.totalRevenue,
      uniqueCustomers: data.uniqueCustomers.size,
      averageRevenue: data.transactionCount > 0 ? data.totalRevenue / data.transactionCount : 0,
    }));

    res.json(result.sort((a, b) => b.totalRevenue - a.totalRevenue));
  } catch (error) {
    console.error("Location analysis error:", error);
    res.status(500).json({ error: "Failed to fetch location analysis" });
  }
};

/**
 * Get payment method distribution
 */
export const getPaymentMethodAnalysis = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const paymentData = {};

    bills.forEach(bill => {
      const method = bill.paymentMethod || "UNKNOWN";
      if (!paymentData[method]) {
        paymentData[method] = {
          method,
          count: 0,
          totalAmount: 0,
        };
      }
      paymentData[method].count += 1;
      paymentData[method].totalAmount += bill.finalAmountPaid || 0;
    });

    const result = Object.values(paymentData).map(data => ({
      method: data.method,
      count: data.count,
      totalAmount: data.totalAmount,
      percentage: bills.length > 0 ? (data.count / bills.length) * 100 : 0,
      averageAmount: data.count > 0 ? data.totalAmount / data.count : 0,
    }));

    res.json(result.sort((a, b) => b.count - a.count));
  } catch (error) {
    console.error("Payment method analysis error:", error);
    res.status(500).json({ error: "Failed to fetch payment method analysis" });
  }
};

/**
 * Get purchase channel distribution
 */
export const getPurchaseChannelAnalysis = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const channelData = {};

    bills.forEach(bill => {
      const channel = bill.purchaseChannel || "UNKNOWN";
      if (!channelData[channel]) {
        channelData[channel] = {
          channel,
          count: 0,
          totalRevenue: 0,
        };
      }
      channelData[channel].count += 1;
      channelData[channel].totalRevenue += bill.finalAmountPaid || 0;
    });

    const result = Object.values(channelData).map(data => ({
      channel: data.channel,
      count: data.count,
      totalRevenue: data.totalRevenue,
      percentage: bills.length > 0 ? (data.count / bills.length) * 100 : 0,
      averageRevenue: data.count > 0 ? data.totalRevenue / data.count : 0,
    }));

    res.json(result.sort((a, b) => b.count - a.count));
  } catch (error) {
    console.error("Purchase channel analysis error:", error);
    res.status(500).json({ error: "Failed to fetch purchase channel analysis" });
  }
};

/**
 * Get time-based trends (daily, weekly, monthly)
 */
export const getTimeTrends = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { period = "daily", startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const trendData = {};

    bills.forEach(bill => {
      if (!bill.transactionDate) return;

      const date = new Date(bill.transactionDate);
      let key;

      if (period === "daily") {
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (period === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else if (period === "monthly") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else {
        key = date.toISOString().split("T")[0];
      }

      if (!trendData[key]) {
        trendData[key] = {
          period: key,
          transactionCount: 0,
          totalRevenue: 0,
          uniqueCustomers: new Set(),
        };
      }

      trendData[key].transactionCount += 1;
      trendData[key].totalRevenue += bill.finalAmountPaid || 0;
      if (bill.customerId) {
        trendData[key].uniqueCustomers.add(bill.customerId);
      }
    });

    const result = Object.values(trendData).map(data => ({
      period: data.period,
      transactionCount: data.transactionCount,
      totalRevenue: data.totalRevenue,
      uniqueCustomers: data.uniqueCustomers.size,
      averageRevenue: data.transactionCount > 0 ? data.totalRevenue / data.transactionCount : 0,
    }));

    // Sort by period
    result.sort((a, b) => a.period.localeCompare(b.period));

    res.json(result);
  } catch (error) {
    console.error("Time trends error:", error);
    res.status(500).json({ error: "Failed to fetch time trends" });
  }
};

/**
 * Get customer behavior patterns (RFM analysis, repeat customers, etc.)
 */
export const getCustomerBehaviorAnalysis = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    const customerData = {};

    bills.forEach(bill => {
      const customerId = bill.customerId || "anonymous";
      if (!customerData[customerId]) {
        customerData[customerId] = {
          customerId,
          customerName: bill.customerName || "Unknown",
          transactionCount: 0,
          totalSpend: 0,
          firstPurchase: bill.transactionDate,
          lastPurchase: bill.transactionDate,
          categories: new Set(),
        };
      }

      customerData[customerId].transactionCount += 1;
      customerData[customerId].totalSpend += bill.finalAmountPaid || 0;

      if (bill.transactionDate) {
        const transDate = new Date(bill.transactionDate);
        if (transDate < new Date(customerData[customerId].firstPurchase)) {
          customerData[customerId].firstPurchase = bill.transactionDate;
        }
        if (transDate > new Date(customerData[customerId].lastPurchase)) {
          customerData[customerId].lastPurchase = bill.transactionDate;
        }
      }

      if (bill.items) {
        bill.items.forEach(item => {
          if (item.category) {
            customerData[customerId].categories.add(item.category);
          }
        });
      }
    });

    const now = new Date();
    const result = Object.values(customerData).map(data => {
      const recencyDays = data.lastPurchase
        ? Math.floor((now - new Date(data.lastPurchase)) / (1000 * 60 * 60 * 24))
        : null;

      return {
        customerId: data.customerId,
        customerName: data.customerName,
        transactionCount: data.transactionCount,
        totalSpend: data.totalSpend,
        averageSpend: data.transactionCount > 0 ? data.totalSpend / data.transactionCount : 0,
        recencyDays,
        isRepeatCustomer: data.transactionCount > 1,
        preferredCategories: Array.from(data.categories),
        firstPurchase: data.firstPurchase,
        lastPurchase: data.lastPurchase,
      };
    });

    // Calculate summary stats
    const repeatCustomers = result.filter(c => c.isRepeatCustomer).length;
    const totalCustomers = result.length;
    const avgTransactionsPerCustomer = totalCustomers > 0
      ? bills.length / totalCustomers
      : 0;

    res.json({
      summary: {
        totalCustomers,
        repeatCustomers,
        newCustomers: totalCustomers - repeatCustomers,
        repeatCustomerRate: totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0,
        avgTransactionsPerCustomer,
      },
      customers: result.sort((a, b) => b.totalSpend - a.totalSpend),
    });
  } catch (error) {
    console.error("Customer behavior analysis error:", error);
    res.status(500).json({ error: "Failed to fetch customer behavior analysis" });
  }
};

/**
 * Generate and save shopping patterns from billing data
 */
export const generateShoppingPatterns = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate, autoSave = false } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.transactionDate = {};
      if (startDate) dateFilter.transactionDate.$gte = new Date(startDate);
      if (endDate) dateFilter.transactionDate.$lte = new Date(endDate);
    }

    const bills = await CustomerBilling.find({
      vendorId,
      isRefunded: false,
      ...dateFilter,
    });

    // Aggregate patterns by category and location
    const patternMap = {};

    bills.forEach(bill => {
      const location = bill.demographics?.location || bill.meta?.ipLocation || "Unknown";
      
      if (bill.items && bill.items.length > 0) {
        bill.items.forEach(item => {
          const category = item.category || "Other";
          const key = `${category}_${location}`;

          if (!patternMap[key]) {
            patternMap[key] = {
              vendorId,
              category,
              location,
              totalSpend: 0,
              transactionCount: 0,
              peakHours: {},
            };
          }

          patternMap[key].totalSpend += item.totalPrice || 0;
          patternMap[key].transactionCount += 1;

          if (bill.transactionDate) {
            const hour = new Date(bill.transactionDate).getHours();
            const hourKey = `${hour}:00`;
            patternMap[key].peakHours[hourKey] = (patternMap[key].peakHours[hourKey] || 0) + 1;
          }
        });
      }
    });

    // Convert to array and format
    const patterns = Object.values(patternMap).map(pattern => {
      const peakHoursArray = Object.entries(pattern.peakHours)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => hour);

      return {
        vendorId: pattern.vendorId,
        category: pattern.category,
        location: pattern.location,
        totalSpend: pattern.totalSpend,
        peakHours: peakHoursArray,
        meta: {
          transactionCount: pattern.transactionCount,
          averageSpend: pattern.transactionCount > 0
            ? pattern.totalSpend / pattern.transactionCount
            : 0,
        },
      };
    });

    // Save to database if autoSave is true
    if (autoSave === "true") {
      // Delete existing patterns for this vendor in the date range
      await ShoppingPattern.deleteMany({
        vendorId,
        ...(startDate || endDate ? {
          timeStamp: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {}),
          },
        } : {}),
      });

      // Insert new patterns
      if (patterns.length > 0) {
        await ShoppingPattern.insertMany(patterns);
      }
    }

    res.json({
      message: autoSave === "true" ? "Patterns generated and saved" : "Patterns generated",
      count: patterns.length,
      patterns,
    });
  } catch (error) {
    console.error("Generate patterns error:", error);
    res.status(500).json({ error: "Failed to generate shopping patterns" });
  }
};

/**
 * Get saved shopping patterns
 */
export const getSavedPatterns = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timeStamp = {};
      if (startDate) dateFilter.timeStamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timeStamp.$lte = new Date(endDate);
    }

    const patterns = await ShoppingPattern.find({
      vendorId,
      ...dateFilter,
    }).sort({ totalSpend: -1 });

    res.json(patterns);
  } catch (error) {
    console.error("Get saved patterns error:", error);
    res.status(500).json({ error: "Failed to fetch saved patterns" });
  }
};
