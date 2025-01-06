// import (Internal imports)
import { useState } from 'react';

// import classNames from 'classnames';

import styled from 'styled-components';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import 'swiper/swiper-bundle.css';
import {
  FreeMode,
  Grid,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules';

// flowbite-react
import { Card } from 'flowbite-react';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive.ts';
// import { Logger } from '../../../helper/logger.ts';

// redux
import { useDispatch } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';
import { showAlert } from '../../../redux/home.ts';

// icons
import PurrChat from '../../../asset/images/home/icons/purr-chat.svg';
import PurrVault from '../../../asset/images/home/icons/purr-vault.svg';
import PurrPost from '../../../asset/images/home/icons/purr-post.svg';
import PurrHub from '../../../asset/images/home/icons/purr-chat.svg';
import PurrChase from '../../../asset/images/home/icons/purr-chase.svg';
import LuckyDraw from '../../../asset/images/home/icons/lucky-draw.svg';
import BugBounty from '../../../asset/images/home/icons/bug-bounty.svg';
import FoodGuide from '../../../asset/images/home/icons/food-guide.svg';
import PurrMail from '../../../asset/images/home/icons/purr-mail.svg';
import PurrCloud from '../../../asset/images/home/icons/purr-cloud.svg';
import SocialBureau from '../../../asset/images/home/icons/social-bureau.svg';

// const log = new Logger('ServicesGrid');

export default function ServicesGrid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const services = [
    { id: 'purr-chat', name: 'PurrChat', icon: PurrChat, link: '/chat/direct' },
    { id: 'purr-vault', name: 'PurrVault', icon: PurrVault, link: '' },
    {
      id: 'purr-cloud',
      name: 'PurrCloud',
      icon: PurrCloud,
      link: '/keep',
    },
    {
      id: 'purr-mail',
      name: 'PurrMail',
      icon: PurrMail,
      link: '/purr-mail',
    },
    { id: 'purr-hub', name: 'PurrHub', icon: PurrHub, link: '' },
    { id: 'purr-chase', name: 'PurrChase', icon: PurrChase, link: '' },
    {
      id: 'lucky-draw',
      name: 'Lucky Draw',
      icon: LuckyDraw,
      link: '/lucky-draw',
    },
    {
      id: 'bug-bounty',
      name: 'Bug Bounty',
      icon: BugBounty,
      link: '/bug-bounty',
    },
    { id: 'purr-post', name: 'PurrPost', icon: PurrPost, link: '/purr-post' },
    {
      id: 'social-bureau',
      name: 'Social Bureau',
      icon: SocialBureau,
      link: '',
    },
    {
      id: 'food-guide',
      name: 'Food Guide',
      icon: FoodGuide,
      link: '',
    },
  ];

  const handleSocialBureau = () => {
    const shareUrl = `https://www.socialbureau.io`;
    window.open(shareUrl, '_blank');
  };

  const handleFoodGuide = () => {
    const foodGuideUrl = `https://foodguide.purringchat.io`;
    window.open(foodGuideUrl, '_blank');
  };

  const handleUnavailableFeature = (name: string) => {
    if (!isAlertVisible) {
      setIsAlertVisible(true);
      dispatch(showAlert({ message: 'Feature is coming soon!', name: name }));
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    }
  };

  return (
    <CustomCardStyle>
      <Card>
        <p className="text-[#6B7280] text-sm text-center font-semibold">
          Our Services
        </p>
        <CustomSwiperStyle>
          <Swiper
            grid={{ rows: 2, fill: 'row' }}
            spaceBetween={15}
            slidesPerView={isTabletOrMobile ? 3.5 : 4.5}
            loop={false}
            navigation={false}
            freeMode={true}
            pagination={false}
            scrollbar={{ draggable: true }}
            modules={[Grid, Navigation, FreeMode, Pagination, Scrollbar]}>
            {services.map(service => (
              <SwiperSlide key={service.id}>
                <div
                  className="flex flex-col items-center gap-4 h-20 cursor-pointer"
                  onClick={() => {
                    if (service.id === 'social-bureau') {
                      handleSocialBureau();
                    } else if (service.id === 'food-guide') {
                      handleFoodGuide();
                    } else if (service.id === 'lucky-draw') {
                      dispatch(
                        showAlert({
                          message: `We would like to inform you that the lucky draw event on the Purring Chat platform will be suspended this month. Instead, we will be conducting the lucky draw on DeBank. Thank you for your understanding and continued support.`,
                          name: `Notice: Lucky Draw Suspension on Purring Chat Platform This Month`,
                        })
                      );
                    } else if (service.link) {
                      dispatch(toggleMobileControlSidebarAction());
                      navigate(service.link);
                    } else {
                      handleUnavailableFeature(service.name);
                    }
                  }}>
                  <img
                    src={service.icon}
                    alt={service.name}
                    className="w-8 h-8 transition hover:scale-75"
                  />
                  <p className="text-[#6B7280] text-xs text-center font-normal">
                    {service.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </CustomSwiperStyle>
      </Card>
    </CustomCardStyle>
  );
}

const CustomCardStyle = styled.div`
  .card-inner {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;

const CustomSwiperStyle = styled.div`
  .swiper {
    padding-bottom: 30px;
  }

  .swiper-slide {
    width: auto;
    max-width: 20%;
  }

  .swiper-scrollbar {
    max-width: 15%;
    left: 50% !important;
    transform: translate(-50%);
    background: rgb(255 213 176);
  }
`;
