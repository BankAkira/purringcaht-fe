// import (Internal imports)
import { useEffect, useRef, useState } from 'react';

import QRCode from 'qrcode.react';

import styled from 'styled-components';

// flowbite
import { Button, Modal } from 'flowbite-react';

// react-icons
import { FaAngleLeft } from 'react-icons/fa6';
import { LuDownload } from 'react-icons/lu';
import { IoScan } from 'react-icons/io5';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive.ts';

// redux
import { useDispatch } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';

// types
import { User } from '../../../type/auth.ts';

// images
import Logo from '../../../../src/asset/icon/Logo.png';

// icons
import PurrChase from '../../../asset/images/home/icons/purr-chase.svg';
import LuckyDraw from '../../../asset/images/home/icons/lucky-draw.svg';
import PurrCloud from '../../../asset/images/home/icons/purr-cloud.svg';
import { showAlert } from '../../../redux/home.ts';

type Props = {
  openModal: boolean;
  onCloseModal: () => void;
  profile?: User | null;
};

export default function QuickActionsModal({
  openModal,
  onCloseModal,
  profile,
}: Props) {
  const { isTabletOrMobile } = useResponsive();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const url = `app.purringchat.io/?refcode=${profile?.referralCode?.refCode}`;
  const _url = 'app.purringchat.io';

  useEffect(() => {
    if (profile?.picture) {
      fetch(profile.picture)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result as string);
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => console.error('Error loading image:', error));
    } else {
      setImageSrc(Logo);
    }
  }, [profile]);

  const handleDownload = () => {
    setDownloading(true);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const qrCodeCanvas = qrCodeRef.current?.querySelector('canvas');

    if (context && qrCodeCanvas) {
      const size = 128;
      const margin = 20; // Margin around the QR code

      canvas.width = (size + margin * 2) * 2;
      canvas.height = (size + margin * 2) * 2;
      context.scale(2, 2);

      // Fill background with white color
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

      // Draw the QR code
      context.drawImage(qrCodeCanvas, margin, margin, size, size);

      // Create a download link
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'qr-code.png';
      link.click();

      setTimeout(() => {
        setDownloading(false);
      }, 1000);
    }
  };

  return (
    <Modal show={openModal} onClose={onCloseModal} size="lg">
      <CustomModalStyle>
        <Modal.Header>
          <div className="flex items-center justify-between px-4 py-2">
            <FaAngleLeft
              className="text-[#F05252] text-xl cursor-pointer"
              onClick={onCloseModal}
            />
            <p className="text-[#F05252] text-xl font-bold">Quick actions</p>
            <IoScan className="text-[#F05252] text-xl cursor-pointer" />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center">
            <p className="text-[#F98080] text-sm font-medium">
              Ask to scan this QR-Code
            </p>
            <div className="flex justify-center p-5">
              {profile ? (
                <div
                  className="relative p-4 bg-white rounded-lg shadow-lg"
                  ref={qrCodeRef}>
                  <QRCode
                    value={url || _url}
                    size={isTabletOrMobile ? 256 : 320}
                    imageSettings={{
                      src: imageSrc || Logo,
                      height: isTabletOrMobile ? 48 : 64,
                      width: isTabletOrMobile ? 48 : 64,
                      excavate: true,
                    }}
                    renderAs="canvas"
                  />
                  <div className="corner-markers">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                </div>
              ) : (
                <p>No profile data.</p>
              )}
            </div>
            <Button
              size="sm"
              pill
              disabled={downloading}
              className="ms-auto bg-gradient-to-br from-pink-500 to-orange-400 !border-0 min-w-0 lg:min-w-[124px] h-[34px] max-lg:max-h-[28px] max-lg:bg-transparent transition bg-white text-white m-2 p-5 hover:opacity-70"
              onClick={handleDownload}>
              {downloading ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-lg">Loading...</span>
                </>
              ) : (
                <>
                  <LuDownload className="mr-2 w-[20px] h-[20px]" />
                  <p className="text-lg">Download QR Code</p>
                </>
              )}
            </Button>
            <div className="flex gap-8 p-4">
              <div className="flex flex-col items-center gap-2">
                <button className="bg-gradient-to-br from-[#FD4077]/50 to-[#FE7601]/50 rounded-[15px] w-[77.931px] h-[77.931px] flex-shrink-0 flex items-center justify-center hover:opacity-75">
                  <img
                    src={PurrChase}
                    alt="ICON"
                    width={25}
                    height={25}
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                    }}
                  />
                </button>
                <p className="text-[#6B7280] text-xs font-medium">PurrChase</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  className="bg-gradient-to-br from-[#FD4077]/50 to-[#FE7601]/50 rounded-[15px] w-[77.931px] h-[77.931px] flex-shrink-0 flex items-center justify-center hover:opacity-75"
                  onClick={() => {
                    dispatch(toggleMobileControlSidebarAction());
                    // navigate(`/lucky-draw`);
                    dispatch(
                      showAlert({
                        message: `We would like to inform you that the lucky draw event on the Purring Chat platform will be suspended this month. Instead, we will be conducting the lucky draw on DeBank. Thank you for your understanding and continued support.`,
                        name: `Notice: Lucky Draw Suspension on Purring Chat Platform This Month`,
                      })
                    );
                    onCloseModal();
                  }}>
                  <img
                    src={LuckyDraw}
                    alt="ICON"
                    width={25}
                    height={25}
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                    }}
                  />
                </button>
                <p className="text-[#6B7280] text-xs font-medium">Lucky Draw</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  className="bg-gradient-to-br from-[#FD4077]/50 to-[#FE7601]/50 rounded-[15px] w-[77.931px] h-[77.931px] flex-shrink-0 flex items-center justify-center hover:opacity-75"
                  onClick={() => {
                    dispatch(toggleMobileControlSidebarAction());
                    navigate(`/keep`);
                    onCloseModal();
                  }}>
                  <img
                    src={PurrCloud}
                    alt="ICON"
                    width={25}
                    height={25}
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                    }}
                  />
                </button>
                <p className="text-[#6B7280] text-xs font-medium">PurrCloud</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </CustomModalStyle>
    </Modal>
  );
}

const CustomModalStyle = styled.div`
  .corner-markers {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .corner {
    position: absolute;
    width: 50px;
    height: 50px;
    border: 6px solid #fe7601;
  }

  .top-left {
    top: -4px;
    left: -4px;
    border-top-width: 6px;
    border-left-width: 6px;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 15px;
  }

  .top-right {
    top: -4px;
    right: -4px;
    border-top-width: 6px;
    border-right-width: 6px;
    border-left: none;
    border-bottom: none;
    border-top-right-radius: 15px;
  }

  .bottom-left {
    bottom: -4px;
    left: -4px;
    border-bottom-width: 6px;
    border-left-width: 6px;
    border-top: none;
    border-right: none;
    border-bottom-left-radius: 15px;
  }

  .bottom-right {
    bottom: -4px;
    right: -4px;
    border-bottom-width: 6px;
    border-right-width: 6px;
    border-top: none;
    border-left: none;
    border-bottom-right-radius: 15px;
  }
`;
