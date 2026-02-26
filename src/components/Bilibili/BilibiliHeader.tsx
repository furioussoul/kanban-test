import React from 'react';
import { Search, User, Bell, MessageSquare, History, Upload, Menu } from 'lucide-react';

const BilibiliHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center justify-between px-6">
      {/* Left section: Logo and Nav */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="text-blue-400 text-xl font-bold hidden md:block">bilibili</span>
        </div>
        <nav className="hidden lg:flex items-center space-x-4 text-gray-700">
          <a href="#" className="hover:text-blue-400">首页</a>
          <a href="#" className="hover:text-blue-400">番剧</a>
          <a href="#" className="hover:text-blue-400">直播</a>
          <a href="#" className="hover:text-blue-400">游戏中心</a>
          <a href="#" className="hover:text-blue-400">会员购</a>
          <a href="#" className="hover:text-blue-400">下载客户端</a>
        </nav>
      </div>

      {/* Middle section: Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 bg-gray-100 rounded-lg pl-4 pr-10 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 transition-all"
          />
          <button className="absolute right-3 top-2.5 text-gray-400 group-hover:text-blue-400">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Right section: Icons and User */}
      <div className="flex items-center space-x-6 text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer hover:text-blue-400 flex flex-col items-center">
            <User size={20} />
            <span className="text-[10px] hidden md:block">登录</span>
          </div>
          <div className="cursor-pointer hover:text-blue-400 flex flex-col items-center relative">
            <Bell size={20} />
            <span className="text-[10px] hidden md:block">消息</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full">2</span>
          </div>
          <div className="cursor-pointer hover:text-blue-400 flex flex-col items-center">
            <History size={20} />
            <span className="text-[10px] hidden md:block">历史</span>
          </div>
        </div>
        <button className="bg-pink-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-pink-500 transition-colors">
          <Upload size={18} />
          <span className="font-medium">投稿</span>
        </button>
      </div>
    </header>
  );
};

export default BilibiliHeader;
