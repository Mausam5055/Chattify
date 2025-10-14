import { UsersIcon } from "lucide-react";

const FriendsPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="mx-auto bg-base-200 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
          <UsersIcon className="size-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Feature Coming Soon</h2>
        <p className="text-base-content/70 mb-6">
          We're working hard to bring you an amazing friends feature. Stay tuned for updates!
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default FriendsPage;