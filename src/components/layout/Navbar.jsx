import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">
        <Link to="/dashboard">TimeSheet Management</Link>
      </h1>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;