import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router";
import { Gem } from "lucide-react";
import useAuthContext from "../../../hooks/useAuthContext";
import { SIDEBAR_LINKS } from "./sidebarLinks";

const Sidebar = () => {
  const { logOut } = useAuthContext();
  return (
    <div>
      <Card className="h-full w-[230px] p-4 pt-0 bg-white border-r border-gray-200 shadow-none rounded-none flex flex-col justify-between">
        <div>
          <Link to="/">
            <div className="flex items-center flex-col space-x-2 text-2xl text-black font-bold  py-3">
              <Gem className="w-7 h-7 text-rose-500" />
              <span className="font-serif tracking-wide">
                Luxe <span className="text-rose-500">&</span> Loom
              </span>
            </div>
          </Link>

          <List className="min-w-full">
            {SIDEBAR_LINKS.map((link, index) => {
              return (
                <Link to={link.path} key={index}>
                  <ListItem key={index}>
                    <ListItemPrefix>{link.icon}</ListItemPrefix>
                    {link.name}
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </div>

        <List className="min-w-full">
          <ListItem onClick={logOut} className="bg-gray-300 min-w-full">
            <ListItemPrefix>
              <FaSignInAlt className="h-5 w-5 rotate-180" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    </div>
  );
};

export default Sidebar;
