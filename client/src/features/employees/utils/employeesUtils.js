import { Chip } from "@mui/material";

  export const getStatusBadge = (status) => {
    const statusColors = {
      Active: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
      "Part-time": "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      "On Leave": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };
    return (
      <Chip
        className={
          statusColors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
        label={status}
      ></Chip>
    );
  };

  export const getRoleBadge = (role) => {
    const colors = {
      Admin: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      "New-Employee": "bg-rose-100 text-rose-800 hover:bg-rose-100",
      "Licensed Esthetician": "bg-pink-100 text-pink-800 hover:bg-pink-100",
      "Spa Receptionist": "bg-teal-100 text-teal-800 hover:bg-teal-100",
      "Spa Attendant": "bg-slate-100 text-slate-800 hover:bg-slate-100",
      "Nail Technician": "bg-orange-100 text-orange-800 hover:bg-orange-100",
      "Body Treatment Specialist":
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    };
    return (
      <Chip
        className={
          colors[role] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
        label={role}
      ></Chip>
    );
  };


  export const spaRoles = [
    { id: 705, label: "Admin" },
    { id: 493, label: "Manager" },
    { id: 159, label: "Therapist" },
    { id: 111, label: "New-Employee" },
  ];
  
  export const spaEmployeesStatus = [
    { id: 1, label: "Active" },
    { id: 111, label: "Inactive" },
  ];
  
  export const spaDepartments = [
    "Management",
    "Massage Therapy",
    "Facial Treatments",
    "Body Treatments",
    "Front Desk",
    "Support Services",
    "Nail Services",
  ];
  
  export const getRoleTitle = (roleId) => {
    const roles = {
      705: "Admin",
      493: "Manager",
      159: "Therapist",
      111: "New-Employee",
    };
  
    return roles[roleId] || "New-Employee"; // Default fallback
  };
  
  export const getStatusTitle = (statusId) => {
    return statusId === 111 ? "Inactive" : "Active";
  }

  export const getRoleLabelById = (id) => {
  const role = spaRoles.find(role => role.id === id);
  return role ? role.label : 'Unknown'; // Default if not found
};