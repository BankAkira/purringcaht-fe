// import (Internal imports)
import { PropsWithChildren } from 'react';

// react-router-dom
import { useParams } from 'react-router-dom';

// helper functions
import { Logger } from '../../helper/logger.ts';
import { CryptoAES256 } from '../../helper/rsa-crypto.ts';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';

// redux
import { useDispatch, useSelector } from '../../redux';
import {
  initializeMailSchemeAction,
  setConversationMail,
  setMailMessages,
  setMailSecret,
} from '../../redux/purr-mail.ts';

// APIs
import { getConversationMailById } from '../../rest-api/purr-mail.ts';

const log = new Logger('MailEncryptionSchemePortal');

export default function MailEncryptionSchemePortal({
  children,
}: PropsWithChildren) {
  const { user, userScheme } = useSelector(state => state.account);
  const params = useParams();
  const dispatch = useDispatch();

  useDeepEffect(() => {
    if (params.conversationMailId) {
      fetchConversationMail(params.conversationMailId);
    }
  }, [params]);

  const fetchConversationMail = async (conversationId: string) => {
    try {
      const res = await getConversationMailById(conversationId);
      if (res) {
        console.log('res', res);

        dispatch(setConversationMail(res));
        dispatch(setMailMessages(res.mailConversationMessage));

        const checkMemberMail =
          res.encryptedMailSecrets[0]?.peerEncryptedMailSecret.filter(e => {
            return e.userId === user!.id;
          })[0];
        const checkSenderMail =
          res.encryptedMailSecrets[0]?.userId === user!.id;
        if (checkSenderMail) {
          inCaseAlreadyHaveMailSecret(
            res.encryptedMailSecrets[0]?.senderEncryptedMailSecret
          );
        } else if (checkMemberMail) {
          inCaseAlreadyHaveMailSecret(checkMemberMail.peerEncryptedMailSecret);
        }
      }
    } catch (error) {
      log.error(error);
    }
  };

  const inCaseAlreadyHaveMailSecret = async (secret: string) => {
    console.log('userScheme', userScheme);

    const encryptedMailSecret = Buffer.from(secret.slice(2), 'hex');
    console.log('encryptedMailSecret', encryptedMailSecret);
    const mailSecret = userScheme!.decrypt(encryptedMailSecret);
    console.log('mailSecret', mailSecret);
    const mailSecretToHex = mailSecret.toString('hex');
    console.log('mailSecretToHex', mailSecretToHex);
    const mailScheme = new CryptoAES256(mailSecret);
    console.log('mailScheme', mailScheme);
    dispatch(initializeMailSchemeAction({ mailScheme }));
    dispatch(setMailSecret({ mailSecret: mailSecretToHex }));
  };

  return <>{children}</>;
}
