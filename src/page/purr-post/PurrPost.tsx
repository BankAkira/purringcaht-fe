// import (Internal imports)
import { useCallback, useEffect, useState } from 'react';

// react-draggable
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// react-icons
import { IoIosClose } from 'react-icons/io';

// react-router-dom
// import { useNavigate } from 'react-router-dom';

// flowbite-react
import { Button } from 'flowbite-react';

// helper functions
import useResponsive from '../../helper/hook/useResponsive';
import {
  setIsOpenMobileControlSidebar,
  // toggleMobileControlSidebarAction,
} from '../../redux/convesation-layout.ts';

// section
import MenuTabSection from '../../features/purr-post/sections/MenuTabSection';
import SidebarSection from '../../features/purr-post/sections/SidebarSection';

// components
import Search from '../../features/purr-post/components/Search';

// redux
import { useDispatch } from '../../redux';

// images
import BtnBallots from '../../asset/images/lucky-draw/btn-ballots.svg';
import ConfettiGold from '../../asset/images/lucky-draw/confetti-gold.gif';
import { showAlert } from '../../redux/home.ts';

const OFFSET = 10;
const ELEMENT_WIDTH = 80;

export default function PurrPost() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { isTabletOrMobile } = useResponsive();
  const [isVisible, setIsVisible] = useState(true);

  const [position, setPosition] = useState({
    x: window.innerWidth - ELEMENT_WIDTH - OFFSET,
    y: window.innerHeight / 2,
  });

  const handleStop = useCallback(
    (_event: DraggableEvent, data: DraggableData) => {
      const screenWidth = window.innerWidth;
      const middleX = screenWidth / 2;
      let newX = data.x;

      if (data.x + data.node.offsetWidth / 2 < middleX) {
        newX = OFFSET;
      } else {
        newX = screenWidth - data.node.offsetWidth - OFFSET;
      }

      const newY = Math.max(
        50,
        Math.min(data.y, window.innerHeight - data.node.offsetHeight - 50)
      );

      setPosition({ x: newX, y: newY });
    },
    []
  );

  const handleResize = useCallback(() => {
    setPosition(prevPosition => ({
      x:
        prevPosition.x >= window.innerWidth / 2
          ? window.innerWidth - ELEMENT_WIDTH - OFFSET
          : OFFSET,
      y: Math.min(prevPosition.y, window.innerHeight - 220),
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;
    if (mainDiv) {
      mainDiv.style.height = isTabletOrMobile ? 'calc(100vh - 70px)' : '100vh';
    }
    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  return (
    <div className="w-full min-h-full bg-white">
      <div className="flex items-center gap-2 border-b p-4 bg-white z-30 sticky top-0">
        <p className="text-gray-900 text-2xl font-bold">PurrPost</p>
        <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-xs font-medium text-transparent sm:text-base">
          (This feature will be available soon.)
        </span>
      </div>
      <div className="flex">
        <MenuTabSection />
        {isTabletOrMobile ? (
          isVisible && (
            <Draggable
              bounds={{
                top: 50,
                bottom: window.innerHeight - 220,
                left: OFFSET,
                right: window.innerWidth - ELEMENT_WIDTH - OFFSET,
              }}
              handle=".handle"
              position={position}
              onStart={e => e.preventDefault()}
              onStop={handleStop}>
              <div className="fixed flex flex-col items-center w-20 z-50 group">
                <img
                  src={BtnBallots}
                  alt="LUCKY_DRAW"
                  className="w-full h-auto"
                />
                <img
                  src={ConfettiGold}
                  alt="LUCKY_DRAW"
                  className="handle absolute inset-0 w-full h-28 object-cover z-10 transition-opacity duration-300 sm:opacity-0 group-hover:opacity-100"
                />
                <button
                  type="button"
                  className="absolute bg-pink-orange backdrop-blur-sm right-1 rounded-full w-4 z-10 hover:bg-[#272c30bf]"
                  onClick={() => {
                    setIsVisible(false);
                  }}>
                  <div className="flex justify-center items-center text-white">
                    <IoIosClose />
                  </div>
                </button>
                <Button
                  pill
                  size="xs"
                  className="absolute top-[68px] z-20 p-0 bg-pink-orange hover:opacity-70"
                  onClick={() => {
                    // dispatch(toggleMobileControlSidebarAction());
                    // navigate('/lucky-draw');
                    dispatch(
                      showAlert({
                        message: `We would like to inform you that the lucky draw event on the Purring Chat platform will be suspended this month. Instead, we will be conducting the lucky draw on DeBank. Thank you for your understanding and continued support.`,
                        name: `Notice: Lucky Draw Suspension on Purring Chat Platform This Month`,
                      })
                    );
                  }}
                  style={{
                    width: 'max-content',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  }}>
                  <p className="text-[10px]">Lucky Draw</p>
                </Button>
              </div>
            </Draggable>
          )
        ) : (
          <div className="flex-shrink-0 w-[388px] bg-white border-l border-gray-200 px-5">
            <div className="bg-white py-2 sticky top-16 z-10">
              <Search />
            </div>
            <SidebarSection />
          </div>
        )}
      </div>
    </div>
  );
}
