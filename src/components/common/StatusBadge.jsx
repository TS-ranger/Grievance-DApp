import { STATUS_LABELS } from "../../utils/constants";

export default function StatusBadge({ status }) {
  // Map contract status to CSS class
  const classMap = {
    Submitted: "pending",
    InReview: "processing",
    Resolved: "resolved",
  };

  const key = classMap[status] || "pending";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`status-badge status-badge--${key}`}>
      {label}
    </span>
  );
}
