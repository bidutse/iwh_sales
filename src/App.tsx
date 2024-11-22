import React, { useState } from 'react';
import SellerForm from './components/SellerForm';
import OrderForm from './components/OrderForm';
import SellerList from './components/SellerList';
import MonthlyReport from './components/MonthlyReport';
import OrderEditModal from './components/OrderEditModal';
import CollapsibleSection from './components/CollapsibleSection';
import ExportButton from './components/ExportButton';
import { Seller, Order } from './types';

const App: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleDeleteSeller = (sellerId: string) => {
    if (window.confirm('Are you sure you want to delete this seller? All associated orders will also be deleted.')) {
      setSellers(sellers.filter(s => s.id !== sellerId));
      setOrders(orders.filter(o => o.sellerId !== sellerId));
    }
  };

  const handleEditSeller = (seller: Seller) => {
    setEditingSeller(seller);
    setIsSellerModalOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (order: Order) => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? order : o));
      setEditingOrder(null);
    } else {
      setOrders([...orders, order]);
    }
    setIsOrderModalOpen(false);
  };

  const handleSellerSubmit = (seller: Seller) => {
    if (editingSeller) {
      setSellers(sellers.map(s => s.id === editingSeller.id ? { ...seller, id: editingSeller.id } : s));
      setEditingSeller(null);
    } else {
      setSellers([...sellers, seller]);
    }
    setIsSellerModalOpen(false);
  };

  const prepareOrdersForExport = () => {
    return orders.map(order => ({
      ...order,
      date: new Date(parseInt(order.id)).toLocaleDateString(),
      sellerName: sellers.find(s => s.id === order.sellerId)?.name || 'Unknown',
      month: new Date(order.month).toLocaleDateString('default', { month: 'long', year: 'numeric' })
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Indowarehub-Sales</h1>
        
        <div className="space-y-8">
          {/* Seller Management Section */}
          <CollapsibleSection title="Seller Management">
            <div className="flex justify-between mb-6">
              <ExportButton
                data={sellers}
                filename="sellers"
                headers={['Name', 'Rate per m³', 'Rate (≤3 products)', 'Rate (>3 products)']}
                fields={['name', 'ratePerCubicMeter', 'rateUnderThree', 'rateOverThree']}
              />
              <button
                onClick={() => {
                  setEditingSeller(null);
                  setIsSellerModalOpen(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add New Seller
              </button>
            </div>
            <SellerList 
              sellers={sellers} 
              onEdit={handleEditSeller}
              onDelete={handleDeleteSeller}
            />
          </CollapsibleSection>

          {/* Order Form Section */}
          <CollapsibleSection title="Record Order">
            <OrderForm 
              sellers={sellers}
              onSubmit={(order) => {
                setOrders([...orders, order]);
              }}
            />
          </CollapsibleSection>

          {/* Orders List Section */}
          <CollapsibleSection title="Order History">
            <div className="mb-6">
              <ExportButton
                data={prepareOrdersForExport()}
                filename="orders"
                headers={['Date', 'Seller', 'Month', '≤3 Products', '>3 Products', 'Volume (m³)']}
                fields={['date', 'sellerName', 'month', 'quantityUnderThree', 'quantityOverThree', 'volume']}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">≤3 Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">&gt;3 Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const seller = sellers.find(s => s.id === order.sellerId);
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(parseInt(order.id)).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {seller?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.quantityUnderThree}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.quantityOverThree}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.volume.toFixed(6)} m³
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          {/* Monthly Report Section */}
          <CollapsibleSection title="Monthly Report">
            <MonthlyReport sellers={sellers} orders={orders} />
          </CollapsibleSection>
        </div>

        {/* Modals */}
        <SellerForm 
          isOpen={isSellerModalOpen}
          onClose={() => {
            setIsSellerModalOpen(false);
            setEditingSeller(null);
          }}
          onSubmit={handleSellerSubmit}
          editingSeller={editingSeller}
        />

        <OrderEditModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setEditingOrder(null);
          }}
          onSubmit={handleOrderSubmit}
          editingOrder={editingOrder}
          sellers={sellers}
        />
      </div>
    </div>
  );
};

export default App;