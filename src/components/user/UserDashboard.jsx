import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "../../context/Web3Context";
import { useContract } from "../../hooks/useContract";
import GrievanceCard from "./GrievanceCard";
import DashboardCharts from "../common/DashboardCharts";
import Loader from "../common/Loader";

export default function UserDashboard() {
  const { account } = useWeb3();
  const { loadUserGrievances } = useContract();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await loadUserGrievances(account);
    setGrievances(data);
    setLoading(false);
  }, [account, loadUserGrievances]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === "Submitted").length,
    processing: grievances.filter((g) => g.status === "InReview").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
  };

  return (
    <div>
      <div className="dashboard__header">
        <p className="dashboard__welcome">Welcome back</p>
        <h1 className="dashboard__title">Your Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--total">
          <span className="stat-card__label">Total Submitted</span>
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
          <span className="stat-card__label">Resolve</span>
          <span className="stat-card__value">{stats.resolved}</span>
        </div>
      </div>

      {/* Charts */}
      {!loading && grievances.length > 0 && (
        <DashboardCharts stats={stats} />
      )}

      {/* Grievance List */}
      <div className="grievance-list">
        <div className="grievance-list__header">
          <h3 className="grievance-list__title">Your Grievances</h3>
        </div>

        {loading ? (
          <Loader text="Loading your grievances..." />
        ) : grievances.length === 0 ? (
          <div className="grievance-list__empty">
            <div className="grievance-list__empty-icon"></div>
            <p>You haven't submitted any grievances yet.</p>
          </div>
        ) : (
          grievances.map((g) => <GrievanceCard key={g.id} grievance={g} />)
        )}
      </div>
    </div>
  );
}
