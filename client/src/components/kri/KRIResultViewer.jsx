import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie, Legend } from 'recharts';
import { AlertTriangle, Shield, TrendingUp, Activity, FileText, Layers } from 'lucide-react';

export default function KRIResultViewer({ data }) {
    const { kri } = data;
    const [activeTab, setActiveTab] = useState('overview');

    // Calculate risk metrics
    const riskStats = kri.risks?.reduce((acc, risk) => {
        const severity = risk.riskScore >= 15 ? 'critical' : risk.riskScore >= 10 ? 'high' : risk.riskScore >= 5 ? 'medium' : 'low';
        acc[severity] = (acc[severity] || 0) + 1;
        acc.total += 1;
        acc.totalScore += risk.riskScore;
        return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0, total: 0, totalScore: 0 }) || { critical: 0, high: 0, medium: 0, low: 0, total: 0, totalScore: 0 };

    const avgRiskScore = riskStats.total > 0 ? (riskStats.totalScore / riskStats.total).toFixed(1) : 0;

    // Prepare chart data
    const riskDistribution = [
        { name: 'Critical', value: riskStats.critical, color: '#ef4444' },
        { name: 'High', value: riskStats.high, color: '#f97316' },
        { name: 'Medium', value: riskStats.medium, color: '#eab308' },
        { name: 'Low', value: riskStats.low, color: '#22c55e' }
    ].filter(item => item.value > 0);

    const riskScoreData = kri.risks?.map(risk => ({
        name: risk.riskTitle.substring(0, 20) + '...',
        score: risk.riskScore,
        impact: risk.impact,
        likelihood: risk.likelihood
    })) || [];

    const radarData = kri.risks?.slice(0, 5).map(risk => ({
        risk: risk.riskTitle.substring(0, 15) + '...',
        score: risk.riskScore,
        fullMark: 25
    })) || [];

    const getSeverityColor = (score) => {
        if (score >= 15) return 'bg-red-500';
        if (score >= 10) return 'bg-orange-500';
        if (score >= 5) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getSeverityBadge = (score) => {
        if (score >= 15) return { text: 'CRITICAL', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
        if (score >= 10) return { text: 'HIGH', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
        if (score >= 5) return { text: 'MEDIUM', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
        return { text: 'LOW', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            KRI Risk Analytics
                        </h1>
                        <p className="text-slate-400">Comprehensive Risk Intelligence Dashboard</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-semibold">Live Analysis</span>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm font-medium">Total Risks</span>
                            <AlertTriangle className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold">{riskStats.total}</div>
                        <div className="text-xs text-slate-500 mt-1">Identified</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-950/30 to-slate-900 border border-red-500/20 rounded-xl p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm font-medium">Critical</span>
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="text-3xl font-bold text-red-400">{riskStats.critical}</div>
                        <div className="text-xs text-red-300/60 mt-1">Requires immediate attention</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-950/30 to-slate-900 border border-orange-500/20 rounded-xl p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm font-medium">High Risk</span>
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="text-3xl font-bold text-orange-400">{riskStats.high}</div>
                        <div className="text-xs text-orange-300/60 mt-1">Priority action needed</div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-500/20 rounded-xl p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm font-medium">Avg Risk Score</span>
                            <Activity className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="text-3xl font-bold text-cyan-400">{avgRiskScore}</div>
                        <div className="text-xs text-cyan-300/60 mt-1">Out of 25</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-700/50">
                    {['overview', 'risks', 'context', 'data'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium transition-all ${activeTab === tab
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-slate-400 hover:text-slate-300'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Risk Distribution */}
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-400" />
                                Risk Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk Score Comparison */}
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                Risk Scores
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={riskScoreData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                        {riskScoreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score >= 15 ? '#ef4444' : entry.score >= 10 ? '#f97316' : entry.score >= 5 ? '#eab308' : '#22c55e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Radar Chart */}
                        {radarData.length > 0 && (
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur lg:col-span-2">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                    Top 5 Risk Analysis
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#334155" />
                                        <PolarAngleAxis dataKey="risk" stroke="#94a3b8" fontSize={12} />
                                        <PolarRadiusAxis stroke="#94a3b8" />
                                        <Radar name="Risk Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* Risks Tab */}
                {activeTab === 'risks' && kri.risks?.length > 0 && (
                    <div className="space-y-4">
                        {/* Table View */}
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-900/50 border-b border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Impact</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Likelihood</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {kri.risks.map((risk, idx) => {
                                            const badge = getSeverityBadge(risk.riskScore);
                                            return (
                                                <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-white">{risk.riskTitle}</div>
                                                        <div className="text-sm text-slate-400 mt-1">{risk.riskDescription}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-300">{risk.impact}</td>
                                                    <td className="px-6 py-4 text-slate-300">{risk.likelihood}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(risk.riskScore)}`}></div>
                                                            <span className="font-semibold">{risk.riskScore}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badge.color}`}>
                                                            {badge.text}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Card View */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {kri.risks.map((risk, idx) => {
                                const badge = getSeverityBadge(risk.riskScore);
                                return (
                                    <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:border-blue-500/30 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-white flex-1">{risk.riskTitle}</h4>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badge.color} whitespace-nowrap ml-2`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-4">{risk.riskDescription}</p>

                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-slate-900/50 rounded-lg p-3">
                                                <div className="text-xs text-slate-400 mb-1">Impact</div>
                                                <div className="text-lg font-semibold text-blue-400">{risk.impact}</div>
                                            </div>
                                            <div className="bg-slate-900/50 rounded-lg p-3">
                                                <div className="text-xs text-slate-400 mb-1">Likelihood</div>
                                                <div className="text-lg font-semibold text-cyan-400">{risk.likelihood}</div>
                                            </div>
                                            <div className="bg-slate-900/50 rounded-lg p-3">
                                                <div className="text-xs text-slate-400 mb-1">Score</div>
                                                <div className="text-lg font-semibold text-orange-400">{risk.riskScore}</div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-semibold text-blue-400">Mitigation</span>
                                            </div>
                                            <p className="text-sm text-slate-300">{risk.mitigationRecommendation}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Context Tab */}
                {activeTab === 'context' && (
                    <div className="space-y-4">
                        {kri.extractedContext && (
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    Extracted Context
                                </h3>
                                <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto border border-slate-700">
                                    {JSON.stringify(kri.extractedContext, null, 2)}
                                </pre>
                            </div>
                        )}
                        {kri.structuredInput && (
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-blue-400" />
                                    Normalized Risk Context
                                </h3>
                                <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto border border-slate-700">
                                    {JSON.stringify(kri.structuredInput, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Data Tab */}
                {activeTab === 'data' && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Complete Data Structure
                        </h3>
                        <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto border border-slate-700">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}