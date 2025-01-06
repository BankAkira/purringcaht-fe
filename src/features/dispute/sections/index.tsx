import ChatFeedSection from './content-section/ChatFeedSection.tsx';
import ChatEncryptionSchemePortal from './content-section/ChatEncryptionSchemePortal.tsx';

export default function FeedSection() {
  return (
    <ChatEncryptionSchemePortal>
      <ChatFeedSection />
    </ChatEncryptionSchemePortal>
  );
}
