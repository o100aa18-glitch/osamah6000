import { useEffect, useState } from 'react';
import './AnimatedRobot.css';

interface AnimatedRobotProps {
  onClick?: () => void;
}

export function AnimatedRobot({ onClick }: AnimatedRobotProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // تشغيل الحركات بشكل مستمر
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 4000); // تكرار كل 4 ثواني

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="animated-robot"
      onClick={onClick}
      title="AI OSAMAH711X"
      translate="no"
    >
      <svg
        viewBox="0 0 200 280"
        className="robot-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* الرأس */}
        <g className={`robot-head ${isAnimating ? 'nod' : ''}`}>
          <rect x="60" y="20" width="80" height="80" rx="10" fill="#2563eb" />
          {/* العيون */}
          <circle cx="80" cy="45" r="8" fill="#fff" />
          <circle cx="120" cy="45" r="8" fill="#fff" />
          {/* البؤبؤ */}
          <circle cx="80" cy="45" r="4" fill="#000" className="pupil" />
          <circle cx="120" cy="45" r="4" fill="#000" className="pupil" />
          {/* الفم */}
          <path d="M 85 65 Q 100 75 115 65" stroke="#fff" strokeWidth="2" fill="none" />
        </g>

        {/* الجسم */}
        <rect x="70" y="110" width="60" height="70" rx="5" fill="#3b82f6" />

        {/* الذراع اليسرى */}
        <g className={`robot-arm-left ${isAnimating ? 'wave' : ''}`}>
          <rect x="35" y="120" width="35" height="15" rx="7" fill="#2563eb" />
          <circle cx="35" cy="127" r="8" fill="#1e40af" />
        </g>

        {/* الذراع اليمنى */}
        <g className="robot-arm-right">
          <rect x="130" y="120" width="35" height="15" rx="7" fill="#2563eb" />
          <circle cx="165" cy="127" r="8" fill="#1e40af" />
        </g>

        {/* الساق اليسرى */}
        <rect x="80" y="185" width="15" height="50" rx="7" fill="#1e40af" />
        {/* الساق اليمنى */}
        <rect x="105" y="185" width="15" height="50" rx="7" fill="#1e40af" />

        {/* الأقدام */}
        <ellipse cx="87" cy="240" rx="12" ry="8" fill="#0f172a" />
        <ellipse cx="112" cy="240" rx="12" ry="8" fill="#0f172a" />

        {/* الزر AI */}
        <circle cx="100" cy="260" r="12" fill="#ec4899" />
        <text x="100" y="265" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
          AI
        </text>
      </svg>

      {/* نص الاسم */}
      <div className="robot-name" translate="no">
        AI OSAMAH711X
      </div>
    </div>
  );
}
