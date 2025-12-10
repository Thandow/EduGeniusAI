import React, { useEffect, useState } from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Allow exit animation to finish
    }, 2500); // Display time

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br from-teal-600 to-blue-700 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-center text-white p-8">
        <div className="relative inline-block mb-4 animate-bounce">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl relative z-10">
                <GraduationCap className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            EduGenie
        </h1>
        <p className="text-teal-100 text-lg font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Intelligent Content Generation
        </p>

        <div className="mt-8 w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left' }}></div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.7); }
            100% { transform: scaleX(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
