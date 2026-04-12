import { Navigate, Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import AdminDashboard from "../components/admin/AdminDashboard";
import Button from "../components/common/Button";

export default function AdminPage() {
  const { isConnected, isAdmin } = useWeb3();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied__icon">🔒</div>
        <h2 className="access-denied__title">Access Denied</h2>
        <p className="access-denied__desc">
          Only the contract administrator can access this panel. Please connect with the admin wallet address.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return <AdminDashboard />;
}
