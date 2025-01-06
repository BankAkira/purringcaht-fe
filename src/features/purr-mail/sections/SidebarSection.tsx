// import (Internal imports)
import React, { useCallback, useEffect, useRef, useState } from 'react';

// react-icons
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaInbox } from 'react-icons/fa';
import { FaAngleLeft } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import { HiPencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import { IoIosMore } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';

// react-modern-drawer
import Drawer from 'react-modern-drawer';

// react-router-dom
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// flowbite-react
import { Dropdown } from 'flowbite-react';

import classNames from 'classnames';
import styled from 'styled-components';

// helper functions
import { Logger } from '../../../helper/logger.ts';
import useResponsive from '../../../helper/hook/useResponsive';

// redux
import { RootState, useDispatch, useSelector } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout';
import { setIsOpenAddOfficialModal } from '../../../redux/layout';
import {
  setCheckedItemsCount,
  toggleVisibility,
} from '../../../redux/purr-mail';

// types
import { MailConversation, SidebarMenuEnum } from '../../../type';

// component/modals
import ModalShare from '../../../component/modals/ModalShare';

// components
import RequestTab from '../components/SearchTab/RequestTab';
import SearchPopover from '../components/SearchTab/SearchPopover';

// modals
import ComposeEmailModal from '../../purr-mail/modals/ComposeEmailModal';

// APIs
import { getCheckYourFriend } from '../../../rest-api/user';

// image
import IconMail from '../../../asset/images/purr-mail/icons/purr-mail.png';
import MailVaultIcon from '../../../asset/images/purr-mail/icons/mail-vault.png';
import MailIcon from '../../../asset/images/purr-mail/icons/mail.png';

const log = new Logger('SidebarSection');

export default function SidebarSection() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isVisible = useSelector((state: RootState) => state.purrMail.isVisible);
  const emailInboxes = useSelector(
    (state: RootState) => state.purrMail.mailInboxes
  );
  const unreadMailCount = useSelector(
    (state: RootState) => state.purrMail.unreadMailCount
  );

  const selectAllRef = useRef<HTMLInputElement>(null);

  const { isTabletOrMobile } = useResponsive();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [messageType, setMessageType] = useState<'Mail' | 'MailVault'>('Mail');
  const [openModalCompose, setOpenModalCompose] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isRestore, setIsRestore] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [openModalConfirmValue, setOpenModalConfirmValue] = useState(false);

  // < ---------- CheckBox ---------- > //
  const checkedItemsCount = useSelector(
    (state: RootState) => state.purrMail.checkedItemsCount
  );

  const [allCheck, setAllCheck] = useState<
    'unchecked' | 'checked' | 'indeterminate'
  >('unchecked');
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckedChange = (hasCheckedItems: boolean) => {
    setIsChecked(hasCheckedItems);
  };

  const handleBackClick = () => {
    setIsChecked(false);
    setAllCheck('unchecked');
    dispatch(setCheckedItemsCount(0));
  };

  const handleSelectAll = () => {
    if (allCheck === 'checked' || allCheck === 'indeterminate') {
      setAllCheck('unchecked');
      dispatch(setCheckedItemsCount(0));
    } else {
      setAllCheck('checked');
      const allItemsCount = emailInboxes.length;
      dispatch(setCheckedItemsCount(allItemsCount));
    }
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = allCheck === 'indeterminate';
    }
  }, [allCheck]);

  useEffect(() => {
    if (isChecked) {
      handleBackClick();
    }
  }, [location.pathname]);

  // < ---------- End CheckBox ---------- > //

  const handleClickMailType = (type: 'Mail' | 'MailVault') => {
    if (type === 'MailVault') {
      setOpenModalConfirmValue(true);
    } else {
      setOpenModalCompose(true);
    }
    setMessageType(type);
  };

  const handleDelete = useCallback(() => {
    setIsDeleted(true);
    setTimeout(() => {
      setIsChecked(false);
      setIsDeleted(false);
    }, 0);
  }, [setIsDeleted, setIsChecked]);

  const handleRestore = useCallback(() => {
    setIsRestore(true);
    setTimeout(() => {
      setIsChecked(false);
      setIsRestore(false);
    }, 0);
  }, [setIsRestore, setIsChecked]);

  const handleStarred = useCallback(() => {
    setIsStarred(true);
    setTimeout(() => {
      setIsStarred(false);
    }, 0);
  }, [setIsStarred]);

  const handleImportant = useCallback(() => {
    setIsImportant(true);
    setTimeout(() => {
      setIsImportant(false);
    }, 0);
  }, [setIsImportant]);

  const fetchCheckYourFriend = async (): Promise<boolean> => {
    try {
      return await getCheckYourFriend();
    } catch (error) {
      log.error('Error:', error);
      return false;
    }
  };

  const setOpenShareModal = async (value: boolean) => {
    const isFriend = await fetchCheckYourFriend();
    setOpenModalConfirmValue(false);
    log.debug(isFriend);

    if (!isFriend) {
      openAddOfficial();
    } else {
      setOpenModalCompose(value);
    }
  };

  const openAddOfficial = () => {
    dispatch(setIsOpenAddOfficialModal(true));
  };

  // Use helper variables for pathname checks
  const isInbox = location.pathname.includes('/purr-mail/inbox');
  const isSend = location.pathname.includes('/purr-mail/send');
  const isTrash = location.pathname.includes('/purr-mail/trash');

  useEffect(() => {
    setIsOwner(isSend);
  }, [isSend]);

  useEffect(() => {
    if (isTrash) {
      setIsDeleted(true);
      setTimeout(() => setIsDeleted(false), 0); // Reset state if needed
    }
  }, [isTrash]);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const currentMenuType = pathParts[2];
    const validMenuTypes = Object.values(SidebarMenuEnum);
    const hasNoExtraPath = pathParts.length === 3;
    if (
      validMenuTypes.includes(currentMenuType as SidebarMenuEnum) &&
      hasNoExtraPath
    ) {
      dispatch(toggleVisibility(true));
    } else {
      dispatch(toggleVisibility(false));
    }
  }, [location.pathname, dispatch]);

  const onClickNav = (menu: SidebarMenuEnum) => {
    if (
      (menu === SidebarMenuEnum.INBOX && isInbox) ||
      (menu === SidebarMenuEnum.SEND && isSend) ||
      (menu === SidebarMenuEnum.TRASH && isTrash)
    ) {
      return;
    }

    if (menu === SidebarMenuEnum.INBOX) {
      setIsOwner(false);
      navigate('/purr-mail/inbox');
    } else if (menu === SidebarMenuEnum.SEND) {
      setIsOwner(true);
      navigate('/purr-mail/send');
    } else if (menu === SidebarMenuEnum.TRASH) {
      navigate('/purr-mail/trash');
    } else {
      setIsOwner(false);
      navigate('/purr-mail/inbox');
    }
  };

  const isActive = (menu: SidebarMenuEnum) => {
    if (menu === SidebarMenuEnum.INBOX) {
      return isInbox;
    }
    if (menu === SidebarMenuEnum.SEND) {
      return isSend;
    }
    if (menu === SidebarMenuEnum.TRASH) {
      return isTrash;
    }
    return false;
  };

  const onClickRequest = (_requestId: string) => {
    let targetPath = '/purr-mail/inbox';

    if (isSend) {
      targetPath = '/purr-mail/send';
    } else if (isTrash) {
      targetPath = '/purr-mail/trash';
    }

    dispatch(toggleMobileControlSidebarAction());
    navigate(`${targetPath}/${_requestId}`);
  };

  const renderMenuItem = (
    menu: SidebarMenuEnum,
    label: string,
    Icon: React.ElementType,
    badgeCount?: number
  ) => (
    <button
      onClick={() => onClickNav(menu)}
      className={classNames(
        isActive(menu)
          ? 'bg-pink-orange-50 hover:opacity-80'
          : 'hover:bg-rose-100',
        'cursor-pointer pb-2 px-3 py-2 transition relative w-full text-start rounded-full flex items-center gap-3'
      )}>
      <Icon
        size={20}
        className={isActive(menu) ? 'text-rose-600' : 'text-gray-500'}
      />
      <span
        className={classNames(
          isActive(menu) ? 'text-primary-gradient' : 'text-[#637381]',
          'text-base font-medium'
        )}>
        {label}
      </span>
      {!!badgeCount && (
        <span className="ml-auto bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg px-2 py-1 text-xs">
          {badgeCount}
        </span>
      )}
    </button>
  );

  // < ---------- sidebarMenu ---------- > //
  const sidebarClassNames = classNames(
    'size-full overflow-y-auto flex flex-col items-center gap-4 max-lg:pb-[58px]',
    {
      'max-w-[200px] py-3 pl-2 pr-4': !isTabletOrMobile,
      'p-2 pt-4': isTabletOrMobile,
    }
  );

  const sidebarMenu = () => (
    <div className={sidebarClassNames}>
      <CustomDropdownStyle>
        <Dropdown
          label={
            <div className="flex items-center">
              <HiPencil className="mr-2" size={24} />
              <span className="text-base font-bold">Compose</span>
            </div>
          }
          placement={isTabletOrMobile ? 'bottom' : 'right-start'}>
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => handleClickMailType('Mail')}>
            <img className="mr-2" src={MailIcon} width={20} alt="ICON" /> Mail
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => handleClickMailType('MailVault')}>
            <img className="mr-2" src={MailVaultIcon} width={20} alt="ICON" />
            MailVault
          </Dropdown.Item>
        </Dropdown>
      </CustomDropdownStyle>
      <div className="flex flex-col gap-2 w-full">
        {renderMenuItem(
          SidebarMenuEnum.INBOX,
          'Inbox',
          FaInbox,
          unreadMailCount
        )}
        {renderMenuItem(SidebarMenuEnum.SEND, 'Send', IoSend)}
        {renderMenuItem(SidebarMenuEnum.TRASH, 'Trash', ImBin)}
      </div>
    </div>
  );
  // < ---------- END sidebarMenu ---------- > //

  return (
    <section>
      {isTabletOrMobile ? (
        <div className="flex flex-col min-h-screen overflow-hidden">
          {isVisible && (
            <>
              {isChecked ? (
                <CustomActionStyle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <FaAngleLeft
                        className="text-[#6B7280] text-[20px] cursor-pointer w-[23px] h-[23px]"
                        onClick={handleBackClick}
                      />
                      <p className="text-[#6B7280] text-lg">
                        {checkedItemsCount}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Trash Bin Icon */}
                      <ImBin
                        className={classNames(
                          'cursor-pointer',
                          checkedItemsCount > 0
                            ? 'text-gray-500 hover:text-rose-500'
                            : 'text-gray-300 cursor-not-allowed'
                        )}
                        size={30}
                        onClick={
                          checkedItemsCount > 0 ? handleDelete : undefined
                        } // Disable click if no items are selected
                      />

                      <CustomDropdownStyle>
                        <Dropdown
                          label=""
                          inline
                          renderTrigger={() => (
                            <span className="flex items-center">
                              <IoIosMore size={30} />
                            </span>
                          )}>
                          {isTrash && checkedItemsCount > 0 && (
                            <Dropdown.Item
                              className="dropdown-item"
                              onClick={handleRestore}>
                              Restore
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item
                            className="dropdown-item"
                            onClick={handleStarred}
                            disabled={checkedItemsCount === 0}>
                            Mark as Starred
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="dropdown-item"
                            onClick={handleImportant}
                            disabled={checkedItemsCount === 0}>
                            Mark as Important
                          </Dropdown.Item>
                        </Dropdown>
                      </CustomDropdownStyle>
                    </div>
                  </div>
                  <CustomCheckboxStyle>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      id="custom-checkbox"
                      className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      checked={allCheck === 'checked'}
                      onChange={handleSelectAll}
                    />
                    {/* Conditional Rendering for buttons */}
                    {allCheck === 'unchecked' ? (
                      <button onClick={handleSelectAll}>Select All</button>
                    ) : (
                      <button onClick={handleSelectAll}>Deselect All</button>
                    )}
                  </CustomCheckboxStyle>
                </CustomActionStyle>
              ) : (
                <CustomSearchStyle>
                  <GiHamburgerMenu
                    size={22}
                    onClick={() => setIsOpenSidebar(prev => !prev)}
                  />
                  <SearchPopover<MailConversation>
                    icon={FiSearch}
                    searchType={'MAIL'}
                    content={(searchResult, handleCloseSearch) => (
                      <div className="flex flex-col items-start">
                        {[...searchResult].map((result, i) => (
                          <RequestTab
                            key={result.id + i}
                            active={false}
                            onClick={() => {
                              onClickRequest(result.id);
                              handleCloseSearch();
                            }}
                            request={result}
                          />
                        ))}
                      </div>
                    )}
                  />
                </CustomSearchStyle>
              )}
            </>
          )}

          <Drawer
            open={isOpenSidebar}
            className="drawer-setting-custom max-lg:!z-[200]"
            onClose={() => setIsOpenSidebar(prev => !prev)}
            direction="left">
            <div className="flex items-center gap-2 p-2 border-b">
              <img src={IconMail} alt="ICON_MAIL" width={65} height={65} />
              <p className="text-[111928] text-2xl font-bold">PurrMail</p>
            </div>
            {sidebarMenu()}
          </Drawer>
          <div className="bg-white w-full min-h-full rounded-xl">
            <Outlet
              context={{
                allCheck,
                setAllCheck,
                handleCheckedChange,
                isOwner,
                isDeleted,
                isRestore,
                isStarred,
                isImportant,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          {sidebarMenu()}
          <div className="bg-white w-full min-h-full rounded-xl overflow-hidden">
            <Outlet
              context={{
                allCheck,
                setAllCheck,
                handleCheckedChange,
                isOwner,
                isDeleted,
                isRestore,
                isStarred,
                isImportant,
              }}
            />
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {openModalCompose && (
        <ComposeEmailModal
          messageType={messageType}
          onClose={() => setOpenModalCompose(false)}
        />
      )}
      <ModalShare
        title="Compose MailVault" // Provide the title
        btnCancel="Cancel" // Provide the cancel button text
        btnConfirm="Confirm" // Provide the confirm button text
        open={openModalConfirmValue}
        onClickBtn={setOpenShareModal}>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-xl bold text-center text-red-600">
            Important: This is a MailVault, not a regular email!
          </h1>
          <p>
            You're creating a MailVault, which will be securely stored and sent
            out only when conditions are met, like no response for a set period.
            This email won’t be sent immediately. Before proceeding, you must
            approve a key exchange between your wallet and the Purring Chat
            official account (Hoodie Purr) to receive periodic reminders. Make
            sure you understand how MailVault works before continuing..
          </p>
        </div>
      </ModalShare>
    </section>
  );
}

const CustomDropdownStyle = styled.div`
  width: 100%;

  [data-testid='flowbite-dropdown-target'] {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    gap: 8px;

    width: 100%;
    height: 48px;
    min-width: 64px;
    padding: 0 16px;

    border-radius: 9999px;
    background: linear-gradient(130deg, #fd4077 -2.26%, #fe7601 96.97%);
  }

  [data-testid='flowbite-dropdown'] {
    border-width: 2px;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

    .dropdown-item {
      &:hover {
        color: #ff6969;
        background-color: #fff1e6 !important;
      }
      &:focus {
        color: #fe7601;
      }
    }
  }
`;

const CustomSearchStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-bottom-width: 1px;

  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity));

  width: 100%;
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;

  .text-input {
    width: 100%;
    input {
      border-radius: 100px;
    }
  }
`;

const CustomActionStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: white;
  border-bottom-width: 1px;

  width: 100%;
  height: 100px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
`;

const CustomCheckboxStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 22px;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #637381;
    appearance: none;
    cursor: pointer;
    position: relative;
  }

  input[type='checkbox']:checked {
    background: linear-gradient(130deg, #fd4077 -2.26%, #fe7601 96.97%);
    border-color: transparent;
  }

  input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input[type='checkbox']:indeterminate {
    background: linear-gradient(130deg, #fd4077 -2.26%, #fe7601 96.97%);
    border-color: transparent;
    position: relative;
  }

  input[type='checkbox']:indeterminate::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 2px;
    background-color: white;
    transform: translate(-50%, -50%);
  }
`;
