// import (Internal imports)
import { ComponentProps } from 'react';

import moment from 'moment';

// redux
import { useSelector } from '../../../../redux';

// types
import { MailConversation } from '../../../../type';

// components
import TabWrapper from './TabWrapper';
import CardTab from './CardTab';

type RequestTabProps = {
  request: MailConversation;
} & ComponentProps<typeof TabWrapper>;

export default function RequestTab({ request, ...rest }: RequestTabProps) {
  const { user } = useSelector(state => state.account);

  const participantImages = request.participant
    .filter(participant => {
      if (request.participant.length > 2) {
        return true;
      }
      return participant.userId !== user?.id;
    })
    .map(participant => ({
      picture: participant.user.picture,
      initials: participant.user.displayName
        ? participant.user.displayName.charAt(0).toUpperCase()
        : 'U',
    }));

  const participants = request.participant.map(participant => {
    if (participant.userId === user?.id) {
      return 'Me';
    } else {
      return participant.user.email;
    }
  });

  const formattedParticipants = participants.join(', ');

  return (
    <TabWrapper {...rest}>
      <CardTab
        img={participantImages}
        name={request.mailConversationMessage[0]?.subject}
        mail={formattedParticipants}
        timestamp={moment(request.updatedAt).unix()}
      />
    </TabWrapper>
  );
}
