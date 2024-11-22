import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { MonthlyStats, SellerStats } from '../types';

interface Props {
  monthlyStats: MonthlyStats[];
  sellerStats: SellerStats[];
}

interface ChartConfig {
  id: string;
  title: string;
  component: React.ReactNode;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8884d8', '#83a6ed', '#8dd1e1'];

export default function MonthlyCharts({ monthlyStats, sellerStats }: Props) {
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = monthlyStats.map(stat => ({
    ...stat,
    formattedMonth: formatMonth(stat.month)
  })).reverse();

  const createChartConfigs = (): ChartConfig[] => [
    {
      id: 'revenue-breakdown',
      title: 'Revenue Breakdown',
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedMonth" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="totalOrderAmount" name="Order Revenue" fill="#0088FE" stackId="revenue" />
            <Bar dataKey="totalVolumeAmount" name="Volume Revenue" fill="#00C49F" stackId="revenue" />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'volume-trend',
      title: 'Order Volume Trend',
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedMonth" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toFixed(6)} m³`} />
            <Legend />
            <Line type="monotone" dataKey="totalVolume" name="Total Volume (m³)" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'order-quantity',
      title: 'Monthly Order Quantity',
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedMonth" />
            <YAxis />
            <Tooltip formatter={(value: number) => value} />
            <Legend />
            <Area type="monotone" dataKey="totalOrders" name="Total Orders" fill="#82ca9d" stroke="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'seller-distribution',
      title: 'Revenue Distribution by Seller',
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sellerStats}
              dataKey="totalAmount"
              nameKey="sellerName"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                name,
                percentage
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {`${name} (${percentage.toFixed(1)}%)`}
                  </text>
                );
              }}
            >
              {sellerStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'seller-comparison',
      title: 'Seller Revenue Comparison',
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sellerStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="sellerName" width={150} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="totalAmount" name="Total Revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  ];

  const [charts, setCharts] = useState(createChartConfigs());

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(charts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCharts(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="charts">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-12"
          >
            {charts.map((chart, index) => (
              <Draggable key={chart.id} draggableId={chart.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between mb-4 cursor-move"
                      >
                        <h3 className="text-lg font-medium">{chart.title}</h3>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </div>
                      <div className="h-[400px]">
                        {chart.component}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}