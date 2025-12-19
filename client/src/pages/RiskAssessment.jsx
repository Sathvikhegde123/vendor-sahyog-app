import PageHeader from "../components/PageHeader";
import { useState } from "react";
import InputModeToggle from "../components/kri/InputModeToggle";
import StructuredKRIForm from "../components/kri/StructuredKRIForm";
import TextKRIForm from "../components/kri/TextKRIForm";
import KRIResultViewer from "../components/kri/KRIResultViewer";


export default function RiskAssessment() {
    const [mode, setMode] = useState("STRUCTURED");
    const [result, setResult] = useState(null);

    return (
        <>
            <PageHeader
                title="Key Risk Indicators"
                description="Monitor KRIs, thresholds, alerts, and trends."
            />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Key Risk Indicators</h1>

                <InputModeToggle mode={mode} setMode={setMode} />

                {mode === "STRUCTURED" ? (
                    <StructuredKRIForm onResult={setResult} />
                ) : (
                    <TextKRIForm onResult={setResult} />
                )}

                {result && <KRIResultViewer data={result} />}
            </div>
        </>
    );
}
