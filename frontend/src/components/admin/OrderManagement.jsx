
import React, { useState,useEffect } from 'react';
import { Plus, ShoppingCart, Eye, Edit3, Calendar } from 'lucide-react';
import { CirclePicker } from "react-color";
import orderService from "../services/orderServices"; // backend API for orders
import {styleService} from "../services/styleServices";

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]); // your existing orders
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [styles, setStyles] = useState([]); // fetch from backend
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [pieces, setPieces] = useState({}); // { color: { size: number } }

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const data = await styleService.fetchStyles(); // fetch from backend
        setStyles(data);
      } catch (err) {
        console.error("Failed to fetch styles", err);
      }
    };
    fetchStyles();
  }, []);

  const handleStyleChange = (styleId) => {
    setSelectedStyleId(styleId);
    const style = styles.find((s) => s.id === styleId);
    if (!style) return;
    const initialPieces = {};
    (style.colors || []).forEach((color) => {
      initialPieces[color] = {};
      (style.sizes || []).forEach((size) => {
        initialPieces[color][size] = 0;
      });
    });
    setPieces(initialPieces);
  };

  const updatePiece = (color, size, value) => {
    setPieces((prev) => ({
      ...prev,
      [color]: { ...prev[color], [size]: Number(value) },
    }));
  };

  const selectedStyle = styles.find((s) => s.id === selectedStyleId);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedStyleId) return alert("Select a style first");
    try {
      await orderService.createOrder({
        styleId: selectedStyleId,
        pieces,
      });
      alert("Order created!");
      setShowCreateForm(false);
      setSelectedStyleId("");
      setPieces({});
    } catch (err) {
      console.error(err);
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Order</h2>
            <form className="space-y-4" onSubmit={handleCreateOrder}>
              {/* Style select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={selectedStyleId}
                  onChange={(e) => handleStyleChange(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select style</option>
                  {styles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic table for sizes & colors */}
              {selectedStyle && (
                <div className="overflow-x-auto border rounded p-3 bg-gray-50">
                  <table className="min-w-full table-fixed">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left">Color</th>
                        {selectedStyle.sizes.map((size) => (
                          <th key={size} className="px-3 py-2 text-left">{size}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStyle.colors.map((color) => (
                        <tr key={color} className="bg-white odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2">{color}</td>
                          {selectedStyle.sizes.map((size) => (
                            <td key={size} className="px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={pieces?.[color]?.[size] || 0}
                                onChange={(e) => updatePiece(color, size, e.target.value)}
                                className="w-20 px-2 py-1 border rounded text-sm"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

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
