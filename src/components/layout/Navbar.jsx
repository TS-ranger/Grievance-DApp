import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "../../context/Web3Context";
import Button from "../common/Button";
import WalletGuide from "../wallet/WalletGuide";

export default function Navbar() {
  const { isConnected, isAdmin, account, hasMetaMask, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleConnect = async () => {
    if (!hasMetaMask) {
      setShowGuide(true);
      return;
    }
    await connectWallet();
  };

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            
            GRIEVANCE DAPP
          </Link>

          {isConnected && (
            <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
              <Link
                to="/dashboard"
                className={`navbar__link ${isActive("/dashboard") ? "navbar__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/submit"
                className={`navbar__link ${isActive("/submit") ? "navbar__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Submit
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`navbar__link ${isActive("/admin") ? "navbar__link--active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  🛡 Admin
                </Link>
              )}
            </div>
          )}

          <div className="navbar__wallet">
            {isConnected ? (
              <>
                <span className="navbar__address">{truncateAddress(account)}</span>
                <Button variant="secondary" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                loading={isConnecting}
                onClick={handleConnect}
              >
                Connect Wallet
              </Button>
            )}

            {isConnected && (
              <button
                className="navbar__hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>
      </nav>

      <WalletGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
}
