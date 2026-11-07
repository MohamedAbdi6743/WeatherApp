import toast from "react-hot-toast";

// One place for toast styling decisions.
const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
};

export const toasterOptions = {
  duration: 5000,
  style: {
    background: "#18181B",
    color: "#FFFFFF",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
    maxWidth: "420px",
  },
  success: { iconTheme: { primary: "#4ADE80", secondary: "#18181B" } },
  error: { iconTheme: { primary: "#F87171", secondary: "#18181B" } },
};

export default notify;
