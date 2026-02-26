import React from 'react';
import { Play, List, Tv } from 'lucide-react';

interface VideoProps {
  id: number;
  thumbnail: string;
  title: string;
  author: string;
  views: string;
  date: string;
  duration: string;
}

const BilibiliVideoCard: React.FC<VideoProps> = ({
  thumbnail,
  title,
  author,
  views,
  date,
  duration,
}) => {
  return (
    <div className="flex flex-col cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Bottom stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between px-2 text-white text-[12px]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Play size={14} className="mr-1" />
              {views}
            </span>
            <span className="flex items-center">
              <Tv size={14} className="mr-1" />
              {Math.floor(Math.random() * 1000)}
            </span>
          </div>
          <span>{duration}</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5">
        <h3 className="text-[15px] font-medium leading-[20px] text-gray-900 line-clamp-2 group-hover:text-blue-400 transition-colors h-[40px]">
          {title}
        </h3>
        <div className="mt-2 flex flex-col text-[13px] text-gray-500">
          <div className="flex items-center hover:text-blue-400">
             <span className="mr-1">UP</span>
             <span className="truncate">{author}</span>
          </div>
          <span className="mt-0.5">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default BilibiliVideoCard;
