import React from 'react';

export const PagePlaceholder = ({ title }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-heading">{title}</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-bg-layer-2 text-text-enabled rounded-lg hover:bg-white/10 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-primary text-text-on-primary rounded-lg hover:opacity-90 transition-opacity">
            Create New
          </button>
        </div>
      </div>

      {/* Mock Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-bg-layer-1 border border-stroke-divider">
            <div className="h-4 w-24 bg-white/5 rounded mb-4" />
            <div className="h-8 w-32 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      <div className="p-8 rounded-xl bg-bg-layer-1 border border-stroke-divider min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-bg-layer-2 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-text-subheading font-medium">Developing {title} Module...</p>
          <p className="text-text-paragraph text-sm max-w-xs mx-auto">
            This module is currently under development to match the premium inXits reporting standards.
          </p>
        </div>
      </div>
    </div>
  );
};
