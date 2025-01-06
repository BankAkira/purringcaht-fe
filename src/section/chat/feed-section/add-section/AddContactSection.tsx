import { useFormik } from 'formik';
import Landing from '../../../../component/landing/Landing';
import { AddContactValue } from '../../../../type/contact';
import {
  Textarea,
  Label,
  Radio,
  Spinner,
  TextInput,
  Button,
} from 'flowbite-react';
import * as yup from 'yup';
import { addContactReasons } from '../../../../constant/conversation';
import { useState } from 'react';
import { useDebounceText } from '../../../../helper/hook/useDebounceText';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect';
import useBoolean from '../../../../helper/hook/useBoolean';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../../helper/error-format';
import { queryParamsToString } from '../../../../helper/query-param';
import { searchUsersApi } from '../../../../rest-api/user';
import { User } from '../../../../type/auth';
import styled from 'styled-components';
import { addContactApi } from '../../../../rest-api/contact';
import { omit } from 'lodash';
import { loadResultsAction as loadContactAction } from '../../../../redux/contact';
import { useDispatch } from '../../../../redux';
import Avatar from '../../../../component/avatar/Avatar';
import searchUserImage from '../../../../asset/images/search-user.svg';
import {
  ConversationMenuTab,
  ConversationType,
  CreateConversationBody,
} from '../../../../type/conversation';
import { createConversationRequestApi } from '../../../../rest-api/conversation';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { HiPencilSquare } from 'react-icons/hi2';
import SendIcon from '../../../../asset/images/send-icon.svg';
import useResponsive from '../../../../helper/hook/useResponsive';
import { toggleMobileControlSidebarAction } from '../../../../redux/convesation-layout';
import classNames from 'classnames';

const initialValues: AddContactValue = {
  walletAddress: '',
  reason: addContactReasons[0].value,
  description: '',
  submitType: 0,
};

const validationSchema = yup.object().shape({
  walletAddress: yup.string().nonNullable().required('Required'),
  reason: yup.string().nonNullable().required('Required'),
  description: yup.string().nonNullable().required('Required'),
});

export default function AddSectionContactSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [textKeyword, setTextKeyword] = useState('');
  const finalText = useDebounceText(textKeyword);
  const [isSearching, searchingStart, searchingDone] = useBoolean(true);
  const [isSubmitting, submittingStart, submittingDone] = useBoolean(false);
  const [userResult, setUserResult] = useState(Array<User>());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { isTabletOrMobile } = useResponsive();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  useDeepEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const displayNameParams = searchParams.get('displayName');
    if (displayNameParams) setTextKeyword(displayNameParams);
  }, [location]);

  useDeepEffect(() => {
    (async () => {
      if (finalText) {
        try {
          const params = {
            limit: 5,
            page: 1,
            text: textKeyword,
            type: 'CONTACT',
          };
          const userPayload = await searchUsersApi(queryParamsToString(params));
          if (userPayload?.results) {
            setUserResult(userPayload?.results);
          }
        } catch (error) {
          toast.error(errorFormat(error).message);
        } finally {
          searchingDone();
        }
      }
    })();
  }, [finalText]);

  const handleSetSelectedUser = (user: User) => {
    formik.setFieldValue('walletAddress', user.walletAddress);
    setSelectedUser(user);
    setUserResult(Array<User>());
    setTextKeyword('');
  };

  const handleClearSelectedUser = () => {
    formik.setFieldValue('walletAddress', '');
    setSelectedUser(null);
  };

  const handleSubmit = async (values: AddContactValue) => {
    try {
      submittingStart();

      const addContactBody = omit(values, ['submitType']);
      const addContactResp = await addContactApi(addContactBody);

      if (values.submitType === 2 && addContactResp) {
        const body: CreateConversationBody = {
          userIds: [addContactResp.userId],
          description: values.description,
          reason: values.reason,
          type: ConversationType.DM,
        };

        const createdResp = await createConversationRequestApi(body);
        if (!createdResp?.conversationRequests[0].id) {
          throw new Error('Request is error');
        }

        navigate(
          `/chat/${ConversationMenuTab.DIRECT_REQUEST}/${createdResp?.conversationRequests[0].id}`
        );
      }

      handleClearSelectedUser();
      dispatch(loadContactAction());
      // toast.success('Add Contact Success.');
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      submittingDone();
    }
  };

  const displaySearchResult = () => {
    if (!textKeyword) {
      return <></>;
    }
    if (isSearching) {
      return (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      );
    }

    if (!userResult.length) {
      return (
        <div className="flex items-center justify-center gap-2 mt-5 text-center">
          <div className="text-base text-gray-600 underline">Not found!</div>
          <div className="mt-0 text-sm text-gray-400">Try search again.</div>
        </div>
      );
    }

    return userResult.map(user => (
      <div
        className="cursor-pointer"
        key={user.walletAddress}
        onClick={() => handleSetSelectedUser(user)}>
        <ListContactContainer>
          <Avatar
            img={user.picture}
            name={user.displayName}
            text={`User ID: ${user.displayId}`}
          />
          <FaAngleRight className="text-[22px] text-[#999]" />
        </ListContactContainer>
      </div>
    ));
  };

  return (
    <>
      {isTabletOrMobile && (
        <div className="flex w-full items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px] max-lg:h-[60px] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:z-20">
          <div
            className="flex items-center gap-3"
            onClick={() => {
              dispatch(toggleMobileControlSidebarAction());
              navigate(`/chat/${ConversationMenuTab.CONTACTS}`);
            }}>
            <FaAngleLeft className="text-[#F05252] text-[20px]" />

            <span className="font-bold text-base text-[#555]">
              Add New Contact
            </span>
          </div>
        </div>
      )}
      <div className="w-full bg-gray-100 overflow-y-auto h-[calc(100vh-60px)] max-lg:mt-[60px] lg:h-screen pb-0 lg:pb-[30px] fade-in">
        <div className="h-auto lg:h-full">
          <div className="bg-gradient-to-l from-[#FEA7C0] from-8% to-[#FFC08A] to-100% py-[50px] max-lg:pt-[20px] max-lg:pb-[5px]">
            <Landing
              src={searchUserImage}
              subTitle="You can add contact with a profile name or User ID and start the conversation after they accept your request."
              title="Add New Contact"
              titleClass="text-white md:text-3xl"
              subTitleClass="text-white"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-3 max-lg:h-full">
            <div
              className={classNames(
                'flex flex-col items-center gap-3 mt-10 max-lg:mt-4 px-4 w-full ',
                { 'max-w-[800px] ': !isTabletOrMobile },
                { 'max-w-[400px] pb-[60px] h-full ': isTabletOrMobile }
              )}>
              {!selectedUser ? (
                <div className="w-full mx-auto max-w-[500px]">
                  <TextInput
                    placeholder="Search for new friends by profile name or User ID"
                    icon={IoSearchOutline}
                    onChange={e => {
                      setTextKeyword(e.target.value);
                      searchingStart();
                    }}
                    style={{
                      borderColor: '#D1D5DB !important',
                      borderRadius: '50px',
                      height: '50px',
                      background: '#fff',
                    }}
                    value={textKeyword}
                  />
                  {displaySearchResult()}
                </div>
              ) : (
                <>
                  <ListContactContainer className="w-full max-w-[500px] mx-auto">
                    <Avatar
                      img={selectedUser.picture}
                      name={selectedUser.displayName}
                      text={`User ID: ${selectedUser.displayId}`}
                    />
                    <button
                      className="flex items-center gap-1 p-1.5 bg-gray-100 rounded-lg"
                      onClick={() => handleClearSelectedUser()}>
                      <IoCloseOutline className="text-lg" />
                      <span className="text-xs max-md:hidden">Cancel</span>
                    </button>
                  </ListContactContainer>

                  <p className="mt-3 max-lg:mt-0 mb-2 text-xs font-normal text-gray-600">
                    What's the purpose of adding contact?
                  </p>

                  <fieldset className="grid w-full lg:grid-cols-2 xl:grid-cols-4  gap-4">
                    {addContactReasons.map(radio => {
                      return (
                        <div
                          className="flex items-center gap-3 px-2.5 py-3 rounded-[16px] bg-white"
                          key={radio.value}>
                          <Radio
                            id={radio.value}
                            name="reason"
                            className="cursor-pointer"
                            value={radio.value}
                            checked={formik.values.reason === radio.value}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ color: '#fe6338' }}
                          />
                          <Label
                            htmlFor={radio.value}
                            className="cursor-pointer">
                            {radio.title}
                            <p className="text-xs font-normal text-gray-400">
                              {radio.supTitle}
                            </p>
                          </Label>
                        </div>
                      );
                    })}
                  </fieldset>

                  <div className="relative w-full mt-3">
                    <div className="absolute left-[8px] top-[16px]">
                      <HiPencilSquare className="text-[20px] text-[#999]" />
                    </div>
                    <Textarea
                      placeholder="short note to receiver..."
                      name="description"
                      className="pl-8 rounded-[16px]"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                      color={
                        formik.touched.description &&
                        !!formik.errors.description
                          ? 'failure'
                          : ''
                      }
                      helperText={
                        <>
                          {formik.touched.description &&
                            formik.errors.description}
                        </>
                      }
                    />
                  </div>

                  <div className="flex gap-3 max-lg:flex-col pb-4 max-lg:w-full">
                    {/* <Button
                      onClick={() => {
                        formik.setFieldValue('submitType', 1);
                        formik.handleSubmit();
                      }}
                      className="rounded-full btn-gradient-outline"
                      disabled={isSubmitting}
                      isProcessing={isSubmitting}>
                      Just add to my contact
                    </Button> */}
                    <Button
                      onClick={() => {
                        formik.setFieldValue('submitType', 2);
                        formik.handleSubmit();
                      }}
                      className="rounded-full btn-gradient-outline"
                      disabled={isSubmitting}
                      isProcessing={isSubmitting}>
                      <img src={SendIcon} className="mr-1.5" alt="" />
                      Send a chat request
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  margin: 10px 0;
`;

const ListContactContainer = styled.div`
  background: #ffffff;
  margin: 10px 0;
  border-radius: 16px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding-right: 15px;
  & > div {
    justify-content: flex-start;
    padding: 10px;
  }
`;
