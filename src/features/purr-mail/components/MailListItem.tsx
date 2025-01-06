// import (Internal imports)
import React, { useState } from 'react';

// react-icons
import { FaStar } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import {
  PiPaperclipHorizontal,
  PiTagChevronFill,
  PiWarningOctagonFill,
} from 'react-icons/pi';

import classNames from 'classnames';
import moment from 'moment/moment';
import styled from 'styled-components';

// helper functions
import { Logger } from '../../../helper/logger';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';

import useResponsive from '../../../helper/hook/useResponsive';

// types
import { MailConversation } from '../../../type';

// APIs
import {
  markMailAsRead,
  updateStarredAndImportantStatus,
} from '../../../rest-api/purr-mail';

// icons
import MailVaultIcon from '../../../asset/images/purr-mail/icons/mail-vault.png';
import MailIcon from '../../../asset/images/purr-mail/icons/mail.png';

interface MailListItemProps {
  email: MailConversation;
  index: number;
  checked: boolean;
  handleEmailClick: (mailId: string) => void;
  handleItemCheck: (mailId: string) => void;
  mailStatus: string;
  isYouSender: boolean;
  isStarred: boolean;
  isImportant: boolean;
  updateEmailStatus: (
    emailId: string,
    updatedFields: Partial<MailConversation>
  ) => void;
}

const log = new Logger('MailListItem');

const MailListItem: React.FC<MailListItemProps> = ({
  email,
  index,
  checked,
  handleEmailClick,
  handleItemCheck,
  mailStatus,
  isYouSender,
  isStarred,
  isImportant,
  updateEmailStatus,
}) => {
  const { isTabletOrMobile } = useResponsive();

  const [userRecipients, setUserRecipients] = useState<string>('');

  useDeepEffect(() => {
    mapEmailParticipants();
  }, [email]);

  const mapEmailParticipants = () => {
    const mapUserPatient = email.participant
      .filter((_e, i) => i !== 0)
      .map(e => {
        return e.user.email;
      });
    if (mapUserPatient.length) setUserRecipients(mapUserPatient.join(', '));
  };

  const handleStarredAndImportantStatusClick = async (
    statusKey: 'isStarred' | 'isImportant'
  ) => {
    const shouldSetTrue = !email[statusKey];
    try {
      await updateStarredAndImportantStatus(email.id, {
        [statusKey]: shouldSetTrue,
      });

      updateEmailStatus(email.id, { [statusKey]: shouldSetTrue });
    } catch (error) {
      log.error(`Failed to update ${statusKey} for mail item:`, error);
    }
  };

  const handleMailClick = async (mailId: string) => {
    if (mailId && !email?.isRead) {
      try {
        await markMailAsRead(mailId);
      } catch (error) {
        log.error('Failed to mark mail as read:', error);
      }
    }
    handleEmailClick(mailId);
  };

  return (
    <li
      key={index}
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] mb-2 p-4 ${email?.isRead && '!bg-gray-100'} ${!isTabletOrMobile && 'rounded-lg'} cursor-pointer hover:border hover:shadow-md hover:rounded-lg`}
      onClick={() => handleMailClick(email?.id)}>
      {/* Email Actions */}
      <div className="flex items-center">
        <CustomCheckboxStyle>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={checked}
            onClick={e => e.stopPropagation()}
            onChange={() => handleItemCheck(email?.id)}
          />
        </CustomCheckboxStyle>
      </div>

      {/* Email Info */}
      <div className="flex flex-col justify-between gap-2 mx-4">
        <div className="flex flex-col w-full">
          <div
            className={classNames(
              'text-[#212B36] text-sm text-ellipsis whitespace-nowrap overflow-hidden',
              { 'text-[#919EAB]': email?.isRead }
            )}>
            <div className="inline-flex items-center">
              {mailStatus === 'trash' && (
                <ImBin size={14} className="text-gray-500 mb-1 mr-1" />
              )}
              {isYouSender ? 'To:' : 'From:'}{' '}
              {isYouSender
                ? userRecipients
                : email?.participant[0]?.user?.email}
            </div>
          </div>
          <p
            className={classNames(
              'text-[#212B36] text-sm font-semibold text-ellipsis whitespace-nowrap overflow-hidden',
              { 'text-[#919EAB]': email?.isRead }
            )}>
            Subject: {email?.mailConversationMessage[0]?.subject}
          </p>
        </div>
        {/* Status Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            className={classNames(
              isStarred ? 'text-yellow-400' : 'text-gray-500',
              'hover:text-yellow-500 cursor-pointer'
            )}
            onClick={e => {
              e.stopPropagation();
              handleStarredAndImportantStatusClick('isStarred');
            }}>
            <FaStar size={20} />
          </button>

          <button
            className={classNames(
              isImportant ? 'text-yellow-400' : 'text-gray-500',
              'hover:text-yellow-500 cursor-pointer'
            )}
            onClick={e => {
              e.stopPropagation();
              handleStarredAndImportantStatusClick('isImportant');
            }}>
            <PiTagChevronFill size={20} />
          </button>

          <button
            className="text-gray-500 hover:text-red-400"
            onClick={e => {
              e.stopPropagation();
            }}>
            <PiWarningOctagonFill size={20} />
          </button>
        </div>
      </div>

      {/* Email Time and Tags */}
      <div className="flex flex-col items-end justify-between gap-2">
        <span
          className={classNames(
            'flex items-center gap-3 text-[#212B36] text-xs',
            { 'text-[#919EAB]': email?.mailConversationUserRead?.length }
          )}>
          {!!email?.mailConversationMessage[0]?.files.length && (
            <PiPaperclipHorizontal size={20} />
          )}
          {moment(email?.updatedAt).fromNow()}
        </span>

        <span
          className={`text-white text-xs font-medium px-2 py-1 rounded-full ${
            email.status === 'WAITING'
              ? 'bg-[#FF5630]'
              : email.status === 'COMPLETED'
                ? 'bg-[#00A76F]'
                : email.status === 'DRAFT'
                  ? 'bg-[#FFAB00]'
                  : 'bg-gray-100'
          }`}>
          {email.status.charAt(0) + email.status.slice(1).toLowerCase()}
        </span>
        {email.type === 'VAULT' ? (
          <img width={26} src={MailVaultIcon} alt="mail" />
        ) : (
          <img width={26} src={MailIcon} alt="mail" />
        )}
      </div>
    </li>
  );
};

const CustomCheckboxStyle = styled.div`
  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #637381;
    appearance: none;
    cursor: pointer;
    position: relative;
  }

  input[type='checkbox']:checked {
    background: linear-gradient(130deg, #fd4077 -2.26%, #fe7601 96.97%);
    border-color: transparent;
  }

  input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

export default MailListItem;
