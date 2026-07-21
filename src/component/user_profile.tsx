import { useState } from "react";
import ProfileDropdown from "./profile_dropdown";
import { logoutUser } from "../api/api";

interface UserProfileProps {
  username: string
  onProfileClick: () => void
  onEditClick: () => void
}

import { useNavigate } from "react-router-dom";

export default function UserProfile({ username, onEditClick }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate();

  const initials = username
    ? username
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    : '';
    const onLogout = async () => {
  try {
    const logout = await logoutUser();
    console.log("Logout response:", logout);

    if (!logout?.error) {
      console.log("Logout successful");
      navigate("/auth/login", { replace: true });
    } else {
      console.error("Logout failed:", logout?.message);
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

  return (
    <div className="relative">
    <button
      onClick={() => {
        setIsDropdownOpen(!isDropdownOpen)
        // onProfileClick()
      }}
      className="flex items-center gap-3 rounded-lg hover:bg-primary p-2 transition-colors cursor-pointer"
      title="Click to edit profile"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
        {initials}
      </div>

      <span className="text-sm font-medium text-foreground hidden sm:inline">
        {username}
      </span>
    </button>
    <ProfileDropdown
        username={username}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        onEdit={onEditClick}
        onLogout={onLogout}
      />
      </div>
  );
}
