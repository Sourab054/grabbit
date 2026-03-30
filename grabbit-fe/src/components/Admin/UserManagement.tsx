import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
  clearError,
} from "../../redux/slices/adminSlice";
import { toast } from "sonner";
import Pagination from "../Common/Pagination";

const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.admin,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchUsers());
    }
  }, [navigate, user, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultAction = await dispatch(addUser(formData));
    if (addUser.fulfilled.match(resultAction)) {
      toast.success("User added successfully!");
      setFormData({ name: "", email: "", password: "", role: "customer" });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const resultAction = await dispatch(
      updateUser({ id: userId, role: newRole }),
    );
    if (updateUser.fulfilled.match(resultAction)) {
      toast.success("User role updated successfully");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      const resultAction = await dispatch(deleteUser(userId));
      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success("User deleted successfully");
      }
    }
  };

  if (loading && users.length === 0)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winterella-red"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto font-inter">
      <h2 className="text-4xl font-oswald uppercase tracking-tighter mb-10">
        User Management
      </h2>

      {/* Add New User Form */}
      <div className="bg-white p-8 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-16">
        <h3 className="text-2xl font-oswald uppercase tracking-tight mb-6 px-1">
          Add New User
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
        >
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest text-gray-500 mb-2 px-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest text-gray-500 mb-2 px-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest text-gray-500 mb-2 px-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="grow">
              <label className="block font-oswald uppercase text-xs tracking-widest text-gray-500 mb-2 px-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border-4 border-black p-3 font-bold focus:outline-none bg-white uppercase text-sm"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-winterella-red text-white px-8 py-3 font-oswald uppercase tracking-widest hover:bg-winterella-black transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* User List Management */}
      <div className="overflow-x-auto border-4 border-black">
        <table className="min-w-full text-left bg-white">
          <thead className="bg-black text-white font-oswald uppercase text-xs tracking-widest">
            <tr>
              <th className="py-4 px-6 border-r border-gray-800">Name</th>
              <th className="py-4 px-6 border-r border-gray-800">Email</th>
              <th className="py-4 px-6 border-r border-gray-800">Role</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {users
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage,
              )
              .map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-winterella-off-white transition-colors duration-200"
                >
                  <td className="p-6 font-bold text-black border-r border-black uppercase text-sm">
                    {u.name}
                  </td>

                  <td className="p-6 border-r border-black font-medium">
                    {u.email}
                  </td>

                  <td className="p-6 border-r border-black">
                    <select
                      value={u.role}
                      disabled={u._id === user?._id}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="p-2 border-2 border-black font-oswald uppercase text-xs tracking-widest focus:outline-none bg-transparent disabled:opacity-50"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-6">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === user?._id}
                      className="bg-white text-black px-6 py-2 font-oswald text-xs uppercase tracking-widest border-2 border-black hover:bg-winterella-red hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UserManagement;
