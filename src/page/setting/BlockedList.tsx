// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';

// react-icons
import { HiMiniNoSymbol } from 'react-icons/hi2';
import { IoInformationCircle } from 'react-icons/io5';

// react-toastify
import { toast } from 'react-toastify';

// flowbite-react
import { Pagination, Tooltip } from 'flowbite-react';

// types
import {
  GroupBlocked,
  GroupBlockedWithPagination,
  UserBlocked,
  UserBlockedWithPagination,
} from '../../type/auth';
import { QueryParams } from '../../type/query-param';

// helper functions
import { errorFormat } from '../../helper/error-format';
import { Logger } from '../../helper/logger';
import sleep from '../../helper/sleep';
import { queryParamsToString } from '../../helper/query-param';
import useResponsive from '../../helper/hook/useResponsive.ts';

// constants
import { defaultImages } from '../../constant/default-images';

// components
import Avatar from '../../component/avatar/Avatar';
import Button from '../../component/button/Button';
import IconButton from '../../component/icon-button/IconButton';
import useBoolean from '../../helper/hook/useBoolean';
import ChatSkeleton from '../../component/chat-skeleton/ChatSkeleton';
import ConfirmModal from '../../component/@share/ConfirmModal';

// APIs
import {
  getGroupsBlockListApi,
  getUsersBlockListApi,
  unblockGroupByIdApi,
  unblockUserByIdApi,
} from '../../rest-api/user-block';

const log = new Logger('BlockedList');

export default function BlockedList() {
  const ITEM_PER_PAGE = 10;

  const { isTabletOrMobile } = useResponsive();

  const [currentPage, setCurrentPage] = useState(1);
  const [blockedList, setBlockedList] = useState<
    UserBlockedWithPagination | GroupBlockedWithPagination | undefined
  >(undefined);
  const [selectedBlockedList, setSelectedBlockedList] = useState<
    UserBlocked | GroupBlocked | undefined
  >(undefined);
  const [isLoading, loadingStart, loadingDone] = useBoolean(false);
  const [isToggleType, ToggleTypeStart, ToggleTypeDone] = useBoolean(false);
  const [blockType, setBlockType] = useState<'USER' | 'GROUP'>('USER');
  const [
    isOpenConfirmUnBlockModal,
    openConfirmUnBlockModal,
    closeConfirmUnBlockModal,
  ] = useBoolean(false);

  const initBlockList = async (isLoading?: boolean) => {
    try {
      isLoading && loadingStart();
      const param: QueryParams = {
        page: currentPage,
        limit: ITEM_PER_PAGE,
      };
      let resp;
      if (blockType === 'USER') {
        resp = await getUsersBlockListApi(queryParamsToString(param));
      } else {
        resp = await getGroupsBlockListApi(queryParamsToString(param));
      }
      log.info('Blocked List', resp);
      if (resp) {
        setBlockedList(resp);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      await sleep(500);
      loadingDone();
    }
  };

  const blockedListComponent = (blockedAccount: UserBlocked | GroupBlocked) => {
    return (
      <>
        <Avatar
          img={
            blockType === 'USER'
              ? (blockedAccount as UserBlocked)?.user?.picture
              : (blockedAccount as GroupBlocked)?.conversation
                  ?.profilePicture || defaultImages.noProfile
          }
          name={
            blockType === 'USER'
              ? (blockedAccount as UserBlocked)?.user?.displayName
              : (blockedAccount as GroupBlocked)?.conversation?.name
          }
        />

        <Button
          className="flex items-center justify-center gap-2 "
          label="Unblock"
          borderGradient={{
            fromColor: '#fd4077',
            toColor: '#fe7601',
            rounded: '9999px',
            width: '100px',
          }}
          onClick={() => {
            setSelectedBlockedList(blockedAccount);
            openConfirmUnBlockModal();
          }}
        />
      </>
    );
  };

  const handleUnblock = async (
    selectedBlockedAccount: UserBlocked | GroupBlocked
  ) => {
    try {
      let resp;
      if (blockType === 'USER') {
        resp = await unblockUserByIdApi(
          (selectedBlockedAccount as UserBlocked).userId
        );
      } else {
        resp = await unblockGroupByIdApi(
          (selectedBlockedAccount as GroupBlocked).conversationId
        );
      }
      if (resp) {
        toast.success(
          `Unblock ${blockType === 'USER' ? (selectedBlockedAccount as UserBlocked)?.user?.displayName : (selectedBlockedAccount as GroupBlocked)?.conversation?.name} successfully`
        );
        await initBlockList(true);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmUnBlockModal();
    }
  };

  useEffect(() => {
    if (currentPage > 1 && !blockedList?.results?.length) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage, blockedList]);

  useEffect(() => {
    (async () => {
      await initBlockList(!blockedList || isToggleType);
    })();
  }, [blockType, currentPage, isToggleType]);

  const switchBtn = () => {
    return (
      <div
        className={
          (isLoading
            ? 'pointer-events-none cursor-not-allowed opacity-60'
            : '') +
          ' flex w-full max-w-[220px] items-center justify-center transition'
        }>
        <div className="flex w-full items-center justify-around max-w-[220px] h-[35px] bg-gray-100 rounded-full relative">
          <div
            onClick={() => {
              blockType === 'USER'
                ? setBlockType('GROUP')
                : setBlockType('USER');
              ToggleTypeStart();
              setTimeout(() => {
                ToggleTypeDone();
              }, 200);
            }}
            className={
              'flex items-center z-10 text-sm transition cursor-pointer ' +
              (blockType === 'USER' ? 'text-white' : '')
            }>
            Accounts
          </div>
          <div
            onClick={() => {
              blockType === 'USER'
                ? setBlockType('GROUP')
                : setBlockType('USER');
              ToggleTypeStart();
              setTimeout(() => {
                ToggleTypeDone();
              }, 200);
            }}
            className={
              'flex items-center z-10 text-sm transition cursor-pointer ' +
              (blockType === 'USER' ? '' : 'text-white')
            }>
            Groups
          </div>
          <Button
            onClick={() => {
              blockType === 'USER'
                ? setBlockType('GROUP')
                : setBlockType('USER');
              ToggleTypeStart();
              setTimeout(() => {
                ToggleTypeDone();
              }, 200);
            }}
            className={
              'absolute left-0 transition !flex items-center justify-center gap-2 w-[110px] h-[35px] !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none ' +
              (blockType === 'USER' ? '' : 'translate-x-[110px]')
            }
            label=""
            size="lg"
          />{' '}
        </div>
      </div>
    );
  };

  return (
    <div
      className={classNames('h-screen flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="flex max-md:flex-col max-md:justify-center justify-between items-center gap-3 pb-3">
        <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 max-lg:text-xl select-none">
          Blocked Lists{' '}
          <Tooltip
            content="View and manage your list of blocked users or content"
            placement="top">
            <IconButton
              color="#9CA3AF"
              height={18}
              icon={IoInformationCircle}
              onClick={() => {}}
              width={18}
            />
          </Tooltip>
        </div>

        {switchBtn()}
      </div>

      {isLoading ? (
        <div className="max-w-[50vw] flex flex-col gap-2">
          <ChatSkeleton count={1} loading type="direct" />
          <ChatSkeleton count={1} loading type="direct" />
          <ChatSkeleton count={1} loading type="direct" />
          <ChatSkeleton count={1} loading type="direct" />
          <ChatSkeleton count={1} loading type="direct" />
        </div>
      ) : (
        <div className="flex flex-col gap-5 justify-between min-h-full">
          {blockedList && !!blockedList.totalResults ? (
            <>
              <div className="flex flex-col gap-5">
                {blockedList.results.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between pe-3">
                      {blockedListComponent(item)}
                    </div>
                  );
                })}
              </div>

              {!!blockedList &&
                !!blockedList?.results?.length &&
                blockedList?.totalPages > 1 && (
                  <div className="w-full flex justify-center sm:justify-end p-4">
                    <Pagination
                      layout="pagination"
                      currentPage={currentPage}
                      totalPages={blockedList?.totalPages || 0}
                      onPageChange={e => {
                        setCurrentPage(e);
                      }}
                      previousLabel=""
                      nextLabel=""
                      showIcons
                      className="pagination-custom"
                      theme={{
                        pages: {
                          selector: {
                            active: '!text-orange-500 !bg-orange-100',
                          },
                        },
                      }}
                    />
                  </div>
                )}
            </>
          ) : (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center">
              <HiMiniNoSymbol className="text-gray-400 text-[120px]" />
              <span className="text-gray-400">
                {blockType === 'USER'
                  ? 'No blocked account yet'
                  : 'No blocked group yet'}
              </span>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            if (selectedBlockedList) {
              setTimeout(() => {
                closeConfirmUnBlockModal();
              }, 100);
              await handleUnblock(selectedBlockedList);
            }
          })();
        }}
        openModal={isOpenConfirmUnBlockModal}
        onCloseModal={closeConfirmUnBlockModal}
        title="Confirm unblock"
        color="red"
        description={`Do you want to unblock '${blockType === 'USER' ? (selectedBlockedList as UserBlocked)?.user?.displayName : (selectedBlockedList as GroupBlocked)?.conversation?.name}'`}
      />
    </div>
  );
}
