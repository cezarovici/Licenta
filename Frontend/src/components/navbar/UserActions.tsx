import { useEffect, useState } from "react";
import { useUserType } from "../../hooks/useUserType";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function UserActionsIsland() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserActionsIslandRaw />
    </QueryClientProvider>
  );
}

function UserActionsIslandRaw() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userType } = useUserType();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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
      {userType?.name == "CLIENT" && (
        <a
          href="/search"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Search
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
