import React, { useState } from 'react';

interface DimensionCalculatorProps {
  onCalculate: (cubicMeters: number) => void;
}

const DimensionCalculator: React.FC<DimensionCalculatorProps> = ({ onCalculate }) => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculateCubicMeters = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    
    // Convert from cm³ to m³ (divide by 1,000,000)
    const cubicMeters = (l * w * h) / 1000000;
    setResult(cubicMeters);
    onCalculate(cubicMeters);
  };

  return (
    <form onSubmit={calculateCubicMeters} className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Product Dimension Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Calculate
        </button>
        {result !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-900">
              Volume: {result.toFixed(6)} m³
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default DimensionCalculator;