// import { useState } from 'react';
import useResponsive from '../../../helper/hook/useResponsive';
import { useDispatch } from 'react-redux';
import { tabChange } from '../../../redux/nft';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';

export default function TabSection() {
  const listTab = ['My NFTs', 'Gacha', 'Shop', 'NFTs Utilizing'];
  // const listTab = ['My NFTs'];
  const { isTabletOrMobile } = useResponsive();
  const dispatch = useDispatch();
  const { tabClick } = useSelector((state: RootState) => state.nft);

  return (
    <section
      className={`w-[300px] h-[288px] flex ${isTabletOrMobile ? 'w-full h-fit' : 'flex-col p-4'} bg-white`}>
      {listTab.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              dispatch(tabChange(item));
            }}
            style={{
              backgroundImage: `${tabClick === item ? 'linear-gradient(96deg, rgba(255, 241, 230, 0.80) 0%, rgba(255, 236, 241, 0.80) 68.49%, rgba(250, 236, 245, 0.80) 100%)' : ''}`,
              borderLeft: `${tabClick === item ? '2px solid rgba(254, 118, 1, 0.80)' : ''}`,
            }}
            className="cursor-pointer px-2 h-14 rounded-r-lg flex items-center font-semibold flex-1">
            {item}
          </div>
        );
      })}
    </section>
  );
}
