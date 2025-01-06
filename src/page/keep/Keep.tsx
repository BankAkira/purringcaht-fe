import { HiSearch } from 'react-icons/hi';
import TextInput from '../../component/text-input/TextInput';
import { useEffect, useState } from 'react';
import FileCard from '../../component/file-card/FileCard';
import IconButton from '../../component/icon-button/IconButton';
import { IoInformationCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { errorFormat } from '../../helper/error-format';
import useBoolean from '../../helper/hook/useBoolean';
import { getUserKeepsApi } from '../../rest-api/user';
import { queryParamsToString } from '../../helper/query-param';
import { omit } from 'lodash';
import { PageInfo } from '../../type/common';
import { KeepFile } from '../../type/keep';
import { decryptMessage } from '../../helper/crypto';
import { unkeepMessageApi } from '../../rest-api/conversation-message';
import { MessageContentType } from '../../type/message';
import emptyMediaImage from '../../asset/images/empty-img/empty-media.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner, Tooltip } from 'flowbite-react';
import FullScreenLoader from '../../component/FullScreenLoader';
import { IoMdListBox } from 'react-icons/io';
import { FaRegImage } from 'react-icons/fa6';
import { GiHamburgerMenu } from 'react-icons/gi';
import { PiVideoFill } from 'react-icons/pi';
import classNames from 'classnames';
import { ConversationType } from '../../type/conversation';
import { CryptoAES256 } from '../../helper/rsa-crypto';
import { useSelector } from '../../redux';
import useResponsive from '../../helper/hook/useResponsive';

const tabs = [
  {
    id: '',
    title: 'All',
    icon: GiHamburgerMenu,
  },
  {
    id: MessageContentType.IMAGE,
    title: 'Image',
    icon: FaRegImage,
  },
  {
    id: MessageContentType.VIDEO,
    title: 'Video',
    icon: PiVideoFill,
  },
  {
    id: MessageContentType.FILE,
    title: 'Files',
    icon: IoMdListBox,
  },
];

type QueryParams = {
  page?: number;
  limit?: number;
  text?: string;
  orderBy?: string;
  type?: string;
};

const defaultQueryParams = {
  page: 1,
  limit: 20,
  text: '',
  orderBy: 'updatedAt:desc',
  type: '',
};

export default function Keep() {
  const { isTabletOrMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('');
  const [reload, reloadToggle] = useState(false);
  const [textKeyword, setTextKeyword] = useState('');

  const [isLoading, loadingStart, loadingDone] = useBoolean(true);
  const [isUnkeeping, unkeepingStart, unkeepingDone] = useBoolean(false);
  const { userScheme } = useSelector(state => state.account);

  const [queryParams, setQueryParams] =
    useState<QueryParams>(defaultQueryParams);
  const [pageInfo, setPageInfo] = useState<Omit<PageInfo, 'results'>>({
    limit: 0,
    page: 0,
    totalPages: 0,
    totalResults: 0,
  });
  const [keepFiles, setKeepFiles] = useState(Array<KeepFile>());

  useEffect(() => {
    (async () => {
      try {
        loadingStart();
        const results = await handleFetchKeeps(queryParams);

        setKeepFiles(results);
      } catch (error) {
        toast.error(errorFormat(error).message);
      } finally {
        loadingDone();
      }
    })();
  }, [reload]);

  const onTabChange = async (tab: string) => {
    setActiveTab(tab);

    const newQueryParams = {
      ...defaultQueryParams,
      type: tab,
    };

    const results = await handleFetchKeeps(newQueryParams);

    setKeepFiles(results);
  };

  const onScrollEnd = async () => {
    const newQueryParams = {
      ...queryParams,
      page: +queryParams.page! + 1,
    };
    const results = await handleFetchKeeps(newQueryParams);

    setKeepFiles(prev => [...prev, ...results]);
  };

  const onSearch = async (text: string) => {
    setTextKeyword(text);
    const newQueryParams = {
      ...defaultQueryParams,
      text: text,
    };
    const results = await handleFetchKeeps(newQueryParams);

    setKeepFiles(results);
  };

  const handleFetchKeeps = async (_queryParams: QueryParams) => {
    const payload = await getUserKeepsApi(queryParamsToString(_queryParams));
    if (!payload) {
      throw new Error('Payload not found');
    }

    const _pageInfo = omit(payload, ['results']);

    setPageInfo(_pageInfo);
    setQueryParams(_queryParams);

    const decryptPayload = await Promise.all(
      payload.results.map(async r => {
        let decryptedContent = '';
        if (
          r.conversationMessage.conversation.type === ConversationType.GROUP
        ) {
          const chatSecret = Buffer.from(r.encryptedChatSecret.slice(2), 'hex');
          const chatScheme = new CryptoAES256(chatSecret);
          decryptedContent = await decryptMessage(
            r.conversationMessage.content,
            r.conversationMessage.contentType,
            chatScheme
          );
        }

        if (r.conversationMessage.conversation.type === ConversationType.DM) {
          const encryptedChatSecret = Buffer.from(
            r.encryptedChatSecret.slice(2),
            'hex'
          );
          const chatSecret = userScheme!.decrypt(encryptedChatSecret);
          const chatScheme = new CryptoAES256(chatSecret);
          decryptedContent = await decryptMessage(
            r.conversationMessage.content,
            r.conversationMessage.contentType,
            chatScheme
          );
        }

        return {
          ...r,
          conversationMessage: {
            ...r.conversationMessage,
            decryptedContent,
          },
        };
      })
    );

    return decryptPayload;
  };

  const handleUnkeep = async (messageId: string) => {
    if (isUnkeeping) return;
    try {
      unkeepingStart();
      await unkeepMessageApi(messageId);
      toast.success('Deleted successfully');
      reloadToggle(prev => !prev);
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      unkeepingDone();
    }
  };

  return (
    <section
      className={
        (isTabletOrMobile ? 'h-[calc(100vh-60px)]' : 'h-screen') +
        ' p-4 bg-white overflow-auto'
      }
      id="content-container">
      <div className="flex items-center gap-2 select-none">
        <h2 className="text-2xl font-bold tracking-tight max-lg:text-xl">
          PurrCloud
        </h2>{' '}
        {
          <Tooltip
            content="Save changes or selections for future use"
            placement="right">
            <IconButton
              color="#9CA3AF"
              height={18}
              icon={IoInformationCircle}
              onClick={() => {}}
              width={18}
            />
          </Tooltip>
        }
      </div>

      {/* <p className="font-light text-gray-500 dark:text-gray-400 text-lg my-[8px]">
        Package Name
      </p> */}

      {isLoading ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          {/* <p className="mb-0">
            173.94 GB of 2 TB used
            <span className="ml-3 cursor-pointer text-[#FE7601]">Upgrade</span>
          </p> */}

          <form className="py-3">
            <TextInput
              icon={HiSearch}
              id="search"
              name="search"
              type="search"
              placeholder="Search"
              onChange={e => onSearch(e.target.value)}
              value={textKeyword}
            />
          </form>

          <div className="grid grid-cols-4 pb-3 mt-4 mb-3 max-lg:mt-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={classNames(
                    'flex justify-center items-center gap-2 border-b py-3 cursor-pointer text-base text-[#9CA3AF] border-[#D1D5DB] max-md:flex-col max-md:gap-0 ',
                    {
                      '!border-[#FE7601] !text-[#FE7601]': activeTab === tab.id,
                    }
                  )}>
                  <Icon />
                  <span className="max-md:text-[11px]">{tab.title}</span>
                </div>
              );
            })}
          </div>

          {!keepFiles.length && (
            <>
              <div className="flex items-center justify-center h-[250px]">
                <div className={`media-thumbnail-container small`}>
                  <div className="flex flex-col items-center justify-center w-full gap-2 text-center overflow-indicator">
                    <img src={emptyMediaImage} width={60} alt="empty media" />
                    <span className="text-sm font-normal text-gray-500">
                      No media
                    </span>
                    <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
                      The photos, videos and files you keep will appear here
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          <InfiniteScroll
            dataLength={+pageInfo.page * +pageInfo.limit}
            next={onScrollEnd}
            hasMore={
              !!keepFiles.length && keepFiles.length < pageInfo.totalResults
            }
            scrollableTarget="app-main"
            loader={
              <div className="my-3">
                <Spinner className="w-12 h-12" />
              </div>
            }
            endMessage={<></>}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
                {keepFiles.map(file => (
                  <FileCard
                    file={file}
                    key={file.id}
                    handleUnkeep={handleUnkeep}
                  />
                ))}
              </div>
            </div>
          </InfiniteScroll>
        </>
      )}
    </section>
  );
}
