import React, { useState } from 'react';

const CATEGORIES = [
  '首页', '动画', '番剧', '国创', '音乐', '舞蹈', '游戏', '知识', '科技', '运动',
  '汽车', '生活', '美食', '动物圈', '鬼畜', '时尚', '娱乐', '纪录片', '影视', '课程'
];

const BilibiliCategory: React.FC = () => {
  const [active, setActive] = useState('首页');

  return (
    <div className="flex overflow-x-auto whitespace-nowrap space-x-2 py-4 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => setActive(category)}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium ${
            active === category 
              ? 'bg-blue-400 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default BilibiliCategory;
