import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 z-30 h-16 flex items-center flex-shrink-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full gap-4">
          {isChatPage && (
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <ShipWheelIcon className="size-7 sm:size-9 text-primary" />
              <span className="hidden sm:inline text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Chattify
              </span>
            </Link>
          )}

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {!isChatPage && (
              <Link to="/notifications">
                <button className="btn btn-ghost btn-sm btn-circle">
                  <BellIcon className="h-5 w-5 text-base-content opacity-70" />
                </button>
              </Link>
            )}

            <ThemeSelector />

            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>

            <button className="btn btn-ghost btn-sm btn-circle" onClick={logoutMutation}>
              <LogOutIcon className="h-5 w-5 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
