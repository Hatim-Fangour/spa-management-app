import { MdNote, MdPayment } from "react-icons/md";
import { FaMoneyBill, FaRegSmileBeam } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { TbMassage } from "react-icons/tb";
import { FaCalendarDays } from "react-icons/fa6";

import { Avatar } from "@mui/material";
import { Signature, TestTube, User } from "lucide-react";

export const UserAvatar = ({ name, imgSrc, className, textStyle }) => {
  // Function to get the first letter of the name
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <Avatar
      alt={name}
      src={imgSrc}
      sx={textStyle}
      // className="h-full w-full cursor-pointer box-border"
      className={className}
    >
      {!imgSrc && getInitials(name)} {/* Show first letter if no image */}
    </Avatar>
  );
};

export const menuItems = [
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    url: "/dashboard",
    roles: [705, 493], // Admin, Manager
  },
  {
    title: "Calendar",
    icon: <FaCalendarDays />,
    url: "/calendar",
    roles: [705, 493, 159], // Admin, Manager and therapist
  },
  {
    title: "Package Information",
    icon: <TbMassage />,
    url: "/packages",
    roles: [705, 493], // Admin, Manager
  },
  {
    title: "Customers",
    icon: <FaRegSmileBeam />,
    url: "/customers",
    roles: [705, 493, 159], // Admin, Manager
  },
  {
    title: "Needs",
    icon: <MdPayment />,
    url: "/needs",
    roles: [705, 493, 159], // Admin, Manager
  },
  {
    title: "Notes",
    icon: <MdNote />,
    url: "/notes",
    roles: [705, 493, 159], // Admin, Manager
  },
  {
    title: "Employees",
    icon: <User />,
    url: "/employees",
    roles: [705], // Admin
  },
];

export const getFirstName = (user) => {
  if (user?.firstName) return user.firstName;
  if (user?.displayName) return user.displayName.split(" ")[0];
  return "U"; // Default initial
};

export const getUserName = (user) => {
  if (!user) return "Loading...";

  // Try displayName first, then fallback to firstName+lastName
  if (user.displayName) return user.displayName;
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  return user.email || "User";
};

export const getRoleTitle = (roleId) => {
  const roles = {
    705: "Admin",
    493: "Manager",
    159: "Therapist",
    111: "New-Employee",
  };

  return roles[roleId] || "New-Employee"; // Default fallback
};

export const authorizedMenuItems = (claims) => {
  return menuItems.filter((item) => item.roles.includes(claims));
};

export const sideBarOpenduration = 300;
