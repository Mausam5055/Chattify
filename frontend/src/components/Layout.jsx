import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {/* Added 'md:sticky md:top-0' to make navbar fixed on mobile but sticky on desktop */}
          <div className="fixed top-0 left-0 right-0 z-30 md:static md:z-auto">
            <Navbar />
          </div>
          
          {/* Added padding to account for fixed navbar on mobile */}
          <main className="flex-1 overflow-y-auto pt-16 md:pt-0 mt-16 md:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;