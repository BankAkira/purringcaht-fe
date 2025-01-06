import { useState } from 'react';
import { useDispatch, useSelector } from '../../../redux';
import { useDebounceText } from '../../../helper/hook/useDebounceText';
import { useNavigate } from 'react-router-dom';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { Button, HelperText, Label, Modal, Spinner } from 'flowbite-react';
import TabWrapper from '../../../component/TabWrapper';
import Avatar from '../../../component/avatar/Avatar';
import { defaultImages } from '../../../constant/default-images';
import trimAddress from '../../../helper/trim-address';
import ChatSkeleton from '../../../component/chat-skeleton/ChatSkeleton';
import { HiSearch } from 'react-icons/hi';
import TextInput from '../../../component/text-input/TextInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { RiEdit2Line } from 'react-icons/ri';
import { IoCloseOutline } from 'react-icons/io5';
import {
  ConversationType,
  CreateConversationBody,
} from '../../../type/conversation';
import { createConversationRequestApi } from '../../../rest-api/conversation';
import { loadResultsAction as loadGroupsAction } from '../../../redux/conversation';
import useBoolean from '../../../helper/hook/useBoolean';
import { searchUsersApi } from '../../../rest-api/user';
import { queryParamsToString } from '../../../helper/query-param';
import { User } from '../../../type/auth';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../helper/error-format';
import Dropzone from 'react-dropzone';
import { uploadFile } from '../../../helper/upload-file';
import emptyContactImage from '../../../asset/images/empty-img/empty-user.svg';
import { FaCirclePlus } from 'react-icons/fa6';
import { PiCheckCircleFill } from 'react-icons/pi';
import { FaTimesCircle } from 'react-icons/fa';
import { toggleMobileControlSidebar } from '../../../redux/convesation-layout';
import useResponsive from '../../../helper/hook/useResponsive';

type Props = {
  open: boolean;
  onClose: () => void;
};

type CreateGroupForm = {
  profilePicture: File | null;
  name: string;
  description: string;
  userIds: string[];
};

const createGroupFormValue: CreateGroupForm = {
  profilePicture: null,
  name: '',
  description: '',
  userIds: Array<string>(),
};

const groupFormValidationSchema = yup.object().shape({
  profilePicture: yup
    .mixed<File>()
    .nullable()
    .test('fileSize', 'The file is too large', value => {
      return !value || value.size <= 2000000;
    })
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .jpg, .gif',
      value => {
        return (
          !value ||
          value.type === 'image/jpeg' ||
          value.type === 'image/gif' ||
          value.type === 'image/png'
        );
      }
    ),
  name: yup
    .string()
    .required('Name is required')
    .min(4, 'Group name must be at least 4 characters.')
    .max(50, 'Group names must not be longer than 50 characters.'),
  description: yup.string(),
  userIds: yup.array().min(1, 'Group members must have at least 1 person.'),
});

export default function CreateGroupModal({ open, onClose }: Props) {
  const { user } = useSelector(state => state.account);
  const dispatch = useDispatch();
  const [textKeyword, setTextKeyword] = useState('');
  const finalText = useDebounceText(textKeyword);
  const navigate = useNavigate();
  const [groupMembers, setGroupMembers] = useState(Array<User>());
  const [users, setUsers] = useState(Array<User>());
  const [isSearching, searchingStart, searchingDone] = useBoolean(true);
  const { isTabletOrMobile } = useResponsive();

  const formik = useFormik({
    initialValues: createGroupFormValue,
    validationSchema: groupFormValidationSchema,
    onSubmit: values => {
      handleCreateGroup(values);
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    resetForm,
    handleSubmit,
    isSubmitting,
  } = formik;

  useDeepEffect(() => {
    (async () => {
      if (open) {
        try {
          searchingStart();
          const params = {
            limit: 10,
            page: 1,
            text: textKeyword,
            type: 'GROUP',
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
    })();
  }, [finalText, open]);

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
    resetForm();
    onClose();
  };

  const handleCreateGroup = async (values: CreateGroupForm) => {
    let profilePicture = defaultImages.noProfile;
    if (values.profilePicture) {
      profilePicture = await uploadFile(values.profilePicture);
    }

    const body: CreateConversationBody = {
      ...values,
      profilePicture,
      type: ConversationType.GROUP,
    };
    const created = await createConversationRequestApi(body);
    if (!created?.id) {
      throw new Error('Request is error');
    }
    handleClose();
    dispatch(
      loadGroupsAction({
        page: 1,
        limit: 30,
        text: '',
        type: ConversationType.GROUP,
      })
    );
    navigate(`/chat/group/${created.id}`);
    isTabletOrMobile && dispatch(toggleMobileControlSidebar());
  };

  const filteredUser = groupMembers.filter(member => member.id !== user?.id);

  return (
    <Modal dismissible show={open} onClose={handleClose} size={'xl'}>
      <Modal.Header>
        <div className="text-lg font-bold text-gray-900 max-md:text-base">
          Create new group
        </div>
      </Modal.Header>
      <Modal.Body className="!p-3">
        <div className="flex flex-col w-full gap-0 my-2">
          <div
            className={
              (touched?.profilePicture && errors?.profilePicture
                ? 'mb-8'
                : 'mb-5') +
              ' relative flex flex-col items-center justify-center'
            }>
            <Dropzone
              accept={{
                'image/gif': [],
                'image/avif': [],
                'image/apng': [],
                'image/jpeg': [],
                'image/png': [],
                'image/webp': [],
              }}
              maxFiles={1}
              onDrop={files => {
                setFieldValue('profilePicture', files[0]);
              }}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className="cursor-pointer"
                  {...getRootProps({ multiple: false })}>
                  <div
                    className={
                      (touched?.profilePicture && errors?.profilePicture
                        ? 'border-2 border-red-600 -mt-2 sm:mt-0'
                        : ' mt-2') +
                      ' relative items-start self-stretch flex grow flex-col rounded-full'
                    }>
                    <input
                      id="upload-zone"
                      {...getInputProps({ multiple: false })}
                      multiple={false}
                    />
                    <Avatar
                      img={
                        values.profilePicture
                          ? URL.createObjectURL(values.profilePicture)
                          : defaultImages.noProfile
                      }
                      onClick={() => {}}
                      size="lg"
                    />
                    <FaCirclePlus className="absolute bottom-0.5 right-0.5 text-xl rounded-full text-orange-500 bg-white border border-white" />
                  </div>
                </div>
              )}
            </Dropzone>
            {touched?.profilePicture && errors?.profilePicture && (
              <Label className="absolute w-full min-w-[240px] text-xs text-center -bottom-[34px] sm:-bottom-5 text-[#e02424]">
                <span className="flex items-center justify-center gap-1.5">
                  <FaTimesCircle className="text-[14px] -mt-[2.5px] hidden sm:block" />{' '}
                  {errors?.profilePicture}
                </span>{' '}
              </Label>
            )}
          </div>
          <div className="mb-3 mt-3 sm:mt-0 input-custom-no-border">
            <TextInput
              icon={RiEdit2Line}
              placeholder="Group Name ..."
              value={values.name}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              color={touched?.name && !!errors?.name ? 'failure' : ''}
              helperText={touched?.name && errors?.name}
            />
          </div>
          <div className="mb-3 input-custom-no-border">
            <TextInput
              icon={RiEdit2Line}
              placeholder="Group Description ..."
              value={values.description}
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              color={
                touched?.description && !!errors?.description ? 'failure' : ''
              }
              helperText={touched?.description && errors?.description}
            />
          </div>
        </div>
        {!!filteredUser.length && (
          <div className="flex gap-2 h-[60px] items-center my-0 overflow-x-auto">
            {[...filteredUser].map(member => (
              <div
                key={member.id}
                className="relative flex flex-col items-center cursor-pointer ">
                <Avatar img={member.picture || defaultImages.noProfile} />
                <small className="w-[50px] truncate text-center text-[10px] mt-0.5 text-gray-700">
                  {member.displayName}
                </small>
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
        {touched?.userIds && !!errors?.userIds && values.userIds.length < 1 && (
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
        <div className="overflow-y-auto h-[32vh]" id="content-container">
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
                          result.displayName ||
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
          disabled={isSubmitting}>
          <div className="h-full w-full max-h-[20px] flex justify-center items-center">
            {isSubmitting ? <Spinner /> : 'Create Group'}
          </div>
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
