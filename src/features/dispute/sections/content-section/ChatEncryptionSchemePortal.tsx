// React and Redux imports
import { PropsWithChildren, useState } from 'react';
import { useDispatch, useSelector } from '../../../../redux';
import { useNavigate, useParams } from 'react-router-dom';

// Helper and API function imports
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect.ts';
import {
  CryptoAES256,
  CryptoECIES,
  generateSecret,
} from '../../../../helper/rsa-crypto.ts';
import { getEncryptedUserSecretByUserIdApi } from '../../../../rest-api/encrypted-user-secrets.ts';
import {
  getDisputeByConversationId,
  getConversationSecretDisputeByIdApi,
} from '../../../../rest-api/conversation.ts';
import { createChatSecretApi } from '../../../../rest-api/encrypted-chat-secrets.ts';
import { Buffer } from 'buffer';
import { Logger } from '../../../../helper/logger.ts';
import { errorFormat } from '../../../../helper/error-format.ts';
import { toast } from 'react-toastify';

// Third-party libraries
import { ethers } from 'ethers';

// Components and Redux actions
import FullSpinner from '../../../../component/FullSpinner.tsx';
import {
  initializeChatSchemeAction,
  setChatSecret,
} from '../../../../redux/message-dispute.ts';

// Types and Enums
import { DmEncryptedChatSecret } from '../../../../type/crypto.ts';
import {
  ConversationPayload,
  ConversationType,
} from '../../../../type/conversation.ts';
import { Dispute, DisputeInformation } from '../../../../type/dispute.ts';

const log = new Logger('ChatEncryptionSchemePortal Dispute');

export default function ChatEncryptionSchemePortal({
  children,
}: PropsWithChildren) {
  // Redux state and router hooks
  const { user, userScheme } = useSelector(state => state.account);
  const { chatScheme } = useSelector(state => state.messageDispute);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Component state
  const [isInitialize, setIsInitialize] = useState(false);
  const [isError, setIsError] = useState(false);

  // Custom deep effect hook to initialize chat secrets
  useDeepEffect(() => {
    initializeChatSecret();
  }, [params]);

  const getConversationSecret = async (conversationId: string) => {
    try {
      return await getConversationSecretDisputeByIdApi(conversationId);
    } catch (error) {
      return undefined;
    }
  };

  const inCaseAlreadyHaveDmSecret = (secret: string) => {
    const encryptedChatSecret = Buffer.from(secret.slice(2), 'hex');
    const chatSecret = userScheme!.decrypt(encryptedChatSecret);
    const chatSecretToHex = chatSecret.toString('hex');
    const chatScheme = new CryptoAES256(chatSecret);
    dispatch(initializeChatSchemeAction({ chatScheme }));
    dispatch(setChatSecret({ chatSecret: chatSecretToHex }));
  };

  const inCaseNoDmSecret = async (conversation: ConversationPayload) => {
    const { participants } = conversation;

    const chatSecret = generateSecret();

    const peerUser = participants.filter(p => p.user.id !== user!.id)[0].user;

    const peerSecret = await getEncryptedUserSecretByUserIdApi(peerUser.id);

    if (!peerSecret) {
      throw new Error('get peer secret fail');
    }

    const peerPublicKey = Buffer.from(
      (peerSecret.publicKeyPrefix ? '02' : '03') +
        peerSecret.publicKeyX.slice(2),
      'hex'
    );

    const chatSecretEncryptedForPeer = CryptoECIES.encrypt(
      peerPublicKey.toString('hex'),
      chatSecret
    );

    const chatSecretEncryptedForMe = userScheme!.encrypt(chatSecret);

    const chatInitialization: DmEncryptedChatSecret = {
      myEncryptedChatSecret: ethers.utils.hexlify(chatSecretEncryptedForMe),
      peerEncryptedChatSecret: ethers.utils.hexlify(chatSecretEncryptedForPeer),
      peerUserId: peerUser.id,
      conversationId: conversation.id,
    };

    const response = await createChatSecretApi(chatInitialization);

    if (!response) {
      throw new Error('create secret fail');
    }

    const chatScheme = new CryptoAES256(chatSecret);
    dispatch(initializeChatSchemeAction({ chatScheme }));
  };

  const initializeChatSecret = async () => {
    // setSecretKeyForAdmin();
    // deCryptChatSecretForAdmin();
    if (user && params.conversationId && userScheme) {
      setIsInitialize(true);
      try {
        const conversationId = params.conversationId;
        if (!conversationId) {
          throw new Error('conversation id is empty');
        }

        const conversation = await getDisputeByConversationId(conversationId);
        if (!conversation) {
          throw new Error('get conversation fail');
        }

        const findUserAdminDisputes = (conversation: ConversationPayload) => {
          if (!conversation?.Dispute) return;
          const SC = conversation.Dispute.flatMap((e: Dispute) =>
            e.disputeInformations.flatMap((info: DisputeInformation) =>
              info.userAdminDisputes.filter(item => item.adminId === user.id)
            )
          );

          const result = SC.length ? SC[0] : null;
          return result;
        };
        const adminSecret = findUserAdminDisputes(conversation);

        const secretPayload = await getConversationSecret(conversation.id);
        const secret = adminSecret
          ? adminSecret.adminSecretKey
          : secretPayload?.secret;

        switch (conversation.type) {
          case ConversationType.DM: {
            if (secret) {
              inCaseAlreadyHaveDmSecret(secret);
            } else {
              await inCaseNoDmSecret(conversation);
            }
            break;
          }
          default: {
            throw new Error('Conversation type not support');
          }
        }
      } catch (error) {
        log.error(error);
        setIsError(true);
        if (errorFormat(error).message === 'Conversation not found') {
          toast.error('Chat not found');
          navigate(`/dispute`);
        }
      } finally {
        setIsInitialize(false);
      }
    }
  };

  // Render spinner while initializing or if chat scheme is not yet available
  if (isInitialize || !chatScheme) {
    return <FullSpinner />;
  }

  // Render error message if an error occurs
  if (isError) {
    return <p className="text-red-500">Something went wrong!</p>;
  }

  // Render children when everything is initialized and no errors
  return <>{children}</>;
}
