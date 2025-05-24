import { FaUsers } from "react-icons/fa";

import { FaBoxOpen, FaShoppingBag } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export const SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard className="h-5 w-5" />,
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: <FaUsers className="h-5 w-5" />,
  },
  {
    name: "Products",
    path: "/dashboard/products",
    icon: <FaBoxOpen className="h-5 w-5" />,
  },
  {
    name: "Orders",
    path: "/dashboard/orders",
    icon: <FaShoppingBag className="h-5 w-5" />,
  },
];
