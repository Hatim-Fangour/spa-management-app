import toast from "react-hot-toast";

export const notifyError = () =>
  toast.error("Please, fill all required fieled !", {
    style: {
      background: "rgba(230, 230, 230, 0.801)",
      // color: "#fff",
      backdropFilter: "blur(16px)",
    },
  });

export const notifySuccess = (modal, action) =>
  toast.success(`${modal} ${action} successfully !`, {
    style: {
      background: "rgba(230, 230, 230, 0.801)",
      // color: "#fff",
      backdropFilter: "blur(16px)",
    },
  });
