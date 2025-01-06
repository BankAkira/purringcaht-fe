import {
  Button,
  Dropdown,
  Label,
  Modal,
  TextInput,
  Tooltip,
} from 'flowbite-react';
import { IoClose } from 'react-icons/io5';
import {
  ConversationPayload,
  ConversationRole,
  Participant,
} from '../type/conversation';
import { FaCirclePlus, FaCrown, FaPlus, FaRegUser } from 'react-icons/fa6';
import Avatar from './avatar/Avatar';
import { LiaUserEditSolid } from 'react-icons/lia';
import { IoMdMore } from 'react-icons/io';
import { PiArrowsClockwise } from 'react-icons/pi';
import { LuUserX } from 'react-icons/lu';
import {
  removeMemberConversationApi,
  updateConversationApi,
  updateRoleMemberConversationApi,
} from '../rest-api/conversation';
import { toast } from 'react-toastify';
import { errorFormat } from '../helper/error-format';
import useBoolean from '../helper/hook/useBoolean';
import { useEffect, useState } from 'react';
import ConfirmModal from './@share/ConfirmModal';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { defaultImages } from '../constant/default-images';
import { uploadFile } from '../helper/upload-file';
import { RiEdit2Line } from 'react-icons/ri';
import { UpdateConversationPayload } from '../type/message';
import { urlToFile } from '../helper/format';
import { HiSearch } from 'react-icons/hi';
import { useDebounceText } from '../helper/hook/useDebounceText';
import emptyUser from '../asset/images/empty-img/empty-user.svg';
import { useSelector } from '../redux';
import { FaTimesCircle } from 'react-icons/fa';

type EditGroupForm = {
  profilePicture: File | null;
  name: string;
  description: string;
};

const editGroupFormValue: EditGroupForm = {
  profilePicture: null,
  name: '',
  description: '',
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
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onReload: () => void;
  onInvite: () => void;
  conversation: ConversationPayload | null;
};

export default function GroupModal({
  isOpen,
  onClose,
  onReload,
  onInvite,
  conversation,
}: Props) {
  const [
    isOpenConfirmRemoveModal,
    openConfirmRemoveModal,
    closeConfirmRemoveModal,
  ] = useBoolean(false);
  const [
    isOpenConfirmPromoteModal,
    openConfirmPromoteModal,
    closeConfirmPromoteModal,
  ] = useBoolean(false);
  const [selectedProfile, setSelectedProfile] = useState<Participant | null>(
    null
  );
  const [defaultForMik, setDefaultForMik] = useState<EditGroupForm | null>(
    null
  );
  const [textKeyword, setTextKeyword] = useState('');
  const finalText = useDebounceText(textKeyword);
  const [participant, setParticipant] = useState(Array<Participant>());
  const { user } = useSelector(state => state.account);

  const formik = useFormik({
    initialValues: editGroupFormValue,
    validationSchema: groupFormValidationSchema,
    onSubmit: values => {
      handleEditGroup(values);
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldValue,
    handleBlur,
    resetForm,
    handleSubmit,
    isSubmitting,
  } = formik;

  const roleIcon = (role: 'MEMBER' | 'ADMIN' | 'MANAGER') => {
    switch (role) {
      case 'MEMBER':
        return (
          <Tooltip placement="left" content="Member">
            <FaRegUser className="text-gray-400" />
          </Tooltip>
        );
      case 'MANAGER':
        return (
          <Tooltip placement="left" content="Admin">
            <LiaUserEditSolid className="text-gray-400 scale-[1.3] -me-0.5 -mb-0.5" />
          </Tooltip>
        );
      case 'ADMIN':
        return (
          <Tooltip placement="left" content="Owner">
            <FaCrown className="text-yellow-300" />
          </Tooltip>
        );
      default:
        return (
          <Tooltip placement="left" content="Member">
            <FaRegUser className="text-gray-400" />
          </Tooltip>
        );
    }
  };

  const handleRemoveMemberGroup = async (value: Participant) => {
    try {
      if (conversation && conversation?.id) {
        const resp = await removeMemberConversationApi(conversation?.id, [
          value.userId,
        ]);
        if (!resp) {
          throw new Error('Request is error');
        } else {
          toast.success(`Remove ${value?.user?.displayName} successfully`);
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      onReload();
    }
  };
  const handlePromoteMemberGroup = async (
    value: Participant,
    role: 'ADMIN' | 'MEMBER' | 'MANAGER'
  ) => {
    try {
      if (conversation && conversation?.id) {
        const resp = await updateRoleMemberConversationApi(
          conversation?.id,
          value.userId,
          role
        );
        if (!resp) {
          throw new Error('Request is error');
        } else {
          toast.success(`Promote ${value?.user?.displayName} successfully`);
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      onReload();
      onClose();
    }
  };

  const handleEditGroup = async (values: EditGroupForm) => {
    try {
      let profilePicture = defaultImages.noProfile;
      if (values.profilePicture) {
        profilePicture = await uploadFile(values.profilePicture);
      }

      const body: UpdateConversationPayload = {
        ...values,
        profilePicture,
      };

      if (conversation && conversation?.id) {
        const created = await updateConversationApi(conversation?.id, body);
        if (!created?.id) {
          throw new Error('Request is error');
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      handleClose();
      onReload();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    setParticipant(
      conversation?.participants.filter(
        item =>
          item.user.displayName.includes(finalText) ||
          item.user.displayId.includes(finalText)
      ) || []
    );
  }, [finalText, conversation]);

  useEffect(() => {
    (async () => {
      if (conversation) {
        let url = null;
        if (conversation?.profilePicture) {
          url = await urlToFile(conversation.profilePicture);
        }
        const editValue: EditGroupForm = {
          profilePicture: url ? url : null,
          name: conversation.name,
          description: conversation.description,
        };
        setDefaultForMik(editValue);
        formik.setValues(editValue);
      }
    })();
  }, [conversation, isOpen]);

  const isEditing =
    defaultForMik?.description !== values.description ||
    defaultForMik?.name !== values.name ||
    defaultForMik?.profilePicture !== values.profilePicture;

  return (
    <>
      <Modal
        show={isOpen}
        size={'2xl'}
        onClose={handleClose}
        style={{ overflow: 'hidden' }}>
        <Modal.Header>
          <div className="flex flex-wrap items-center justify-between">
            <div className="text-gray-900 text-lg font-semibold">
              {participant.find(item => item.userId === user?.id)?.role !==
              ConversationRole.MEMBER
                ? 'Edit group'
                : 'All member'}
            </div>
            <IoClose
              className="-mt-[1px] text-gray-500 cursor-pointer hover:text-gray-400 transition"
              onClick={handleClose}
            />
          </div>
        </Modal.Header>
        <Modal.Body className="!min-h-[70vh] !p-0 !overflow-hidden !rounded-lg">
          <div className="p-5 flex-1 overflow-y-auto max-h-[70vh] max-sm:px-3 max-sm:py-4 !min-h-[70vh] !px-0">
            {participant.find(item => item.userId === user?.id)?.role !==
              ConversationRole.MEMBER && (
              <>
                <div className="flex flex-col w-full gap-0 my-2 px-4">
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
                        touched?.description && !!errors?.description
                          ? 'failure'
                          : ''
                      }
                      helperText={touched?.description && errors?.description}
                    />
                  </div>
                </div>
                <div className="flex gap-4 px-4 pt-2 pb-6 border-b-2">
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
                    disabled={isSubmitting || !isEditing}
                    isProcessing={isSubmitting}>
                    Save
                  </Button>
                </div>
              </>
            )}
            <div
              className={
                (participant.find(item => item.userId === user?.id)?.role !==
                ConversationRole.MEMBER
                  ? 'mt-6'
                  : 'mt-0') + ' flex flex-col gap-3 px-4'
              }>
              {participant.find(item => item.userId === user?.id)?.role !==
                ConversationRole.MEMBER && <span>All member</span>}

              <div className="h-[50px]">
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

              {participant.find(item => item.userId === user?.id)?.role ===
                ConversationRole.ADMIN && (
                <div className="flex gap-2 items-center justify-between">
                  <span className="text-gray-500">Member</span>
                  <span
                    className="flex gap-2 text-orange-500 items-center cursor-pointer"
                    onClick={onInvite}>
                    <FaPlus className="-mt-0.5" /> Invite
                  </span>
                </div>
              )}

              {!!participant && !!participant?.length ? (
                <div className="flex flex-col gap-5 my-3">
                  {participant.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between">
                      <Avatar
                        img={item?.user?.picture}
                        name={item?.userNickname || item?.user?.displayName}
                      />
                      <div className="flex gap-2 items-center">
                        <div
                          className={
                            !(
                              (participant.find(
                                item => item.userId === user?.id
                              )?.role === ConversationRole.MANAGER ||
                                participant.find(
                                  item => item.userId === user?.id
                                )?.role === ConversationRole.ADMIN) &&
                              item.userId !== user?.id &&
                              item.role !== ConversationRole.ADMIN
                            )
                              ? participant.find(
                                  item => item.userId === user?.id
                                )?.role === ConversationRole.MEMBER
                                ? 'me-4'
                                : 'me-[40px]'
                              : ''
                          }>
                          {roleIcon(item.role)}
                        </div>
                        {(participant.find(item => item.userId === user?.id)
                          ?.role === ConversationRole.MANAGER ||
                          participant.find(item => item.userId === user?.id)
                            ?.role === ConversationRole.ADMIN) &&
                          item.userId !== user?.id &&
                          item.role !== ConversationRole.ADMIN && (
                            <Dropdown
                              label={
                                <IoMdMore className="text-[26px] p-0 hover:scale-125 transition text-[#9CA3AF]" />
                              }
                              arrowIcon={false}
                              style={{
                                border: '0',
                                backgroundColor: 'transparent',
                                color: '#6b7280',
                                zIndex: '2',
                                padding: '0',
                                width: '32px',
                                overflow: 'hidden',
                              }}>
                              {participant.find(
                                value => value.userId === user?.id
                              )?.role === ConversationRole.ADMIN && (
                                <Dropdown.Item
                                  onClick={() => {
                                    setSelectedProfile(item);
                                    openConfirmPromoteModal();
                                  }}>
                                  <PiArrowsClockwise className="-mt-[2px] me-2 text-[18px]" />{' '}
                                  {item.role !== ConversationRole.MANAGER
                                    ? 'Promote to admin'
                                    : 'Promote to member'}
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item
                                onClick={() => {
                                  setSelectedProfile(item);
                                  openConfirmRemoveModal();
                                }}>
                                <LuUserX className="-mt-[2px] me-2 text-[16px]" />{' '}
                                Remove member
                              </Dropdown.Item>
                            </Dropdown>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-[15vh] flex flex-col gap-2 items-center justify-center">
                  <img src={emptyUser} alt="" />
                  <span className="text-sm text-gray-400">
                    Member not found
                  </span>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            if (selectedProfile) {
              await handleRemoveMemberGroup(selectedProfile);
            }
          })();
        }}
        openModal={isOpenConfirmRemoveModal}
        onCloseModal={closeConfirmRemoveModal}
        title="Confirm remove"
        color="red"
        description={`Do you want to remove ${selectedProfile?.user.displayName} ?`}
      />
      <ConfirmModal
        onConfirm={() => {
          (async () => {
            if (selectedProfile) {
              await handlePromoteMemberGroup(
                selectedProfile,
                selectedProfile.role !== ConversationRole.MANAGER
                  ? 'MANAGER'
                  : 'MEMBER'
              );
            }
          })();
        }}
        size="lg"
        openModal={isOpenConfirmPromoteModal}
        onCloseModal={closeConfirmPromoteModal}
        title="Confirm promote to admin"
        color="red"
        description={`Do you want to promote ${selectedProfile?.user.displayName ? selectedProfile?.user.displayName + ' ' : ''}to admin ?`}
      />
    </>
  );
}
