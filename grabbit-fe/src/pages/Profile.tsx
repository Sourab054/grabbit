import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import type { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="bg-winterella-off-white min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Section: User Identity Card */}
          <div className="w-full lg:w-1/3 bg-winterella-black text-white p-10 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-winterella-red/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-inter mb-2 block">
                  Member Profile
                </span>
                <h1 className="text-4xl md:text-5xl font-oswald uppercase leading-tight tracking-tighter">
                  {user?.name}
                </h1>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                  Email Address
                </span>
                <p className="text-lg font-inter text-gray-300 break-all">
                  {user?.email}
                </p>
              </div>

              <div className="pt-8 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full bg-winterella-red text-white py-4 px-8 font-oswald text-lg uppercase tracking-widest hover:bg-white hover:text-winterella-black transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-winterella-red via-winterella-yellow to-winterella-black"></div>
          </div>

          {/* Right Section: Activity & Orders */}
          <div className="flex-1 w-full bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 min-h-[600px]">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
