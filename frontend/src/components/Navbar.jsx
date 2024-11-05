import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightEndOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userName = "Admin";

  const handleProfileClick = () => {
    navigate("/profils");
  };

  const handleLogoutClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-white py-4 px-6 flex justify-between items-center h-28 w-full shadow-lg">
      {/* Logo section */}
      <div className="flex items-center">
        <div className="p-4">
          <h1>Logo</h1>
        </div>
      </div>

      {/* Section du profil utilisateur */}
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-medium">Bonjour, {userName}</span>
          <Menu.Button className="text-gray-900 hover:bg-gray-100 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-[#3a6d27]">
            <UserCircleIcon className="h-10 w-10 text-gray-700" /> {/* L'icône de profil */}
          </Menu.Button>
        </div>

        {/* Menu déroulant amélioré */}
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleProfileClick}
                    className={`${
                      active ? "bg-[#4B8B32] text-white" : "text-gray-900"
                    } group flex items-center w-full px-2 py-2 text-sm rounded-lg transition-colors duration-150`}
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-white" /> {/* Icône pour Profil */}
                    Profil
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogoutClick}
                    className={`${
                      active ? "bg-[#4B8B32] text-white" : "text-gray-900"
                    } group flex items-center w-full px-2 py-2 text-sm rounded-lg transition-colors duration-150`}
                  >
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-white" /> {/* Icône pour Déconnexion */}
                    Déconnexion
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
};

export default Navbar;
