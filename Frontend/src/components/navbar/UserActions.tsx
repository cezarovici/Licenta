import { useEffect, useState } from "react";
import { isAdmin } from "../../lib/admin_auth";

export default function UserActionsIsland() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsAdmin(isAdmin());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return isLoggedIn ? (
    <>
      <a
        href="/profile"
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Profile
      </a>

      {admin && (
        <a
          href="/admin"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Admin Panel
        </a>
      )}

      <button
        onClick={handleLogout}
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <a
        href="/login"
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Login
      </a>
      <a
        href="/register"
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Register
      </a>
    </>
  );
}
