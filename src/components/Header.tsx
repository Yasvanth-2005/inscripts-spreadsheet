import React from "react";
import { Search, Bell, Menu } from "lucide-react";

interface HeaderProps {
  onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Left Side: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 flex-1 min-w-0">
        {/* Mobile Menu - Shown only on small screens */}
        {/* <button className="md:hidden p-1 text-gray-600 hover:text-gray-900">
          <Menu className="w-5 h-5" />
        </button> */}

        {/* Mobile: Show only Spreadsheet name */}
        <div className="md:hidden">
          <span className="font-semibold text-[1.05rem] text-gray-800">
            Spreadsheet 3
          </span>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center space-x-2">
          <span>Workspace</span>
          <span className="text-gray-300">/</span>
          <span>Folder 2</span>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-800">Spreadsheet 3</span>
          <button className="text-gray-400 hover:text-gray-600">...</button>
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
        <button className="relative p-2 text-gray-500 hover:text-gray-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-custom-green ring-1 ring-white"></span>
        </button>
        <div className="flex items-center space-x-2 md:w-auto">
          <img
            className="h-8 w-8 rounded-full flex-shrink-0"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
          <div className="hidden md:block min-w-0">
            <div className="text-sm font-medium text-gray-700">John Doe</div>
            <div className="text-xs text-gray-500 truncate">
              john.doe@example.com
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
