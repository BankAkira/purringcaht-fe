import ChatSkeleton from '../../../component/chat-skeleton/ChatSkeleton';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '../../../component/icon-button/IconButton';
import { BsPatchQuestion } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { useDispatch, useSelector } from '../../../redux';
import {
  fetchDeletedMessages,
  fetchMessages,
  loadMoreResultAction,
  loadResultsAction,
  setDefaultConversationStateAction,
  startLoadingAction,
  startLoadingAction as startLoadingConversationAction,
} from '../../../redux/conversation';
import {
  ConversationMenuTab,
  ConversationPayload,
  ConversationType,
} from '../../../type/conversation';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import useBoolean from '../../../helper/hook/useBoolean';
import CreateGroupModal from './CreateGroupModal';
import {
  setActiveTab,
  toggleMobileControlSidebarAction,
} from '../../../redux/convesation-layout';
import ConversationTab from '../../../component/ConversationTab';
import SearchPopover from '../@share/SearchPopover';
import { GlobalSearchType } from '../../../type/chat';
import emptyChatImage from '../../../asset/images/empty-img/empty-chat.svg';
import { IncomingMessage } from '../../../type/message';
import { useEffect, useState } from 'react';
import { off, ref } from 'firebase/database';

export default function GroupConvesation() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupRequestCount } = useSelector(state => state.badge);
  const { isInitializing, queryParams, results, pageInfo, deletedResults } =
    useSelector(state => state.conversation);
  const [isOpenAddModal, openAddModal, closeAddModal] = useBoolean(false);
  const { database } = useSelector(state => state.firebase);
  const { isInitializing: isMessageInitializing } = useSelector(
    state => state.message
  );
  const [incomingMessage, setIncomingMessage] = useState<IncomingMessage[]>([]);
  const [isDisabled, trueIsDisabled, falseIsDisabled] = useBoolean(false);

  useEffect(() => {
    if (isInitializing || isMessageInitializing) {
      trueIsDisabled();
    } else {
      setTimeout(() => {
        falseIsDisabled();
      }, 500);
    }
  }, [isInitializing, isMessageInitializing]);

  useDeepEffect(() => {
    dispatch(fetchMessages()).then(msg => {
      setIncomingMessage(msg);
    });

    return () => {
      if (database) {
        results.forEach(item => {
          const listenRef = ref(database, `${item.id}/latestMessage`);
          off(listenRef);
        });
      }
    };
  }, [database, isInitializing, results.length]);

  useDeepEffect(() => {
    if (database && deletedResults.length > 0 && !isInitializing) {
      dispatch(fetchDeletedMessages());
    }
    return () => {
      if (database) {
        deletedResults.forEach(item => {
          const listenRef = ref(
            database,
            `${item.conversationId}/latestMessage`
          );
          off(listenRef);
        });
      }
    };
  }, [database, isInitializing, deletedResults.length]);

  useDeepEffect(() => {
    (() => {
      dispatch(startLoadingConversationAction());

      dispatch(
        loadResultsAction({
          type: ConversationType.GROUP,
        })
      );
    })();

    return () => {
      dispatch(setDefaultConversationStateAction());
    };
  }, []);

  const onScrollEnd = async () => {
    const newQueryParams = {
      ...queryParams,
      page: +queryParams.page! + 1,
    };
    dispatch(loadMoreResultAction(newQueryParams));
  };

  const onClickInviteGroup = () => {
    dispatch(startLoadingAction());
    const tab = ConversationMenuTab.GROUP_INVITE;
    dispatch(setActiveTab(tab));
    navigate(`/chat/${tab}`);
  };

  const onClickAddConversation = () => {
    openAddModal();
  };

  const onClickConversation = async (groupId: string) => {
    dispatch(toggleMobileControlSidebarAction());
    navigate(`/chat/${ConversationMenuTab.GROUP}/${groupId}`);
    setTimeout(() => {
      dispatch(
        loadResultsAction({
          type: ConversationType.GROUP,
        })
      );
    }, 300);
  };

  return (
    <>
      <div className="px-3 h-[50px]">
        <SearchPopover<ConversationPayload>
          searchType={GlobalSearchType.GROUP}
          content={(searchResult, handleCloseSearch) => (
            <>
              <div
                className={
                  (isDisabled ? 'opacity-70 pointer-events-none' : '') +
                  ' flex flex-col items-start fade-in transition'
                }>
                {[...searchResult].map((result, i) => (
                  <ConversationTab
                    key={result.id + i}
                    active={false}
                    onClick={() => {
                      onClickConversation(result.id);
                      handleCloseSearch();
                    }}
                    conversation={result}
                    incomingMessage={
                      incomingMessage.find(
                        item => item.conversationId === result.id
                      ) || null
                    }
                  />
                ))}
              </div>
            </>
          )}
        />
      </div>

      {!!groupRequestCount && (
        <div
          className={
            (isInitializing ? 'cursor-not-allowed' : 'cursor-pointer') +
            ' flex items-center justify-between px-3 h-[45px]'
          }
          onClick={() => !isInitializing && onClickInviteGroup()}>
          <div className="flex items-center justify-between gap-2">
            <span className="w-[32px] h-[32px] p-1.5 flex items-center justify-center bg-gray-100 rounded-full">
              <IconButton icon={BsPatchQuestion} />
            </span>
            <p className="text-[#6B7280] font-semibold">Group Invitations</p>
          </div>
          <div className="bg-[#FE7601] rounded-full w-6 h-6 text-xs line-clamp-none font-bold text-white flex justify-center items-center">
            {groupRequestCount}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-3 h-[45px]">
        <p className="text-base text-gray-500">Group Conversations</p>
        <p
          className="flex gap-1 items-center text-[12px] text-[#ff6969] font-bold cursor-pointer hover:opacity-70 transition"
          onClick={onClickAddConversation}>
          <IconButton icon={FaPlus} color="#ff6969" width={14} height={14} />
          <span>ADD</span>
        </p>
      </div>

      <div
        className={classNames('pb-3 overflow-y-auto', {
          'conversation-container-height': !!groupRequestCount,
          'extra-conversation-container-height': !groupRequestCount,
        })}
        id="content-container">
        {isInitializing ? (
          <SkeletonLoader />
        ) : (
          <>
            {!results.length && (
              <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400">
                <img src={emptyChatImage} width={62} alt="empty chat" />
                <div className="px-4 text-center">
                  <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                    No Group Chat
                  </p>
                  <p className="text-sm font-normal text-[#9CA3AF] max-w-[280px]">
                    You didn't made any conversation yet, start the
                    conversation!
                  </p>
                </div>
              </div>
            )}
            <InfiniteScroll
              dataLength={+pageInfo.page * +pageInfo.limit}
              next={onScrollEnd}
              hasMore={
                !!results.length && results.length < pageInfo.totalResults
              }
              scrollableTarget="content-container"
              loader={
                <div className="my-3">
                  <SkeletonLoader />
                </div>
              }
              endMessage={<></>}>
              <div
                className={
                  (isDisabled ? 'opacity-70 pointer-events-none' : '') +
                  ' flex flex-col items-start fade-in transition'
                }>
                {[...results].map((result, i) => (
                  <ConversationTab
                    key={result.id + i}
                    active={groupId === result.id}
                    onClick={() => onClickConversation(result.id)}
                    conversation={result}
                    incomingMessage={
                      incomingMessage.find(
                        item => item.conversationId === result.id
                      ) || null
                    }
                  />
                ))}
              </div>
            </InfiniteScroll>
          </>
        )}
      </div>

      {isOpenAddModal && (
        <CreateGroupModal open={isOpenAddModal} onClose={closeAddModal} />
      )}
    </>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-1 px-3">
      <ChatSkeleton count={2} loading type="group" />
      <ChatSkeleton count={2} loading type="group" />
      <ChatSkeleton count={2} loading type="group" />
      <ChatSkeleton count={2} loading type="group" />
      <ChatSkeleton count={2} loading type="group" />
    </div>
  );
}
