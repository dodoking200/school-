"use client";
import { useAuth } from "@/lib/useAuth";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/types";

interface SideNavProps {
  children: React.ReactNode;
}
export default function SideNav({ children }: SideNavProps) {
  const { logout, getCurrentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-white  p-4 fixed ">
      <div>
        <div className="flex items-center justify-center mb-8">
          <span className="font-medium text-gray-900 text-center">
            <strong>{user?.name || "Loading..."}</strong>
            <br />
            <p className="text-gray-500 text-sm text-center">
              {user?.role || "Role not available"}
            </p>
          </span>
        </div>
        <nav className="flex flex-col gap-1">{children}</nav>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-black hover:text-red-500 text-sm px-3 py-3 "
      >
        <span className="material-icons text-base">
          <LogOut />
        </span>
        Logout
      </button>
    </aside>
  );
}
