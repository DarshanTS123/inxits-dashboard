import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageLoader } from '../components/ui/PageLoader';
import InxitsLogo from '../assets/Inxits.svg';
import UnionPattern from '../assets/Union.png';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-page">
      {/* Left Section - Brand Identity (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a1b3d] items-center justify-center border-r border-white/5">
        {/* Geometric Pattern - Centered around logo */}
        <div
          className="absolute w-[120%] h-[120%] opacity-50 pointer-events-none animate-[spin_100s_linear_infinite]"
          style={{
            backgroundImage: `url(${UnionPattern})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'plus-lighter',
          }}
        />

        {/* Brand Logo */}
        <div className="relative z-10 w-full max-w-[380px] px-12">
          <img src={InxitsLogo} alt="inXits" />
        </div>
      </div>

      {/* Right Section - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 relative overflow-hidden">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden mb-12 w-full max-w-[180px]">
          <img src={InxitsLogo} alt="inXits" className="w-full h-auto" />
        </div>

        <div className="w-full max-w-[420px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
