import IconButton from '../../../component/icon-button/IconButton';
import { FaChevronLeft } from 'react-icons/fa';
import ChatTab from '../../../component/chat-tab/ChatTab';
import ChatSkeleton from '../../../component/chat-skeleton/ChatSkeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { ComponentProps, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  setActiveTab,
  toggleMobileControlSidebarAction,
} from '../../../redux/convesation-layout';
import { useDispatch, useSelector } from '../../../redux';
import {
  ConversationMenuTab,
  ConversationRequestType,
  ConversationType,
} from '../../../type/conversation';
import {
  loadMoreResultAction,
  loadResultsAction,
  startLoadingAction,
} from '../../../redux/conversation-request';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { defaultImages } from '../../../constant/default-images';
import moment from 'moment';
import TabWrapper from '../../../component/TabWrapper';
import { ConversationRequestPayload } from '../../../type/conversation-requests';
import SearchPopover from '../@share/SearchPopover';
import { GlobalSearchType } from '../../../type/chat';
import emptyChatImage from '../../../asset/images/empty-img/empty-chat.svg';
import { startLoadingAction as startLoadingActionConversation } from '../../../redux/conversation';
import useBoolean from '../../../helper/hook/useBoolean';

export default function GroupInviteSection() {
  const { requestId } = useParams();
  const { isInitializing, queryParams, results, pageInfo } = useSelector(
    state => state.conversationRequest
  );
  const { isInitializing: isInitializingConversation, isFetchFirebase } =
    useSelector(state => state.conversation);
  const [isInit, initStart, initDone] = useBoolean(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useDeepEffect(() => {
    dispatch(startLoadingAction());
    dispatch(
      loadResultsAction({ type: ConversationRequestType.GROUP_REQUEST })
    );
  }, []);

  useEffect(() => {
    switch (true) {
      case isInitializing:
      case isInitializingConversation:
      case isFetchFirebase:
        initStart();
        break;
      default:
        setTimeout(() => {
          initDone();
        }, 800);
        break;
    }
  }, [isInitializing, isInitializingConversation, isFetchFirebase]);

  const onScrollEnd = async () => {
    const newQueryParams = {
      ...queryParams,
      page: +queryParams.page! + 1,
    };
    dispatch(loadMoreResultAction(newQueryParams));
  };

  const onClickRequest = (_requestId: string) => {
    dispatch(toggleMobileControlSidebarAction());
    const tab = ConversationMenuTab.GROUP_INVITE;
    navigate(`/chat/${tab}/${_requestId}`);
  };

  const onClickBackToConversation = () => {
    dispatch(startLoadingActionConversation());
    const tab = ConversationMenuTab.GROUP;
    dispatch(setActiveTab(tab));
    navigate(`/chat/${tab}`);
  };

  return (
    <>
      <div className="px-3 h-[50px]">
        <SearchPopover<ConversationRequestPayload>
          searchType={GlobalSearchType.REQUEST}
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
      </div>

      <div
        className={
          (isInit ? 'cursor-not-allowed' : 'cursor-pointer') +
          ' flex items-center justify-between px-3 h-[45px]'
        }
        onClick={() => !isInit && onClickBackToConversation()}>
        <div className="flex items-center justify-between gap-2">
          <span className="w-[22px] h-[22px] p-1.5 flex items-center justify-center rounded-full">
            <IconButton icon={FaChevronLeft} />
          </span>
          <p className="text-[#6B7280] font-semibold">Group conversation</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 h-[45px]">
        <p className="text-base text-gray-500">
          Invitation to join conversation
        </p>
      </div>

      <div
        className="pb-3 overflow-y-auto conversation-container-height"
        id="content-container">
        {isInit ? (
          <SkeletonLoader />
        ) : (
          <>
            {!results.length && (
              <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400">
                <img src={emptyChatImage} width={62} alt="empty chat" />
                <div className="px-4 text-center">
                  <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                    No Group Invitation
                  </p>
                  <p className="text-sm font-normal text-[#9CA3AF] max-w-[280px]">
                    No Group Invitation yet
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
              }>
              <div className="flex flex-col items-start">
                {[...results].map((result, i) => {
                  return (
                    <RequestTab
                      key={result.id + i}
                      active={requestId === result.id}
                      onClick={() => onClickRequest(result.id)}
                      request={result}
                    />
                  );
                })}
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
      <ChatSkeleton count={2} loading type="direct" />
      <ChatSkeleton count={2} loading type="direct" />
    </div>
  );
}

function RequestTab(
  props: { request: ConversationRequestPayload } & ComponentProps<
    typeof TabWrapper
  >
) {
  const { request, ...rest } = props;
  const { user } = useSelector(state => state.account);
  const isMyRequest = user?.id === request.senderId;

  if (isMyRequest) return <></>;

  return (
    <TabWrapper {...rest}>
      <ChatTab
        img={
          (request.conversation?.type === ConversationType.DM
            ? request.sender.picture
            : request.conversation?.profilePicture) || defaultImages.noProfile
        }
        unreadCount={0}
        textHighlight={true}
        name={request?.conversation?.name || 'Unknown'}
        text={'Invite to join the group'}
        timestamp={moment(request.createdAt).unix()}
      />
    </TabWrapper>
  );
}
