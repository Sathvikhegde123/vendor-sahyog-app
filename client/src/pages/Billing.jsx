import PageHeader from "../components/PageHeader";

export default function Billing() {
  return (
    <>
      <PageHeader
        title="Billing & Anomalies"
        description="Track transactions and detect billing irregularities."
      />
      <div className="bg-white p-4 rounded shadow">
        Billing logs and anomaly detection.
      </div>
    </>
  );
}
