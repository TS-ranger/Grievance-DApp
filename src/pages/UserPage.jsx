import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import UserDashboard from "../components/user/UserDashboard";
import SubmitForm from "../components/user/SubmitForm";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";

export default function UserPage() {
  const { isConnected } = useWeb3();
  const location = useLocation();
  const [view, setView] = useState(
    location.pathname === "/submit" ? "submit" : "dashboard"
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setView(location.pathname === "/submit" ? "submit" : "dashboard");
  }, [location.pathname]);

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  const handleSubmitSuccess = () => {
    setToast({ message: "Grievance submitted successfully!", type: "success" });
    setView("dashboard");
  };

  return (
    <div>
      <div className="dashboard__actions">
        <Button
          variant={view === "dashboard" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("dashboard")}
        >
          Dashboard
        </Button>
        <Button
          variant={view === "submit" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("submit")}
        >
          Submit Grievance
        </Button>
      </div>

      {view === "dashboard" && <UserDashboard />}
      {view === "submit" && <SubmitForm onSuccess={handleSubmitSuccess} />}

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
