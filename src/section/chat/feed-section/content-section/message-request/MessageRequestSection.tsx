import classNames from 'classnames';
import SideRequestInfoSection from './SideInfoSection';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useBoolean from '../../../../../helper/hook/useBoolean';
import { ConversationRequestPayload } from '../../../../../type/conversation-requests';
import FullSpinner from '../../../../../component/FullSpinner';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../../../helper/error-format';
import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';
import {
  acceptConversationRequestApi,
  cancelConversationRequestApi,
  denyConversationRequestApi,
  getConversationRequestByIdApi,
} from '../../../../../rest-api/conversation-requests';
import Landing from '../../../../../component/landing/Landing';
import Button from '../../../../../component/button/Button';
import { useDispatch, useSelector } from '../../../../../redux';
import { toggleIsShowLoader } from '../../../../../redux/layout';
import { loadResultsAction } from '../../../../../redux/conversation-request';
import {
  ConversationMenuTab,
  ConversationRequestType,
} from '../../../../../type/conversation';
import { addContactReasons } from '../../../../../constant/conversation';

import { IoCloseCircleOutline } from 'react-icons/io5';
import { addContactApi } from '../../../../../rest-api/contact';
import { AddContactBody } from '../../../../../type/contact';
import useResponsive from '../../../../../helper/hook/useResponsive';
import {
  toggleMobileChatInfo,
  toggleMobileControlSidebarAction,
} from '../../../../../redux/convesation-layout';
import { FaInfoCircle } from 'react-icons/fa';
import Drawer from 'react-modern-drawer';
import { FaAngleLeft } from 'react-icons/fa6';
import sleep from '../../../../../helper/sleep';

export default function MessageRequestSection() {
  const { requestId } = useParams();
  const { user } = useSelector(state => state.account);
  const { isOpenMobileChatInfo } = useSelector(
    state => state.conversationLayout
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [request, serRequest] = useState<ConversationRequestPayload | null>(
    null
  );
  const [isInitializing, initializingStart, initializingDone] =
    useBoolean(true);

  const redirectConversationTab =
    request?.type === ConversationRequestType.MESSAGE_REQUEST
      ? ConversationMenuTab.DIRECT
      : ConversationMenuTab.GROUP;

  const redirectRequestTab =
    request?.type === ConversationRequestType.MESSAGE_REQUEST
      ? ConversationMenuTab.DIRECT_REQUEST
      : ConversationMenuTab.GROUP_INVITE;

  const { isTabletOrMobile } = useResponsive();

  useDeepEffect(() => {
    (async () => {
      try {
        if (requestId) {
          initializingStart();
          const contactPayload = await getConversationRequestByIdApi(requestId);
          if (contactPayload) {
            if (contactPayload.answer === 'accept') {
              navigate(
                `/chat/${contactPayload.type === 'MESSAGE_REQUEST' ? 'direct' : 'group'}/${contactPayload.conversationId}`
              );
            } else if (contactPayload.answer === 'deny') {
              navigate(
                `/chat/${contactPayload.type === 'MESSAGE_REQUEST' ? 'direct' : 'group'}`
              );
            }
            serRequest(contactPayload);
          }
        }
      } catch (error) {
        await sleep(1000);
        if (errorFormat(error).message.includes('REQUEST_ALREADY_ANSWERED')) {
          const conversationId = errorFormat(error).message.split(',');
          navigate(
            `/chat/${conversationId[2].trim()}/${conversationId[1]?.trim()}`
          );
        } else {
          toast.error(errorFormat(error).message);
          navigate(`/`);
        }
      } finally {
        initializingDone();
      }
    })();
  }, [requestId]);

  const handleAcceptRequest = async (requestsId: string) => {
    try {
      dispatch(toggleIsShowLoader(true));
      const acceptResp = await acceptConversationRequestApi(requestsId);
      if (!acceptResp?.id) {
        throw new Error('Request is error');
      }
      if (request) {
        const payload: AddContactBody = {
          walletAddress: request?.sender.walletAddress,
          reason: addContactReasons[1].value,
          description: '-',
        };
        await addContactApi(payload);
      }

      const directId = acceptResp.id;
      navigate(`/chat/${redirectConversationTab}/${directId}`);
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      dispatch(toggleIsShowLoader(false));
    }
  };

  const handleDenyRequest = async (requestsId: string) => {
    try {
      dispatch(toggleIsShowLoader(true));
      const denyResp = await denyConversationRequestApi(requestsId);
      if (!denyResp) {
        throw new Error('deny is error');
      }
      // if (request) {
      //   const payload: AddContactBody = {
      //     walletAddress: request?.sender.walletAddress,
      //     reason: addContactReasons[1].value,
      //     description: '-',
      //   };
      //   await addContactApi(payload);
      // }
      navigate(`/chat/${redirectRequestTab}`);
      if (request?.type) {
        dispatch(loadResultsAction({ type: request.type }));
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      dispatch(toggleIsShowLoader(false));
    }
  };

  const handleCancelRequest = async (requestsId: string) => {
    try {
      dispatch(toggleIsShowLoader(true));
      const cancelResp = await cancelConversationRequestApi(requestsId);
      if (!cancelResp) {
        throw new Error('cancel is error');
      }
      navigate(`/chat/${redirectRequestTab}`);
      if (request?.type) {
        dispatch(loadResultsAction({ type: request.type }));
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      dispatch(toggleIsShowLoader(false));
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-white">
        <FullSpinner />
      </div>
    );
  }

  if (!request) {
    return <></>;
  }

  const dmLanding = () => {
    const isMyRequest = user?.id === request.senderId;

    if (isMyRequest) {
      return (
        <Landing
          button={
            <div className="flex items-center justify-center gap-3 mt-6 max-md:flex-col">
              <Button
                className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center max-h-[40px] px-2 max-md:w-full justify-center"
                label="Cancel chat request"
                onClick={() => handleCancelRequest(request.id)}
                iconLeftSide={<IoCloseCircleOutline className="w-5 h-5 mr-2" />}
              />
            </div>
          }
          subTitle=""
          title="Pending for accepting the chat request"
          titleClass="text-gradient md:text-2xl mb-2"
        />
      );
    }

    const reason = addContactReasons.find(r => r.value === request.reason);

    return (
      <>
        <Landing
          button={
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 max-md:flex-col">
              <Button
                className="!text-white bg-gradient-to-br from-pink-500 to-orange-400 max-md:w-full min-w-[173px]"
                label="Accept chat request"
                onClick={() => handleAcceptRequest(request.id)}
                size="lg"
              />
              <Button
                className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center max-md:w-full justify-center min-w-[173px]"
                label="Delete chat request"
                onClick={() => handleDenyRequest(request.id)}
                size="lg"
              />
            </div>
          }
          hint={`Accept the chat request from ${request.sender.displayName}`}
          subTitle={`“${request.description}”`}
          title={`You have a ${reason?.title} chat request`}
          subTitleClass="text-[#6B7280]"
          titleClass="text-gradient md:text-2xl mb-2"
        />
      </>
    );
  };

  const groupLanding = () => {
    return (
      <>
        <Landing
          button={
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 max-md:flex-col">
              <Button
                className="!text-white bg-gradient-to-br from-pink-500 to-orange-400 max-md:w-full min-w-[173px]"
                label="Accept invitation"
                onClick={() => handleAcceptRequest(request.id)}
                size="lg"
              />
              <Button
                className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center max-md:w-full justify-center min-w-[173px]"
                label="Delete invitation"
                onClick={() => handleDenyRequest(request.id)}
                size="lg"
              />
            </div>
          }
          hint={`Accept the received an invitation from ${request.sender.displayName}`}
          subTitle={`I would like to invite you to join the group “${request.conversation?.name}”`}
          title="You have received an invitation to join the group"
          subTitleClass="text-[#6B7280]"
          titleClass="text-gradient md:text-2xl mb-2"
        />
      </>
    );
  };

  return (
    <div className="flex min-h-full">
      <div className="flex-grow min-h-screen">
        <div className="flex flex-col items-center flex-grow w-full h-full">
          {isTabletOrMobile && (
            <div className="flex w-full items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px] max-lg:h-[60px] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:z-20">
              <div
                className="flex items-center gap-3"
                onClick={() => {
                  dispatch(toggleMobileControlSidebarAction());
                  navigate(`/chat/${redirectRequestTab}`);
                }}>
                <FaAngleLeft className="text-[#F05252] text-[20px]" />
                {request.type === ConversationRequestType.MESSAGE_REQUEST && (
                  <span className="font-bold text-base text-[#555]">
                    Messages Requests
                  </span>
                )}

                {request.type === ConversationRequestType.GROUP_REQUEST && (
                  <span className="font-bold text-base text-[#555]">
                    Group Invitations
                  </span>
                )}
              </div>

              <div
                className="cursor-pointer"
                onClick={() => dispatch(toggleMobileChatInfo())}>
                <FaInfoCircle className="text-[24px] hover:scale-125 transition text-[#9CA3AF] " />
              </div>
            </div>
          )}

          <div className="flex items-center h-full">
            {request.type === ConversationRequestType.MESSAGE_REQUEST &&
              dmLanding()}

            {request.type === ConversationRequestType.GROUP_REQUEST &&
              groupLanding()}
          </div>
          <div className="py-3 px-4 text-sm border-t w-full text-start text-gray-500">
            <p>
              {user?.id !== request.senderId
                ? 'Please accept a chat request before start a conversation.'
                : 'You can cancel the chat request if you want.'}
            </p>
          </div>
          {/* <Landing
            button={
              <div className="flex items-center justify-center gap-3">
                {request.type === ConversationRequestType.MESSAGE_REQUEST &&
                  dmControlButton()}

                {request.type === ConversationRequestType.GROUP_REQUEST &&
                  groupControlButton()}
              </div>
            }
            hint={`Accept the chat request from '${profile.displayName}' before start a conversation`}
            subTitle='"I want to discuss about the data pack you are selling on the platfform please accept the chat request."'
            title="You have a business purpose chat request"
          /> */}
        </div>
      </div>

      {!isTabletOrMobile ? (
        <div
          className={classNames(
            'flex flex-grow-0 flex-shrink-0',
            'w-[300px] bg-white min-h-full',
            'border-l border-gray-200',
            'block'
          )}>
          <SideRequestInfoSection request={request} />
        </div>
      ) : (
        <div className="side-request-info-section max-lg:!z-[111]">
          <Drawer
            size={'80%'}
            open={isOpenMobileChatInfo}
            onClose={() => {
              dispatch(toggleMobileChatInfo());
            }}
            direction="right">
            {isOpenMobileChatInfo && (
              <div className="min-w-[333px] max-w-[333px] max-lg:min-w-full max-lg:max-w-full bg-white min-h-full">
                <SideRequestInfoSection request={request} />
              </div>
            )}
          </Drawer>
        </div>
      )}
    </div>
  );
}
