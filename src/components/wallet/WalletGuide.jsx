import Modal from "../common/Modal";
import Button from "../common/Button";
import { METAMASK_DOWNLOAD_URL } from "../../utils/constants";
import { useWeb3 } from "../../context/Web3Context";

export default function WalletGuide({ isOpen, onClose }) {
  const { connectWallet, hasMetaMask } = useWeb3();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get Started with MetaMask">
      <p style={{ fontSize: "0.8rem", color: "var(--white-60)", marginBottom: "0.5rem", lineHeight: 1.6 }}>
        MetaMask is a free browser extension that lets you interact with the Ethereum blockchain. 
        Follow these simple steps to get started:
      </p>

      <div className="wallet-guide__steps">
        <div className="wallet-guide__step">
          <div className="wallet-guide__step-number">1</div>
          <div className="wallet-guide__step-content">
            <div className="wallet-guide__step-title">Install MetaMask</div>
            <div className="wallet-guide__step-desc">
              Download the MetaMask extension for your browser. It's free and takes less than a minute.
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <a
                href={METAMASK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline btn--sm"
              >
                Download MetaMask ↗
              </a>
            </div>
          </div>
        </div>

        <div className="wallet-guide__step">
          <div className="wallet-guide__step-number">2</div>
          <div className="wallet-guide__step-content">
            <div className="wallet-guide__step-title">Create Your Wallet</div>
            <div className="wallet-guide__step-desc">
              Open MetaMask and click "Create a Wallet". Set a password and safely store 
              your Secret Recovery Phrase — this is your backup key. Never share it with anyone.
            </div>
          </div>
        </div>

        <div className="wallet-guide__step">
          <div className="wallet-guide__step-number">3</div>
          <div className="wallet-guide__step-content">
            <div className="wallet-guide__step-title">Connect to This App</div>
            <div className="wallet-guide__step-desc">
              Once MetaMask is set up, refresh this page and click the "Connect Wallet" button. 
              MetaMask will ask you to approve the connection — click "Connect".
            </div>
          </div>
        </div>
      </div>

      {hasMetaMask ? (
        <Button variant="primary" fullWidth onClick={handleConnect}>
          Connect Now
        </Button>
      ) : (
        <Button
          variant="primary"
          fullWidth
          onClick={() => window.open(METAMASK_DOWNLOAD_URL, "_blank")}
        >
          Download MetaMask
        </Button>
      )}
    </Modal>
  );
}
