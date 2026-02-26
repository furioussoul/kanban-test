import React from 'react';

const BilibiliBanner: React.FC = () => {
  return (
    <div className="relative w-full h-[180px] overflow-hidden rounded-xl group">
      <img 
        src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
        alt="Bilibili Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-4 left-6 text-white">
        <h2 className="text-2xl font-bold shadow-sm">欢迎来到哔哩哔哩</h2>
        <p className="text-sm opacity-90">在这里发现有趣的世界</p>
      </div>
      
      {/* Floating logo or decoration */}
      <div className="absolute right-10 bottom-4 w-24 h-24 hidden md:block group-hover:scale-110 transition-transform cursor-pointer">
          <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center p-4">
              <div className="w-full h-full bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-3xl">
                  B
              </div>
          </div>
      </div>
    </div>
  );
};

export default BilibiliBanner;
