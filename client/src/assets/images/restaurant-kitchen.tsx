export const RestaurantKitchenSVG = () => (
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kitchen-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#333" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>
      <filter id="flame-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
      </filter>
    </defs>
    
    {/* Dark kitchen background */}
    <rect width="800" height="400" fill="url(#kitchen-gradient)" />
    
    {/* Kitchen counters and equipment */}
    <rect x="50" y="150" width="700" height="200" fill="#222" />
    <rect x="50" y="140" width="700" height="10" fill="#333" />
    
    {/* Stove */}
    <rect x="200" y="80" width="180" height="120" fill="#111" />
    <rect x="210" y="90" width="160" height="100" fill="#222" />
    <circle cx="250" cy="120" r="30" fill="#333" />
    <circle cx="250" cy="120" r="25" fill="#111" />
    <circle cx="340" cy="120" r="30" fill="#333" />
    <circle cx="340" cy="120" r="25" fill="#111" />
    
    {/* Flames */}
    <g filter="url(#flame-blur)">
      <circle cx="250" cy="120" r="15" fill="#ff6600" opacity="0.8" />
      <path d="M 240,120 Q 250,90 260,120" stroke="#ff9933" strokeWidth="8" fill="none" />
    </g>
    
    {/* Chef */}
    <circle cx="450" cy="120" r="40" fill="#f0d0b0" /> {/* Face */}
    <rect x="410" y="160" width="80" height="120" fill="#ffffff" /> {/* Chef coat */}
    <rect x="420" y="160" width="60" height="10" fill="#eeeeee" /> {/* Collar */}
    <circle cx="440" cy="115" r="5" fill="#333" /> {/* Eye */}
    <circle cx="460" cy="115" r="5" fill="#333" /> {/* Eye */}
    <path d="M 435,135 Q 450,145 465,135" stroke="#333" strokeWidth="3" fill="none" /> {/* Smile */}
    <rect x="425" y="70" width="50" height="30" fill="#222" /> {/* Chef hat */}
    <rect x="415" y="90" width="70" height="10" fill="#ffffff" /> {/* Hat base */}
    
    {/* Pots and pans */}
    <rect x="150" y="140" width="60" height="40" fill="#555" />
    <rect x="500" y="140" width="80" height="30" fill="#444" />
    
    {/* Utensils */}
    <rect x="400" y="180" width="5" height="90" fill="#999" transform="rotate(30, 400, 180)" />
    <rect x="600" y="150" width="5" height="70" fill="#999" transform="rotate(-20, 600, 150)" />
    
    {/* Steam/smoke effects */}
    <g opacity="0.5">
      <path d="M 240,90 Q 250,70 260,90" stroke="#ffffff" strokeWidth="3" fill="none" />
      <path d="M 255,85 Q 265,65 275,85" stroke="#ffffff" strokeWidth="2" fill="none" />
      <path d="M 330,85 Q 340,65 350,85" stroke="#ffffff" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

export default RestaurantKitchenSVG;