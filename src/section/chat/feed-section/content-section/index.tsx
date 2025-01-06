import { useSelector } from '../../../../redux';
import { ConversationMenuTab } from '../../../../type/conversation';
import ContactInfoSection from './contact/ContactInfoSection';
import ChatFeedSection from './chat-feed/ChatFeedSection';
import MessageRequestSection from './message-request/MessageRequestSection';
import ChatEncryptionSchemePortal from './chat-feed/ChatEncryptionSchemePortal';

export default function FeedSection() {
  const { activeTab } = useSelector(state => state.conversationLayout);

  switch (activeTab) {
    case ConversationMenuTab.CONTACTS:
      return <ContactInfoSection />;
    case ConversationMenuTab.DIRECT:
    case ConversationMenuTab.GROUP:
      return (
        <ChatEncryptionSchemePortal>
          <ChatFeedSection />
        </ChatEncryptionSchemePortal>
      );
    case ConversationMenuTab.DIRECT_REQUEST:
    case ConversationMenuTab.GROUP_INVITE:
      return <MessageRequestSection />;
    default:
      <></>;
  }
}
