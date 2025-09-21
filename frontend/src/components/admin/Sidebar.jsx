import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Shirt,
  ShoppingCart, 
  Activity, 
  Users, 
  BarChart3,
  Factory,
  Group 
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'style', label: 'Style Management', icon: Shirt },
    { id: 'stock', label: 'Stock Management', icon: Package },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'processes', label: 'Process Tracking', icon: Activity },
    { id: 'manage-worker', label: 'Worker Management', icon: Group },
    { id: 'workers', label: 'Worker Performance', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Factory className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ClothFlow</h1>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
