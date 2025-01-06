import classNames from 'classnames';
import {
  ConversationMenuTab,
  ConversationType,
} from '../../../type/conversation';
import { IoChatboxEllipses } from 'react-icons/io5';
import { HiChatAlt2 } from 'react-icons/hi';
import { HiMiniUser } from 'react-icons/hi2';
import DirectConvesationSection from './DirectConvesationSection';
import { useDispatch, useSelector } from '../../../redux';
import { setActiveTab } from '../../../redux/convesation-layout';
import GroupConvesationSection from './GroupConvesationSection';
import ContactSection from './ContactSection';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { IconType } from 'react-icons';
import DirectRequestSection from './DirectRequestSection';
import GroupInviteSection from './GroupInviteSection';
import {
  loadResultsAction,
  setDefaultConversationStateAction,
  setIsFetchFirebase,
  startLoadingAction,
} from '../../../redux/conversation';
import useBoolean from '../../../helper/hook/useBoolean';
import { useEffect } from 'react';
import {
  loadResultsAction as loadContactResultsAction,
  startLoadingAction as startContactLoadingAction,
} from '../../../redux/contact';

export default function ConversationContainer() {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.conversationLayout);
  const { isInitializing } = useSelector(state => state.conversation);
  const { isInitializing: isContactInitializing } = useSelector(
    state => state.contact
  );
  const { isInitializing: isMessageInitializing } = useSelector(
    state => state.message
  );
  const { unreadDmCount, unreadGroupCount } = useSelector(state => state.badge);
  const navigate = useNavigate();
  const [isDisabled, trueIsDisabled, falseIsDisabled] = useBoolean(false);

  useEffect(() => {
    switch (true) {
      case isInitializing:
      case isMessageInitializing:
      case isContactInitializing:
        trueIsDisabled();
        break;
      default:
        setTimeout(() => {
          falseIsDisabled();
        }, 500);
        break;
    }
  }, [isInitializing, isMessageInitializing, isContactInitializing]);

  const onClickTab = (tab: ConversationMenuTab) => {
    setTimeout(() => {
      dispatch(setIsFetchFirebase(true));
    }, 10);

    if (
      !isInitializing ||
      tab === ConversationMenuTab.CONTACTS ||
      tab === ConversationMenuTab.DIRECT ||
      tab === ConversationMenuTab.GROUP
    ) {
      dispatch(setActiveTab(tab));
      navigate(`/chat/${tab}`);
    }
    if (tab === activeTab) {
      if (tab === ConversationMenuTab.DIRECT) {
        (() => {
          dispatch(startLoadingAction());
          dispatch(
            loadResultsAction({
              type: ConversationType.DM,
            })
          );
        })();
        return () => {
          dispatch(setDefaultConversationStateAction());
        };
      } else if (tab === ConversationMenuTab.GROUP) {
        (() => {
          dispatch(startLoadingAction());
          dispatch(
            loadResultsAction({
              type: ConversationType.GROUP,
            })
          );
        })();
        return () => {
          dispatch(setDefaultConversationStateAction());
        };
      } else if (tab === ConversationMenuTab.CONTACTS) {
        dispatch(startContactLoadingAction());
        dispatch(loadContactResultsAction());
      }
    }
  };

  const TabButton = (
    Icon: IconType,
    menuTab: ConversationMenuTab,
    altMenuTab?: ConversationMenuTab,
    countChat?: number
  ) => {
    const isActive = activeTab === menuTab || activeTab === altMenuTab;

    return (
      <>
        <Button
          disabled={isDisabled}
          color="gray"
          className={classNames(
            'p-0 rounded-full h-[38px] btn-conversation-tab ',
            { active: isActive }
          )}
          onClick={() => onClickTab(menuTab)}>
          <svg width="0" height="0" className="absolute">
            <linearGradient
              id="direct-gradient"
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%">
              <stop stopColor="#FE7601" offset="0%" />
              <stop stopColor="#FD4077" offset="100%" />
            </linearGradient>
          </svg>
          <div className="font-semibold flex max-lg:flex-col justify-center items-center">
            <Icon
              style={{
                ...(isActive && {
                  fill: 'url(#direct-gradient)',
                }),
              }}
              className="w-4 h-4 lg:mr-2"
            />
            <b className="font-semibold max-lg:!font-bold max-lg:text-[9px] max-lg:leading-[10px] capitalize">
              {menuTab === 'direct'
                ? 'Chat'
                : menuTab === 'contacts'
                  ? 'Friends'
                  : menuTab}
            </b>
            {!!countChat && countChat > 0 && (
              <div
                className={classNames(
                  'rounded-full text-white ring-1 ring-white  w-[18px] h-[18px] badge-background absolute -top-[5px] -right-[5px] text-fill-white',
                  'select-none',
                  'font-bold text-[10px]',
                  'flex justify-center items-center'
                )}>
                {Number(countChat) <= 99 ? countChat : 99}
              </div>
            )}
          </div>
        </Button>
      </>
    );
  };

  return (
    <div
      className={classNames(
        'flex flex-col',
        'border-r border-gray-200',
        'max-w-full'
      )}>
      <div className="flex justify-start items-center gap-2 px-3 wrapper-chat-conversation h-[70px] max-lg:px-4">
        {TabButton(
          IoChatboxEllipses,
          ConversationMenuTab.DIRECT,
          ConversationMenuTab.DIRECT_REQUEST,
          unreadDmCount
        )}
        {TabButton(
          HiChatAlt2,
          ConversationMenuTab.GROUP,
          ConversationMenuTab.GROUP_INVITE,
          unreadGroupCount
        )}
        {TabButton(
          HiMiniUser,
          ConversationMenuTab.CONTACTS,
          ConversationMenuTab.CONTACTS,
          0
        )}
      </div>

      {activeTab === ConversationMenuTab.DIRECT && <DirectConvesationSection />}
      {activeTab === ConversationMenuTab.DIRECT_REQUEST && (
        <DirectRequestSection />
      )}
      {activeTab === ConversationMenuTab.GROUP && <GroupConvesationSection />}
      {activeTab === ConversationMenuTab.GROUP_INVITE && <GroupInviteSection />}
      {activeTab === ConversationMenuTab.CONTACTS && <ContactSection />}
    </div>
  );
}
