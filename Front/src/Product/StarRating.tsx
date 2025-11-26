// src/components/StarRating.tsx
import { useState } from 'react';

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number, cart_id: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showRatingText?: boolean;
  className?: string;
  cart_id: number;
}

export default function StarRating({
  maxStars = 5,
  cart_id = 0, // Use the prop directly
  initialRating = 0,
  onRatingChange,
  size = 'md',
  disabled = false,
  showRatingText = true,
  className = ''
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    if (disabled) return;
    setRating(value);
    // Use the cart_id prop directly instead of state
    onRatingChange?.(value, cart_id);
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= (hover || rating);
          
          return (
            <button
              key={starValue}
              type="button"
              className={`
                transition-all duration-100 ease-in-out p-1
                ${sizeClasses[size]}
                ${!disabled ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'}
                ${isActive ? 'text-yellow-400' : 'text-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded
              `}
              onClick={() => handleClick(starValue)} // Pass only starValue
              onMouseEnter={() => !disabled && setHover(starValue)}
              onMouseLeave={() => !disabled && setHover(0)}
              disabled={disabled}
              aria-label={`Rate ${starValue} out of ${maxStars}`}
            >
              ★
            </button>
          );
        })}
      </div>
      
      {showRatingText && rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          ({rating}/{maxStars})
        </span>
      )}
    </div>
  );
}