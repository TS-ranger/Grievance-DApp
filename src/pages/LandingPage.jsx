import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import Button from "../components/common/Button";
import WalletGuide from "../components/wallet/WalletGuide";

export default function LandingPage() {
  const { isConnected, isConnecting, hasMetaMask, connectWallet } = useWeb3();
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (!hasMetaMask) {
      setShowGuide(true);
      return;
    }
    const success = await connectWallet();
    if (success) {
      navigate("/dashboard");
    }
  };

  // If already connected, redirect
  if (isConnected) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing">
      <div className="landing__badge"> A Blockchain Powered</div>

      <h1 className="landing__title">University Grievance System</h1>

      <p className="landing__subtitle">
        A transparent and tamper-proof grievance redressal platform built on 
        Ethereum. Submit, track, and resolve grievances with complete accountability.
      </p>

      <div className="landing__actions">
        <Button
          variant="primary"
          size="lg"
          loading={isConnecting}
          onClick={handleConnect}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
        </Button>
        <Button variant="secondary" size="lg" onClick={() => setShowGuide(true)}>
          How It Works
        </Button>
      </div>

      <div className="landing__features">
        <div className="landing__feature">
          <div className="landing__feature-icon"></div>
          <h3 className="landing__feature-title">Submit</h3>
          <p className="landing__feature-desc">
            File your grievance with a description and category. It's recorded permanently on the blockchain.
          </p>
        </div>

        <div className="landing__feature">
          <div className="landing__feature-icon"></div>
          <h3 className="landing__feature-title">Track</h3>
          <p className="landing__feature-desc">
            Monitor the status of your grievance in real-time. Every update is transparent and verifiable.
          </p>
        </div>

        <div className="landing__feature">
          <div className="landing__feature-icon"></div>
          <h3 className="landing__feature-title">Resolve</h3>
          <p className="landing__feature-desc">
            Administrators review and resolve grievances. The entire process is auditable on-chain.
          </p>
        </div>
      </div>

      <WalletGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
