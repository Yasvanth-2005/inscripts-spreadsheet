import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, MoreHorizontal } from "lucide-react";

interface HeaderProps {
  onSearchChange: (term: string) => void;
}

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotif) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotif]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Left Side: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 flex-1 min-w-0">
        {/* Mobile Menu - Shown only on small screens */}
        {/* <button className="md:hidden p-1 text-gray-600 hover:text-gray-900">
          <Menu className="w-5 h-5" />
        </button> */}

        <div className="lg:hidden">
          <span className="font-semibold text-[1.05rem] text-gray-800">
            Spreadsheet 3
          </span>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:flex items-center space-x-2">
          <span>Workspace</span>
          <span className="text-gray-300">/</span>
          <span>Folder 2</span>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-800">Spreadsheet 3</span>
          <div className="text-gray-400 p-1 rounded">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Right Side: Search and User Profile */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within sheet"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-48 md:w-64 bg-gray-50 border border-gray-200 rounded-md pl-9 pr-4 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            className="relative p-2 pr-0 text-gray-500 hover:text-gray-800"
            onClick={() => setShowNotif((v) => !v)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-[8px] p-2 right-[2px] flex items-center justify-center h-4 w-4 rounded-full bg-custom-green text-white text-[0.6rem] font-bold border-2 border-white translate-x-1/2 -translate-y-1/2">
              2
            </span>
          </button>
          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-[-30px] mt-2 w-80 min-w-[250px] bg-white rounded-lg shadow-lg p-0 z-50 border border-gray-200">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="font-semibold text-gray-800">
                  Notifications
                </span>
                <button
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  onClick={() => setShowNotif(false)}
                >
                  &times;
                </button>
              </div>
              <hr className="m-0" />
              <div className="text-center text-gray-500 text-sm py-8">
                No Notifications yet
              </div>
            </div>
          )}
        </div>
        {/* Avatar with fallback */}
        <div className="flex items-center space-x-2 md:w-auto">
          {!imgLoaded || imgError ? (
            <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-500 text-white font-bold text-base">
              {getInitials(user.name)}
            </div>
          ) : null}
          <img
            className="h-8 w-8 rounded-full flex-shrink-0"
            src={user.avatar}
            alt="User avatar"
            style={{ display: imgLoaded && !imgError ? "block" : "none" }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          <div className="hidden md:block min-w-0">
            <div className="text-sm font-medium text-gray-700">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
