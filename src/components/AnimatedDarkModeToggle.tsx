import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface AnimatedDarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedDarkModeToggle: React.FC<AnimatedDarkModeToggleProps> = ({
  isDarkMode,
  onToggle,
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-10 h-5',
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-20 h-10'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const thumbSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const starCounts = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10
  };

  const cloudCounts = {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4
  };

  const particleCounts = {
    xs: 3,
    sm: 4,
    md: 6,
    lg: 8
  };

  return (
    <button
      onClick={onToggle}
      className={`
        relative ${sizeClasses[size]} rounded-full p-0.5 transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        ${isDarkMode 
          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 focus:ring-purple-400 shadow-md shadow-purple-500/20' 
          : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 focus:ring-yellow-400 shadow-md shadow-yellow-500/20'
        }
        hover:scale-105 active:scale-95 transform
        ${className}
      `}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Background glow effect */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-500 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-sm opacity-60' 
          : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 blur-sm opacity-60'
        }
      `} />
      
      {/* Toggle track */}
      <div className={`
        relative w-full h-full rounded-full overflow-hidden
        ${isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-blue-200 to-blue-300'
        }
      `}>
        {/* Stars background for dark mode */}
        {isDarkMode && (
          <div className="absolute inset-0">
            {[...Array(starCounts[size])].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute bg-white rounded-full animate-pulse
                  ${size === 'xs' ? 'w-0.5 h-0.5' : 'w-1 h-1'}
                  ${i % 2 === 0 ? 'animate-bounce' : 'animate-ping'}
                `}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Clouds background for light mode */}
        {!isDarkMode && (
          <div className="absolute inset-0">
            {[...Array(cloudCounts[size])].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute bg-white/30 rounded-full animate-pulse
                  ${size === 'xs' 
                    ? (i === 0 ? 'w-2 h-1' : 'w-1.5 h-0.5')
                    : (i === 0 ? 'w-3 h-2' : i === 1 ? 'w-2 h-1' : 'w-4 h-2')
                  }
                `}
                style={{
                  left: `${Math.random() * 60 + 20}%`,
                  top: `${Math.random() * 40 + 30}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Toggle thumb */}
        <div className={`
          absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out
          ${thumbSizes[size]} rounded-full shadow-md
          ${isDarkMode 
            ? `${size === 'xs' ? 'translate-x-5' : size === 'sm' ? 'translate-x-6' : 'translate-x-full'} bg-gradient-to-br from-gray-100 to-gray-300 shadow-purple-500/40` 
            : 'translate-x-0 bg-gradient-to-br from-yellow-200 to-orange-200 shadow-yellow-500/40'
          }
          flex items-center justify-center
          hover:shadow-lg
        `}>
          {/* Icon container with rotation animation */}
          <div className={`
            transition-all duration-500 ease-in-out transform
            ${isDarkMode ? 'rotate-0 scale-100' : 'rotate-180 scale-100'}
          `}>
            {isDarkMode ? (
              <Moon className={`
                ${iconSizes[size]} text-gray-700 transition-all duration-300
                drop-shadow-sm
              `} />
            ) : (
              <Sun className={`
                ${iconSizes[size]} text-orange-600 transition-all duration-300
                drop-shadow-sm animate-pulse
              `} />
            )}
          </div>

          {/* Glow effect around icon */}
          <div className={`
            absolute inset-0 rounded-full transition-all duration-500 ease-in-out
            ${isDarkMode 
              ? 'bg-purple-400/15 blur-sm' 
              : 'bg-yellow-400/20 blur-sm animate-pulse'
            }
          `} />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {[...Array(particleCounts[size])].map((_, i) => (
            <div
              key={i}
              className={`
                absolute rounded-full transition-all duration-1000 ease-in-out
                ${size === 'xs' ? 'w-0.5 h-0.5' : 'w-1 h-1'}
                ${isDarkMode 
                  ? 'bg-purple-300 opacity-50' 
                  : 'bg-yellow-300 opacity-70'
                }
                ${isDarkMode ? 'animate-bounce' : 'animate-ping'}
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Ripple effect on click */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300 ease-out
        ${isDarkMode 
          ? 'bg-purple-400/0 hover:bg-purple-400/10' 
          : 'bg-yellow-400/0 hover:bg-yellow-400/10'
        }
      `} />
    </button>
  );
};

export default AnimatedDarkModeToggle;