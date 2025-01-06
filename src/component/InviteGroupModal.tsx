import { Button, HelperText, Modal, TextInput } from 'flowbite-react';
import { IoClose, IoCloseOutline } from 'react-icons/io5';
import { useState } from 'react';
import { User } from '../type/auth';
import { useSelector } from '../redux';
import * as yup from 'yup';
import { useDebounceText } from '../helper/hook/useDebounceText';
import useBoolean from '../helper/hook/useBoolean';
import { useFormik } from 'formik';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import { searchUsersApi } from '../rest-api/user';
import { queryParamsToString } from '../helper/query-param';
import { toast } from 'react-toastify';
import { errorFormat } from '../helper/error-format';
import Avatar from './avatar/Avatar';
import { defaultImages } from '../constant/default-images';
import { HiSearch } from 'react-icons/hi';
import ChatSkeleton from './chat-skeleton/ChatSkeleton';
import emptyContactImage from '../asset/images/empty-img/empty-user.svg';
import TabWrapper from './TabWrapper';
import trimAddress from '../helper/trim-address';
import { PiCheckCircleFill } from 'react-icons/pi';
import { ConversationPayload } from '../type/conversation';
import { inviteConversationApi } from '../rest-api/conversation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  conversation: ConversationPayload | null;
};

type InviteGroupForm = {
  userIds: string[];
};

const inviteGroupFormValue: InviteGroupForm = {
  userIds: Array<string>(),
};

const groupFormValidationSchema = yup.object().shape({
  userIds: yup.array().min(1, 'Group members must have at least 1 person.'),
});

export default function InviteGroupModal({
  isOpen,
  onClose,
  conversation,
}: Props) {
  const { user } = useSelector(state => state.account);
  const [textKeyword, setTextKeyword] = useState('');
  const finalText = useDebounceText(textKeyword);
  const [groupMembers, setGroupMembers] = useState(Array<User>());
  const [users, setUsers] = useState(Array<User>());
  const [isSearching, searchingStart, searchingDone] = useBoolean(true);

  const formik = useFormik({
    initialValues: inviteGroupFormValue,
    validationSchema: groupFormValidationSchema,
    onSubmit: values => {
      handleInviteGroup(values);
    },
  });

  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
    handleSubmit,
    isSubmitting,
  } = formik;

  const handleInit = async () => {
    if (isOpen) {
      try {
        searchingStart();
        const params = {
          limit: 10,
          page: 1,
          text: textKeyword,
          type: 'GROUP',
          conversationId: conversation?.id,
        };
        const search = await searchUsersApi(queryParamsToString(params));
        if (search?.results) {
          setUsers(search?.results);
        }
      } catch (error) {
        toast.error(errorFormat(error).message);
      } finally {
        searchingDone();
      }
    }
  };

  useDeepEffect(() => {
    (async () => {
      await handleInit();
    })();
  }, [finalText, isOpen]);

  const onClickContact = (contact: User) => {
    if (!groupMembers.find(member => member.id === contact.id)) {
      const newMembers = [...groupMembers, contact];
      setGroupMembers(newMembers);
      setFieldValue(
        'userIds',
        newMembers.map(member => member.id)
      );
      setFieldTouched('userIds', true);
    }
  };

  const handleInviteGroup = async (values: InviteGroupForm) => {
    try {
      if (conversation && conversation?.id) {
        const invite = await inviteConversationApi(
          conversation?.id,
          values.userIds
        );
        if (!invite) {
          throw new Error('Request is error');
        } else {
          toast.success('Invite successfully');
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      handleClose();
    }
  };

  const handleCancelMember = (contact: User) => {
    const members = [...groupMembers];
    const newMembers = members.filter(member => member.id !== contact.id);
    setGroupMembers(newMembers);
    setFieldValue(
      'userIds',
      newMembers.map(member => member.id)
    );
  };

  const handleClose = () => {
    setGroupMembers([]);
    resetForm();
    onClose();
  };

  const filteredUser = groupMembers.filter(member => member.id !== user?.id);

  return (
    <Modal show={isOpen} size={'2xl'} onClose={handleClose}>
      <Modal.Header>
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-gray-900 text-lg font-semibold">
            Choose friends
          </div>
          <IoClose
            className="-mt-[1px] text-gray-500 cursor-pointer hover:text-gray-400 transition"
            onClick={handleClose}
          />
        </div>
      </Modal.Header>
      <Modal.Body className="h-full">
        <div className="flex flex-col gap-3">
          {!!filteredUser.length && (
            <div className="flex gap-2 h-[60px] items-center my-0 overflow-x-auto">
              {[...filteredUser].map(member => (
                <div
                  key={member.id}
                  className="relative flex flex-col items-center cursor-pointer ">
                  <Avatar img={member.picture || defaultImages.noProfile} />
                  <span className="w-[50px] text-xs truncate text-center text-[10px] mt-0.5 text-gray-700">
                    {member?.userNickname || member.displayName}
                  </span>
                  <div className="items-center flex justify-center absolute h-[14px] w-[14px] right-[1px] top-[1px] z-1">
                    <span
                      className="cursor-pointer p-0.25 bg-white border border-gray-200 hover:border-red-300 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-700"
                      onClick={() => handleCancelMember(member)}>
                      <IoCloseOutline />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {touched?.userIds &&
            !!errors?.userIds &&
            values.userIds.length < 1 && (
              <HelperText color="failure">{errors.userIds}</HelperText>
            )}
          <div className="h-[50px] mt-3">
            <TextInput
              icon={HiSearch}
              id="search"
              name="search"
              type="search"
              placeholder="Search"
              onChange={e => setTextKeyword(e.target.value)}
              value={textKeyword}
            />
          </div>
          <p className="mt-2 mb-3 text-gray-500">Suggestions (Random)</p>
          <div
            className="overflow-y-auto h-full max-h-[45vh]"
            id="content-container">
            {isSearching ? (
              <SkeletonLoader />
            ) : (
              <>
                {!users.length && (
                  <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400">
                    <img src={emptyContactImage} width={62} alt="empty chat" />
                    <div className="px-4 text-center">
                      <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                        No Contacts
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-start">
                  {[...users].map((result, i) => (
                    <TabWrapper
                      key={result.id + i}
                      onClick={() => onClickContact(result)}
                      size="sm">
                      <div className="flex items-center justify-between w-full">
                        <Avatar
                          img={result.picture || defaultImages.noProfile}
                          name={
                            result?.userNickname
                              ? result?.userNickname
                              : result.displayName ||
                                trimAddress(result.walletAddress)
                          }
                        />
                        {values.userIds.some(item => item === result.id) && (
                          <PiCheckCircleFill className="text-xl -mt-1 text-orange-500" />
                        )}
                      </div>
                    </TabWrapper>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal.Body>

      <div className="flex gap-4 p-4 border-t-2">
        <Button
          color="gray"
          onClick={() => handleClose()}
          fullSized
          pill
          disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400"
          onClick={() => handleSubmit()}
          fullSized
          pill
          disabled={isSubmitting}
          isProcessing={isSubmitting}>
          Invite
        </Button>
      </div>
    </Modal>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-1 ">
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
    </div>
  );
}
