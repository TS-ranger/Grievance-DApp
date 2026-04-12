import { useWeb3 } from "../../context/Web3Context";
import Button from "../common/Button";

export default function WalletConnect({ onNeedGuide }) {
  const { isConnected, isConnecting, account, hasMetaMask, connectWallet } = useWeb3();

  const handleClick = async () => {
    if (!hasMetaMask) {
      onNeedGuide?.();
      return;
    }
    await connectWallet();
  };

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  if (isConnected) {
    return (
      <div className="navbar__address">
        {truncateAddress(account)}
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size="lg"
      loading={isConnecting}
      onClick={handleClick}
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
