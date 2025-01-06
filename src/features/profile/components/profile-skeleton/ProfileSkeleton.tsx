// PostComment.tsx
import React from 'react';
import './profile-skeleton.css';

interface ProfileSkeletonProps {
  type: 'follow' | 'group' | 'direct';
  loading: boolean;
  count?: number;
}

const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
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
    <>
      {type === 'follow' ? (
        <div className={`profile-skeleton ${type}`}>
          <div className="avatar-skeleton"></div>
          <div className="text-skeleton">{renderLines()}</div>
          <div className="button-skeleton"></div>
        </div>
      ) : (
        <div className={`profile-skeleton ${type}`}>
          <div className="avatar-skeleton"></div>
          <div className="text-skeleton">{renderLines()}</div>
        </div>
      )}
    </>
  );
};

export default ProfileSkeleton;
