import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Seller } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (seller: Seller) => void;
  editingSeller: Seller | null;
}

export default function SellerForm({ isOpen, onClose, onSubmit, editingSeller }: Props) {
  const [name, setName] = useState('');
  const [ratePerCubicMeter, setRatePerCubicMeter] = useState('');
  const [rateUnderThree, setRateUnderThree] = useState('');
  const [rateOverThree, setRateOverThree] = useState('');
  const [minimumOrderCount, setMinimumOrderCount] = useState('');

  useEffect(() => {
    if (editingSeller) {
      setName(editingSeller.name);
      setRatePerCubicMeter(editingSeller.ratePerCubicMeter.toString());
      setRateUnderThree(editingSeller.rateUnderThree.toString());
      setRateOverThree(editingSeller.rateOverThree.toString());
      setMinimumOrderCount(editingSeller.minimumOrderCount.toString());
    } else {
      setName('');
      setRatePerCubicMeter('');
      setRateUnderThree('');
      setRateOverThree('');
      setMinimumOrderCount('');
    }
  }, [editingSeller]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: editingSeller?.id || Date.now().toString(),
      name,
      ratePerCubicMeter: Number(ratePerCubicMeter),
      rateUnderThree: Number(rateUnderThree),
      rateOverThree: Number(rateOverThree),
      minimumOrderCount: Number(minimumOrderCount)
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {editingSeller ? 'Edit Seller' : 'Add New Seller'}
                    </Dialog.Title>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rate per Cubic Meter</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">Rp</span>
                            </div>
                            <input
                              type="number"
                              value={ratePerCubicMeter}
                              onChange={(e) => setRatePerCubicMeter(e.target.value)}
                              className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              required
                              min="0"
                              step="1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rate for 3 or fewer products</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">Rp</span>
                            </div>
                            <input
                              type="number"
                              value={rateUnderThree}
                              onChange={(e) => setRateUnderThree(e.target.value)}
                              className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              required
                              min="0"
                              step="1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rate for more than 3 products</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">Rp</span>
                            </div>
                            <input
                              type="number"
                              value={rateOverThree}
                              onChange={(e) => setRateOverThree(e.target.value)}
                              className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              required
                              min="0"
                              step="1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Minimum Monthly Orders</label>
                          <input
                            type="number"
                            value={minimumOrderCount}
                            onChange={(e) => setMinimumOrderCount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            min="0"
                            step="1"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Minimum number of orders required per month
                          </p>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                          >
                            {editingSeller ? 'Save Changes' : 'Add Seller'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}