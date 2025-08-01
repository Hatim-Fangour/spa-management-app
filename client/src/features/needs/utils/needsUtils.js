import {
  CleaningServices,
  FitnessCenter,
  Hotel,
  LocalFlorist,
  Restaurant,
  ShoppingCart,
  Spa,
} from "@mui/icons-material";

export const categories = [
  {
    value: "skincare",
    label: "Skincare & Beauty",
    icon: <Spa />,
    color: "#e8f5e8",
  },
  {
    value: "massage",
    label: "Massage Products",
    icon: <LocalFlorist />,
    color: "#f3e5f5",
  },
  {
    value: "linens",
    label: "Towels & Linens",
    icon: <Hotel />,
    color: "#e3f2fd",
  },
  {
    value: "equipment",
    label: "Equipment",
    icon: <FitnessCenter />,
    color: "#fff3e0",
  },
  {
    value: "aromatherapy",
    label: "Aromatherapy",
    icon: <LocalFlorist />,
    color: "#f1f8e9",
  },
  {
    value: "cleaning",
    label: "Cleaning Supplies",
    icon: <CleaningServices />,
    color: "#fce4ec",
  },
  {
    value: "reception",
    label: "Reception",
    icon: <ShoppingCart />,
    color: "#e8eaf6",
  },
  {
    value: "refreshments",
    label: "Refreshments",
    icon: <Restaurant />,
    color: "#e0f2f1",
  },
];

export const getCategoryInfo = (category) => {
  return categories.find((cat) => cat.value === category) || categories[0];
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent":
      return "error";
    case "normal":
      return "warning";
    case "low":
      return "success";
    default:
      return "warning";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "needed":
      return "error";
    case "ordered":
      return "warning";
    case "received":
      return "success";
    default:
      return "warning";
  }
};

export const initNeed = {
    name: "",
    category: "skincare",
    description: "",
    quantity: 1,
    unit: "",
    priority: "normal",
    estimatedCost: 0,
    supplier: "",
    dueDate: "",
  }
