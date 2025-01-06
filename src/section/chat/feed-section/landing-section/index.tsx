import Landing from '../../../../component/landing/Landing';
import { useDispatch, useSelector } from '../../../../redux';
import { ConversationMenuTab } from '../../../../type/conversation';
import noChatSelect from '../../../../asset/images/no-chat-select.svg';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect';
import useResponsive from '../../../../helper/hook/useResponsive';
import { setIsOpenMobileControlSidebar } from '../../../../redux/convesation-layout';

export default function LandingSectionContainer() {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.conversationLayout);
  const { isTabletOrMobile } = useResponsive();

  useDeepEffect(() => {
    dispatch(setIsOpenMobileControlSidebar(true));
  }, []);

  const getLandingMessage = () => {
    switch (activeTab) {
      case ConversationMenuTab.CONTACTS: {
        return {
          title: 'No contact selected',
          subTitle: 'Select a contact from the list to start a conversation.',
          src: noChatSelect,
        };
      }
      case ConversationMenuTab.DIRECT: {
        return {
          title: 'No direct conversation selected',
          subTitle:
            'Select the chat room from lect navigation bar to start a conversation.',
          src: noChatSelect,
        };
      }
      case ConversationMenuTab.DIRECT_REQUEST: {
        return {
          title: 'No message request selected',
          subTitle:
            'Select a direct message invitation from the list to view details and accept or decline.',
          src: noChatSelect,
        };
      }
      case ConversationMenuTab.GROUP: {
        return {
          title: 'No group conversation selected',
          subTitle:
            'Select the group chat from lect navigation bar to start a conversation.',
          src: noChatSelect,
        };
      }
      case ConversationMenuTab.GROUP_INVITE: {
        return {
          title: 'No group invitation selected',
          subTitle:
            'Select a group invitation from the list to view details and accept or decline.',
          src: noChatSelect,
        };
      }
      case ConversationMenuTab.DISPUTE: {
        return {
          title: 'No dispute conversation selected',
          subTitle:
            'Select a dispute room from the navigation bar to see more details.',
          src: noChatSelect,
        };
      }
      default:
        return {
          title: '',
          subTitle: '',
          src: noChatSelect,
        };
    }
  };

  const { src, title, subTitle } = getLandingMessage();

  return (
    <div
      className={
        (isTabletOrMobile ? 'min-h-[calc(100vh-58px)]' : 'min-h-full') +
        ' flex items-center justify-center w-full fade-in'
      }>
      {/* bg-gray-50 */}
      <Landing src={src} subTitle={subTitle} title={title} />
    </div>
  );
}
