import { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden p-4 bg-winterella-black text-white z-30 justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-oswald uppercase tracking-tighter">Grabbit Admin</h1>
        <button onClick={toggleSidebar} className="hover:text-winterella-red transition-colors">
          <FaBars size={24} />
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`bg-winterella-black w-72 h-screen sticky top-0 text-white
    hidden md:block z-20 border-r-2 border-black overflow-y-auto`}
      >
        {/* Sidebar */}
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (Absolute) */}
      <div
        className={`bg-winterella-black w-72 h-screen fixed top-0 left-0 text-white
    transform ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    }
    transition-transform duration-300 md:hidden z-40 border-r-2 border-black overflow-y-auto`}
      >
        <AdminSidebar />
      </div>

      <div className="grow p-10 overflow-auto bg-winterella-off-white">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
