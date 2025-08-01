import dayjs from "dayjs";

export const ExpenseCategoryMenuItems = [
  { value: 1, text: "Rent" },
  { value: 2, text: "Utilities (Electricity, Water, Internet)" },
  { value: 3, text: "Supplies (e.g., towels, skincare products)" },
  { value: 4, text: "Employee Salaries" },
  { value: 5, text: "Marketing and Advertising" },
  { value: 6, text: "Maintenance and Repairs" },
  { value: 7, text: "Equipment Purchases or Rentals" },
  { value: 8, text: "Miscellaneous" },
];

export const IncomeCategoryMenuItems = [
  { value: 1, text: "Services (e.g., massages, facials)" },
  { value: 2, text: "Retail Products (e.g., skincare products sold)" },
  { value: 3, text: "Memberships (e.g., monthly subscription)" },
  { value: 4, text: "Special Events (e.g., spa packages, promotions)" },
  { value: 5, text: "Gift Cards" },
  { value: 6, text: "Tips" },
];

export const IncomeEmployeeInvolvedItems = [
  { value: 1, text: "Admin" },
  { value: 2, text: "Christian Ramlal" },
  { value: 3, text: "IYONA" },
  { value: 4, text: "Brenda" },
  { value: 5, text: "Siena saba" },
  { value: 6, text: "Ruchelle" },
  { value: 7, text: "Murielle Elsa Abla Zinhoue Zinsou" },
  { value: 8, text: "Lishon" },
];

export const nurses = [
  { value: 1, fullName: "Lishon" },
  { value: 2, fullName: "Christian Ramlal" },
  { value: 3, fullName: "IYONA" },
  { value: 4, fullName: "Brenda" },
  { value: 5, fullName: "Siena saba" },
  { value: 6, fullName: "Ruchelle" },
  { value: 7, fullName: "Murielle Elsa Abla Zinhoue Zinsou" },
];
export const rooms = ["A", "B", "C", "D", "E"];

export const timeOffReasons = [
  "Vacation/Leisure",
  "Family Events",
  "Personal Errands",
  "Medical Appointments",
  "Sick Leave",
  "Mental Health Day",
  "Childcare",
  "Elderly/Dependent Care",
  "Bereavement Leave",
  "Professional Development",
  "Workplace Stress",
];

export const PayementMethodMenuItems = [
  { value: 1, text: "Cash" },
  { value: 2, text: "Credit Card" },
  { value: 3, text: "Bank Transfer" },
  { value: 4, text: "Check" },
];

export const DepositMethodMenuItems = [
  { value: 1, text: "Cash" },
  { value: 2, text: "Credit Card" },
  { value: 3, text: "Bank Transfer" },
  { value: 4, text: "Check" },
];

export const SavingCategoryMenuItems = [
  { value: 1, text: "Emergency Fund" },
  { value: 2, text: "Equipment Fund" },
  { value: 3, text: "Staff Bonus Fund" },
  { value: 4, text: "Expansion Fund" },
];

export const StatusMenuItems = [
  { value: 1, text: "Paid" },
  { value: 2, text: "Pending" },
  { value: 3, text: "Partially Paid" },
];

export const SavingStatusMenuItems = [
  { value: 1, text: "Deposited" },
  { value: 2, text: "Pending" },
];

export const RecurringMenuItems = [
  { value: "0", text: "No" },
  { value: "1", text: "Yes" },
];

export const DepServMenuItems = [
  { value: 1, text: "Massage Therap" },
  { value: 2, text: "Facial and Skin Care" },
  { value: 3, text: "Hair Salon" },
  { value: 4, text: "Nail Care" },
  { value: 5, text: "Body Treatments" },
  { value: 6, text: "Hydrotherapy" },
  { value: 7, text: "Fitness and Wellness" },
  { value: 8, text: "Medical Spa (Medi-Spa)" },
  { value: 9, text: "Ayurvedic and Holistic Wellness" },
  { value: 10, text: "Couples and Group Therapy" },
  { value: 11, text: "Child and Teen Spa" },
  { value: 12, text: "Retail and Boutique" },
  { value: 13, text: "VIP or Private Lounge" },
  { value: 14, text: "Cafeteria or Wellness Café" },
  { value: 15, text: "Reception and Customer Service" },
  { value: 16, text: "Pool and Aquatic Therapy" },
  { value: 17, text: "Spa Management and Administration" },
  { value: 18, text: "Special Programs and Events" },
];

export const initExpense = {
  date: dayjs(),
  amount: "",
  description: "",
  category: "",
  payMethode: "",
  depServ: "",
  status: "",
  notes: "",
  recurring: "0",
  responsiblePerson: "",
  vendorSupplier: "",
};

export const initIncome = {
  date: dayjs(),
  amount: "",
  category: "",
  description: "",
  payMethode: "",
  clientName: "",
  employeeInvolved: "",
  status: "",
  notes: "",
};

export const initSaving = {
  date: dayjs(),
  amount: "",
  category: "",
  description: "",
  depoMethode: "",
  respoPerson: "",
  status: "",
  notes: "",
};

export const initCustomer = {
  address: "",
  country: {},
  state: {},
  city: {},
  services: [],
  appointments: [],
  notes: [],
  companyName: "",
  email: "",
  fullName: "",
  phone: "",
};
export const serviceColors = [
  "#fc4c4c",
  "#f57f31",
  "#ffb41f",
  "#8949b1",
  "#126ab8",
  "#5d4037",
  "#9c9c9c",
  "#068f86",
  "#27912b",
  "#76ff03"
];

const handleView = (id) => {
  alert(`Viewing row with ID: ${id}`);
};

const handleEdit = (id) => {
  alert(`Editing row with ID: ${id}`);
};

const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this row ? ")) {
    console.log(`Row ${id} is Deleted !`);
  }
};

export const initInputs = [
  {
    id: 1,
    label: "Full Name",
    name: "fullName",
    type: "text",

    errorMessage:
      "Username should be 3-16 characters and shouldn't include any special character!",
    pattern: "^[A-Za-z0-9 ]{3,16}$",
    required: true,
    error: false,
    touched: false,
  },
  {
    id: 2,
    label: "Email",
    name: "email",
    type: "email",
    // pattern:  "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    errorMessage: "Invalid email format!",
    required: true,
    error: false,
    touched: false,
  },
  {
    id: 3,
    label: "Password",
    name: "password",
    type: "password",
    pattern:
      "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
    errorMessage:
      "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
    required: true,
    error: false,
    touched: false,
  },
  {
    id: 4,
    label: "Confirm password",
    name: "confirmPassword",
    type: "password",
    errorMessage: "Passwords don't match!",
    pattern:
      "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
    required: true,
    error: false,
    touched: false,
  },
];

export const initialCredentials = {
  email: "@gmail.com",
  password: "123qaz@@",
};

export const accessRights = [
  { value: 392, text: "Editing" },
  { value: 251, text: "Consulting" },
];

export const roles = [
  { value: 114, role: "Admin", accessRight: 392 },
  { value: 315, role: "Manager", accessRight: 251 },
  { value: 215, role: "Nurse", accessRight: 251 },
];

export const roleRoutes = {
  114: "/", // Admin
  315: "/customers", // Manager
  215: "/calendar", // Nurse
  default: "/unauthorized",
};

export const initialEmployee = {
    details: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: 1,
    },
    // access : [],
    certifications: {},
  }

