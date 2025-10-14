import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { PhoneOff } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
        navigate("/");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup function
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnect().catch(console.error);
      }
    };
  }, [tokenData, authUser, callId, call, client, navigate]);

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave();
      }
      if (client) {
        await client.disconnect();
      }
      navigate("/");
    } catch (error) {
      console.error("Error leaving call:", error);
      navigate("/");
    }
  };

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col bg-base-300">
      <div className="flex items-center justify-between p-4 bg-base-200">
        <h1 className="text-xl font-bold">Video Call</h1>
        <button 
          onClick={handleLeaveCall}
          className="btn btn-error btn-circle btn-sm"
          aria-label="Leave call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg mb-4">Could not initialize call. Redirecting...</p>
            <button 
              onClick={() => navigate("/")} 
              className="btn btn-primary"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT || callingState === CallingState.UNKNOWN) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <SpeakerLayout />
        </div>
        <div className="p-4 bg-base-200">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;
