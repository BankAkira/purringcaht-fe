import React, { ChangeEvent, useState } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { ethers } from 'ethers';

// Third-party components
import { FileInput, Label, Spinner } from 'flowbite-react';

// Internal components
import QuillEditor from '../../../component/@share/QuillEditor';

// Helpers and hooks
import { useDispatch, useSelector } from '../../../redux';
import { getFileOptional, getPdfPageCount } from '../../../helper/file';
import { encryptMessage, fileToBase64 } from '../../../helper/crypto';
import { Logger } from '../../../helper/logger';
import {
  CryptoAES256,
  CryptoECIES,
  generateSecret,
} from '../../../helper/rsa-crypto';
import { useDebounceText } from '../../../helper/hook/useDebounceText';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import {
  createMailConversation,
  searchEmail,
} from '../../../rest-api/purr-mail.ts';

// Types and interfaces
import { FormCreateCompose, ParticipantMail } from '../../../type';
import {
  MessageContentType,
  SelectedFileDispute,
  EncryptedUserSecretPayload,
  User,
} from '../../../type';

// Icons
import { BiExpandAlt } from 'react-icons/bi';
import { BsPaperclip } from 'react-icons/bs';
import { CgArrowsExpandDownRight } from 'react-icons/cg';
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDropupCircle,
  IoMdSend,
} from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { LuImagePlus } from 'react-icons/lu';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MailVaultIcon from '../../../asset/images/purr-mail/icons/mail-vault.png';
import MailIcon from '../../../asset/images/purr-mail/icons/mail.png';

import useResponsive from '../../../helper/hook/useResponsive';
import { showAlert } from '../../../redux/home';
import { setIsOpenMobileControlSidebar } from '../../../redux/convesation-layout';
import { toast } from 'react-toastify';

// Logger instance
const log = new Logger('ComposeEmailModal');

interface ComposeEmailModalProps {
  messageType: 'Mail' | 'MailVault';
  onClose: () => void;
}

interface EmailOption {
  value: User;
  label: string;
}

interface PeerEncryptedUserSecretPayload {
  peerSecret: EncryptedUserSecretPayload[];
  mailSecret: Buffer;
}

const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  messageType,
  onClose,
}) => {
  const { isTabletOrMobile } = useResponsive();
  const dispatch = useDispatch();

  const { user, userScheme } = useSelector(state => state.account);
  const [textKeyword, setTextKeyword] = useState('');
  const [filesMail, setFilesMail] = useState<SelectedFileDispute[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [isMailConditionVisible, setIsMailConditionVisible] = useState(true);
  const [emailOptions, setEmailOptions] = useState<EmailOption[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<MultiValue<EmailOption>>(
    []
  );
  const [subject, setSubject] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [reminderFrequency, setReminderFrequency] = useState<number>(1);
  const [activationTime, setActivationTime] = useState<number>(7);
  const [reminderUnit, setReminderUnit] = useState<string>('Day');
  const [activationUnit, setActivationUnit] = useState<string>('Day');
  const [checkFileSizeOver, setCheckFileSizeOver] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const finalText = useDebounceText(textKeyword);

  useDeepEffect(() => {
    if (finalText) fetchSearchEmail(finalText);
    if (isTabletOrMobile) dispatch(setIsOpenMobileControlSidebar(false));

    return () => {
      if (isTabletOrMobile) dispatch(setIsOpenMobileControlSidebar(true));
    };
  }, [finalText]);

  useDeepEffect(() => {
    const checkFileSize = filesMail.reduce((acc, file) => {
      return acc || (file.optional?.fileSize || 0) > 25 * 1024 * 1024;
    }, false);
    setCheckFileSizeOver(checkFileSize);
  }, [filesMail]);

  const calculateDays = (value: number, unit: string): number => {
    switch (unit) {
      case 'Day':
        return value;
      case 'Week':
        return value * 7;
      case 'Month':
        return value * 30;
      default:
        return value;
    }
  };

  const totalReminderDays = calculateDays(reminderFrequency, reminderUnit);
  const totalActivationDays = calculateDays(activationTime, activationUnit);

  const handleEmailChange = (
    selectedOptions?: MultiValue<EmailOption>,
    actionMeta?: ActionMeta<EmailOption>
  ) => {
    if (!selectedOptions || actionMeta?.action === 'clear') {
      setSelectedEmails([]);
      return;
    }

    if (actionMeta?.action === 'remove-value') {
      const updatedSelections = selectedEmails.filter(selected =>
        selectedOptions.some(option => option.label === selected.label)
      );
      setSelectedEmails(updatedSelections);
    } else {
      const uniqueSelections = selectedOptions.filter(
        option =>
          !selectedEmails.some(selected => selected.label === option.label)
      );
      setSelectedEmails(prev => [...prev, ...uniqueSelections]);
    }
  };

  const handleGenerateMailSecret = async () => {
    const mailSecret = generateSecret();
    const mailSecretEncryptedSender = userScheme!.encrypt(mailSecret);
    const senderEncryptedChatSecret = ethers.utils.hexlify(
      mailSecretEncryptedSender
    );
    const mailScheme = new CryptoAES256(mailSecret);

    const encryptedContent = await encryptMessage(
      editorContent,
      MessageContentType.TEXT,
      mailScheme
    );
    const mailSecretEncryptedForPeers = await Promise.all(
      selectedEmails.map((item: EmailOption) => {
        if (!item?.value?.encryptedUserSecrets) return;
        return createSecretKeyForRecipient({
          peerSecret: item.value.encryptedUserSecrets,
          mailSecret,
        });
      })
    );

    const encryptedContentFiles = await Promise.all(
      filesMail.map(
        async file =>
          await encryptMessage(file.base64, MessageContentType.TEXT, mailScheme)
      )
    );

    return {
      senderEncryptedChatSecret,
      peerSecrets: mailSecretEncryptedForPeers,
      senderSecret: mailSecretEncryptedSender,
      content: encryptedContent,
      contentFile: encryptedContentFiles,
    };
  };

  const createSecretKeyForRecipient = async ({
    peerSecret,
    mailSecret,
  }: PeerEncryptedUserSecretPayload) => {
    if (peerSecret.length > 0) {
      const peerPublicKey = Buffer.from(
        (peerSecret[0].publicKeyPrefix ? '02' : '03') +
          peerSecret[0].publicKeyX.slice(2),
        'hex'
      );
      const mailSecretEncryptedForPeer = CryptoECIES.encrypt(
        peerPublicKey.toString('hex'),
        mailSecret
      );
      return {
        userId: peerSecret[0].userId,
        peerEncryptedMailSecret: ethers.utils.hexlify(
          mailSecretEncryptedForPeer
        ),
      };
    }
    return null;
  };

  const fetchSearchEmail = async (text: string) => {
    if (!text) return;
    try {
      const res = await searchEmail({ text });
      if (res && res.results) {
        const option: EmailOption[] = res.results
          .filter(
            (result: User) => result.email !== user?.email && result?.email
          )
          .filter((result: User) => result.email !== user?.email)
          .map((result: User) => ({
            value: result,
            label: `${result?.email ? result.displayName + ' <' + result?.email + '>' : result.displayName}`,
          }));
        setEmailOptions(option);
      }
    } catch (error) {
      log.error('Error fetching email:', error);
    }
  };

  const toggleMailCondition = () => setIsMailConditionVisible(prev => !prev);
  const toggleExpand = () => setIsExpanded(prev => !prev);

  const handleSend = async () => {
    if (checkFileSizeOver) {
      dispatch(
        showAlert({
          message: 'File size is too large. Max file size allowed is 25MB',
        })
      );
      return;
    }

    if (
      messageType === 'MailVault' &&
      (activationTime < 7 ||
        activationTime > 365 ||
        reminderFrequency < 1 ||
        reminderFrequency > 30)
    ) {
      dispatch(
        showAlert({
          message:
            'MailVault Activation Time must be between 7 and 365 days, and Reminder Frequency must be between 1 and 30 days.',
          time: 3000,
        })
      );
      return;
    }

    setIsSending(true);
    const { peerSecrets, content, contentFile, senderEncryptedChatSecret } =
      await handleGenerateMailSecret();
    console.log({
      peerSecrets,
      content,
      contentFile,
      senderEncryptedChatSecret,
    });

    const formData: FormCreateCompose = {
      verifyReminderDays: totalReminderDays,
      sendAfterDays: totalActivationDays,
      type: messageType === 'MailVault' ? 'VAULT' : 'MAIL',
      status: messageType === 'MailVault' ? 'WAITING' : 'COMPLETED',
      email: selectedEmails.map(e => e.value.email).join(','),
      memo,
      subject,
      content,
      files: filesMail.map((f, i) => ({
        base64: contentFile[i],
        optional: f.optional,
      })),
      senderEncryptedMailSecret: senderEncryptedChatSecret,
      peerEncryptedMailSecret:
        peerSecrets?.filter(
          (peer): peer is ParticipantMail => peer !== null && peer !== undefined
        ) || [],
    };
    if (!formData.email) return;

    if (messageType === 'Mail') {
      delete formData.sendAfterDays;
      delete formData.verifyReminderDays;
    }
    console.log('formData', formData);

    setTimeout(async () => {
      try {
        const res = await createMailConversation(formData);
        if (res) {
          toast.success('Mail send successfully');
        }
      } catch (error) {
        log.error('error', error);
        toast.error(`Something's wrong, try again later`);
      } finally {
        setIsSending(false);
        onClose();
      }
    }, 1000);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      const filesArray = Array.from(files);
      const filesMap = filesArray.map(async (item: File) => {
        const count = await getPdfPageCount(item);
        const fileInfo: SelectedFileDispute = {
          base64: (await fileToBase64(item)).toString(),
          optional: { ...getFileOptional(item), pageCount: count },
        };
        return fileInfo;
      });
      const resolvedFiles = await Promise.all(filesMap);
      setFilesMail(prevFiles => [...prevFiles, ...resolvedFiles]);
    }
  };

  const handleRemoveFile = (index: number) =>
    setFilesMail(prevFiles => prevFiles.filter((_, i) => i !== index));

  return (
    <div
      className={`fixed z-50 ${isExpanded || isTabletOrMobile ? 'inset-0' : 'bottom-4 right-4'} flex items-center justify-center`}>
      <div
        className={`flex flex-col ${isExpanded || isTabletOrMobile ? 'w-full h-full max-w-none max-h-none' : 'w-[700px] h-auto'} p-4 bg-white rounded-lg shadow-2xl relative overflow-y-auto`}
        style={{
          maxHeight: isTabletOrMobile ? '98vh' : '90vh',
          maxWidth: isTabletOrMobile ? '100vw' : '85vw',
        }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold flex items-center gap-1">
            New Message :{' '}
            {messageType === 'MailVault' ? (
              <img width={24} src={MailVaultIcon} alt="MailVault" />
            ) : (
              <img width={24} src={MailIcon} alt="Mail" />
            )}
            {messageType}{' '}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={toggleExpand}
              className="text-gray-500 hover:text-gray-600">
              {isExpanded ? <CgArrowsExpandDownRight /> : <BiExpandAlt />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-600">
              <IoCloseSharp size={20} />
            </button>
          </div>
        </div>

        {/* Email Fields */}
        <div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <label className="text-gray-700 font-semibold mr-2 min-w-[60px]">
              From :
            </label>
            <div className="flex-1 px-3 py-2">{user?.email}</div>
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <label className="text-gray-700 font-semibold mr-2 min-w-[60px]">
              To :
            </label>
            <Select
              isMulti
              options={emailOptions}
              value={selectedEmails}
              placeholder="Enter email addresses"
              onChange={handleEmailChange}
              onInputChange={(inputValue, action) => {
                if (action.action === 'input-change')
                  setTextKeyword(inputValue);
              }}
              className="flex-1 basic-multi-select input-bg-transparent"
              classNamePrefix="select"
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              styles={{
                control: provided => ({
                  ...provided,
                  border: 'none',
                  boxShadow: 'none',
                  '&:hover': { border: 'none' },
                  backgroundColor: 'transparent',
                }),
              }}
            />
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <label className="text-gray-700 font-semibold mr-2 min-w-[60px]">
              Subject :
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter to Subject"
              className="flex-1 px-3 py-2 focus:outline-none border-none"
            />
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <label className="text-gray-700 font-semibold mr-2 min-w-[60px]">
              Memo :
            </label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="Memo ..."
              className="flex-1 ml-1 px-3 py-2 focus:outline-none border-none"
            />
          </div>

          {/* Mail Condition Toggle */}
          {messageType === 'MailVault' && (
            <div className="bg-orange-100 rounded-md ">
              <button
                onClick={toggleMailCondition}
                className="flex items-center justify-between w-full px-3 py-2 mb-2 text-white bg-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="font-semibold">
                  Configuring MailVault Triggers and Reminders
                </span>
                <span>
                  {isMailConditionVisible ? (
                    <IoMdArrowDropupCircle size={26} />
                  ) : (
                    <IoMdArrowDropdownCircle size={26} />
                  )}
                </span>
              </button>

              {/* Mail Condition Section */}
              {isMailConditionVisible && (
                <div className="p-4 mb-4 border rounded-md">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800">
                      Reminder Frequency
                    </h4>
                    <p className="mb-2 text-sm text-gray-600">
                      How often would you like to receive reminder messages from
                      Purring Chat?
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={reminderFrequency > 0 ? reminderFrequency : ''}
                        onChange={e => {
                          const value = e.target.value;
                          const numberValue = Number(value);

                          if (!isNaN(numberValue)) {
                            setReminderFrequency(numberValue);
                          }
                        }}
                        placeholder="Enter the number"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={reminderUnit}
                        onChange={e => setReminderUnit(e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Day</option>
                        {/* <option>Week</option>
                        <option>Month</option> */}
                      </select>
                    </div>
                    <p className="text-sm text-gray-700">
                      Total Reminder Days:{' '}
                      <span className="font-semibold">
                        {' '}
                        {totalReminderDays} Day(s)
                      </span>
                    </p>
                  </div>

                  {/* MailVault Activation Time Section */}
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      MailVault Activation Time
                    </h4>
                    <p className="mb-2 text-sm text-gray-600">
                      If no response is received to the reminder, after how long
                      should the MailVault be automatically sent to the
                      designated recipient?
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={7}
                        max={365}
                        value={activationTime > 0 ? activationTime : ''}
                        onChange={e => {
                          const value = e.target.value;
                          const numberValue = Number(value);

                          if (!isNaN(numberValue)) {
                            setActivationTime(numberValue);
                          }
                        }}
                        placeholder="Enter the number"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        aria-readonly
                        value={activationUnit}
                        onChange={e => setActivationUnit(e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Day</option>
                        {/* <option>Week</option>
                        <option>Month</option> */}
                      </select>
                    </div>
                    <p className="text-sm text-gray-700">
                      Total Activation Days:
                      <span className="font-semibold">
                        {' '}
                        {totalActivationDays} Day(s)
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Quill Editor */}
        <QuillEditor value={editorContent} onChange={setEditorContent} />

        {/* List of Attachments */}
        <div
          className={`${filesMail?.length > 2 && isExpanded ? 'h-60' : filesMail?.length > 2 ? 'h-40' : ''} overflow-auto mt-4`}>
          <ul>
            {filesMail.map((file, index) => (
              <li
                key={index}
                className="flex justify-between w-fit items-center bg-gray-100 p-2 mb-2 rounded">
                <span className="text-blue-600 font-medium">
                  {file.optional.fileName}
                </span>
                <span className="text-sm ml-3 text-gray-600">
                  ({((file?.optional?.fileSize || 0) / 1024).toFixed(1)}K)
                </span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="ml-2 text-gray-500 hover:text-red-500">
                  <RiDeleteBin6Line size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        {checkFileSizeOver && (
          <small className="text-red-500"> File size limit: 25MB </small>
        )}
        <div
          className={`flex items-center justify-between ${isExpanded ? 'mt-9' : 'mt-3'}`}>
          <div className="flex space-x-4 px-4">
            <Label className="flex h-38 w-full cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <LuImagePlus size={26} />
              <FileInput
                multiple
                accept="image/*,video/mp4,video/quicktime,video/webm,video/ogg"
                id="mail-image"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
            <Label className="flex h-38 w-full cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <BsPaperclip size={26} />
              <FileInput
                multiple
                accept="application/pdf,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/zip"
                id="mail-file"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>

          <button
            disabled={checkFileSizeOver || selectedEmails.length === 0}
            onClick={handleSend}
            className={`flex items-center px-4 py-2 text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${checkFileSizeOver ? 'opacity-50' : ''}`}>
            {isSending ? <Spinner size="sm" /> : 'Send'}
            <IoMdSend size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmailModal;
