import React from 'react';

interface ScreenSkeletonProps {
  type?: 'screen' | 'modal' | 'detail';
}

export const ScreenSkeleton: React.FC<ScreenSkeletonProps> = ({ type = 'screen' }) => {
  if (type === 'modal') {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in-up"
        role="status"
        aria-live="polite"
      >
        <div className="w-full max-w-lg bg-[#1b1b1d] rounded-t-3xl sm:rounded-3xl border border-[#353437]/50 p-6 flex flex-col gap-4 animate-pulse">
          <div className="w-12 h-1.5 bg-[#353437] rounded-full mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-[#2a2a2c] rounded-lg" />
            <div className="h-8 w-8 bg-[#2a2a2c] rounded-full" />
          </div>
          <div className="space-y-3 py-4">
            <div className="h-20 bg-[#201f21] rounded-2xl border border-[#353437]/40" />
            <div className="h-20 bg-[#201f21] rounded-2xl border border-[#353437]/40" />
          </div>
          <div className="h-12 bg-[#2a2a2c] rounded-xl w-full" />
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in-up"
        role="status"
        aria-live="polite"
      >
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-4 animate-pulse">
          <div className="h-4 w-16 bg-[#2a2a2c] rounded-md" />
          <div className="h-3 w-3 bg-[#353437] rounded-full" />
          <div className="h-4 w-32 bg-[#2a2a2c] rounded-md" />
        </div>

        {/* Hero Visual Skeleton */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl bg-[#1b1b1d] border border-[#353437]/40 animate-pulse mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/5 to-transparent animate-shimmer" />
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 animate-pulse">
            <div className="h-8 w-2/3 bg-[#2a2a2c] rounded-xl" />
            <div className="h-4 w-full bg-[#201f21] rounded-md" />
            <div className="h-4 w-5/6 bg-[#201f21] rounded-md" />
            <div className="h-32 bg-[#1b1b1d] rounded-2xl border border-[#353437]/30 mt-6" />
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-64 bg-[#1b1b1d] rounded-2xl border border-[#353437]/40 p-5 space-y-4">
              <div className="h-6 w-1/2 bg-[#2a2a2c] rounded-lg" />
              <div className="h-10 w-full bg-[#f2ca50]/20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in-up"
      role="status"
      aria-live="polite"
    >
      {/* Top Section Header Placeholder */}
      <div className="flex items-center justify-between mb-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#f2ca50]/20 rounded-md" />
          <div className="h-7 w-48 bg-[#2a2a2c] rounded-xl" />
        </div>
        <div className="h-8 w-24 bg-[#201f21] rounded-full border border-[#353437]/40" />
      </div>

      {/* Featured Banner Skeleton */}
      <div className="w-full h-36 sm:h-48 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 mb-6 p-6 flex flex-col justify-center gap-3 animate-pulse relative overflow-hidden">
        <div className="h-5 w-1/3 bg-[#2a2a2c] rounded-lg" />
        <div className="h-4 w-2/3 bg-[#201f21] rounded-md" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/5 to-transparent animate-shimmer" />
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-3 border border-[#353437]/40 shadow-sm animate-pulse min-h-[220px]"
          >
            <div className="w-full aspect-[4/3] rounded-xl bg-[#201f21] mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-[#2a2a2c] rounded-md" />
              <div className="h-3 w-1/2 bg-[#201f21] rounded-md" />
            </div>
            <div className="mt-4 pt-2.5 border-t border-[#353437]/30 flex items-center justify-between">
              <div className="h-4 w-16 bg-[#f2ca50]/20 rounded-md" />
              <div className="h-8 w-20 bg-[#2a2a2c] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
