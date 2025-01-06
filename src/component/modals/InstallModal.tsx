// import (Internal imports)
import { useState } from 'react';

import { usePWAInstall } from 'react-use-pwa-install';

// toast
import { toast } from 'react-toastify';

// flowbite-react
import { Modal } from 'flowbite-react';

// helper functions
import useBoolean from '../../helper/hook/useBoolean';
import useResponsive from '../../helper/hook/useResponsive.ts';
import { Logger } from '../../helper/logger.ts';
import { setSwInstall } from '../../helper/local-storage';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';

// components
import Button from '../../component/button/Button';

// icons
import Logo from '../../asset/icon/Logo.png';

// images
import ETHGlobalIstanbul from '../../asset/images/ETHGlobal-Istanbul.png';
import AwardWinner from '../../asset/images/4-award-winner.png';

const log = new Logger('InstallModal');

declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;

    prompt(): Promise<void>;
  }
}

export default function InstallModal() {
  const install = usePWAInstall();

  const { isTabletOrMobile } = useResponsive();

  const [isOpenModal, openModal, closeModal] = useBoolean(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useDeepEffect(() => {
    if (install) openModal();

    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      if (event) {
        event.preventDefault();
        setDeferredPrompt(event);
        openModal();
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          log.debug('User accepted the install prompt');
        } else {
          log.debug('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        closeModal();
      });
    } else {
      toast.error(`Something's wrong, try again later`);
      setSwInstall('error');
      closeModal();
    }
  };

  const onCloseModal = () => {
    closeModal();
  };

  return (
    <Modal
      dismissible
      className="modal-responsive custom-modal"
      show={isOpenModal && !!install}
      onClose={onCloseModal}
      size="sm">
      <Modal.Header className="items-center pb-1 border-0 pt-6 justify-center font-bold text-gray-900 hide-close-btn-modal"></Modal.Header>
      <Modal.Body className="!py-0 !px-3 overflow-hidden">
        <div className="flex flex-col gap-3 justify-center items-center bg-gradient-to-l">
          <div className="bg-white rounded-full p-5 overflow-hidden border-4 border-[#FFC08A]">
            <img
              src={Logo}
              width={!isTabletOrMobile ? 110 : 70}
              height={!isTabletOrMobile ? 110 : 70}
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 justify-center items-center p-5 overflow-hidden">
          <img className="w-[60%]" src={AwardWinner} alt="AWARD_WINNER" />
          <img className="w-full" src={ETHGlobalIstanbul} alt="ETHGLOBAL" />
        </div>
        <div className="text-[12px] text-gray-500 dark:text-gray-400 text-center">
          PurringChat (formerly CatChaChat) Winner of 4 awards at the Ethereum
          Global Hackathon Istanbul 2023. Download with confidence! Ultimate
          Privacy, Unparalleled Security, Seamless Connection.
        </div>
      </Modal.Body>
      <Modal.Footer className="flex-col gap-2 border-0 max-sm:px-4 max-sm:py-4 p-6 foobar-modal-custom">
        <p
          className="text-slate-500 group-hover:text-white text-sm text-center"
          onClick={handleInstallClick}>
          Install Purring Chat the App
        </p>
        {install && (
          <Button
            className="text-white mt-1 bg-gradient-to-br from-pink-500 to-orange-400 min-h-[50px] min-w-[200px] w-full"
            label="Install now"
            onClick={install}
            size="lg"
            variant="primary"
          />
        )}
      </Modal.Footer>
    </Modal>
  );
}
