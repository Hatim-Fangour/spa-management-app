export const initNote = {
  content: "",
  writer: "",
  priority: "medium",
  category: "",
};

  export const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return {
          backgroundColor: "rgb(254 226 226)", // bg-red-100
          color: "rgb(153 27 27)", // text-red-800
          border: "1px solid rgb(254 202 202)", // border-red-200
        };
      case "medium":
        return {
          backgroundColor: "rgb(254 249 195)", // bg-yellow-100
          color: "rgb(133 77 14)", // text-yellow-800
          border: "1px solid rgb(254 240 138)", // border-red-200
        };
      case "low":
        return {
          backgroundColor: "rgb(220 252 231)", // bg-green-100
          color: "rgb(22 101 52)", // text-green-800
          border: "1px solid rgb(187 247 208)", // border-red-200
        };
      default:
        return {
          backgroundColor: "rgb(243 244 246)", // bg-gray-100
          color: "rgb(31 41 55)", // text-gray-800
          borderColor: "rgb(229 231 235)", // border-gray-200
        };
    }
  };

  export const getCategoryColor = (category) => {
    const colors = {
      Review: {
        backgroundColor: "rgb(219 234 254)", // bg-blue-100
        color: "rgb(30 64 175)", // text-blue-800
        borderColor: "rgb(191 219 254)", // border-blue-200
      },
      Development: {
        backgroundColor: "rgb(237 233 254)", // bg-purple-100
        color: "rgb(107 33 168)", // text-purple-800
        borderColor: "rgb(221 214 254)", // border-purple-200
      },
      HR: {
        backgroundColor: "rgb(252 231 243)", // bg-pink-100
        color: "rgb(157 23 77)", // text-pink-800
        borderColor: "rgb(251 207 232)", // border-pink-200
      },
      Product: {
        backgroundColor: "rgb(224 231 255)", // bg-indigo-100
        color: "rgb(55 48 163)", // text-indigo-800
        borderColor: "rgb(199 210 254)", // border-indigo-200
      },
    };
    return (
      colors[category] || {
        backgroundColor: "rgb(243 244 246)", // bg-gray-100
        color: "rgb(31 41 55)", // text-gray-800
        borderColor: "rgb(229 231 235)", // border-gray-200
      }
    );
  };

  export const getStatusColor = (status) => {
    return status === "done" ? "success" : "default";
  };
