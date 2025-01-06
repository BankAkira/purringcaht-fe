// import (Internal imports)
import { useState, useEffect } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// flowbite-react
import { Spinner } from 'flowbite-react';

// type
import { PointLog } from '../../type/point';

// helper functions
import { pointPurrKit } from '../../helper/point';
import { formatDate } from '../../helper/format-date';
import useResponsive from '../../helper/hook/useResponsive';

// redux
import { useSelector } from '../../redux';

// APIs
import { getPointLogsMe } from '../../rest-api/point';

// images
import emptyMediaImage from '../../asset/images/empty-img/empty-media.svg';

// icons
import PurrPointsToken from '../../asset/icon/icons/PurrPointsToken.svg';

const tabs = [
  {
    name: 'List',
    value: 'all',
  },
  // {
  //   name: 'Received',
  //   value: 'received',
  // },
  // {
  //   name: 'Used',
  //   value: 'used',
  // },
];

export default function PurrPoints() {
  const { isTabletOrMobile } = useResponsive();
  const { points } = useSelector(state => state.userPoint);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredPoints, setFilteredPoints] = useState<PointLog[] | []>([]);

  useEffect(() => {
    fetchPointsLog();
  }, [activeTab]);

  const fetchPointsLog = async () => {
    try {
      const res = await getPointLogsMe();
      if (res) setFilteredPoints(res.results);
      console.log('res points', res);
    } catch (error) {
      console.error('error', error);
    }
  };

  const onTabChange = async (tab: string) => {
    setActiveTab(tab);
  };

  const pointCard = (point: PointLog) => (
    <div className="grid grid-cols-[auto_1fr_auto] items-center">
      <CustomImg>
        <img
          src={PurrPointsToken}
          width={70}
          height={70}
          alt="COINS_CAT"
          className={point.isOutcome ? 'filter-grayscale' : ''}
        />
      </CustomImg>
      <div className="flex flex-col justify-center">
        <p className="text-gray-900 text-base font-medium">{point.type}</p>
        <span className="text-[#6B7280] text-sm font-normal">
          Time: {formatDate(point.createdAt)}
        </span>
      </div>
      <p
        className={`${point.isOutcome ? 'text-red-600' : 'text-green-500'} text-xl font-medium`}>
        {point?.isOutcome ? '-' : '+'}
        {pointPurrKit(point.amount)}
      </p>
    </div>
  );

  return (
    <div
      className={classNames('flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="text-gray-900 text-2xl font-bold max-lg:text-xl">
        Points history
      </div>

      <div className="border-b py-5">
        <div className="flex items-center">
          <img src={PurrPointsToken} width={65} height={65} alt="COINS_CAT" />
          <p className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-2xl font-medium text-transparent">
            {points} PurrPoints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 pb-3 max-lg:mt-0">
        {tabs.map(tab => (
          <div
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={classNames(
              'flex justify-center items-center gap-2 border-b py-3 cursor-pointer text-base text-gray-500 border-gray-300 max-md:flex-col max-md:gap-0',
              {
                '!border-orange-500 !text-orange-500': activeTab === tab.value,
              }
            )}>
            <span className="max-md:text-xs">{tab.name}</span>
          </div>
        ))}
      </div>

      {!filteredPoints.length && (
        <div className="flex items-center justify-center h-[250px]">
          <div className="media-thumbnail-container small">
            <div className="flex flex-col items-center justify-center w-full gap-2 text-center overflow-indicator">
              <img src={emptyMediaImage} width={60} alt="empty media" />
              <span className="text-sm font-normal text-gray-500">
                No media
              </span>
              <span className="text-xs font-light text-gray-400 max-w-xs">
                The photos, videos and files you keep will appear here
              </span>
            </div>
          </div>
        </div>
      )}

      <div>
        <InfiniteScroll
          dataLength={filteredPoints.length}
          next={() => {}}
          hasMore={false}
          scrollableTarget="app-main"
          loader={
            <div className="my-3">
              <Spinner className="w-12 h-12" />
            </div>
          }
          endMessage={
            <p
              className="text-center py-2 rounded-b-lg"
              style={{
                background:
                  'linear-gradient(274deg, #ffecf1 1.97%, #fff1e6 100%)',
              }}>
              No more data to load.
            </p>
          }>
          <div className="flex flex-col gap-6">
            {filteredPoints.map(point => (
              <div className="border-b p-3" key={point.id}>
                {pointCard(point)}
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

const CustomImg = styled.div`
  .filter-grayscale {
    filter: grayscale(100%) brightness(0.99) contrast(1.2);
  }
`;
