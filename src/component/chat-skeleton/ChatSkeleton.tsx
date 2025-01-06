// ChatSkeleton.tsx
import React from 'react';
import './chat-skeleton.css';

interface ChatSkeletonProps {
  type: 'group' | 'direct';
  loading: boolean;
  count?: number;
}

const ChatSkeleton: React.FC<ChatSkeletonProps> = ({
  type,
  loading,
  count = 2,
}) => {
  if (!loading) {
    return null;
  }

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < count; i++) {
      lines.push(
        <div
          key={i}
          className={`line-skeleton ${i === 0 ? 'long' : 'short'}`}></div>
      );
    }
    return lines;
  };

  return (
    <div className={`chat-skeleton ${type}`}>
      <div className="avatar-skeleton"></div>
      <div className="text-skeleton">{renderLines()}</div>
    </div>
  );
};

export default ChatSkeleton;
