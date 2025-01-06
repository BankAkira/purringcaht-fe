import ChatSkeleton from '../../../../component/chat-skeleton/ChatSkeleton.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from '../../../../redux';
import { toggleMobileControlSidebarAction } from '../../../../redux/convesation-layout.ts';
import { ConversationType } from '../../../../type/conversation.ts';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect.ts';
import {
  loadMoreResultAction,
  startLoadingAction as startLoadingConversationAction,
  loadResultsAction as loadConversationAction,
  setDefaultConversationStateAction,
  fetchMessages,
  fetchDeletedMessages,
} from '../../../../redux/conversation-dispute.ts';
import useBoolean from '../../../../helper/hook/useBoolean.ts';
import ConversationTabDispute from '../../components/ConversationTabDispute.tsx';
import emptyChatImage from '../../../../asset/images/empty-img/empty-chat.svg';
import { IncomingMessage } from '../../../../type/message.ts';
import { useEffect, useState } from 'react';
import { off, ref } from 'firebase/database';

export default function DisputeConversation() {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  // const { user } = useSelector(state => state.account);
  const { isInitializing, queryParams, results, pageInfo, deletedResults } =
    useSelector(state => state.conversationDispute);
  const navigate = useNavigate();
  const { database } = useSelector(state => state.firebase);
  const { isInitializing: isMessageInitializing } = useSelector(
    state => state.messageDispute
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
        loadConversationAction({
          type: ConversationType.DM,
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

  const onClickConversation = async (_conversationId: string) => {
    dispatch(toggleMobileControlSidebarAction());
    navigate(`/dispute/${_conversationId}`);
    // setTimeout(() => {
    //   dispatch(
    //     loadConversationAction({
    //       type: ConversationType.DM,
    //     })
    //   );
    // }, 300);
  };

  return (
    <>
      <div className="pb-3 overflow-y-auto" id="content-container">
        {isInitializing ? (
          <SkeletonLoader />
        ) : (
          <>
            {!results.length && (
              <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400">
                <img src={emptyChatImage} width={62} alt="empty chat" />
                <div className="px-4 text-center">
                  <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                    No Conversation
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
                  <ConversationTabDispute
                    key={result.id + i}
                    active={conversationId === result.id}
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
    </>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-1 px-3">
      <ChatSkeleton count={2} loading type="direct" />
      <ChatSkeleton count={2} loading type="direct" />
      <ChatSkeleton count={2} loading type="direct" />
    </div>
  );
}
