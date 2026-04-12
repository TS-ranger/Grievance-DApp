import StatusBadge from "../common/StatusBadge";

export default function GrievanceCard({ grievance }) {
  const { id, description, category, status, timestamp } = grievance;

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = new Date(ts * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grievance-card animate-in">
      <div className="grievance-card__header">
        <span className="grievance-card__id">#{String(id).padStart(3, "0")}</span>
        <StatusBadge status={status} />
      </div>

      <p className="grievance-card__description">{description}</p>

      <div className="grievance-card__meta">
        <span className="grievance-card__category">{category}</span>
        {timestamp > 0 && (
          <span className="grievance-card__time">{formatDate(timestamp)}</span>
        )}
      </div>
    </div>
  );
}
