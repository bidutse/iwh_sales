import React, { useState } from 'react';
import { Seller, Order, MonthlyStats, SellerStats } from '../types';
import MonthlyTable from './MonthlyTable';
import MonthlyCharts from './MonthlyCharts';

interface Props {
  sellers: Seller[];
  orders: Order[];
}

export default function MonthlyReport({ sellers, orders }: Props) {
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table');

  const calculateMonthlyStats = (): MonthlyStats[] => {
    const monthlyData: { [key: string]: MonthlyStats } = {};

    // First, initialize monthly data with zero values
    orders.forEach((order) => {
      const monthKey = order.month;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          totalOrders: 0,
          totalSellers: 0,
          totalAmount: 0,
          totalVolume: 0,
          totalOrderAmount: 0,
          totalVolumeAmount: 0
        };
      }
    });

    // Calculate orders and revenue by seller and month
    sellers.forEach((seller) => {
      Object.keys(monthlyData).forEach((monthKey) => {
        const sellerMonthOrders = orders.filter(
          order => order.sellerId === seller.id && order.month === monthKey
        );

        if (sellerMonthOrders.length > 0) {
          monthlyData[monthKey].totalSellers += 1;

          // Calculate actual orders for this seller in this month
          const actualOrders = sellerMonthOrders.reduce(
            (sum, order) => sum + order.quantityUnderThree + order.quantityOverThree,
            0
          );

          // Check if we need to apply minimum order count
          const isUnderMinimum = actualOrders < seller.minimumOrderCount;
          const effectiveOrders = isUnderMinimum ? seller.minimumOrderCount : actualOrders;
          monthlyData[monthKey].totalOrders += effectiveOrders;

          // Calculate volume charges
          sellerMonthOrders.forEach((order) => {
            const volumeCharge = order.volume * seller.ratePerCubicMeter;
            monthlyData[monthKey].totalVolumeAmount += volumeCharge;
            monthlyData[monthKey].totalVolume += order.volume;

            if (isUnderMinimum) {
              // If under minimum, all orders are charged at the base rate (≤3 products rate)
              const orderCharge = effectiveOrders * seller.rateUnderThree;
              monthlyData[monthKey].totalOrderAmount += orderCharge;
              monthlyData[monthKey].totalAmount += volumeCharge + orderCharge;
            } else {
              // Normal calculation for actual orders
              const orderCharge = (
                order.quantityUnderThree * seller.rateUnderThree +
                order.quantityOverThree * seller.rateOverThree
              );
              monthlyData[monthKey].totalOrderAmount += orderCharge;
              monthlyData[monthKey].totalAmount += volumeCharge + orderCharge;
            }
          });
        }
      });
    });

    return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
  };

  const calculateSellerStats = (): SellerStats[] => {
    const sellerData: { [key: string]: { amount: number; orders: number } } = {};
    let totalAmount = 0;

    sellers.forEach((seller) => {
      const sellerOrders = orders.filter(order => order.sellerId === seller.id);
      
      // Group orders by month
      const monthlyOrders: { [key: string]: number } = {};
      sellerOrders.forEach(order => {
        if (!monthlyOrders[order.month]) {
          monthlyOrders[order.month] = 0;
        }
        monthlyOrders[order.month] += order.quantityUnderThree + order.quantityOverThree;
      });

      let totalSellerAmount = 0;
      let totalSellerOrders = 0;

      Object.entries(monthlyOrders).forEach(([month, orderCount]) => {
        // Check if we need to apply minimum order count
        const isUnderMinimum = orderCount < seller.minimumOrderCount;
        const effectiveOrders = isUnderMinimum ? seller.minimumOrderCount : orderCount;
        totalSellerOrders += effectiveOrders;

        // Calculate revenue for this month
        const monthOrders = sellerOrders.filter(order => order.month === month);
        const monthRevenue = monthOrders.reduce((sum, order) => {
          const volumeCharge = order.volume * seller.ratePerCubicMeter;
          
          let orderCharge;
          if (isUnderMinimum) {
            // If under minimum, all orders are charged at the base rate
            orderCharge = effectiveOrders * seller.rateUnderThree;
          } else {
            // Normal calculation
            orderCharge = (
              order.quantityUnderThree * seller.rateUnderThree +
              order.quantityOverThree * seller.rateOverThree
            );
          }
          
          return sum + volumeCharge + orderCharge;
        }, 0);

        totalSellerAmount += monthRevenue;
      });

      sellerData[seller.id] = {
        amount: totalSellerAmount,
        orders: totalSellerOrders
      };
      totalAmount += totalSellerAmount;
    });

    return Object.entries(sellerData).map(([sellerId, data]) => ({
      sellerId,
      sellerName: sellers.find(s => s.id === sellerId)?.name || 'Unknown',
      totalAmount: data.amount,
      percentage: (data.amount / totalAmount) * 100,
      totalOrders: data.orders
    })).sort((a, b) => b.totalAmount - a.totalAmount);
  };

  const monthlyStats = calculateMonthlyStats();
  const sellerStats = calculateSellerStats();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'table' | 'charts')}
          >
            <option value="table">Table View</option>
            <option value="charts">Charts View</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('table')}
              className={`${
                activeTab === 'table'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`${
                activeTab === 'charts'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Charts View
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'table' ? (
        <MonthlyTable monthlyStats={monthlyStats} />
      ) : (
        <MonthlyCharts monthlyStats={monthlyStats} sellerStats={sellerStats} />
      )}
    </div>
  );
}