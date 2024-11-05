import {
    ChartBarIcon,
    LockClosedIcon,
    ClockIcon,
  } from "@heroicons/react/24/outline";
  import { Link, useLocation } from "react-router-dom";
  
  // eslint-disable-next-line react/prop-types
  const SidebarItem = ({ Icon, text, to, isActive, isImage }) => (
    <Link to={to}>
      <div
        className={`flex items-center space-x-2 py-2 px-4 cursor-pointer transition-colors duration-200 ${
          isActive
            ? "bg-white text-[#4B8B32] border-2 border-[#4B8B32] rounded-2xl"
            : "hover:bg-white hover:text-[#4B8B32]"
        }`}
      >
        {isImage ? (
          <img
            src={Icon}
            alt={text}
            className="h-6 w-6 transition-transform duration-200 hover:bg-white hover:text-[#4B8B32] ease-in-out hover:scale-110"
          />
        ) : (
          <Icon className="h-6 w-6 transition-transform duration-200 ease-in-out hover:scale-110" />
        )}
        <span>{text}</span>
      </div>
    </Link>
  );
  
  const Sidebar = () => {
    const location = useLocation();
  
    return (
      <div className="w-56 bg-white mt-6 mb-4 border border-gray-50 h-600 shadow-lg rounded-lg">
        <nav className="mt-4">
          <SidebarItem
            Icon={ChartBarIcon}
            text="Dashboard"
            to="/admin/dashboard"
            isActive={location.pathname === "/admin/dashboard"}
            isImage={false}
          />
          <SidebarItem
            Icon={LockClosedIcon} // Icône pour le mot de passe
            text="Mot de passe"
            to="/admin/motdepasse"
            isActive={location.pathname === "/admin/motdepasse"}
            isImage={false}
          />
          <SidebarItem
            Icon={ClockIcon} // Icône pour l'historique
            text="Historique"
            to="/admin/historique"
            isActive={location.pathname === "/admin/historique"}
            isImage={false}
          />
        </nav>
      </div>
    );
  };
  
  export default Sidebar;
  