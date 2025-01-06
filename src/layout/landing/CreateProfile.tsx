// import (Internal imports)
import { ChangeEvent, useState } from 'react';

import * as yup from 'yup';
import moment from 'moment';
import classNames from 'classnames';
import styled from 'styled-components';
import { useFormik } from 'formik';

import environment from '../../environment';

// react-dropzone
import Dropzone from 'react-dropzone';

// react-icons
import { FaPlus, FaUpload } from 'react-icons/fa6';
import { RiEdit2Line } from 'react-icons/ri';
import { IoInformationCircle } from 'react-icons/io5';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// react-toastify
import { toast } from 'react-toastify';

// flowbite-react
import { Label, Spinner, Tooltip } from 'flowbite-react';

// types
import { UpdateUserPayload, User } from '../../type/auth';
import { UpdateUserSettingPayload } from '../../type/setting';

// helper functions
import { errorFormat } from '../../helper/error-format';
import { getRefCode } from '../../helper/local-storage';
import { uploadFile } from '../../helper/upload-file';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';
import useBoolean from '../../helper/hook/useBoolean';
import sleep from '../../helper/sleep';
import useResponsive from '../../helper/hook/useResponsive';

// redux
import { useDispatch, useSelector } from '../../redux';
import { initializeAccountSuccess } from '../../redux/account';
import { setReferralCode } from '../../redux/referral';

// components
import Avatar from '../../component/avatar/Avatar';
import Button from '../../component/button/Button';
import FullSpinner from '../../component/FullSpinner';
import IconButton from '../../component/icon-button/IconButton';
import SwitchButton from '../../component/switch/Switch';
import TextInput from '../../component/text-input/TextInput';

// constants
import { defaultImages } from '../../constant/default-images';

// APIs
import { getPlatformsByName } from '../../rest-api/platform';
import { updateUserApi } from '../../rest-api/user';
import { updateUserSettingApi } from '../../rest-api/user-setting';

type UserSettingFormType = {
  isInvisible: boolean;
  isNotificationAccountActivity: boolean;
  isNotificationCatChaChatCommunication: boolean;
  isOnline: boolean;
  isShowDisplayId: boolean;
};

type UserFormType = UserSettingFormType & {
  profileImage: File | null;
  profileImageUrl?: string;
  displayId: string;
  name: string;
  email: string;
  referralCode: string | null;
  platformId: string | null;
};

const userFormValidationSchema = yup.object<UserFormType>().shape({
  profileImage: yup
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
  displayId: yup
    .string()
    .nonNullable()
    .trim()
    .matches(/^\S+$/, 'User ID cannot contain spaces')
    .required('User ID is required'),
  name: yup.string().nonNullable().required('Profile name is required'),
  email: yup
    .string()
    .required('PurrMail is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'PurrMail can only contain letters a-z, A-Z, numbers 0-9, and special characters (._%+-)'
    )
    .max(42, 'PurrMail can be at most 42 characters long')
    .test(
      'isValidEmail',
      'PurrMail contains invalid characters or format',
      value => {
        if (!value) return true;

        const localPart = value.split('@')[0];
        return !(
          localPart.startsWith('.') ||
          localPart.endsWith('.') ||
          localPart.includes('..')
        );
      }
    ),
  isInvisible: yup.boolean(),
  isNotificationAccountActivity: yup.boolean(),
  isNotificationCatChaChatCommunication: yup.boolean(),
});

type Props = {
  isSetting?: boolean;
};

export default function CreateProfile({ isSetting }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  const [isLoading, loadingStart, loadingDone] = useBoolean(false);
  const [userIdAlreadyUse, setUserIdAlreadyUse] = useState<string | null>(null);
  const [platformId, setPlatformId] = useState<string | null>(null);

  const { user } = useSelector(state => state.account);
  const { refcode } = useSelector(state => state.referral);

  const userFormInitialValues: UserFormType = {
    profileImage: null,
    displayId: user?.displayId || '',
    name: user?.displayName || '',
    email: user?.email || '',
    isInvisible: user?.userSetting?.isInvisible || false,
    isNotificationAccountActivity:
      user?.userSetting?.isNotificationAccountActivity || false,
    isNotificationCatChaChatCommunication:
      user?.userSetting?.isNotificationCatChaChatCommunication || false,
    isOnline: user?.userSetting?.isOnline || false,
    referralCode: refcode || null,
    isShowDisplayId: user?.userSetting?.isShowDisplayId || false,
    platformId: platformId,
  };

  const formik = useFormik({
    initialValues: userFormInitialValues,
    validationSchema: userFormValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    handleBlur,
    dirty,
  } = formik;

  useDeepEffect(() => {
    setTimeout(() => {
      if (getRefCode()) dispatch(setReferralCode(getRefCode()));
    }, 1000);
    getPlatform();
  }, []);

  const getPlatform = async () => {
    try {
      const res = await getPlatformsByName('SB');
      if (res.results) setPlatformId(res.results[0].id);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleChangeReferralCode = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setReferralCode(event.target.value));
  };

  const setLimitDate = () => {
    if (user) {
      const userDisplayNameUpdateTime =
        environment.userDisplayNameUpdateTime || 30;
      return moment(user.displayNameUpdatedAt)
        .add(userDisplayNameUpdateTime, 'days')
        .toDate();
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.trim().toLowerCase();
    const emailWithDomain = email ? `${email}@purrmail.io` : '';

    if (email === '') {
      setFieldError('email', 'Email is required');
    } else {
      setFieldError('email', undefined);
    }

    setFieldValue('email', emailWithDomain, true);
  };

  const onSubmit = async (values: UserFormType) => {
    try {
      loadingStart();
      const limitDate = setLimitDate();

      if (
        user?.displayName !== values.name &&
        limitDate &&
        moment().isBefore(limitDate)
      ) {
        toast.error(
          'You can change your name after ' +
            moment(setLimitDate()).format('DD MMMM YYYY, HH:mm:ss')
        );
        formik.setSubmitting(false);
        return;
      }

      let image = '';
      if (values.profileImage) {
        image = await uploadFile(values.profileImage);
        setFieldValue('profileImageUrl', undefined);
        setFieldValue('profileImage', null);
      } else {
        image = values.profileImageUrl || user?.picture || '';
      }

      const userSettingPayload: UpdateUserSettingPayload = {
        isInvisible: values.isInvisible,
        isNotificationAccountActivity: values.isNotificationAccountActivity,
        isNotificationCatChaChatCommunication:
          values.isNotificationCatChaChatCommunication,
        isOnline: values.isOnline,
        isShowDisplayId: values.isShowDisplayId,
      };

      const userPayload: UpdateUserPayload = {
        displayId: values.displayId,
        displayName: values.name,
        email: values.email,
        picture: values.profileImage ? image : user?.picture,
        isInitProfile: true,
        referralCode: !refcode ? null : refcode,
        platformId: platformId,
      };

      if (!userPayload.platformId) delete userPayload.platformId;
      if (!userPayload.referralCode) delete userPayload.referralCode;

      if (isSetting) {
        delete userPayload.displayId;
        delete userPayload.isInitProfile;
        if (user?.displayName === userPayload.displayName) {
          delete userPayload.displayName;
        }
        if (user?.email === userPayload.email) {
          delete userPayload.email;
        }
        if (!values.profileImage && !values.profileImageUrl) {
          delete userPayload.picture;
        }
      }

      let isSaved = false;
      if (
        user?.displayName !== values.name ||
        !!values.profileImageUrl ||
        !!values.profileImage ||
        user?.email !== values.email
      ) {
        const resp = await updateUserApi(userPayload);
        if (resp?.isInitProfile) {
          if (user) {
            const userInfo: User = {
              ...user,
              isInitProfile: true,
              displayId: userPayload.displayId || user.displayId,
              displayName: userPayload.displayName || user.displayName,
              picture: userPayload.picture || user.picture,
              email: userPayload.email || user.email,
            };
            dispatch(initializeAccountSuccess({ user: userInfo }));
          }
          isSaved = true;
        } else {
          isSaved = false;

          if (String(resp).includes('You will can change your name after')) {
            toast.error(String(resp));
          } else if (String(resp).includes('User id already existed')) {
            setUserIdAlreadyUse(values.displayId);
            toast.error(`User id is already in use.`);
          } else if (String(resp).includes('User already have user id')) {
            setUserIdAlreadyUse(values.displayId);
            toast.error(`User already have user id'`);
            navigate('/');
          } else {
            toast.error(`Something's wrong, try again later`);
          }
          formik.setSubmitting(false);
          return;
        }
      }

      if (
        user?.userSetting?.isInvisible !== values.isInvisible ||
        user?.userSetting?.isShowDisplayId !== values.isShowDisplayId ||
        user?.userSetting?.isNotificationAccountActivity !==
          values.isNotificationAccountActivity ||
        user?.userSetting?.isNotificationCatChaChatCommunication !==
          values.isNotificationCatChaChatCommunication
      ) {
        const resp = await updateUserSettingApi(userSettingPayload);
        if (resp?.id) {
          if (user && user.userSetting) {
            const userInfo: User = {
              ...user,
              userSetting: {
                ...user.userSetting,
                isInvisible: userSettingPayload.isInvisible,
                isNotificationAccountActivity:
                  userSettingPayload.isNotificationAccountActivity,
                isNotificationCatChaChatCommunication:
                  userSettingPayload.isNotificationCatChaChatCommunication,
                isOnline: userSettingPayload.isOnline,
                isShowDisplayId: userSettingPayload.isShowDisplayId,
              },
            };
            dispatch(initializeAccountSuccess({ user: userInfo }));
          }
          isSaved = true;
        } else {
          isSaved = false;
          toast.error(String(resp));
          formik.setSubmitting(false);
          return;
        }
      }
      if (isSaved) {
        formik.resetForm({ values: formik.values });
        if (!isSetting) {
          await sleep(1000);
          navigate('/');
        } else {
          toast.success('Update account successfully');
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
      formik.setSubmitting(false);
    } finally {
      await sleep(1000);
      loadingDone();
    }
  };

  const handleClickUpload = () => {
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) {
      uploadZone.click();
    }
  };

  const handleProfileImageChange = async (files: File[]) => {
    if (files && files.length > 0) {
      await setFieldValue('profileImage', files[0]);
      await setFieldValue('profileImageUrl', undefined);
      formik.setFieldTouched('profileImage', true, true);
      formik.setFieldTouched('profileImageUrl', true, true);
    }
  };

  return (
    <div
      className={
        (isSetting
          ? ''
          : 'bg-gradient-to-l from-[#FEA7C0] from-8% to-[#FFC08A] to-100% min-h-screen py-5') +
        ' w-full flex flex-col gap-3 justify-center items-center pb-10 px-2'
      }>
      {!isSetting && isLoading ? (
        <FullSpinner height="84" />
      ) : (
        <div
          className={
            (isLoading ? '!pointer-events-none' : '') +
            (isSetting ? '!px-0' : 'max-w-[800px] px-5 ') +
            ' w-full flex flex-col items-center justify-center gap-8 '
          }>
          {!isSetting && (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <span className="text-2xl lg:text-3xl font-semibold text-white">
                Welcome to Purring Chat !
              </span>
              <span className="text-base font-normal text-white">
                Please enter your Name and User ID
              </span>
            </div>
          )}
          <div className="relative flex flex-col items-center justify-center">
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
              onDrop={handleProfileImageChange}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className="cursor-pointer"
                  {...getRootProps({ multiple: false })}>
                  <div
                    className={
                      (touched?.profileImage && errors?.profileImage
                        ? 'border border-red-600'
                        : '') +
                      ' items-start self-stretch flex grow flex-col mt-2 rounded-full'
                    }>
                    <input
                      id="upload-zone"
                      {...getInputProps({ multiple: false })}
                      multiple={false}
                    />
                    <Avatar
                      img={
                        values.profileImageUrl ||
                        (values.profileImage &&
                          URL.createObjectURL(values.profileImage)) ||
                        user?.picture ||
                        defaultImages.noProfile
                      }
                      onClick={() => {}}
                      size={isTabletOrMobile ? 'lg' : 'xl'}
                    />
                    {!isSetting && (
                      <FaPlus className="p-1 bg-gradient-to-br from-pink-500 to-orange-400 text-white text-[28px] max-lg:text-[22px] rounded-full cursor-pointer absolute right-1.5 bottom-1.5 max-lg:right-0.5 max-lg:bottom-0.5" />
                    )}
                  </div>
                </div>
              )}
            </Dropzone>
            {touched?.profileImage && errors?.profileImage && (
              <Label className="absolute w-screen lg:w-[calc(100vw-302px)] px-3 sm:px-0 min-w-[240px] text-xs sm:text-sm text-center -bottom-7 text-[#e02424]">
                {errors?.profileImage}
              </Label>
            )}
            {isSetting && (
              <div className="flex gap-3 mt-3 sm:mt-5 mb-2 sm:mb-0">
                <Button
                  className="!flex items-center justify-center gap-2 btn-gradient-outline !shadow-none max-lg:max-h-[34px] max-lg:text-base"
                  iconLeftSide={
                    <FaUpload className="w-5 h-5 text-orange-400" />
                  }
                  label="Upload"
                  onClick={() => handleClickUpload()}
                />
                <Button
                  className="flex flex-wrap gap-2 min-w-[114px] max-lg:max-h-[34px] max-lg:text-base max-lg:p-0"
                  label="Remove"
                  onClick={() => {
                    setFieldValue('profileImage', null);
                    setFieldValue('profileImageUrl', defaultImages.noProfile);
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col w-full gap-1">
            <Label
              className={(isSetting ? 'text-gray-900' : 'text-white') + ' '}>
              User ID
            </Label>
            <TextInput
              icon={RiEdit2Line}
              placeholder="Create Your User ID"
              value={values.displayId.trim() || ''}
              disabled={isSetting || !!user?.displayId}
              name="displayId"
              onChange={handleChange}
              onBlur={handleBlur}
              color={
                (!!touched?.displayId && !!errors?.displayId) ||
                userIdAlreadyUse === values.displayId
                  ? 'failure'
                  : ''
              }
              helperText={
                userIdAlreadyUse === values.displayId
                  ? 'User id is already in use'
                  : touched?.displayId && errors?.displayId
              }
            />
            <Label
              className={
                (isSetting ? 'text-gray-500' : 'text-white') +
                ' text-xs sm:text-sm leading-tight'
              }>
              {isSetting
                ? `You can't change your User ID`
                : `This will be your unique ID that you can share with friends to add you. ID is approved, it cannot be changed.`}
            </Label>
            <SwitchButton
              label={values.isShowDisplayId ? 'Show User ID' : 'Hide User ID'}
              description="Toggle this switch to show or hide your User ID to others."
              isActive={values.isShowDisplayId}
              onToggle={value => setFieldValue('isShowDisplayId', value)}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <Label
              className={(isSetting ? 'text-gray-900' : 'text-white') + ' '}>
              Profile name
            </Label>
            <TextInput
              icon={RiEdit2Line}
              placeholder="Choose Your User Name"
              value={values.name || ''}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              color={!!touched?.name && !!errors?.name ? 'failure' : ''}
              helperText={touched?.name && errors?.name}
            />
            <Label
              className={
                (isSetting ? 'text-gray-500' : 'text-white') +
                ' text-xs sm:text-sm leading-tight'
              }>
              You can change your name once per month.
            </Label>
          </div>
          <div className="flex flex-col w-full gap-1">
            <Label
              className={(isSetting ? 'text-gray-900' : 'text-white') + ' '}>
              PurrMail
            </Label>
            <div className="relative">
              <CustomInputMailStyle>
                <TextInput
                  icon={RiEdit2Line}
                  placeholder="Create your preferred PurrMail address"
                  value={values.email.replace('@purrmail.io', '')}
                  name="email"
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                  color={!!touched?.email && !!errors?.email ? 'failure' : ''}
                  helperText={touched?.email && errors?.email}
                  maxLength={32}
                  disabled={user?.email !== null && user?.email !== ''}
                />
              </CustomInputMailStyle>
              <span
                className={classNames(
                  'absolute top-[1px] right-[1px] flex items-center pointer-events-none text-[#111928] font-normal border rounded-r-full px-2 h-[38px]',
                  'bg-gradient-to-br from-pink-500 to-orange-400',
                  'text-white'
                )}>
                @purrmail.io
              </span>
            </div>
            <Label
              className={
                (isSetting ? 'text-gray-500' : 'text-white') +
                ' text-xs sm:text-sm leading-tight'
              }>
              You can use letters, numbers, and punctuation.
            </Label>
          </div>
          {!isSetting && (
            <div className="flex flex-col w-full gap-1">
              <Label
                className={(isSetting ? 'text-gray-900' : 'text-white') + ' '}>
                Referral Code
              </Label>
              <TextInput
                icon={RiEdit2Line}
                placeholder="Enter a Referral Code (Optional)"
                value={refcode || ''}
                onChange={handleChangeReferralCode}
                name="referralCode"
              />
              <Label
                className={
                  (isSetting ? 'text-gray-500' : 'text-white') +
                  ' text-xs sm:text-sm leading-tight'
                }>
                You will earn 0.02 points for successfully creating a new
                account with a referral code and 0.01 points without a referral
                code.
              </Label>
            </div>
          )}
          {isSetting && (
            <div className="flex flex-col items-start justify-start w-full gap-8">
              <div className="flex flex-col items-start justify-start w-full gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 select-none">
                  Status{' '}
                  <Tooltip content="Online Presence" placement="right">
                    <IconButton
                      color="#9CA3AF"
                      icon={IoInformationCircle}
                      width={18}
                      height={18}
                      onClick={() => {}}
                    />
                  </Tooltip>
                </div>
                <SwitchButton
                  label="Invisible"
                  description="You will not appear online but will have full access to Purring Chat"
                  isActive={values.isInvisible}
                  onToggle={value => setFieldValue('isInvisible', value)}
                />
              </div>

              <div className="flex flex-col items-start justify-start w-full gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 select-none">
                  Alerts & Notifications{' '}
                  <Tooltip content="App Activity Updates" placement="right">
                    <IconButton
                      color="#9CA3AF"
                      height={18}
                      icon={IoInformationCircle}
                      onClick={() => {}}
                      width={18}
                    />
                  </Tooltip>
                </div>
                <SwitchButton
                  label="Notifications activities"
                  description="Receive notifications for various activities happening in the application"
                  isActive={values.isNotificationCatChaChatCommunication}
                  onToggle={value =>
                    setFieldValue(
                      'isNotificationCatChaChatCommunication',
                      value
                    )
                  }
                />
                <SwitchButton
                  label="Notifications sound"
                  description="Toggle notification sound to be alerted audibly of various activities"
                  isActive={values.isNotificationAccountActivity}
                  onToggle={value =>
                    setFieldValue('isNotificationAccountActivity', value)
                  }
                />
              </div>
            </div>
          )}

          <Button
            className={
              (isSetting
                ? 'bg-gradient-to-br from-pink-500 to-orange-400'
                : 'bg-gradient-to-br from-pink-500 to-orange-400') +
              ' !flex items-center justify-center gap-2 !text-white min-w-[200px] max-h-[40px] !shadow-none mb-14 lg:mb-4'
            }
            disabled={
              isLoading ||
              (!dirty &&
                user?.displayName === values.name &&
                !values.profileImageUrl &&
                !values.profileImage &&
                (!values.email || user?.email === values.email) &&
                user?.userSetting?.isInvisible === values.isInvisible &&
                user?.userSetting?.isShowDisplayId === values.isShowDisplayId &&
                user?.userSetting?.isNotificationAccountActivity ===
                  values.isNotificationAccountActivity &&
                user?.userSetting?.isNotificationCatChaChatCommunication ===
                  values.isNotificationCatChaChatCommunication) ||
              formik.isSubmitting
            }
            label={isLoading ? <Spinner /> : isSetting ? 'Save' : 'Next'}
            type="submit"
            onClick={() => formik.handleSubmit()}
            size="lg"
          />
        </div>
      )}
      <div> Version {environment.appVersion}</div>
    </div>
  );
}

const CustomInputMailStyle = styled.div`
  .con-text-input div input {
    padding-right: 35%;
  }
`;
