import { useSelector } from '../../redux';
import { ConversationPayload, ConversationType } from '../../type/conversation';
import { UserSetting } from '../../type/setting';

export type Profile = {
  userId?: string;
  contactId?: string;
  pictures?: string[];
  name?: string;
  displayId?: string;
  description?: string;
  userSetting?: UserSetting;
};

export default function useConversationProfile(
  conversation?: ConversationPayload | null
) {
  const { user } = useSelector(state => state.account);

  if (!conversation || !user) {
    return null;
  }

  let profile: Profile = {
    userId: '',
    contactId: '',
    pictures: Array<string>(),
    name: '',
    displayId: '',
    description: '',
    userSetting: undefined,
  };

  if (conversation.type === ConversationType.DM) {
    const opponent = conversation.participants.find(p => p.userId !== user.id);
    profile = {
      userId: opponent?.userId,
      contactId: opponent?.contact?.id,
      pictures: opponent?.user.picture ? [opponent.user.picture] : undefined,
      name: conversation?.userNickname || opponent?.user.displayName,
      displayId: opponent?.user.displayId,
      description: opponent?.user.displayId,
      userSetting: Array.isArray(opponent?.user.userSettings)
        ? opponent?.user.userSettings[0]
        : opponent?.user.userSettings,
    };
  }

  if (conversation.type === ConversationType.GROUP) {
    const pictures = conversation.participants.map(
      participant => participant.user.picture
    );

    profile = {
      pictures,
      name: conversation.name,
      description: conversation.description,
    };
  }

  return profile;
}
