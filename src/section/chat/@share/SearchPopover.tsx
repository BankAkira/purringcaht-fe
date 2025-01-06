import { useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import TextInput from '../../../component/text-input/TextInput';
import { useDebounceText } from '../../../helper/hook/useDebounceText';
import useBoolean from '../../../helper/hook/useBoolean';
import { Popover } from 'react-tiny-popover';
import { PopoverWrapper } from '../../../component/@styled/PopoverWrapper';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../helper/error-format';
import styled from 'styled-components';
import { Spinner } from 'flowbite-react';
import { GlobalSearchType } from '../../../type/chat';
import { globalSearchApi } from '../../../rest-api/user';
import { queryParamsToString } from '../../../helper/query-param';
import emptyImage from '../../../asset/images/empty-img/empty-user.svg';
import useResponsive from '../../../helper/hook/useResponsive';
import classNames from 'classnames';
import { useDispatch } from '../../../redux';
import { setIsFetchFirebase } from '../../../redux/conversation';
import sleep from '../../../helper/sleep';

type Props<T> = {
  searchType: GlobalSearchType;
  content: (searchResult: T[], handleClose: () => void) => JSX.Element;
};

export default function SearchPopover<T>({ searchType, content }: Props<T>) {
  const dispatch = useDispatch();
  const popoverRef = useRef<HTMLElement>({} as HTMLElement);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const [textKeyword, setTextKeyword] = useState('');
  const finalText = useDebounceText(textKeyword);
  const [isSearching, searchingStart, searchingDone] = useBoolean(true);
  const [searchResult, setSearchResult] = useState(Array<T>());

  const { isTabletOrMobile } = useResponsive();

  useDeepEffect(() => {
    if (textKeyword.length) {
      openPopover();
      searchingStart();
    } else {
      handleClose();
    }
  }, [textKeyword]);

  useDeepEffect(() => {
    (async () => {
      if (finalText.length) {
        try {
          const queryParams = {
            page: 1,
            limit: 10,
            text: finalText,
            type: searchType,
          };
          const search = await globalSearchApi<T>(
            queryParamsToString(queryParams)
          );
          if (search?.results) {
            setSearchResult(search?.results);
          }
          await sleep(500);
          dispatch(setIsFetchFirebase(false));
        } catch (error) {
          toast.error(errorFormat(error).message);
        } finally {
          searchingDone();
        }
      }
    })();
  }, [finalText]);

  const handleClose = () => {
    setTimeout(() => {
      dispatch(setIsFetchFirebase(false));
    }, 500);
    closePopover();
    setTextKeyword('');
  };

  const placeholderText = (() => {
    switch (searchType) {
      case 'DM':
        return 'Search Chat';
      case 'GROUP':
        return 'Search Group';
      case 'CONTACT':
        return 'Search Contact';
      case 'REQUEST':
        return 'Search Invitation';
      default:
        return 'Search';
    }
  })();

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        onClickOutside={() => closePopover()}
        positions={['bottom']}
        containerStyle={{
          zIndex: '9999',
          ...(!isTabletOrMobile && {
            paddingBottom: '10px',
            paddingLeft: '0px',
          }),
          ...(isTabletOrMobile && {
            paddingBottom: '10px',
            paddingLeft: '0px',
            paddingTop: '16px',
            width: '100%',
            height: '100vh',
          }),
        }}
        ref={popoverRef}
        reposition={false}
        containerClassName={classNames({
          'sticker-popover-wrapper pl-5': !isTabletOrMobile,
        })}
        content={
          <PopoverWrapper className="h-[400px] w-[300px] overflow-auto max-lg:w-full max-lg:h-full">
            {isSearching ? (
              <LoadingContainer>
                <Spinner />
              </LoadingContainer>
            ) : (
              <>
                {!searchResult.length ? (
                  <div className="flex flex-col gap-3 items-center justify-center h-[395px] text-gray-400">
                    <img src={emptyImage} alt="" width="100" />
                    Data Not found
                  </div>
                ) : (
                  content(searchResult, handleClose)
                )}
              </>
            )}
          </PopoverWrapper>
        }>
        <div>
          <TextInput
            icon={HiSearch}
            id="search"
            name="search"
            type="search"
            placeholder={placeholderText}
            onChange={e => setTextKeyword(e.target.value)}
            value={textKeyword}
            autoComplete="off"
          />
        </div>
      </Popover>
    </>
  );
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 395px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
`;
