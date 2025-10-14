import { Link, useLocation, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, VideoIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const { id: targetUserId } = useParams();
  
  const isChatPage = location.pathname?.startsWith("/chat");

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser && isChatPage,
  });

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  const handleVideoCall = async () => {
    if (!tokenData?.token || !authUser || !targetUserId) {
      toast.error("Unable to start video call. Please try again.");
      return;
    }

    try {
      const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
      const client = StreamChat.getInstance(STREAM_API_KEY);

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      const channelId = [authUser._id, targetUserId].sort().join("-");
      const channel = client.channel("messaging", channelId, {
        members: [authUser._id, targetUserId],
      });

      await channel.watch();

      const callUrl = `${window.location.origin}/call/${channel.id}`;
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      
      toast.success("Video call link sent successfully!");
    } catch (error) {
      console.error("Error starting video call:", error);
      toast.error("Unable to start video call. Please try again.");
    }
  };

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
            {isChatPage && (
              <button 
                onClick={handleVideoCall}
                className="btn btn-primary btn-sm btn-circle"
                aria-label="Start video call"
              >
                <VideoIcon className="h-5 w-5" />
              </button>
            )}
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
