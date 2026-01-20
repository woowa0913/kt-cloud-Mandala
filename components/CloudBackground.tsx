import React from 'react';
import { Zap, Cloud } from 'lucide-react';

interface Props {
  position?: 'fixed' | 'absolute';
  className?: string;
}

export const CloudBackground: React.FC<Props> = ({ position = 'fixed', className = '' }) => {
  const positionClass = position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0';

  return (
    <div className={`${positionClass} pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Soft Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50 via-white to-sky-100 opacity-80" />
      
      {/* Moving Soft Blobs - Horizontal Flow */}
      {/* Top Left to Right */}
      <div className="absolute top-10 left-[-100px] w-32 h-32 bg-white rounded-full mix-blend-screen filter blur-xl opacity-60 animate-float-horizontal" style={{ animationDuration: '45s', animationDelay: '-10s' }} />
      <div className="absolute top-1/4 left-[-150px] w-48 h-48 bg-sky-100 rounded-full mix-blend-screen filter blur-2xl opacity-50 animate-float-horizontal" style={{ animationDuration: '60s', animationDelay: '-5s' }} />
      <div className="absolute top-5 left-[-50px] w-24 h-24 bg-white rounded-full mix-blend-screen filter blur-lg opacity-70 animate-float-horizontal" style={{ animationDuration: '55s', animationDelay: '0s' }} />

      {/* Right to Left (Reverse) */}
      <div className="absolute bottom-1/3 right-[-100px] w-64 h-64 bg-blue-100 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float-horizontal-reverse" style={{ animationDuration: '70s', animationDelay: '-15s' }} />
      <div className="absolute bottom-20 right-[-120px] w-40 h-40 bg-yellow-50 rounded-full mix-blend-screen filter blur-2xl opacity-50 animate-float-horizontal-reverse" style={{ animationDuration: '50s', animationDelay: '-5s' }} />
      
      {/* More Static/Ambient Clouds */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Floating Cloud Icons - Increased count & adjusted delays */}
      {/* Left to Right set */}
      <div className="absolute top-20 left-[-50px] animate-float-horizontal opacity-40" style={{ animationDuration: '60s', animationDelay: '0s' }}>
        <Cloud className="w-24 h-24 text-white fill-sky-50" />
      </div>
      <div className="absolute top-1/3 left-[-80px] animate-float-horizontal opacity-30" style={{ animationDuration: '75s', animationDelay: '-20s' }}>
        <Cloud className="w-32 h-32 text-sky-100 fill-white" />
      </div>
      <div className="absolute top-2/3 left-[-60px] animate-float-horizontal opacity-35" style={{ animationDuration: '65s', animationDelay: '-10s' }}>
        <Cloud className="w-28 h-28 text-white fill-sky-50" />
      </div>
      <div className="absolute bottom-10 left-[-40px] animate-float-horizontal opacity-25" style={{ animationDuration: '80s', animationDelay: '-30s' }}>
        <Cloud className="w-20 h-20 text-sky-200 fill-white" />
      </div>

      {/* Right to Left set */}
      <div className="absolute bottom-1/4 right-[-60px] animate-float-horizontal-reverse opacity-40" style={{ animationDuration: '65s', animationDelay: '-5s' }}>
        <Cloud className="w-20 h-20 text-white fill-sky-100" />
      </div>
       <div className="absolute top-10 right-[-40px] animate-float-horizontal-reverse opacity-20" style={{ animationDuration: '80s', animationDelay: '-15s' }}>
        <Cloud className="w-40 h-40 text-sky-50 fill-white" />
      </div>
      <div className="absolute top-1/2 right-[-80px] animate-float-horizontal-reverse opacity-30" style={{ animationDuration: '70s', animationDelay: '-25s' }}>
        <Cloud className="w-32 h-32 text-white fill-sky-200" />
      </div>
      <div className="absolute bottom-5 right-[-50px] animate-float-horizontal-reverse opacity-25" style={{ animationDuration: '55s', animationDelay: '0s' }}>
        <Cloud className="w-24 h-24 text-sky-100 fill-white" />
      </div>

      {/* Twinkling Sparks (Yellow & Sky Blue) - Scattered randomly */}
      
      {/* Yellow Sparks */}
      <div className="absolute top-[15%] left-[10%] animate-twinkle" style={{ animationDelay: '0s' }}>
        <Zap className="w-8 h-8 text-yellow-300 fill-yellow-200" />
      </div>
      <div className="absolute bottom-[25%] left-[5%] animate-twinkle" style={{ animationDelay: '2s' }}>
        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-300" />
      </div>
      <div className="absolute top-[40%] right-[15%] animate-twinkle" style={{ animationDelay: '1.5s' }}>
        <Zap className="w-10 h-10 text-yellow-300 fill-yellow-100" />
      </div>
       <div className="absolute bottom-[10%] right-[30%] animate-twinkle" style={{ animationDelay: '4s' }}>
        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-300" />
      </div>

      {/* Sky Blue Sparks */}
      <div className="absolute top-[20%] right-[25%] animate-twinkle" style={{ animationDelay: '1s' }}>
        <Zap className="w-6 h-6 text-sky-300 fill-sky-200" />
      </div>
      <div className="absolute bottom-[35%] right-[5%] animate-twinkle" style={{ animationDelay: '3s' }}>
        <Zap className="w-8 h-8 text-sky-400 fill-sky-200" />
      </div>
      <div className="absolute top-[60%] left-[20%] animate-twinkle" style={{ animationDelay: '0.5s' }}>
        <Zap className="w-5 h-5 text-sky-300 fill-sky-100" />
      </div>
      <div className="absolute top-[80%] left-[80%] animate-twinkle" style={{ animationDelay: '2.5s' }}>
        <Zap className="w-7 h-7 text-sky-300 fill-sky-200" />
      </div>

    </div>
  );
};
