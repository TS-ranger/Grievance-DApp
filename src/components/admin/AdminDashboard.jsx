import { useState, useEffect, useCallback } from "react";
import { useContract } from "../../hooks/useContract";
import AdminGrievanceCard from "./AdminGrievanceCard";
import DashboardCharts from "../common/DashboardCharts";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

export default function AdminDashboard() {
  const { loadGrievances, updateStatus } = useContract();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await loadGrievances();
    setGrievances(data);
    setLoading(false);
  }, [loadGrievances]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
      const statusLabel = status === "InReview" ? "Processing" : status === "Submitted" ? "Pending" : "Resolved";
      setToast({ message: `Grievance #${id} updated to ${statusLabel}`, type: "success" });
      await fetchData();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const stats = {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === "Submitted").length,
    processing: grievances.filter((g) => g.status === "InReview").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
  };

  const filtered =
    filter === "all"
      ? grievances
      : filter === "pending"
        ? grievances.filter((g) => g.status === "Submitted")
        : filter === "processing"
          ? grievances.filter((g) => g.status === "InReview")
          : grievances.filter((g) => g.status === "Resolved");

  const filters = [
    { key: "all", label: "All", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "processing", label: "Processing", count: stats.processing },
    { key: "resolved", label: "Resolved", count: stats.resolved },
  ];

  return (
    <div>
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header__left">
          <div className="admin-header__badge">🛡 Admin Panel</div>
          <h1 className="dashboard__title">Manage Grievances</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--total">
          <span className="stat-card__label">Total Issues</span>
          <span className="stat-card__value">{stats.total}</span>
        </div>
        <div className="stat-card stat-card--pending">
          <span className="stat-card__label">Pending</span>
          <span className="stat-card__value">{stats.pending}</span>
        </div>
        <div className="stat-card stat-card--processing">
          <span className="stat-card__label">Processing</span>
          <span className="stat-card__value">{stats.processing}</span>
        </div>
        <div className="stat-card stat-card--resolved">
          <span className="stat-card__label">Resolved</span>
          <span className="stat-card__value">{stats.resolved}</span>
        </div>
      </div>

      {/* Charts */}
      {!loading && grievances.length > 0 && (
        <DashboardCharts stats={stats} />
      )}

      {/* Filters */}
      <div className="admin__filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`admin__filter-btn ${filter === f.key ? "admin__filter-btn--active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="admin__filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Grievance List */}
      <div className="grievance-list">
        {loading ? (
          <Loader text="Loading all grievances..." />
        ) : filtered.length === 0 ? (
          <div className="grievance-list__empty">
            <div className="grievance-list__empty-icon">📭</div>
            <p>No grievances found for this filter.</p>
          </div>
        ) : (
          filtered.map((g) => (
            <AdminGrievanceCard
              key={g.id}
              grievance={g}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
