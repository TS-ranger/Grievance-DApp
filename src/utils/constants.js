export const CONTRACT_ADDRESS = "0xB67620B8e39ad853b73bbafFEFf34f617863043c";

// Contract status values (as stored on-chain)
export const STATUS = {
  SUBMITTED: "Submitted",
  IN_REVIEW: "InReview",
  RESOLVED: "Resolved",
};

// Display-friendly labels for statuses
export const STATUS_LABELS = {
  Submitted: "Pending",
  InReview: "Processing",
  Resolved: "Resolved",
};

export const CATEGORIES = [
  { value: "Academic", label: "Academic" },
  { value: "Hostel", label: "Hostel" },
  { value: "Fees", label: "Fees" },
];

export const METAMASK_DOWNLOAD_URL = "https://metamask.io/download/";
