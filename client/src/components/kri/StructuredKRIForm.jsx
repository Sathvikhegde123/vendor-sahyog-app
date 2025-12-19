import { useState } from "react";
import { generateKRI } from "../../services/kriService";

export default function StructuredKRIForm({ onResult }) {
    const [form, setForm] = useState({
        businessOverview: {
            industry: "",
            productsOrServices: "",
            businessModel: "",
            annualRevenueRange: "",
            employeeCountRange: "",
        },
        operationalContext: {
            coreProcesses: "",
            keyDependencies: "",
            geographicPresence: "",
            outsourcingLevel: "",
        },
        technologyContext: {
            techStack: "",
            customerData: false,
            financialData: false,
            personalData: false,
            systemAvailabilityCriticality: "",
        },
        complianceContext: {
            regulationsApplicable: "",
            auditsFrequency: "",
            pastComplianceIssues: false,
        },
        strategicContext: {
            growthPlans: "",
            marketCompetitionLevel: "",
            relianceOnKeyClients: "",
        },
    });

    const update = (section, key, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const submit = async () => {
        const payload = {
            inputMode: "STRUCTURED",
            structuredInput: {
                businessOverview: {
                    industry: form.businessOverview.industry,
                    productsOrServices: form.businessOverview.productsOrServices.split(","),
                    businessModel: form.businessOverview.businessModel,
                    annualRevenueRange: form.businessOverview.annualRevenueRange,
                    employeeCountRange: form.businessOverview.employeeCountRange,
                },
                operationalContext: {
                    coreProcesses: form.operationalContext.coreProcesses.split(","),
                    keyDependencies: form.operationalContext.keyDependencies.split(","),
                    geographicPresence: form.operationalContext.geographicPresence.split(","),
                    outsourcingLevel: form.operationalContext.outsourcingLevel,
                },
                technologyContext: {
                    techStack: form.technologyContext.techStack.split(","),
                    dataSensitivity: {
                        customerData: form.technologyContext.customerData,
                        financialData: form.technologyContext.financialData,
                        personalData: form.technologyContext.personalData,
                    },
                    systemAvailabilityCriticality:
                        form.technologyContext.systemAvailabilityCriticality,
                },
                complianceContext: {
                    regulationsApplicable:
                        form.complianceContext.regulationsApplicable.split(","),
                    auditsFrequency: form.complianceContext.auditsFrequency,
                    pastComplianceIssues: form.complianceContext.pastComplianceIssues,
                },
                strategicContext: {
                    growthPlans: form.strategicContext.growthPlans,
                    marketCompetitionLevel: form.strategicContext.marketCompetitionLevel,
                    relianceOnKeyClients: form.strategicContext.relianceOnKeyClients,
                },
            },
        };

        const res = await generateKRI(payload);
        onResult(res);
    };

    return (
        <div className="space-y-10 max-w-6xl mx-auto">

            <Section title="Business Overview" description="High-level business identity and scale">
                <Input label="Industry" onChange={(v) => update("businessOverview", "industry", v)} />
                <Input label="Products / Services" hint="Comma separated" onChange={(v) => update("businessOverview", "productsOrServices", v)} />
                <Input label="Business Model" onChange={(v) => update("businessOverview", "businessModel", v)} />
                <Input label="Annual Revenue Range" onChange={(v) => update("businessOverview", "annualRevenueRange", v)} />
                <Input label="Employee Count Range" onChange={(v) => update("businessOverview", "employeeCountRange", v)} />
            </Section>

            <Section title="Operational Context" description="How your organization operates day-to-day">
                <Input label="Core Processes" hint="Comma separated" onChange={(v) => update("operationalContext", "coreProcesses", v)} />
                <Input label="Key Dependencies" hint="Cloud providers, vendors, platforms" onChange={(v) => update("operationalContext", "keyDependencies", v)} />
                <Input label="Geographic Presence" hint="Countries / regions" onChange={(v) => update("operationalContext", "geographicPresence", v)} />
                <Select label="Outsourcing Level" options={["Low", "Medium", "High"]} onChange={(v) => update("operationalContext", "outsourcingLevel", v)} />
            </Section>

            <Section title="Technology Context" description="Technology stack and data sensitivity">
                <Input label="Technology Stack" hint="Comma separated" onChange={(v) => update("technologyContext", "techStack", v)} />
                <div className="col-span-2 flex gap-6 pt-2">
                    <Checkbox label="Customer Data" onChange={(v) => update("technologyContext", "customerData", v)} />
                    <Checkbox label="Financial Data" onChange={(v) => update("technologyContext", "financialData", v)} />
                    <Checkbox label="Personal Data" onChange={(v) => update("technologyContext", "personalData", v)} />
                </div>
                <Select
                    label="System Availability Criticality"
                    options={["Low", "Medium", "High"]}
                    onChange={(v) =>
                        update("technologyContext", "systemAvailabilityCriticality", v)
                    }
                />
            </Section>

            <Section title="Compliance Context" description="Regulatory exposure and audit posture">
                <Input label="Applicable Regulations" hint="Comma separated" onChange={(v) => update("complianceContext", "regulationsApplicable", v)} />
                <Select label="Audit Frequency" options={["Quarterly", "Half-Yearly", "Yearly"]} onChange={(v) => update("complianceContext", "auditsFrequency", v)} />
                <Checkbox label="Past Compliance Issues" onChange={(v) => update("complianceContext", "pastComplianceIssues", v)} />
            </Section>

            <Section title="Strategic Context" description="Growth and competitive positioning">
                <Input label="Growth Plans" onChange={(v) => update("strategicContext", "growthPlans", v)} />
                <Select label="Market Competition Level" options={["Low", "Medium", "High"]} onChange={(v) => update("strategicContext", "marketCompetitionLevel", v)} />
                <Select label="Reliance on Key Clients" options={["Low", "Medium", "High"]} onChange={(v) => update("strategicContext", "relianceOnKeyClients", v)} />
            </Section>

            <div className="pt-6">
                <button
                    onClick={submit}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition"
                >
                    Generate Key Risk Indicators
                </button>
            </div>
        </div>
    );
}

/* ---------------- UI Components ---------------- */

const Section = ({ title, description, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
);

const Input = ({ label, hint, onChange }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
        <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const Select = ({ label, options, onChange }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select</option>
            {options.map((o) => (
                <option key={o}>{o}</option>
            ))}
        </select>
    </div>
);

const Checkbox = ({ label, onChange }) => (
    <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onChange={(e) => onChange(e.target.checked)}
        />
        {label}
    </label>
);
