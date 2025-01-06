import { useSelector } from '../../../../redux';
import { ConversationMenuTab } from '../../../../type/conversation';
import AddContactSection from './AddContactSection';

export default function AddSectionContainer() {
  const { activeTab } = useSelector(state => state.conversationLayout);

  switch (activeTab) {
    case ConversationMenuTab.CONTACTS:
      return <AddContactSection />;
    default:
      return <></>;
  }
}
