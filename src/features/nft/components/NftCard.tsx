import React from 'react';

interface NftCardProps {
  identifier: string;
  name: string;
  imageUrl: string;
}

const NftCard: React.FC<NftCardProps> = ({ identifier, name, imageUrl }) => {
  return (
    <li
      className="w-[19%] min-w-[200px] h-[346px] rounded-xl relative"
      style={{
        boxShadow:
          '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
      }}>
      <img src={imageUrl} alt={name} className="w-full h-[50%] rounded-t-xl" />
      <div className="w-full h-[50%] flex flex-col">
        <h1 className="px-4 py-5 text-xl font-bold">{name}</h1>
        <p className="px-4 text-gray-500">NFT ID: {identifier}</p>
      </div>
    </li>
  );
};

export default NftCard;
