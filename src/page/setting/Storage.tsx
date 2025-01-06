// import (Internal imports)
import { useState } from 'react';

// react-icons
import { GoDotFill } from 'react-icons/go';
import { PiShareFatBold } from 'react-icons/pi';
import { FaAngleDown, FaAngleUp, FaChevronRight } from 'react-icons/fa6';

// react-multi-progress
import MultiProgress from 'react-multi-progress';

// helper functions
// import { Logger } from '../../helper/logger';
import useResponsive from '../../helper/hook/useResponsive';

// component
import Button from '../../component/button/Button';
import StorageCard from '../../component/setting/StorageCard';
import StorageTable from '../../component/setting/StorageTable';

// icons
import Logo from '../../asset/icon/Logo';
import classNames from 'classnames';

const mockData = [
  {
    type: 'Media',
    store: '99.93 GB',
    color: '#4B99F1',
  },
  {
    type: 'Files',
    store: '99.93 GB',
    color: '#F05252',
  },
  {
    type: 'Massage',
    store: '99.93 GB',
    color: '#0E9F6E',
  },
  {
    type: 'Plug in',
    store: '99.93 GB',
    color: '#E3A008',
  },
];

// const log = new Logger('Storage');

export default function Storage() {
  const { isTabletOrMobile } = useResponsive();

  // const [toggleBtn, setToggleBtn] = useState(true);
  const [toggleDetailed, setToggleDetailed] = useState(true);

  // const switchBtn = () => {
  //   return (
  //     <div className="flex w-full items-center justify-center">
  //       <div className="flex w-full items-center justify-around max-w-[220px] h-[35px] bg-gray-100 rounded-full relative">
  //         <div
  //           onClick={() => setToggleBtn(prev => !prev)}
  //           className={
  //             'flex items-center z-10 text-sm transition cursor-pointer ' +
  //             (toggleBtn ? 'text-white' : '')
  //           }>
  //           Monthly
  //         </div>
  //         <div
  //           onClick={() => setToggleBtn(prev => !prev)}
  //           className={
  //             'flex items-center z-10 text-sm transition cursor-pointer ' +
  //             (toggleBtn ? '' : 'text-white')
  //           }>
  //           Yearly
  //         </div>
  //         <Button
  //           onClick={() => setToggleBtn(prev => !prev)}
  //           className={
  //             'absolute left-0 transition !flex items-center justify-center gap-2 w-[110px] h-[35px] !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none ' +
  //             (toggleBtn ? '' : 'translate-x-[110px]')
  //           }
  //           label=""
  //           size="lg"
  //         />{' '}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div
      className={classNames('h-screen flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        {!isTabletOrMobile ? (
          <Logo width={110} height={110} />
        ) : (
          <Logo width={70} height={70} />
        )}
        <span className="text-4xl max-lg:text-2xl font-semibold">
          You’ve got 2 TB of storage
        </span>
        <span className="text-lg font-normal text-gray-500 -mt-3">
          Storage in Purring Chat
        </span>
        <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
          (This feature will be available soon.)
        </span>
        <Button
          className="!flex items-center justify-center w-full max-w-[312px] gap-2 !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none"
          label="Get More storage"
        />
      </div>

      <div className="w-full flex flex-col items-start justify-center gap-2 max-w-[800px]">
        173.94 GB of 2 TB used
        <MultiProgress
          backgroundColor="#D1D5DB"
          height="14px"
          roundLastElement={false}
          elements={mockData.map(item => ({
            value: Math.random() * 30,
            color: item.color,
          }))}
        />
      </div>

      <div className="w-full flex flex-col items-start justify-center gap-1 max-w-[500px]">
        <span className="text-base font-medium text-gray-500 mb-3">
          STORAGE DETAILS
        </span>
        {mockData.map((item, index) => (
          <div key={index} className="flex w-full items-center gap-5">
            <GoDotFill
              className="text-[40px] w-[40px] min-w-[40px] h-[40px] -mt-[2px]"
              style={{ color: item.color }}
            />
            <div className="text-base font-medium w-full">{item.type}</div>
            <div className="text-base font-medium text-gray-500 w-full max-w-[100px]">
              {item.store}
            </div>
            <div className="flex items-center cursor-pointer">
              <PiShareFatBold className="text-orange-500 text-[24px]" />
              <FaChevronRight className="text-orange-500 text-[20px] -mt-[3px] -ms-[11px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade of more storage */}
      <div className="w-full flex flex-col items-center justify-center gap-8 pb-28">
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <span className="text-4xl font-semibold mb-3">
            Upgrade of more storage
          </span>
          <span className="text-4xl font-semibold">
            More space, extra benefits
          </span>
          <span className="text-xl font-normal text-gray-500 mt-4 max-w-[750px] mx-auto">
            This upgrade will signify decreased costs and eliminate the need for
            additional gas usage. Upgrade for a more cost-effective and valuable
            experience!"
          </span>
        </div>

        <div className="flex flex-col w-full items-center justify-center gap-4">
          {/* {switchBtn()} */}
          <div className="w-full max-w-[1200px] gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <StorageCard type="FREE" />
            <StorageCard type="BASIC" />
            <StorageCard type="PREMIUM" />
            <StorageCard type="PRO" />
          </div>
        </div>

        <div
          className="text-orange-500 flex items-center hover:opacity-70 transition gap-2 cursor-pointer"
          onClick={() => setToggleDetailed(prev => !prev)}>
          <span className="text-base font-medium">
            Show Detailed Plan Comparison
          </span>
          {toggleDetailed ? <FaAngleDown /> : <FaAngleUp />}
        </div>

        {toggleDetailed && <StorageTable />}
      </div>
    </div>
  );
}
