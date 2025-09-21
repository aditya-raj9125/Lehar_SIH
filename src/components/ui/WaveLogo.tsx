import React from 'react';

interface WaveLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

export const WaveLogo: React.FC<WaveLogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true,
  textSize = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Ocean Wave SVG Logo */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main wave body - dark blue */}
          <path
            d="M10,70 Q25,40 40,50 T70,45 T90,55 L90,100 L10,100 Z"
            fill="#1e40af"
            className="drop-shadow-sm"
          />
          
          {/* Wave mid-tone - light blue */}
          <path
            d="M10,70 Q25,50 40,60 T70,55 T90,65 L90,100 L10,100 Z"
            fill="#3b82f6"
          />
          
          {/* Wave crest foam - white */}
          <path
            d="M10,70 Q25,35 40,45 T70,40 T90,50 L90,70 L10,70 Z"
            fill="#ffffff"
            className="drop-shadow-sm"
          />
          
          {/* Foam details - smaller white splashes */}
          <path
            d="M15,45 Q20,35 25,40 T35,38 T45,42"
            fill="#ffffff"
            opacity="0.9"
          />
          <path
            d="M50,42 Q55,32 60,37 T70,35 T80,39"
            fill="#ffffff"
            opacity="0.9"
          />
          
          {/* Additional foam splashes */}
          <circle cx="20" cy="40" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="35" cy="35" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="55" cy="37" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="75" cy="39" r="1.5" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground ${textSizeClasses[textSize]}`}>
            LEHAR
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            Ocean Hazard Monitoring
          </span>
        </div>
      )}
    </div>
  );
};

export default WaveLogo;
