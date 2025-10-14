import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import { 
  VideoIcon, 
  ArrowLeftIcon, 
  BellIcon, 
  LogOutIcon, 
  ShipWheelIcon 
} from "lucide-react";
import ThemeSelector from "../components/ThemeSelector";
import useLogout from "../hooks/useLogout";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const FullScreenChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

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

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleNotifications = () => {
    navigate("/notifications");
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen flex flex-col">
      {/* Unified Navbar for both mobile and desktop */}
      <nav className="bg-base-200 border-b border-base-300 z-30 h-16 flex items-center flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBack} 
                className="btn btn-ghost btn-circle md:hidden"
              >
                <ArrowLeftIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
              
              <button 
                onClick={handleVideoCall} 
                className="btn btn-success btn-sm text-white md:hidden"
              >
                <VideoIcon className="size-5" />
              </button>
              
              <div className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary hidden md:block" />
                <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider hidden md:block">
                  Streamify
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={handleVideoCall} 
                className="btn btn-success btn-sm text-white hidden md:flex items-center"
              >
                <VideoIcon className="size-5" />
                <span className="ml-1">Call</span>
              </button>
              
              <button 
                onClick={handleNotifications}
                className="btn btn-ghost btn-circle"
              >
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
              
              <ThemeSelector />
              
              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img 
                    src={authUser?.profilePic} 
                    alt="User Avatar" 
                    onError={(e) => {
                      e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                    }}
                  />
                </div>
              </div>

              <button 
                className="btn btn-ghost btn-circle hidden md:block" 
                onClick={logoutMutation}
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Content - Full Screen */}
      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient} customClasses={{}}>
          <Channel channel={channel}>
            <div className="w-full h-full flex flex-col">
              <Window className="h-full flex flex-col">
                <ChannelHeader 
                  title={channel.data?.name || "Chat"}
                  className="flex-shrink-0"
                />
                <MessageList 
                  className="flex-1 overflow-y-auto"
                />
                <MessageInput 
                  focus 
                  className="flex-shrink-0"
                />
              </Window>
              
              <Thread />
            </div>
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default FullScreenChatPage;