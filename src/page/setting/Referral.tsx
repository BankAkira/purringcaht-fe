// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';
import moment from 'moment';

import environment from '../../environment';

// react-copy-to-clipboard
import CopyToClipboard from 'react-copy-to-clipboard';

// react-icons
import { CgArrowsExchangeAltV } from 'react-icons/cg';
import { IoInformationCircle } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { PiShareFatThin } from 'react-icons/pi';

// react-toastify
import { toast } from 'react-toastify';

// react-share
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  LineShareButton,
  LineIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

// flowbite-react
import { Label, Pagination, Spinner, Table, Tooltip } from 'flowbite-react';

// types
import { ReferralHistoryTypeWithPagination } from '../../type/referral';

// helper functions
import { queryParamsToString } from '../../helper/query-param';
import { pointPurrKit } from '../../helper/point';
import useBoolean from '../../helper/hook/useBoolean';
import useResponsive from '../../helper/hook/useResponsive.ts';

// redux
import { useSelector } from '../../redux';

// components
import IconButton from '../../component/icon-button/IconButton';
import TextInput from '../../component/text-input/TextInput';

// APIs
import { getReferralHistory } from '../../rest-api/referral';

// images
import noImage from '../../asset/images/empty-img/empty-chat.svg';

// icons
import Favicon from '../../asset/icon/favicon.ico';

export default function Referral() {
  const ITEM_PER_PAGE = 10;

  const { isTabletOrMobile } = useResponsive();
  const { user } = useSelector(state => state.account);

  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [isLoading, trueLoading, falseLoading] = useBoolean(true);
  const [refHistory, setRefHistory] =
    useState<ReferralHistoryTypeWithPagination | null>(null);
  const shareUrl = `${environment.domainName}?refcode=${user?.referralCode?.refCode}`;

  const handleEmailShare = () => {
    const emailShareLink = `mailto:?subject=Check%20out%20this%20post&body=${shareUrl}`;
    window.open(emailShareLink, '_blank');
  };

  const handleSocialBureauShare = () => {
    const shareUrl = `https://www.socialbureau.io/forum/submit/?refcode=${user?.referralCode?.refCode}`;
    window.open(shareUrl, '_blank');
  };

  const handleInit = async (isNoLoading?: boolean) => {
    try {
      !isNoLoading && trueLoading();
      const param = {
        limit: ITEM_PER_PAGE,
        page: currentPage,
        type: 'REFERENCE,REFERRALCODE',
      };
      const resp = await getReferralHistory(queryParamsToString(param));
      if (resp) {
        setRefHistory(resp);
      }
    } catch (error) {
      setRefHistory(null);
    } finally {
      falseLoading();
      setIsInit(false);
    }
  };

  useEffect(() => {
    (async () => {
      await handleInit(!isInit);
    })();
  }, [currentPage]);

  useEffect(() => {
    if (!isInit && !refHistory?.results?.length && currentPage > 1) {
      setCurrentPage(prevItem => prevItem - 1);
    }
  }, [isInit, refHistory, currentPage]);

  const onCopyCode = async () => {
    if (!copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const onCopyCodeLinkShareUrl = async () => {
    toast.success('copied link');
  };
  return (
    <div
      className={classNames('h-screen flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 max-lg:text-xl select-none">
        Referral{' '}
        <Tooltip
          content="Earn rewards by inviting friends to use our service"
          placement="right">
          <IconButton
            color="#9CA3AF"
            height={18}
            icon={IoInformationCircle}
            onClick={() => {}}
            width={18}
          />
        </Tooltip>
      </div>

      <div className="flex flex-col w-full lg:w-[50%] gap-1 mt-5">
        <Label className={'text-gray-900 mx-1'}>Your Code</Label>

        <div className="w-full relative">
          <CopyToClipboard
            text={user?.referralCode?.refCode || ''}
            onCopy={onCopyCode}>
            <TextInput
              role="button"
              rightIcon={MdContentCopy}
              value={user?.referralCode?.refCode}
              readOnly
              name="refCode"
            />
          </CopyToClipboard>
          {copied && (
            <div
              className={
                'absolute -top-[40px] lg:top-1/2 right-0 lg:-right-[85px] -translate-y-1 lg:-translate-y-1/2 z-10 fade-in inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip'
              }>
              <div className="relative">
                Copied!
                <div className="w-2 h-2 bg-gray-900 absolute -bottom-[11px] lg:top-1/2 left-1/2 lg:-left-[15px] -translate-x-1/2 lg:translate-x-0 lg:-translate-y-1/2 rotate-45" />
              </div>
            </div>
          )}
        </div>

        <Label
          className={'text-gray-500 text-xs sm:text-sm mx-2 leading-tight'}>
          You will earn 0.02 points for successfully creating a new account with
          a referral link and 0.01 points without a referral link.
        </Label>
      </div>

      <div>
        <Label className={'text-gray-900 mx-1'}>
          Share your referral code to Social
        </Label>
        <div className="flex justify-start gap-2 items-center px-[12px] mt-2">
          <FacebookShareButton
            className="hover:scale-110 transition"
            url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton
            className="hover:scale-110 transition"
            url={shareUrl}>
            <XIcon size={32} round />
          </TwitterShareButton>

          <LineShareButton
            url={shareUrl}
            className="hover:scale-110 transition">
            <LineIcon size={32} round />
          </LineShareButton>

          <EmailShareButton
            url={shareUrl}
            onClick={handleEmailShare}
            className="hover:scale-110 transition">
            <EmailIcon bgStyle={{ fill: '#ff5a1f' }} size={32} round />
          </EmailShareButton>

          <button
            type="button"
            className="border border-[#142440] bg-[#142440] rounded-full hover:scale-110 transition"
            style={{ padding: '6px 7px' }}
            onClick={handleSocialBureauShare}>
            <img src={Favicon} alt="ICON_SOCIAL" width={16} height={16} />
          </button>

          <CopyToClipboard
            text={shareUrl || ''}
            onCopy={onCopyCodeLinkShareUrl}>
            <button
              type="button"
              className="border border-gray-400 bg-white rounded-full hover:scale-110 transition"
              style={{ padding: '6px 7px' }}>
              <PiShareFatThin size={18} />
            </button>
          </CopyToClipboard>
        </div>
      </div>

      <hr />

      <div className="text-xl font-bold text-gray-900 flex items-center gap-2 max-lg:text-xl mb-2 mt-5 select-none">
        Referral History
        <Tooltip
          content="Prize history by inviting friends to use our service naja"
          placement="top">
          <IconButton
            color="#9CA3AF"
            height={18}
            icon={IoInformationCircle}
            onClick={() => {}}
            width={18}
          />
        </Tooltip>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell className="bg-[#FFF1E6]">
            <div className="flex items-center gap-1">
              DATE{' '}
              <CgArrowsExchangeAltV className="text-[14px] -mt-[2px] cursor-pointer" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell className="bg-[#FFF1E6]">
            <div className="flex items-center gap-1">
              POINT{' '}
              <CgArrowsExchangeAltV className="text-[14px] -mt-[2px] cursor-pointer" />
            </div>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={2}>
                <div className="min-h-[80px] flex items-center justify-center flex-col mt-10 gap-2">
                  <Spinner size="lg" />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            <>
              {!!refHistory && !!refHistory.results.length ? (
                <>
                  {refHistory?.results.map((item, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {moment(item?.createdAt).format('DD/MM/YYYY, HH:mm')}
                      </Table.Cell>
                      <Table.Cell>
                        {pointPurrKit(item.pointLog.amount) || 0}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </>
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={2}>
                    <div className="min-h-[80px] flex items-center justify-center flex-col mt-10 gap-2">
                      <img src={noImage} alt="" />
                      <span className="text-gray-400">
                        No referral history data
                      </span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </>
          )}
        </Table.Body>
      </Table>

      {!!refHistory &&
        !!refHistory?.results?.length &&
        refHistory?.totalPages > 1 && (
          <div className="w-full flex justify-center sm:justify-end p-4">
            <Pagination
              layout="pagination"
              currentPage={currentPage}
              totalPages={refHistory?.totalPages || 0}
              onPageChange={e => {
                setCurrentPage(e);
              }}
              previousLabel=""
              nextLabel=""
              showIcons
              className="pagination-custom"
              theme={{
                pages: {
                  selector: {
                    active: '!text-orange-500 !bg-orange-100',
                  },
                },
              }}
            />
          </div>
        )}

      <hr className="my-6" />
    </div>
  );
}
