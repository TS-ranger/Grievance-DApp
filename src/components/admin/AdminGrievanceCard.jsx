import { useState } from "react";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";
import { STATUS } from "../../utils/constants";

export default function AdminGrievanceCard({ grievance, onUpdateStatus }) {
  const { id, student, description, category, status, timestamp } = grievance;
  const [updating, setUpdating] = useState(false);

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

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const handleUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdating(false);
    }
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
        <span className="grievance-card__student" title={student}>
          From: {truncateAddress(student)}
        </span>
        {timestamp > 0 && (
          <span className="grievance-card__time">{formatDate(timestamp)}</span>
        )}
      </div>

      {status !== STATUS.RESOLVED && (
        <div className="grievance-card__actions">
          {status === STATUS.SUBMITTED && (
            <Button
              variant="outline"
              size="sm"
              loading={updating}
              disabled={updating}
              onClick={() => handleUpdate(STATUS.IN_REVIEW)}
            >
              Set Processing
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            loading={updating}
            disabled={updating}
            onClick={() => handleUpdate(STATUS.RESOLVED)}
          >
            Mark Resolved
          </Button>
        </div>
      )}
    </div>
  );
}
