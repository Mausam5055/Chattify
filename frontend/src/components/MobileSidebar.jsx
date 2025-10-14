import { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, Menu, X } from "lucide-react";

const MobileSidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-ghost btn-circle bg-base-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-base-200 border-r border-base-300 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-base-300">
            <Link to="/" className="flex items-center gap-2.5" onClick={toggleSidebar}>
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Chattify
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/"
              onClick={toggleSidebar}
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/" ? "btn-active" : ""
              }`}
            >
              <HomeIcon className="size-5 text-base-content opacity-70" />
              <span>Home</span>
            </Link>

            <Link
              to="/friends"
              onClick={toggleSidebar}
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/friends" ? "btn-active" : ""
              }`}
            >
              <UsersIcon className="size-5 text-base-content opacity-70" />
              <span>Friends</span>
            </Link>

            <Link
              to="/notifications"
              onClick={toggleSidebar}
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/notifications" ? "btn-active" : ""
              }`}
            >
              <BellIcon className="size-5 text-base-content opacity-70" />
              <span>Notifications</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-base-300 mt-auto">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="size-2 rounded-full bg-success inline-block" />
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
