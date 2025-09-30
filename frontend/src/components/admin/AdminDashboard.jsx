// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../utils/Sidebar';
import { Topbar } from '../utils/Topbar';

// --- keep Overview here and export it so App.jsx can import it ---
export const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12% from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock (kg)</p>
              <p className="text-2xl font-bold text-gray-900">1,250</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-teal-600 rounded"></div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">-5% from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workers</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+2 new this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-600 rounded"></div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+18% efficiency</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[
              { id: 'ORD-001', design: 'Summer Dress', status: 'Cutting', progress: 25 },
              { id: 'ORD-002', design: 'Formal Shirt', status: 'Stitching', progress: 60 },
              { id: 'ORD-003', design: 'Casual Pants', status: 'Finishing', progress: 90 }
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.design}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{order.status}</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Status</h3>
          <div className="space-y-4">
            {[
              { name: 'Cutting', active: 8, pending: 3, color: 'blue' },
              { name: 'Stitching', active: 12, pending: 5, color: 'teal' },
              { name: 'Washing', active: 6, pending: 2, color: 'purple' },
              { name: 'Finishing', active: 4, pending: 1, color: 'orange' }
            ].map((process) => (
              <div key={process.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${process.color}-500 rounded-full`}></div>
                  <span className="font-medium text-gray-900">{process.name}</span>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-600 font-medium">{process.active} active</span>
                  <span className="text-orange-600 font-medium">{process.pending} pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin layout that renders the Sidebar, Topbar and the nested route content via Outlet ---
const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  // keep activeTab synced with current path (so Sidebar highlight works)
  useEffect(() => {
    // location.pathname might be like "/styles" or "/dashboard"
    const path = location.pathname.replace(/^\//, ''); // remove leading slash
    switch (path) {
      case '':
      case 'dashboard':
        setActiveTab('overview');
        break;
      case 'styles':
        setActiveTab('style');
        break;
      case 'stock':
        setActiveTab('stock');
        break;
      case 'orders':
        setActiveTab('orders');
        break;
      case 'processes':
        setActiveTab('processes');
        break;
      case 'manage-worker':
        setActiveTab('manage-worker');
        break;
      case 'workers':
        setActiveTab('workers');
        break;
      case 'reports':
        setActiveTab('reports');
        break;
      default:
        setActiveTab('overview');
    }
  }, [location.pathname]);

  // optional helper to programmatically navigate + set activeTab
  const handleNavigate = (tabKey) => {
    setActiveTab(tabKey);
    const route =
      tabKey === 'overview' ? '/dashboard' :
      tabKey === 'style' ? '/styles' :
      tabKey === 'stock' ? '/stock' :
      tabKey === 'orders' ? '/orders' :
      tabKey === 'processes' ? '/processes' :
      tabKey === 'manage-worker' ? '/manage-worker' :
      tabKey === 'workers' ? '/workers' :
      tabKey === 'reports' ? '/reports' : '/dashboard';
    navigate(route);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6">
          {/* This Outlet renders the child route (Overview, StyleManagement etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
