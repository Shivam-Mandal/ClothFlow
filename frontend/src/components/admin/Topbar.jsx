import React from 'react';
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';

export const Topbar = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders, workers, or tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
