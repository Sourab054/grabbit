import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="p-8 h-full flex flex-col bg-winterella-black text-white">
      <div className="mb-12">
        <Link to="/admin" className="text-4xl font-oswald uppercase tracking-tighter hover:text-winterella-red transition-colors">
          Grabbit
        </Link>
        <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">Admin Dashboard</p>
      </div>

      <nav className="flex flex-col space-y-4 grow">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "text-winterella-yellow font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 border-b-2 border-winterella-yellow"
              : "text-white font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 border-b-2 border-transparent hover:text-winterella-red transition-all"
          }
        >
          <FaUser size={18} />
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "text-winterella-yellow font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 border-b-2 border-winterella-yellow"
              : "text-white font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 border-b-2 border-transparent hover:text-winterella-red transition-all"
          }
        >
          <FaBoxOpen size={18} />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "text-winterella-yellow font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 border-b-2 border-winterella-yellow"
              : "text-white font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 border-b-2 border-transparent hover:text-winterella-red transition-all"
          }
        >
          <FaClipboardList size={18} />
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-winterella-yellow font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 mt-8"
              : "text-white font-oswald uppercase text-xl tracking-wider flex items-center space-x-3 py-2 mt-8 hover:text-winterella-red transition-all"
          }
        >
          <FaStore size={18} />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className="mt-12">
        <button
          onClick={handleLogout}
          className="w-full bg-winterella-red text-white py-4 font-oswald uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-winterella-red flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
