'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Spotlight from './components/Spotlight';
import { corporateColors } from './constants/colors';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Mouse tracking spotlight */}
      <Spotlight />

      {/* Interactive particle canvas */}
      <ParticleBackground />

      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-16 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-8 sm:gap-12 w-full">
          {/* Logos */}
         <div className="max-w-[800px] flex items-center justify-center gap-2 sm:gap-3">
          <img 
            src="/MagicBlock-Logo-White.png" 
            alt="MagicBlock Logo" 
            className="h-6 sm:h-9 max-w-[200px]"
          />
         </div>

         {/* Title & Date */}
         <div className="flex justify-center px-2 flex-col">
           <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-white max-w-4xl">
             Virtual Hacker House
           </h2>
          <p className="text-base sm:text-lg md:text-2xl text-center text-gray-300 max-w-2xl font-light">
             7th - 9th January 2026
           </p>
         </div>

         {/* Subtitle */}
         <div className="flex flex-col justify-center px-2">
            <p className="text-base sm:text-lg md:text-2xl text-center text-gray-300 max-w-xl">
              Join MagicBlock team, get feedback, and push what's possible on Solana!
            </p>
         </div>

         {/* CTA Buttons */}
         <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto px-2">
          {/* Join Virtual Button */}
          <Link
            href="https://play.workadventu.re/@/magicblock/magicblock-office/startup"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-5 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all touch-manipulation flex items-center justify-center"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-400 to-blue-400 blur-xl transition-opacity duration-300"></div>
            
            {/* Content */}
            <span className="relative text-white whitespace-nowrap">
              🚀 Join Virtual Office
            </span>
          </Link>

          {/* Submit Project Button */}
          <div className="group relative px-5 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg rounded-3xl overflow-hidden shadow-lg transition-all touch-manipulation opacity-50 cursor-not-allowed">
            {/* Border + background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-500/10 transition-all duration-300"></div>
            <div className="absolute inset-0 border-2 border-gray-500/30 rounded-3xl transition-colors duration-300"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-gray-400 to-gray-400 blur-xl transition-opacity duration-300 -z-10"></div>
            
            {/* Content */}
            <div className="relative flex flex-col items-center justify-center ">
              <span className="text-gray-400 whitespace-nowrap">
                💡 Submit Your Project
              </span>
              <p className="text-xs text-gray-500 font-light">Available from 9th January 2026</p>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full max-w-5xl mx-auto px-4">
          <div className="w-full sm:w-80 backdrop-blur-md bg-white/5 border rounded-2xl px-8 py-12 sm:px-10 sm:py-16 hover:scale-105 transition-all duration-300 cursor-pointer transform" style={{ borderColor: `${corporateColors.purple}40`, backgroundColor: `${corporateColors.purple}08` }}>
            <div className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg" style={{ color: corporateColors.purple }}>Real-Time</div>
            <p className="text-xs sm:text-sm text-gray-400">Sub 50 ms block time</p>
          </div>
          <div className="w-full sm:w-80 backdrop-blur-md bg-white/5 border rounded-3xl px-8 py-12 sm:px-10 sm:py-16 hover:scale-105 transition-all duration-300 cursor-pointer transform touch-manipulation" style={{ borderColor: `${corporateColors.coral}40`, backgroundColor: `${corporateColors.coral}08` }}>
            <div className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg" style={{ color: corporateColors.coral }}>Zero Gas Fees</div>
            <p className="text-xs sm:text-sm text-gray-400">Scale indefinitely</p>
          </div>

          <div className="w-full sm:w-80 backdrop-blur-md bg-white/5 border rounded-3xl px-8 py-12 sm:px-10 sm:py-16 hover:scale-105 transition-all duration-300 cursor-pointer transform touch-manipulation" style={{ borderColor: `${corporateColors.blue}40`, backgroundColor: `${corporateColors.blue}08` }}>
            <div className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg" style={{ color: corporateColors.blue }}>Customization</div>
            <p className="text-xs sm:text-sm text-gray-400">Use VRF, privacy, and cranks</p>
          </div>
          <div className="w-full sm:w-80 backdrop-blur-md bg-white/5 border rounded-3xl px-8 py-12 sm:px-10 sm:py-16 hover:scale-105 transition-all duration-300 cursor-pointer transform touch-manipulation" style={{ borderColor: `${corporateColors.teal}40`, backgroundColor: `${corporateColors.teal}08` }}>
            <div className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg" style={{ color: corporateColors.teal }}>Solana Native</div>
            <p className="text-xs sm:text-sm text-gray-400">Built on Solana</p>
          </div>
        </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 right-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse opacity-50 animate-float"></div>
      <div className="absolute bottom-1/3 left-10 w-3 h-3 bg-blue-500 rounded-full animate-pulse opacity-50 animation-delay-1000 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-50 animation-delay-500 animate-float" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}
