import React from 'react';
import { MonthlyStats } from '../types';

interface Props {
  monthlyStats: MonthlyStats[];
}

export default function MonthlyTable({ monthlyStats }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sellers
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Revenue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Volume Revenue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Revenue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Volume
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {monthlyStats.map((stat) => (
            <tr key={stat.month}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatMonth(stat.month)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {stat.totalOrders}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {stat.totalSellers}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(stat.totalOrderAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(stat.totalVolumeAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(stat.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {stat.totalVolume.toFixed(6)} m³
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}