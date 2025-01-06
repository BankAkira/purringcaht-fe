import moment from 'moment';
import Avatar from '../../../component/avatar/Avatar';
import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { Spinner } from 'flowbite-react';
import Judge from '../../../asset/icon/icons/judge.png';
import { Dispute, ResultsDisputeStatus } from '../../../type/dispute';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { useSelector } from '../../../redux';
import _ from 'lodash';

type Props = {
  img: string | string[];
  name: string;
  userId?: string;
  conversationId?: string;
  memberCount?: number;
  text?: ReactNode;
  status?: 'online' | 'busy' | 'away' | 'offline';
  onClick?: () => void;
  unreadCount?: number;
  timestamp: number;
  textHighlight?: boolean;
  isFetch?: boolean;
  dispute?: Dispute | null | undefined;
};

export default function ChatTabDispute({
  dispute,
  img,
  name,
  status,
  onClick,
  timestamp,
  isFetch,
}: Props) {
  const { user } = useSelector(state => state.account);

  // ** if typeUser = undefined this is user admin when user not admin to not show defendant user **//
  const [typeUser, setTypeUser] = useState<string | undefined>(undefined);
  const [disputeStatus, setDisputeStatus] = useState<
    ResultsDisputeStatus | undefined
  >(undefined);

  useDeepEffect(() => {
    if (user && dispute) {
      const typeUser = findUser(dispute, user.id);
      setTypeUser(typeUser);

      const lastResult = _.last(dispute.ResultDispute);
      if (lastResult?.resultDisputeConfirm) {
        setDisputeStatus(lastResult.resultDisputeConfirm[0].resultStatus);
      }
    }
  }, [dispute, user]);

  const findUser = (dispute: Dispute, userId: string) => {
    return _.findKey(dispute, value => value === userId);
  };

  return (
    <div
      className="flex w-full px-0 cursor-pointer justify-content-between"
      onClick={onClick}>
      <div className="flex justify-start items-center w-[80%] gap-3">
        <div className="min-w-[40px]">
          <Avatar img={img} status={status} size="md" />
        </div>
        <div className="font-medium dark:text-white">
          <div className="flex gap-1">
            <div className="text-sm font-normal text-gray-900 truncate max-w-16 overflow-hidden">
              {name}
            </div>
            <div>
              <img src={Judge} alt="judge" />{' '}
            </div>
            {typeUser === undefined && (
              <div className="text-sm font-normal text-gray-900 truncate max-w-16 overflow-hidden">
                {dispute?.defendant?.displayName || 'Anonymous'}
              </div>
            )}
          </div>

          <div
            className={classNames('text-xs max-w-44 truncate fade-in ', {
              'text-[#4B99F1]': disputeStatus !== 'SUCCESS',
              'text-[#0E9F6E]': disputeStatus === 'SUCCESS',
            })}>
            {disputeStatus === 'SUCCESS' ? 'Dispute Resolved' : 'Under Dispute'}
          </div>
        </div>
        {typeUser === undefined && (
          <div className="min-w-[40px]">
            <Avatar
              img={dispute?.defendant?.picture || ''}
              status={status}
              size="md"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col items-end w-[20%] whitespace-nowrap">
        <div className="text-[10px] !text-gray-400 leading-[24px] fade-in">
          {moment.unix(timestamp).fromNow()}
        </div>
        {!isFetch ? (
          <></>
        ) : (
          <div className="h-[12px] flex items-center justify-center">
            <Spinner color="gray" size="xs" />
          </div>
        )}
      </div>
    </div>
  );
}
