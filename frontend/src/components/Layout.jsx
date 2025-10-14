import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <>
            <Sidebar />
            <MobileSidebar />
          </>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-base-100">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
