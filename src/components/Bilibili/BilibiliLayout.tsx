import React from 'react';
import BilibiliHeader from './BilibiliHeader';
import BilibiliCategory from './BilibiliCategory';
import BilibiliVideoCard from './BilibiliVideoCard';

const DUMMY_VIDEOS = [
  {
    id: 1,
    title: "【精选】这才是真正的B站！2024最值得看的内容合集",
    author: "B站官方",
    views: "120.5万",
    date: "2小时前",
    duration: "15:20",
    thumbnail: "https://picsum.photos/seed/1/400/225"
  },
  {
    id: 2,
    title: "如何用React实现一个B站？从零开始手把手教你",
    author: "程序员小王",
    views: "5.8万",
    date: "1天前",
    duration: "45:30",
    thumbnail: "https://picsum.photos/seed/2/400/225"
  },
  {
    id: 3,
    title: "绝美风景！航拍镜头下的中国大地，美到窒息",
    author: "地理君",
    views: "234万",
    date: "3天前",
    duration: "08:12",
    thumbnail: "https://picsum.photos/seed/3/400/225"
  },
  {
    id: 4,
    title: "深度解析：为什么这个视频会火遍全网？",
    author: "数据挖掘机",
    views: "12.3万",
    date: "5小时前",
    duration: "12:45",
    thumbnail: "https://picsum.photos/seed/4/400/225"
  },
  {
    id: 5,
    title: "美味挑战！尝试制作全国各地的特色早餐",
    author: "美食探店达人",
    views: "89万",
    date: "昨天",
    duration: "20:00",
    thumbnail: "https://picsum.photos/seed/5/400/225"
  },
  {
    id: 6,
    title: "2024最强装机指南：从入门到骨灰级玩家",
    author: "科技评测站",
    views: "45.6万",
    date: "4天前",
    duration: "32:15",
    thumbnail: "https://picsum.photos/seed/6/400/225"
  },
  {
    id: 7,
    title: "治愈系动画：那年夏天的我们，又回来了",
    author: "漫话家",
    views: "12.1万",
    date: "12小时前",
    duration: "04:50",
    thumbnail: "https://picsum.photos/seed/7/400/225"
  },
  {
    id: 8,
    title: "手办开箱：全网首发！这款高达真的太帅了",
    author: "模玩分享",
    views: "8.2万",
    date: "2天前",
    duration: "18:30",
    thumbnail: "https://picsum.photos/seed/8/400/225"
  },
  {
    id: 9,
    title: "编程实战：使用Tailwind CSS快速搭建现代UI",
    author: "前端架构师",
    views: "3.4万",
    date: "3小时前",
    duration: "25:10",
    thumbnail: "https://picsum.photos/seed/9/400/225"
  },
  {
    id: 10,
    title: "猫咪日常：我家主子今天又做了什么惊人之举？",
    author: "铲屎官日记",
    views: "56.7万",
    date: "1天前",
    duration: "06:22",
    thumbnail: "https://picsum.photos/seed/10/400/225"
  },
  {
    id: 11,
    title: "历史揭秘：那些被遗忘的古代黑科技",
    author: "考古小队",
    views: "15.9万",
    date: "5天前",
    duration: "14:40",
    thumbnail: "https://picsum.photos/seed/11/400/225"
  },
  {
    id: 12,
    title: "极简生活：如何通过断舍离找回内心的平静",
    author: "生活美学师",
    views: "7.5万",
    date: "6小时前",
    duration: "11:05",
    thumbnail: "https://picsum.photos/seed/12/400/225"
  }
];

const BilibiliLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <BilibiliHeader />
      
      <main className="pt-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        <BilibiliCategory />
        
        {/* Video Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
          {DUMMY_VIDEOS.map((video) => (
            <BilibiliVideoCard key={video.id} {...video} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default BilibiliLayout;
