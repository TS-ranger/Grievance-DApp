import { useState, useCallback } from "react";
import { useWeb3 } from "../context/Web3Context";

export function useContract() {
  const { contract, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitGrievance = useCallback(
    async (description, category) => {
      if (!contract || !account) throw new Error("Wallet not connected");
      if (!description.trim()) throw new Error("Description is required");

      setLoading(true);
      setError(null);

      try {
        await contract.methods
          .submitGrievance(description, category)
          .send({ from: account });
        return true;
      } catch (err) {
        const message = err.message?.includes("User denied")
          ? "Transaction was cancelled"
          : "Failed to submit grievance";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [contract, account]
  );

  const loadGrievances = useCallback(async () => {
    if (!contract) return [];

    setLoading(true);
    setError(null);

    try {
      const count = await contract.methods.grievanceCount().call();
      const grievances = [];

      for (let i = 1; i <= Number(count); i++) {
        const g = await contract.methods.getGrievance(i).call();
        grievances.push({
          id: Number(g[0]),
          student: g[1],
          description: g[2],
          category: g[3],
          status: g[4],
          timestamp: Number(g[5]),
        });
      }

      return grievances;
    } catch (err) {
      setError("Failed to load grievances");
      return [];
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const loadUserGrievances = useCallback(
    async (userAccount) => {
      const all = await loadGrievances();
      return all.filter(
        (g) => g.student.toLowerCase() === userAccount.toLowerCase()
      );
    },
    [loadGrievances]
  );

  const updateStatus = useCallback(
    async (id, status) => {
      if (!contract || !account) throw new Error("Wallet not connected");

      setLoading(true);
      setError(null);

      try {
        await contract.methods
          .updateStatus(id, status)
          .send({ from: account });
        return true;
      } catch (err) {
        const message = err.message?.includes("User denied")
          ? "Transaction was cancelled"
          : "Failed to update status";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [contract, account]
  );

  const getGrievanceCount = useCallback(async () => {
    if (!contract) return 0;
    try {
      const count = await contract.methods.grievanceCount().call();
      return Number(count);
    } catch {
      return 0;
    }
  }, [contract]);

  return {
    submitGrievance,
    loadGrievances,
    loadUserGrievances,
    updateStatus,
    getGrievanceCount,
    loading,
    error,
  };
}
