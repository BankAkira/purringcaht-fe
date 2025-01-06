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
import { ContactHidden, ContactHiddenWithPagination } from '../../type/contact';
import { QueryParams } from '../../type/query-param';

// helper functions
import { Logger } from '../../helper/logger';
import { errorFormat } from '../../helper/error-format';
import { queryParamsToString } from '../../helper/query-param';
import sleep from '../../helper/sleep';
import useBoolean from '../../helper/hook/useBoolean';
import useResponsive from '../../helper/hook/useResponsive.ts';

// components
import Avatar from '../../component/avatar/Avatar';
import Button from '../../component/button/Button';
import IconButton from '../../component/icon-button/IconButton';
import ChatSkeleton from '../../component/chat-skeleton/ChatSkeleton';
import ConfirmModal from '../../component/@share/ConfirmModal';

// APIs
import {
  getContactHiddenListApi,
  unHideContactByIdApi,
} from '../../rest-api/contact';

const log = new Logger('HiddenList');

export default function HiddenList() {
  const ITEM_PER_PAGE = 10;

  const { isTabletOrMobile } = useResponsive();

  const [currentPage, setCurrentPage] = useState(1);
  const [hiddenList, setHiddenList] = useState<
    ContactHiddenWithPagination | undefined
  >(undefined);
  const [selectedHiddenList, setSelectedHiddenList] = useState<
    ContactHidden | undefined
  >(undefined);
  const [isLoading, loadingStart, loadingDone] = useBoolean(false);
  const [
    isOpenConfirmUnHiddenModal,
    openConfirmUnHiddenModal,
    closeConfirmUnHiddenModal,
  ] = useBoolean(false);

  const initHiddenList = async (isLoading?: boolean) => {
    try {
      isLoading && loadingStart();
      const param: QueryParams = {
        page: currentPage,
        limit: ITEM_PER_PAGE,
      };
      const resp = await getContactHiddenListApi(queryParamsToString(param));
      log.info('Hidden List', resp);
      if (resp) {
        setHiddenList(resp);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      await sleep(500);
      loadingDone();
    }
  };

  const blockedListComponent = (hiddenAccount: ContactHidden) => {
    return (
      <>
        <Avatar
          img={hiddenAccount?.user?.picture}
          name={hiddenAccount?.user?.displayName}
        />

        <Button
          className="flex items-center justify-center gap-2 "
          label="Unhide"
          borderGradient={{
            fromColor: '#fd4077',
            toColor: '#fe7601',
            rounded: '9999px',
            width: '100px',
          }}
          onClick={() => {
            setSelectedHiddenList(hiddenAccount);
            openConfirmUnHiddenModal();
          }}
        />
      </>
    );
  };

  const handleUnHide = async (selectedBlockedAccount: ContactHidden) => {
    try {
      const resp = await unHideContactByIdApi(selectedBlockedAccount.contactId);
      if (resp) {
        toast.success(
          `Unhide ${selectedBlockedAccount?.user?.displayName} successfully`
        );
        await initHiddenList(true);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmUnHiddenModal();
    }
  };

  useEffect(() => {
    if (currentPage > 1 && !hiddenList?.results?.length) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage, hiddenList]);

  useEffect(() => {
    (async () => {
      await initHiddenList(!hiddenList);
    })();
  }, [currentPage]);

  return (
    <div
      className={classNames('h-screen flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="flex max-md:flex-col max-md:justify-center justify-between items-center gap-3 pb-3">
        <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 max-lg:text-xl">
          Hidden Lists{' '}
          <Tooltip
            content="Check and manage the content you have chosen to hide"
            placement="bottom">
            <IconButton
              color="#9CA3AF"
              height={18}
              icon={IoInformationCircle}
              onClick={() => {}}
              width={18}
            />
          </Tooltip>
        </div>
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
          {hiddenList && !!hiddenList.totalResults ? (
            <>
              <div className="flex flex-col gap-5">
                {hiddenList.results.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between pe-3">
                      {blockedListComponent(item)}
                    </div>
                  );
                })}
              </div>

              {!!hiddenList &&
                !!hiddenList?.results?.length &&
                hiddenList?.totalPages > 1 && (
                  <div className="w-full flex justify-center sm:justify-end p-4">
                    <Pagination
                      layout="pagination"
                      currentPage={currentPage}
                      totalPages={hiddenList?.totalPages || 0}
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
              <span className="text-gray-400">No Hidden account yet</span>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            if (selectedHiddenList) {
              setTimeout(() => {
                closeConfirmUnHiddenModal();
              }, 100);
              await handleUnHide(selectedHiddenList);
            }
          })();
        }}
        openModal={isOpenConfirmUnHiddenModal}
        onCloseModal={closeConfirmUnHiddenModal}
        title="Confirm unhide"
        color="red"
        description={`Do you want to unhide '${selectedHiddenList?.user?.displayName}'`}
      />
    </div>
  );
}
