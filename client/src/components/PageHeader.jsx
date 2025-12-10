export default function PageHeader({ title, description }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
    );
}
