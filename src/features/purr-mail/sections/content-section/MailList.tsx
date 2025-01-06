// import (Internal imports)
import { useEffect, useRef, useState } from 'react';

// react-icons
import { CiCircleChevLeft, CiCircleChevRight } from 'react-icons/ci';
import { FaStar, FaTrashRestoreAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { GrRefresh } from 'react-icons/gr';
import { ImBin } from 'react-icons/im';
import { PiTagChevronFill, PiWarningOctagonFill } from 'react-icons/pi';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// react-router-dom
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

// flowbite-react
import { Button, Dropdown, Spinner } from 'flowbite-react';

import classNames from 'classnames';
import styled from 'styled-components';

// helper functions
import { Logger } from '../../../../helper/logger.ts';
import useResponsive from '../../../../helper/hook/useResponsive.ts';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect.ts';

// redux
import { useDispatch } from '../../../../redux';
import { toggleMobileControlSidebarAction } from '../../../../redux/convesation-layout.ts';
import {
  setCheckedItemsCount,
  setMailInboxes,
} from '../../../../redux/purr-mail.ts';

// types
import { MailConversation, SidebarMenuEnum } from '../../../../type';

// components
import MailListItem from '../../components/MailListItem.tsx';
import RequestTab from '../../components/SearchTab/RequestTab.tsx';
import SearchPopover from '../../components/SearchTab/SearchPopover.tsx';

// APIs
import {
  delMailApi,
  getConversationMails,
  moveMailToRecycleBin,
  restoreMailApi,
  updateStarredAndImportantStatus,
} from '../../../../rest-api/purr-mail.ts';

interface MailListContextType {
  handleCheckedChange: (hasCheckedItems: boolean) => void;
  allCheck: 'unchecked' | 'checked' | 'indeterminate';
  setAllCheck: React.Dispatch<
    React.SetStateAction<'unchecked' | 'checked' | 'indeterminate'>
  >;
  isOwner: boolean;
  isDeleted: boolean;
  isRestore: boolean;
  isStarred: boolean;
  isImportant: boolean;
}

const log = new Logger('MailList');

export default function MailList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();
  const {
    handleCheckedChange,
    allCheck,
    setAllCheck,
    isOwner,
    isDeleted,
    isRestore,
    isStarred,
    isImportant,
  } = useOutletContext<MailListContextType>();

  const [emailInbox, setEmailInbox] = useState<MailConversation[] | []>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectAllCheck, setSelectAllCheck] = useState<
    'unchecked' | 'checked' | 'indeterminate'
  >('unchecked');

  const [mailStatus, setMailStatus] = useState('inbox');

  const selectAllRef = useRef<HTMLInputElement>(null);

  const pageRef = useRef(1);
  const limitRef = useRef(20);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.pathname.includes('send')) {
      setMailStatus('send');
    } else if (location.pathname.includes('trash')) {
      setMailStatus('trash');
    } else {
      setMailStatus('inbox');
    }
  }, [location.pathname]);

  const saveMailListToStorage = (
    isDeleted: boolean,
    isOwner: boolean,
    totalResults: number
  ) => {
    const mailList = {
      isDeleted: isDeleted,
      isOwner: isOwner,
      totalResults: totalResults,
    };
    localStorage.setItem('mailList', JSON.stringify(mailList));
  };

  const fetchData = async (currentPage = 1, append = false) => {
    try {
      const isTrash = location.pathname.includes('/trash');
      const params = {
        page: currentPage,
        limit: limitRef.current,
        orderBy: 'updatedAt:desc',
        status: 'COMPLETED',
        isDeleted: isTrash ? true : undefined,
        isOwner: isTrash ? undefined : isOwner,
      };

      const res = await getConversationMails(params);

      if (res) {
        if (append) {
          setEmailInbox(prevInbox => [...prevInbox, ...res.results]);
        } else {
          setEmailInbox(res.results);
        }
        setTotalPages(res.totalPages);
        setTotalResults(res.totalResults);

        // Dispatch Redux actions
        dispatch(setMailInboxes(res.results));

        // Save mailList to localStorage
        saveMailListToStorage(isTrash, isOwner, res.totalResults);

        log.debug('res', res);
      }
    } catch (error) {
      log.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreData = async () => {
    const nextPage = pageRef.current + 1;
    if (nextPage <= totalPages) {
      pageRef.current = nextPage;
      await fetchData(nextPage, true);
    }
  };

  const fetchNewData = async () => {
    const isTrash = location.pathname.includes('/trash');
    const params = {
      page: 1,
      limit: limitRef.current,
      orderBy: 'updatedAt:desc',
      status: 'COMPLETED',
      isDeleted: isTrash ? true : undefined,
      isOwner: isTrash ? undefined : isOwner,
    };

    try {
      const res = await getConversationMails(params);

      if (res) {
        const existingIds = emailInbox.map(email => email.id);
        const newEmails = res.results.filter(
          email => !existingIds.includes(email.id)
        );

        if (newEmails.length > 0) {
          setEmailInbox(prevInbox => [...newEmails, ...prevInbox]);

          if (res.totalResults !== totalResults) {
            setTotalResults(res.totalResults);
          }
        }
      }
    } catch (error) {
      log.error('Error fetching new data:', error);
    }
  };

  useDeepEffect(() => {
    const intervalId = setInterval(async () => {
      if (isTabletOrMobile) {
        await fetchNewData();
      } else {
        try {
          const isTrash = location.pathname.includes('/trash');
          const res = await getConversationMails({
            page: 1,
            limit: limitRef.current,
            orderBy: 'updatedAt:desc',
            status: 'COMPLETED',
            isDeleted: isTrash ? true : undefined,
            isOwner: isTrash ? undefined : isOwner,
          });

          if (res && res.totalResults !== totalResults) {
            await fetchData();
          }
        } catch (error) {
          log.error('Error checking new data for desktop:', error);
        }
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isTabletOrMobile, emailInbox, totalResults]);

  useEffect(() => {
    setIsLoading(true);
    if (checkedItems.length > 0 && selectAllCheck !== 'checked') {
      setCheckedItems([]);
      setSelectAllCheck('unchecked');
      setAllCheck('unchecked');
      dispatch(setCheckedItemsCount(0));
    }

    pageRef.current = 1;
    limitRef.current = 20;
    fetchData(1);
  }, [location.pathname, isOwner]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectAllCheck === 'indeterminate';
    }
  }, [selectAllCheck]);

  useEffect(() => {
    if (allCheck === 'checked') {
      const allIds = emailInbox.map(email => email.id);
      setCheckedItems(allIds);
    } else if (allCheck === 'unchecked') {
      setCheckedItems([]);
    }
  }, [allCheck, emailInbox]);

  useEffect(() => {
    if (checkedItems.length === 0) {
      setAllCheck('unchecked');
    } else if (checkedItems.length === emailInbox.length) {
      setAllCheck('checked');
    } else {
      setAllCheck('indeterminate');
    }
  }, [checkedItems, emailInbox.length, setAllCheck]);

  const handleSelectAll = () => {
    switch (selectAllCheck) {
      case 'checked':
      case 'indeterminate':
        {
          setCheckedItems([]);
          setSelectAllCheck('unchecked');
          setAllCheck('unchecked');
          dispatch(setCheckedItemsCount(0));
        }
        break;

      case 'unchecked':
        {
          const allIds = emailInbox.map(email => email.id);
          setCheckedItems(allIds);
          setSelectAllCheck('checked');
          setAllCheck('checked');
          dispatch(setCheckedItemsCount(allIds.length));
        }
        break;

      default:
        break;
    }
  };

  const handleItemCheck = (mailId: string) => {
    const isChecked = checkedItems.includes(mailId);
    let newCheckedItems = [];

    if (isChecked) {
      newCheckedItems = checkedItems.filter(id => id !== mailId);
    } else {
      newCheckedItems = [...checkedItems, mailId];
    }

    setCheckedItems(newCheckedItems);
    handleCheckedChange(newCheckedItems.length > 0);

    dispatch(setCheckedItemsCount(newCheckedItems.length));

    if (newCheckedItems.length === 0) {
      setSelectAllCheck('unchecked');
      setAllCheck('unchecked');
    } else if (newCheckedItems.length === emailInbox.length) {
      setSelectAllCheck('checked');
      setAllCheck('checked');
    } else {
      setSelectAllCheck('indeterminate');
      setAllCheck('indeterminate');
    }
  };

  const reFetchData = async () => {
    setIsLoading(true);
    await fetchData();
  };

  const handleNextPage = () => {
    if (pageRef.current < totalPages) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      fetchData(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (pageRef.current > 1) {
      const prevPageValue = pageRef.current - 1;
      pageRef.current = prevPageValue;
      fetchData(prevPageValue);
    }
  };

  const handleEmailClick = (mailId: string) => {
    if (checkedItems.length > 0) {
      return;
    }

    const currentPath = location.pathname;
    let targetPath = '/purr-mail/inbox';
    let mailStatus = 'inbox';

    if (currentPath.includes('send')) {
      targetPath = '/purr-mail/send';
      mailStatus = 'send';
    } else if (currentPath.includes('trash')) {
      targetPath = '/purr-mail/trash';
      mailStatus = 'trash';
    }

    navigate(`${targetPath}/${mailId}`, { state: { status: mailStatus } });
  };

  // <-- Delete, Move, Restore, Starred and Important Mail --> //
  const handleDeleteSelectedItems = async () => {
    if (checkedItems.length === 0) {
      return;
    }

    try {
      for (const mailId of checkedItems) {
        await delMailApi(mailId);
        log.debug(`Permanently deleted mail with id: ${mailId}`);
      }

      setCheckedItems([]);
      setSelectAllCheck('unchecked');
      setAllCheck('unchecked');
      dispatch(setCheckedItemsCount(0));

      fetchData();
    } catch (error) {
      log.error('Failed to delete mail permanently:', error);
    }
  };

  const handleMoveSelectedItems = async () => {
    if (checkedItems.length === 0) {
      return;
    }

    try {
      for (const mailId of checkedItems) {
        await moveMailToRecycleBin(mailId);
        log.debug(`Moved mail to recycle bin with id: ${mailId}`);
      }

      setCheckedItems([]);
      setSelectAllCheck('unchecked');
      setAllCheck('unchecked');
      dispatch(setCheckedItemsCount(0));

      fetchData();
    } catch (error) {
      log.error('Failed to moved mail items:', error);
    }
  };

  const handleDeleteClick = () => {
    if (mailStatus === 'trash') {
      handleDeleteSelectedItems();
    } else {
      handleMoveSelectedItems();
    }
  };

  const handleRestoreClick = async () => {
    if (checkedItems.length === 0) {
      return;
    }

    try {
      for (const mailId of checkedItems) {
        await restoreMailApi(mailId);
        log.debug(`Restore mail with id: ${mailId}`);
      }

      setCheckedItems([]);
      setSelectAllCheck('unchecked');
      setAllCheck('unchecked');
      dispatch(setCheckedItemsCount(0));

      fetchData();
    } catch (error) {
      log.error('Failed to restore mail items:', error);
    }
  };

  useEffect(() => {
    if (isDeleted) {
      handleDeleteClick();
    } else if (isRestore) {
      handleRestoreClick();
    } else if (isStarred) {
      handleStarredAndImportantStatusClick('isStarred');
    } else if (isImportant) {
      handleStarredAndImportantStatusClick('isImportant');
    }
  }, [isDeleted, isRestore, isStarred, isImportant]);
  // <-- END Delete, Move, Restore, Starred and Important Mail --> //

  const isAllStarred = emailInbox
    .filter(email => checkedItems.includes(email.id))
    .every(email => email.isStarred);

  const isAllImportant = emailInbox
    .filter(email => checkedItems.includes(email.id))
    .every(email => email.isImportant);

  const hasMixedStarred = emailInbox
    .filter(email => checkedItems.includes(email.id))
    .some(email => email.isStarred !== isAllStarred);

  const hasMixedImportant = emailInbox
    .filter(email => checkedItems.includes(email.id))
    .some(email => email.isImportant !== isAllImportant);

  const handleStarredAndImportantStatusClick = async (
    statusKey: 'isStarred' | 'isImportant'
  ) => {
    if (checkedItems.length === 0) {
      return;
    }

    const allSelectedEmails = emailInbox.filter(email =>
      checkedItems.includes(email.id)
    );

    const shouldSetTrue = allSelectedEmails.some(email => !email[statusKey]);

    try {
      for (const mailId of checkedItems) {
        await updateStarredAndImportantStatus(mailId, {
          [statusKey]: shouldSetTrue,
        });
      }

      fetchData();
    } catch (error) {
      log.error(`Failed to update ${statusKey} status for mail items:`, error);
    }
  };

  const handleUpdateEmailStatus = (
    emailId: string,
    updatedFields: Partial<MailConversation>
  ) => {
    setEmailInbox(prevInbox =>
      prevInbox.map(email =>
        email.id === emailId ? { ...email, ...updatedFields } : email
      )
    );
  };

  const onClickRequest = (_requestId: string) => {
    const currentPath = location.pathname;
    let targetPath = '/purr-mail/inbox';

    if (currentPath.includes('send')) {
      targetPath = '/purr-mail/send';
    }

    dispatch(toggleMobileControlSidebarAction());
    navigate(`${targetPath}/${_requestId}`);
  };

  const mailLabels: Record<SidebarMenuEnum, string> = {
    [SidebarMenuEnum.INBOX]: 'Inbox',
    [SidebarMenuEnum.SEND]: 'Send',
    [SidebarMenuEnum.TRASH]: 'Trash',
  };

  return (
    <div
      className={classNames('flex flex-col gap-4', {
        'px-0 py-4': isTabletOrMobile,
        'p-4': !isTabletOrMobile,
      })}>
      {/* Header */}
      <p
        className={classNames('text-[#212B36] text-xl font-bold', {
          'px-4': isTabletOrMobile,
        })}>
        {mailLabels[mailStatus as SidebarMenuEnum] || 'Inbox'}
      </p>

      {/*Search Bar */}
      {!isTabletOrMobile && (
        <CustomSearchStyle>
          <SearchPopover<MailConversation>
            icon={FiSearch}
            searchType={'MAIL'}
            content={(searchResult, handleCloseSearch) => (
              <>
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
              </>
            )}
          />
        </CustomSearchStyle>
      )}

      {/* Actions */}
      {!isTabletOrMobile && (
        <div className="flex items-center justify-between gap-4 px-[10px]">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <CustomCheckboxStyle>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  id="custom-checkbox"
                  className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  checked={allCheck === 'checked'}
                  onChange={handleSelectAll}
                />
              </CustomCheckboxStyle>

              <CustomDropdownStyle>
                <Dropdown label="" inline>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => handleSelectAll()}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => {
                      setCheckedItems([]);
                      setSelectAllCheck('unchecked');
                    }}>
                    Unselected
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => {
                      const readEmails = emailInbox.filter(
                        email => email.isRead
                      );
                      setCheckedItems(readEmails.map(email => email.id));
                      setSelectAllCheck('indeterminate');
                    }}>
                    Read
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onClick={() => {
                      const unreadEmails = emailInbox.filter(
                        email => !email.isRead
                      );
                      setCheckedItems(unreadEmails.map(email => email.id));
                      setSelectAllCheck('indeterminate');
                    }}>
                    Unread
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item">
                    Starred
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item">
                    Unstirred
                  </Dropdown.Item>
                </Dropdown>
              </CustomDropdownStyle>
            </div>
            <div className="flex items-center gap-5 px-3">
              {checkedItems.length === 0 ? (
                <GrRefresh
                  className="text-gray-500 cursor-pointer hover:text-rose-500"
                  size={20}
                  onClick={() => reFetchData()}
                />
              ) : (
                <>
                  <div className="flex items-center gap-5 px-3">
                    <FaStar
                      className={classNames(
                        hasMixedStarred
                          ? 'text-gray-500'
                          : isAllStarred
                            ? 'text-yellow-400'
                            : 'text-gray-500',
                        'cursor-pointer hover:text-yellow-500'
                      )}
                      size={20}
                      onClick={() =>
                        handleStarredAndImportantStatusClick('isStarred')
                      }
                    />
                    <PiTagChevronFill
                      className={classNames(
                        hasMixedImportant
                          ? 'text-gray-500'
                          : isAllImportant
                            ? 'text-yellow-400'
                            : 'text-gray-500',
                        'cursor-pointer hover:text-yellow-500'
                      )}
                      size={20}
                      onClick={() =>
                        handleStarredAndImportantStatusClick('isImportant')
                      }
                    />
                    <PiWarningOctagonFill
                      className="text-gray-500 cursor-pointer hover:text-red-400"
                      size={20}
                    />
                    <ImBin
                      className="text-gray-500 cursor-pointer hover:text-rose-400"
                      size={18}
                      onClick={handleDeleteClick}
                    />

                    {mailStatus === SidebarMenuEnum.TRASH && (
                      <>
                        <div className="border-r-2 border-[#D1D5DB] h-6 mx-2"></div>
                        <Button
                          size="xs"
                          className="min-w-20 text-center bg-pink-orange rounded-full hover:opacity-70"
                          onClick={handleRestoreClick}>
                          <FaTrashRestoreAlt className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-end gap-2">
            <p className="text-[#919EAB] text-right text-xs font-normal">
              {pageRef.current}-
              {pageRef.current * limitRef.current > totalResults
                ? totalResults
                : pageRef.current * limitRef.current}{' '}
              of {totalResults}
            </p>
            <button
              onClick={handlePrevPage}
              disabled={pageRef.current === 1}
              className="text-rose-500 hover:text-rose-600">
              <CiCircleChevLeft size={22} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={pageRef.current >= totalPages}
              className="text-rose-500 hover:text-rose-600">
              <CiCircleChevRight size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Email List */}
      <CustomMailListStyle>
        <div
          className={classNames('size-full', {
            'unset-screen': isTabletOrMobile,
            'configure-screen': !isTabletOrMobile,
          })}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner color="pink" aria-label="Center-aligned spinner" />
            </div>
          ) : emailInbox.length === 0 ? (
            <p className="text-center">No results found.</p>
          ) : (
            <>
              {isTabletOrMobile ? (
                <InfiniteScroll
                  dataLength={emailInbox.length}
                  next={fetchMoreData}
                  hasMore={pageRef.current < totalPages}
                  loader={<></>}
                  endMessage={
                    <p className="text-sm text-center py-2">
                      Yay! You have seen it all
                    </p>
                  }>
                  <ul>
                    {emailInbox.map((email, index) => (
                      <MailListItem
                        key={index}
                        email={email}
                        index={index}
                        checked={checkedItems.includes(email.id)}
                        handleEmailClick={handleEmailClick}
                        handleItemCheck={handleItemCheck}
                        mailStatus={mailStatus}
                        isYouSender={isOwner}
                        isStarred={email.isStarred}
                        isImportant={email.isImportant}
                        updateEmailStatus={handleUpdateEmailStatus}
                      />
                    ))}
                  </ul>
                </InfiniteScroll>
              ) : (
                <ul>
                  {emailInbox.map((email, index) => (
                    <MailListItem
                      key={index}
                      email={email}
                      index={index}
                      checked={checkedItems.includes(email.id)}
                      handleEmailClick={handleEmailClick}
                      handleItemCheck={handleItemCheck}
                      mailStatus={mailStatus}
                      isYouSender={isOwner}
                      isStarred={email.isStarred}
                      isImportant={email.isImportant}
                      updateEmailStatus={handleUpdateEmailStatus}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </CustomMailListStyle>
    </div>
  );
}

const CustomCheckboxStyle = styled.div`
  padding: 5px;

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

  &:hover {
    background: linear-gradient(273deg, #fec4d5 5.69%, #fff1e6 93.2%);
    border-radius: 4px;
  }
`;

const CustomDropdownStyle = styled.div`
  padding: 8px 5px;
  button > svg {
    margin-left: unset;
  }
  &:hover {
    background: linear-gradient(273deg, #fec4d5 5.69%, #fff1e6 93.2%);
    border-radius: 4px;
  }

  [data-testid='flowbite-dropdown'] {
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

const CustomMailListStyle = styled.div`
  .configure-screen {
    height: calc(100vh - 296px);
    overflow-y: auto;
    scrollbar-color: auto;
  }

  .unset-screen {
    overflow: hidden;
  }
`;

const CustomSearchStyle = styled.div`
  .text-input {
    width: 100%;
    input {
      border-radius: 100px;
    }
  }
`;
