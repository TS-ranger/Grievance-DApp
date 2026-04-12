import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { contractABI } from "../utils/abi";
import { CONTRACT_ADDRESS } from "../utils/constants";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [error, setError] = useState(null);

  // Detect MetaMask on mount
  useEffect(() => {
    setHasMetaMask(!!window.ethereum);
  }, []);

  // Check if the connected account is admin
  const checkAdmin = useCallback(
    async (contractInstance, userAccount) => {
      try {
        const adminAddress = await contractInstance.methods.admin().call();
        setIsAdmin(
          adminAddress.toLowerCase() === userAccount.toLowerCase()
        );
      } catch (err) {
        console.error("Failed to check admin status:", err);
        setIsAdmin(false);
      }
    },
    []
  );

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const web3Instance = new window.Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3Instance.eth.getAccounts();
      const userAccount = accounts[0];
      const contractInstance = new web3Instance.eth.Contract(
        contractABI,
        CONTRACT_ADDRESS
      );

      setWeb3(web3Instance);
      setContract(contractInstance);
      setAccount(userAccount);
      setIsConnected(true);

      await checkAdmin(contractInstance, userAccount);
      return true;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError(err.message || "Failed to connect wallet");
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [checkAdmin]);

  // Disconnect wallet (UI-level only)
  const disconnectWallet = useCallback(() => {
    setWeb3(null);
    setContract(null);
    setAccount(null);
    setIsAdmin(false);
    setIsConnected(false);
    setError(null);
  }, []);

  // Listen for account / chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        if (contract) {
          checkAdmin(contract, accounts[0]);
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account, contract, checkAdmin, disconnectWallet]);

  const value = {
    web3,
    contract,
    account,
    isAdmin,
    isConnected,
    isConnecting,
    hasMetaMask,
    error,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
