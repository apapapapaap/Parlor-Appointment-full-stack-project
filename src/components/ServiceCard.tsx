import React from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  isDarkMode?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, quantity, onAdd, onRemove, isDarkMode = false }) => {
  return (
    <div className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {service.name}
            </h3>
            <div className={`text-sm mb-3 min-h-[2.5rem] flex items-start transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <p className="leading-relaxed">
                {service.description}
              </p>
            </div>
            <div className={`flex items-center space-x-4 text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
              <span className="text-lg font-bold text-pink-600">₹{service.price}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ml-3 flex-shrink-0 ${
            service.category === 'bridal' 
              ? isDarkMode
                ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                : 'bg-purple-100 text-purple-700'
              : isDarkMode
                ? 'bg-pink-900/50 text-pink-300 border border-pink-700'
                : 'bg-pink-100 text-pink-700'
          }`}>
            {service.category === 'bridal' ? 'Bridal' : 'Regular'}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onRemove}
              disabled={quantity === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-pink-600 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`font-semibold min-w-[20px] text-center transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {quantity}
            </span>
            <button
              onClick={onAdd}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {quantity > 0 && (
            <div className="text-right">
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total
              </p>
              <p className="font-bold text-pink-600">₹{service.price * quantity}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;