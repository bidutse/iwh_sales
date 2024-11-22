import React, { useState } from 'react';
import { Seller, Order } from '../types';

interface Props {
  sellers: Seller[];
  onSubmit: (order: Order) => void;
}

export default function OrderForm({ sellers, onSubmit }: Props) {
  const [sellerId, setSellerId] = useState('');
  const [quantityUnderThree, setQuantityUnderThree] = useState('');
  const [quantityOverThree, setQuantityOverThree] = useState('');
  const [month, setMonth] = useState('');
  const [volume, setVolume] = useState('');

  const months = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' },
    { value: '2025-01', label: 'January 2025' },
    { value: '2025-02', label: 'February 2025' },
    { value: '2025-03', label: 'March 2025' },
    { value: '2025-04', label: 'April 2025' },
    { value: '2025-05', label: 'May 2025' },
    { value: '2025-06', label: 'June 2025' },
    { value: '2025-07', label: 'July 2025' },
    { value: '2025-08', label: 'August 2025' },
    { value: '2025-09', label: 'September 2025' },
    { value: '2025-10', label: 'October 2025' },
    { value: '2025-11', label: 'November 2025' },
    { value: '2025-12', label: 'December 2025' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now().toString(),
      sellerId,
      month,
      quantityUnderThree: parseInt(quantityUnderThree || '0'),
      quantityOverThree: parseInt(quantityOverThree || '0'),
      volume: parseFloat(volume)
    });

    setSellerId('');
    setQuantityUnderThree('');
    setQuantityOverThree('');
    setMonth('');
    setVolume('');
  };

  const isValid = sellerId && month && volume && 
    (parseInt(quantityUnderThree || '0') > 0 || parseInt(quantityOverThree || '0') > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Seller</label>
        <select
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Select a seller</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Month</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Select a month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Orders with 3 or fewer products
          </label>
          <input
            type="number"
            value={quantityUnderThree}
            onChange={(e) => setQuantityUnderThree(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Orders with more than 3 products
          </label>
          <input
            type="number"
            value={quantityOverThree}
            onChange={(e) => setQuantityOverThree(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Volume (m³)</label>
        <input
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          min="0"
          step="0.000001"
          placeholder="0.000000"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        disabled={!isValid}
      >
        Record Order
      </button>
    </form>
  );
}