import { PropsWithChildren, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../redux';
import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';
import {
  CryptoAES256,
  CryptoECIES,
  generateSecret,
} from '../../../../../helper/rsa-crypto';
import { getEncryptedUserSecretByUserIdApi } from '../../../../../rest-api/encrypted-user-secrets';

import { ethers } from 'ethers';
import {
  getConversationByIdApi,
  getConversationSecretByIdApi,
} from '../../../../../rest-api/conversation';
import { useNavigate, useParams } from 'react-router-dom';
import FullSpinner from '../../../../../component/FullSpinner';
import {
  DmEncryptedChatSecret,
  GroupEncryptedChatSecret,
} from '../../../../../type/crypto';
import { createChatSecretApi } from '../../../../../rest-api/encrypted-chat-secrets';
import {
  initializeChatSchemeAction,
  setChatSecret,
} from '../../../../../redux/message';
import { Buffer } from 'buffer';
import {
  ConversationMenuTab,
  ConversationPayload,
  ConversationType,
} from '../../../../../type/conversation';
import { Logger } from '../../../../../helper/logger';
import { errorFormat } from '../../../../../helper/error-format';
import { toast } from 'react-toastify';
import { setIsFetchFirebase } from '../../../../../redux/conversation';

const log = new Logger('ChatEncryptionSchemePortal');

export default function ChatEncryptionSchemePortal({
  children,
}: PropsWithChildren) {
  const { user, userScheme } = useSelector(state => state.account);
  const { chatScheme } = useSelector(state => state.message);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isInitialize, setIsInitialize] = useState(false);
  const [isError, setIsError] = useState(false);

  useDeepEffect(() => {
    initializeChatSecret();
  }, [params]);

  const getConversationSecret = async (conversationId: string) => {
    try {
      const secretPayload = await getConversationSecretByIdApi(conversationId);
      return secretPayload;
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

  const inCaseAlreadyHaveGroupSecret = (secret: string) => {
    const chatSecret = Buffer.from(secret.slice(2), 'hex');
    const chatScheme = new CryptoAES256(chatSecret);
    dispatch(initializeChatSchemeAction({ chatScheme }));
  };

  const inCaseNoGroupSecret = async (conversation: ConversationPayload) => {
    const chatSecret = generateSecret();

    const chatInitialization: GroupEncryptedChatSecret = {
      groupEncryptedChatSecret: ethers.utils.hexlify(chatSecret),
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
    if (user && (params.directId || params.groupId) && userScheme) {
      setIsInitialize(true);
      dispatch(setIsFetchFirebase(true));

      try {
        const conversationId = params.directId || params.groupId;

        if (!conversationId) {
          throw new Error('conversation id is empty');
        }

        const conversation = await getConversationByIdApi(conversationId);

        if (!conversation) {
          throw new Error('get conversation fail');
        }

        const secretPayload = await getConversationSecret(conversation.id);

        switch (conversation.type) {
          case ConversationType.DM: {
            if (secretPayload?.secret) {
              inCaseAlreadyHaveDmSecret(secretPayload?.secret);
            } else {
              await inCaseNoDmSecret(conversation);
            }
            break;
          }
          case ConversationType.GROUP: {
            if (secretPayload?.secret) {
              inCaseAlreadyHaveGroupSecret(secretPayload?.secret);
            } else {
              await inCaseNoGroupSecret(conversation);
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
          navigate(
            `/chat/${params.groupId ? ConversationMenuTab.GROUP : ConversationMenuTab.DIRECT}`
          );
        }
      } finally {
        dispatch(setIsFetchFirebase(false));
        setIsInitialize(false);
      }
    }
  };

  if (isInitialize || !chatScheme) {
    return <FullSpinner />;
  }

  if (isError) {
    if (params) {
      navigate(
        `/chat/${params.groupId ? ConversationMenuTab.GROUP : ConversationMenuTab.DIRECT}`
      );
    } else {
      navigate(`/`);
    }

    return <></>;
  }

  return <>{children}</>;
}
