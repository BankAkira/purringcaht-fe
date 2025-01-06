import { useSelector } from '../../../redux';

import { defaultImages } from '../../../constant/default-images';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import logo from '/src/asset/icon/Logo.png';
import { PropsWithChildren, SetStateAction, useState } from 'react';
import { Button } from 'flowbite-react';
import { ConversationPayload } from '../../../type/conversation';
import { useDispatch } from '../../../redux';
import classNames from 'classnames';
import {
  AdminJudgmentDispute,
  Dispute,
  DisputeInformation,
  ResultDisputeForm,
} from '../../../type/dispute';

import { formatDate } from '../../../helper/format-date';
import useBoolean from '../../../helper/hook/useBoolean';

import { Logger } from '../../../helper/logger';
import {
  createResultDispute,
  updateConfirmResultDispute,
} from '../../../rest-api/dispute';
import DisputeResolutionModal from '../modals/DisputeResolutionModal';
import FullScreenLoader from '../../../component/FullScreenLoader';
import { User } from '@sentry/react';
import AppealModal from '../modals/AppealModal';
import { initializeMessageAction } from '../../../redux/message-dispute';
import ConfirmModal from '../../../component/@share/ConfirmModal';
import _ from 'lodash';

const log = new Logger('InformationDisputeBubble');

// import { getFileCategory } from '../../../helper/file';
type ChatBubbleDisputeProps = {
  widthNameTruncate?: number;
  conversation?: ConversationPayload;
  dispute: Dispute;
};

type BubbleProps = {
  information?: DisputeInformation;
  adminJudgment?: AdminJudgmentDispute;
  isSender?: boolean;
  isLoading?: boolean;
  index: number;
  myUser?: User | null;
};

export default function InformationDisputeBubble({
  widthNameTruncate,
  dispute,
}: ChatBubbleDisputeProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAppeal, openAppealModal, closeAppealModal] = useBoolean();
  const [isOpenAccept, openAcceptModal, closeAcceptModal] = useBoolean();
  const { user } = useSelector(state => state.account);
  const [typeUser, setTypeUser] = useState<string | undefined>(undefined);

  const [
    isOpenDisputeResolution,
    openDisputeResolutionModal,
    closeDisputeResolutionModal,
  ] = useBoolean(false);
  const [imagesInformation, setImagesInformation] = useState<string[][]>([]);

  const findUser = (dispute: Dispute, userId: string) => {
    return _.findKey(dispute, value => value === userId);
  };

  useDeepEffect(() => {
    const fetchFile = async () => {
      if (!dispute || !dispute.disputeInformations) {
        return;
      }
      const imagesInformationArray: SetStateAction<string[][]> = [];
      await Promise.all(
        dispute.disputeInformations.map(async (info: DisputeInformation) => {
          const base64: string[] = [];
          await Promise.all(
            info.files.map(async file => {
              const con = file?.content;
              if (con) {
                const resp = await fetch(con);
                const cypher = await resp.text();
                base64.push(cypher);
              }
            })
          );
          imagesInformationArray.push(base64);
        })
      );
      setImagesInformation(imagesInformationArray);

      // ****
      // check this user is defendantId or  plaintiffId  for use to condition Result confirm;
      // ****
      if (user) {
        const typeUser = findUser(dispute, user.id);
        setTypeUser(typeUser);
      }
    };
    fetchFile();
  }, [dispute, user]);

  const onCreateResultsDispute = async (payload: ResultDisputeForm) => {
    setIsLoading(true);
    try {
      const res = await createResultDispute(payload);
      if (res) dispatch(initializeMessageAction(dispute.conversationId));
    } catch (error) {
      log.error('error create resultsDispute', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAppealDispute = async () => {
    // log.debug('appeal');
  };

  const handleAccept = async (confirmId: string) => {
    closeAcceptModal();
    try {
      const res = await updateConfirmResultDispute(confirmId, {
        status: 'ACCEPT',
      });
      if (res) dispatch(initializeMessageAction(dispute.conversationId));
    } catch (error) {
      log.error('error', error);
    }
  };

  function Avatar({ picture }: { picture?: string }) {
    return (
      <img
        src={picture || defaultImages.noProfile}
        className="object-cover w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8 rounded-full"
        alt=""
      />
    );
  }

  function BubbleWrapper({
    isSender,
    children,
    className,
    isUnsendBubble,
  }: PropsWithChildren<{
    isSender?: boolean;
    className?: string;
    isUnsendBubble?: boolean;
  }>) {
    if (!isSender) {
      return (
        <div
          style={{
            background: 'linear-gradient(135deg, #fe7fa4 0%, #fea355 100%)',
          }}
          className={classNames(
            ' rounded-br-2xl rounded-tr-2xl rounded-bl-2xl',
            { 'border px-3 py-2': isUnsendBubble },
            { 'px-4 py-3': !isUnsendBubble },
            className
          )}>
          {children}
        </div>
      );
    }
    return (
      <div
        className={classNames(
          'bg-white rounded-bl-2xl rounded-tl-2xl rounded-br-2xl max-md:text-[13px] max-md:leading-[20px] text-sm',
          { 'border px-3 py-2': isUnsendBubble },
          { 'px-4 py-3': !isUnsendBubble },
          className
        )}>
        {children}
      </div>
    );
  }

  function DisputeResolutionBubble({
    adminJudgment,
    isSender,
    myUser = user,
    index,
  }: BubbleProps) {
    return (
      // Admin Dispute
      <BubbleWrapper isSender={isSender}>
        <div className="bg-gray-100 p-1 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Dispute Resolution Summary [{index + 1}]
            </h2>
            <div className="mb-4">
              <p className="text-gray-600">
                Dispute Resolution Summary from the admin
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">The winner</h3>
              {adminJudgment?.userWon ? (
                <p>{adminJudgment?.userWon?.displayName || 'N/A'} </p>
              ) : (
                <p>in favor of both </p>
              )}
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Dispute Date and Time</h3>
              <p>
                Submitted on:{' '}
                {formatDate(dispute?.createdAt, 'DD-MM-yyyy [at] HH:mm')}
              </p>
              <p>
                Resolved on:{' '}
                {formatDate(adminJudgment?.createdAt, 'DD-MM-yyyy [at] HH:mm')}
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Result</h3>
              <p>{adminJudgment?.detail.result || 'Not resolved yet'}</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Reason</h3>
              <p>
                {adminJudgment?.detail.reason
                  ? adminJudgment?.detail.reason
                  : 'Not resolved yet'}
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Consequences</h3>
              <p>
                {adminJudgment?.detail.consequence
                  ? adminJudgment?.detail.consequence
                  : 'Not resolved yet'}
              </p>
            </div>
            {!isAdmin &&
              dispute.ResultDispute[index]?.resultDisputeConfirm[0]
                ?.resultStatus === 'PENDING' &&
              (typeUser === 'plaintiffId'
                ? dispute.ResultDispute[index]?.resultDisputeConfirm[0]
                    ?.plaintiffStatus === 'PENDING'
                : typeUser === 'defendantId'
                  ? dispute.ResultDispute[index]?.resultDisputeConfirm[0]
                      .defendantStatus === 'PENDING'
                  : false) &&
              (dispute.AdminJudgmentDispute.length <= index + 1 &&
              dispute.AdminJudgmentDispute.length < 3
                ? dispute.disputeInformations.length > index + 1
                  ? false
                  : adminJudgment?.userWonId !== myUser?.id
                : false) && (
                <div className="flex justify-between gap-2">
                  <Button
                    className="text-white bg-gradient-to-br from-pink-500 to-orange-400 min-w-[50px] w-[100%]"
                    onClick={openAppealModal}>
                    Appeal
                  </Button>
                  <Button
                    className="text-white bg-gradient-to-br from-pink-500 to-orange-400 min-w-[50px] w-[100%]"
                    onClick={openAcceptModal}>
                    Accept
                  </Button>
                  <ConfirmModal
                    onConfirm={() => {
                      (async () => {
                        await handleAccept(
                          dispute.ResultDispute[index].resultDisputeConfirm[0]
                            .id
                        );
                      })();
                    }}
                    openModal={isOpenAccept}
                    onCloseModal={closeAcceptModal}
                    title="Accept to results dispute"
                    color="red"
                    description={`I accept this decision.`}
                  />
                  <AppealModal
                    openModal={isOpenAppeal}
                    onCloseModal={closeAppealModal}
                    onAppeal={onAppealDispute}
                    dispute={dispute}
                    resultDisputeConfirmId={
                      dispute.ResultDispute[index].resultDisputeConfirm[0].id
                    }
                  />
                </div>
              )}
            {dispute.ResultDispute[index]?.resultDisputeConfirm[0]
              ?.resultStatus === 'SUCCESS' && (
              <div className="text-lg text-center font-semibold px-1 text-gradient md:text-xl">
                Dispute Completed
              </div>
            )}
          </div>
        </div>
      </BubbleWrapper>
    );
  }
  function DisputeBubble({
    information,
    isSender,
    index,
    myUser = user,
  }: BubbleProps) {
    return (
      // User Dispute
      <BubbleWrapper isSender={isSender}>
        <div className="bg-gray-100 p-1 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {index > 0 ? `Detail Appeal Request` : `Detail Dispute Request`}
            </h2>
            <div className="mb-4">
              <p className="text-gray-600">
                {index > 0
                  ? `    The appeal request was submitted on`
                  : `    The dispute request was submitted on`}
                <br />
                {formatDate(information?.createdAt)}
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">
                Topic to {index > 0 ? `appeal` : `dispute`}
              </h3>
              <p>{information?.topic}</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">
                Title of the {index > 0 ? `appeal` : `dispute`}
              </h3>
              <p>{information?.title}</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">
                Description of the {index > 0 ? `appeal` : `dispute`}
              </h3>
              <p>{information?.description}</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Time of the Incident</h3>
              <p>
                {' '}
                {formatDate(dispute.startDate, 'DD/MM/YYYY')} -{' '}
                {formatDate(dispute.endDate, 'DD/MM/YYYY')}
              </p>
            </div>
            <hr className="mb-4" />
            {imagesInformation[index]?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-600">Evidenced file</h3>
                <div className="flex gap-1 row-auto">
                  {imagesInformation[index].slice(0, 2).map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt="Evidenced file"
                      className="border rounded-md w-[98px] h-[98px] cursor-pointer"
                      style={{
                        borderRadius: '10px',
                      }}
                    />
                  ))}
                  {imagesInformation[index].length > 2 && (
                    <div
                      className="border bg-[#eaeaea] cursor-pointer rounded-md w-[98px] h-[98px] flex items-center justify-center text-gray-600"
                      style={{
                        borderRadius: '10px',
                      }}>
                      +{imagesInformation[index].length - 2}
                    </div>
                  )}
                </div>
              </div>
            )}
            {(dispute.AdminJudgmentDispute[index]?.userId
              ? dispute.AdminJudgmentDispute[index]?.userId !== myUser?.id
              : true) &&
              isAdmin && (
                <div className="flex justify-center">
                  <Button
                    pill
                    className="bg-orange-500 hover:bg-orange-600 "
                    onClick={() => openDisputeResolutionModal()}>
                    Dispute Resolution Summary
                  </Button>
                </div>
              )}
          </div>
        </div>
      </BubbleWrapper>
    );
  }

  const displayDisputeInformation = (
    information: DisputeInformation,
    index: number,
    isSender: boolean
  ) => {
    const bubbleProps: BubbleProps = {
      information,
      index,
      isSender,
    };
    return <DisputeBubble {...bubbleProps} />;
  };
  const displayDisputeResults = (
    adminJudgment: AdminJudgmentDispute,
    index: number,
    isSender: boolean
  ) => {
    const bubbleProps: BubbleProps = {
      adminJudgment,
      index,
      isSender,
    };
    return <DisputeResolutionBubble {...bubbleProps} />;
  };

  // const isOwnerDispute = dispute.plaintiffId === user?.id;
  const isAdmin = user?.role === 'ADMIN_PLATFORM';
  // const isRightForDisplayInformation = isOwnerDispute || isAdmin;
  const isRightForDisplayJudgment = isAdmin;

  // if (!dispute) <></>;

  if (isLoading) return <FullScreenLoader />;

  return (
    <>
      {/* display information dispute */}
      {dispute.disputeInformations &&
        dispute.disputeInformations.map(
          (information: DisputeInformation, index) => (
            <div key={index}>
              <div
                className={`flex gap-2 ${information.userId === user?.id || isAdmin ? 'justify-end mb-8' : 'justify-start mb-4'}`}>
                {!(information.userId === user?.id || isAdmin) && (
                  <Avatar picture={information?.user?.picture} />
                )}
                <div
                  className={`relative flex flex-col gap-1 ${information.userId === user?.id || isAdmin ? 'items-end' : 'items-start'}`}>
                  {' '}
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-bold truncate ${widthNameTruncate ? `max-w-[${widthNameTruncate}px]` : ''}`}>
                      {information?.user?.displayName || 'Anonymous'}
                    </span>

                    <span
                      className={
                        (information.userId === user?.id || isAdmin
                          ? 'fade-in'
                          : '') + ' ms-2 text-xs !font-[300] text-[#6B7280]'
                      }>
                      {formatDate(information.createdAt, 'HH:mm')}
                    </span>
                  </div>
                  <div className="flex break-all">
                    {/* {displayDropdownMenu()} */}

                    <div className={'fade-in transition'}>
                      {displayDisputeInformation(
                        information,
                        index,
                        information.userId === user?.id || isAdmin
                      )}
                    </div>
                  </div>
                </div>
                {(information.userId === user?.id || isAdmin) && (
                  <Avatar picture={information?.user?.picture} />
                )}
              </div>

              {/*  display dispute results  */}
              {dispute.AdminJudgmentDispute[index] && (
                <div
                  className={`flex gap-2 ${isRightForDisplayJudgment ? 'justify-end mb-8' : 'justify-start mb-4'}`}>
                  {!isRightForDisplayJudgment && <Avatar picture={logo} />}
                  <div
                    className={`flex flex-col ${isRightForDisplayJudgment ? 'items-end' : 'items-start'}`}>
                    {' '}
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-bold ${widthNameTruncate ? `truncate max-w-[${widthNameTruncate}px]` : ''}`}>
                        {dispute.AdminJudgmentDispute[index].user
                          ?.displayName || 'Anonymous'}{' '}
                        [admin]
                      </span>
                      <span className="ms-2 text-xs !font-[300] text-[#6B7280]">
                        {formatDate(
                          dispute.AdminJudgmentDispute[index].createdAt,
                          'HH:mm'
                        )}
                      </span>
                    </div>
                    <div className="flex break-all">
                      {displayDisputeResults(
                        dispute.AdminJudgmentDispute[index],
                        index,
                        isRightForDisplayJudgment
                      )}
                    </div>
                  </div>
                  {isRightForDisplayJudgment && <Avatar picture={logo} />}
                </div>
              )}
            </div>
          )
        )}

      <DisputeResolutionModal
        onResultDispute={onCreateResultsDispute}
        openModal={isOpenDisputeResolution}
        onCloseModal={closeDisputeResolutionModal}
        dispute={dispute}
      />
    </>
  );
}
