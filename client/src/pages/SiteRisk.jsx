import { useState } from 'react';
import { AlertCircle, Building2, MapPin, Shield, FileCheck, Users, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function SiteRisk() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        siteName: '',
        siteType: 'Office',
        ownershipType: 'Rented',
        locality: '',
        city: '',
        state: '',
        country: 'India',
        seismicZone: 'Zone II',
        floodZone: false,
        numberOfFloors: '',
        carpetAreaSqFt: '',
        constructionMaterial: 'RCC',
        buildingAgeYears: '',
        fireSafetyEquipment: [],
        emergencyExits: '',
        lastFireDrill: '',
        cctvInstalled: false,
        accessControlSystem: false,
        insuranceProvider: '',
        insuranceExpiry: '',
        fireNOC: false,
        occupancyCertificate: false,
        lastSafetyAuditDate: '',
        dailyOccupancy: '',
        hazardousMaterialsPresent: false,
        criticalOperations: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFireSafetyChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            fireSafetyEquipment: checked
                ? [...prev.fireSafetyEquipment, value]
                : prev.fireSafetyEquipment.filter(item => item !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/site-risk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    inputMode: 'STRUCTURED',
                    structuredInput: {
                        siteIdentity: {
                            siteName: formData.siteName,
                            siteType: formData.siteType,
                            ownershipType: formData.ownershipType
                        },
                        locationDetails: {
                            locality: formData.locality,
                            city: formData.city,
                            state: formData.state,
                            country: formData.country,
                            seismicZone: formData.seismicZone,
                            floodZone: formData.floodZone
                        },
                        buildingDetails: {
                            numberOfFloors: parseInt(formData.numberOfFloors),
                            carpetAreaSqFt: parseInt(formData.carpetAreaSqFt),
                            constructionMaterial: formData.constructionMaterial,
                            buildingAgeYears: parseInt(formData.buildingAgeYears)
                        },
                        safetyInfrastructure: {
                            fireSafetyEquipment: formData.fireSafetyEquipment,
                            emergencyExits: parseInt(formData.emergencyExits),
                            lastFireDrill: formData.lastFireDrill,
                            cctvInstalled: formData.cctvInstalled,
                            accessControlSystem: formData.accessControlSystem
                        },
                        complianceAndInsurance: {
                            insuranceProvider: formData.insuranceProvider,
                            insuranceExpiry: formData.insuranceExpiry,
                            fireNOC: formData.fireNOC,
                            occupancyCertificate: formData.occupancyCertificate,
                            lastSafetyAuditDate: formData.lastSafetyAuditDate
                        },
                        operationalContext: {
                            dailyOccupancy: parseInt(formData.dailyOccupancy),
                            hazardousMaterialsPresent: formData.hazardousMaterialsPresent,
                            criticalOperations: formData.criticalOperations
                        }
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate risk assessment');
            }

            setResult(data.siteRisk);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (score) => {
        if (score >= 70) return 'text-red-600 bg-red-50';
        if (score >= 40) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
    };

    const getSeverityColor = (severity) => {
        if (severity >= 7) return 'bg-red-100 text-red-800';
        if (severity >= 4) return 'bg-orange-100 text-orange-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        Site Risk Assessment
                    </h1>
                    <p className="text-gray-600 mt-2">Comprehensive risk evaluation for your facility</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Site Identity
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                                    <input
                                        type="text"
                                        name="siteName"
                                        value={formData.siteName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Type</label>
                                        <select
                                            name="siteType"
                                            value={formData.siteType}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Office</option>
                                            <option>Warehouse</option>
                                            <option>Factory</option>
                                            <option>Retail</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ownership</label>
                                        <select
                                            name="ownershipType"
                                            value={formData.ownershipType}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Rented</option>
                                            <option>Owned</option>
                                            <option>Leased</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                Location Details
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                                        <input
                                            type="text"
                                            name="locality"
                                            value={formData.locality}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Seismic Zone</label>
                                        <select
                                            name="seismicZone"
                                            value={formData.seismicZone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Zone II</option>
                                            <option>Zone III</option>
                                            <option>Zone IV</option>
                                            <option>Zone V</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-7">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="floodZone"
                                                checked={formData.floodZone}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Flood Zone</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-purple-600" />
                                Building Details
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                                        <input
                                            type="number"
                                            name="numberOfFloors"
                                            value={formData.numberOfFloors}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                                        <input
                                            type="number"
                                            name="carpetAreaSqFt"
                                            value={formData.carpetAreaSqFt}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                        <select
                                            name="constructionMaterial"
                                            value={formData.constructionMaterial}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>RCC</option>
                                            <option>Steel</option>
                                            <option>Brick</option>
                                            <option>Wood</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                                        <input
                                            type="number"
                                            name="buildingAgeYears"
                                            value={formData.buildingAgeYears}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-600" />
                                Safety Infrastructure
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fire Safety Equipment</label>
                                    <div className="space-y-2">
                                        {['Fire Extinguishers', 'Sprinkler System', 'Smoke Detectors', 'Fire Alarms'].map(item => (
                                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={item}
                                                    checked={formData.fireSafetyEquipment.includes(item)}
                                                    onChange={handleFireSafetyChange}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Exits</label>
                                        <input
                                            type="number"
                                            name="emergencyExits"
                                            value={formData.emergencyExits}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Fire Drill</label>
                                        <input
                                            type="date"
                                            name="lastFireDrill"
                                            value={formData.lastFireDrill}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="cctvInstalled"
                                            checked={formData.cctvInstalled}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">CCTV Installed</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="accessControlSystem"
                                            checked={formData.accessControlSystem}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Access Control</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-indigo-600" />
                                Compliance & Insurance
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                                        <input
                                            type="text"
                                            name="insuranceProvider"
                                            value={formData.insuranceProvider}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
                                        <input
                                            type="date"
                                            name="insuranceExpiry"
                                            value={formData.insuranceExpiry}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Safety Audit</label>
                                    <input
                                        type="date"
                                        name="lastSafetyAuditDate"
                                        value={formData.lastSafetyAuditDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="fireNOC"
                                            checked={formData.fireNOC}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Fire NOC</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="occupancyCertificate"
                                            checked={formData.occupancyCertificate}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Occupancy Certificate</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-cyan-600" />
                                Operational Context
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Occupancy</label>
                                    <input
                                        type="number"
                                        name="dailyOccupancy"
                                        value={formData.dailyOccupancy}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="hazardousMaterialsPresent"
                                            checked={formData.hazardousMaterialsPresent}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Hazardous Materials</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="criticalOperations"
                                            checked={formData.criticalOperations}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Critical Operations</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Assessment...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Generate Risk Assessment
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Error</h3>
                                    <p className="text-red-700 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {result && (
                            <>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Assessment</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-medium">Overall Risk Score</span>
                                            <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${getRiskColor(result.overallRiskScore)}`}>
                                                {result.overallRiskScore}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-medium">Compliance Status</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${result.complianceStatus === 'Fully Compliant' ? 'bg-green-100 text-green-800' :
                                                    result.complianceStatus === 'Partially Compliant' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {result.complianceStatus}
                                            </span>
                                        </div>
                                        {result.generatedByAI && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                                <AlertCircle className="w-4 h-4 text-blue-600" />
                                                Generated by AI ({result.aiModelUsed})
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Identified Risks</h2>
                                    <div className="space-y-4">
                                        {result.risks.map((risk, index) => (
                                            <div key={risk._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-semibold text-gray-900">{risk.riskCategory}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(risk.severity)}`}>
                                                        Severity: {risk.severity}/10
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-sm mb-3">{risk.riskDescription}</p>
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <div className="bg-gray-50 p-2 rounded">
                                                        <span className="text-xs text-gray-600">Likelihood</span>
                                                        <div className="text-lg font-semibold text-gray-900">{risk.likelihood}/10</div>
                                                    </div>
                                                    <div className="bg-gray-50 p-2 rounded">
                                                        <span className="text-xs text-gray-600">Risk Score</span>
                                                        <div className={`text-lg font-semibold ${getRiskColor(risk.riskScore)}`}>
                                                            {risk.riskScore}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="text-xs font-semibold text-blue-900 block mb-1">Mitigation Recommendation</span>
                                                            <p className="text-sm text-blue-800">{risk.mitigationRecommendation}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {!result && !error && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessment Yet</h3>
                                <p className="text-gray-600">Fill out the form and click "Generate Risk Assessment" to see results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}