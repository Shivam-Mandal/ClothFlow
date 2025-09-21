import React, { useState } from 'react';
import { Plus, ShoppingCart, Eye, Edit3, Calendar } from 'lucide-react';
import { CirclePicker } from "react-color";
export const OrderManagement = () => {
  const [color, setColor] = useState("#ff0000");
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      design: 'Summer Dress Collection',
      requiredKg: 45,
      currentStage: 'Cutting',
      progress: 25,
      assignedWorkers: 3,
      startDate: '2025-01-10',
      deadline: '2025-01-20',
      priority: 'high'
    },
    {
      id: 'ORD-002',
      design: 'Formal Shirt Series',
      requiredKg: 30,
      currentStage: 'Stitching',
      progress: 60,
      assignedWorkers: 4,
      startDate: '2025-01-08',
      deadline: '2025-01-18',
      priority: 'medium'
    },
    {
      id: 'ORD-003',
      design: 'Casual Pants Line',
      requiredKg: 60,
      currentStage: 'Finishing',
      progress: 90,
      assignedWorkers: 2,
      startDate: '2025-01-05',
      deadline: '2025-01-15',
      priority: 'low'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusColor = (stage) => {
    switch (stage) {
      case 'Cutting': return 'bg-blue-100 text-blue-800';
      case 'Stitching': return 'bg-teal-100 text-teal-800';
      case 'Washing': return 'bg-purple-100 text-purple-800';
      case 'Finishing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Create and track production orders</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['All Orders', 'In Progress', 'Completed', 'Delayed'].map((status, index) => (
          <div key={status} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">{status}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {index === 0 ? orders.length : Math.floor(Math.random() * 10) + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Design
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.design}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.requiredKg} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.currentStage)}`}>
                      {order.currentStage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{order.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.assignedWorkers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(order.deadline).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create form modal */}
      {showCreateForm && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Order</h2>
            <form className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select className="mb-2 w-full border p-2 rounded">
                  <option value="">Select style</option>

                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Kg</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter required kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pieces</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pieces"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>

                {/* <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pieces"
                /> */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none rounded cursor-pointer"
                  />
                  <p className='text-gray-500'>choose color</p>
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
