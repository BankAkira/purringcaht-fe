// import (Internal imports)
import { SVGProps, useRef, useState } from 'react';

// react-tiny-popover
import { Popover } from 'react-tiny-popover';
import { toast } from 'react-toastify';

// flowbite-react
import { Spinner, TextInput } from 'flowbite-react';

import classNames from 'classnames';
import styled from 'styled-components';

// helper functions
import { errorFormat } from '../../../../helper/error-format';
import sleep from '../../../../helper/sleep';
import useBoolean from '../../../../helper/hook/useBoolean';
import { useDebounceText } from '../../../../helper/hook/useDebounceText';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect';
import useResponsive from '../../../../helper/hook/useResponsive';

// redux
import { useDispatch } from '../../../../redux';
import { setIsFetchFirebase } from '../../../../redux/conversation';

// types
import { QueryParams, TypeMailVault } from '../../../../type';

// APIs
import { searchMailApi } from '../../../../rest-api/purr-mail';

// images
import emptyImage from '../../../../asset/images/empty-img/empty-user.svg';

type Props<T> = {
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  searchType: TypeMailVault;
  content: (searchResult: T[], handleClose: () => void) => JSX.Element;
};

export default function SearchPopover<T>({
  icon,
  searchType,
  content,
}: Props<T>) {
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
          const queryParams: QueryParams = {
            page: 1,
            limit: 10,
            text: finalText,
            type: searchType,
          };

          const search = await searchMailApi<T>(queryParams);
          if (search?.results) {
            setSearchResult(search.results);
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
      case 'MAIL':
        return 'Search Mail';
      case 'VAULT':
        return 'Search MailVault';
      default:
        return 'Search';
    }
  })();

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={() => closePopover()}
      positions={['bottom']}
      containerStyle={{
        zIndex: '9999',
        ...(isTabletOrMobile && {
          paddingBottom: '10px',
          paddingLeft: '0px',
          paddingTop: '16px',
          width: '100%',
          height: '100vh',
          transform: 'translate(0, 45px)',
        }),
        ...(!isTabletOrMobile && {
          paddingBottom: '10px',
          top: '10px',
        }),
      }}
      ref={popoverRef}
      reposition={false}
      containerClassName={classNames({
        'w-[calc(100vw-355px)]': !isTabletOrMobile,
      })}
      content={
        <PopoverWrapper className="h-[400px] overflow-auto max-lg:size-full">
          {isSearching ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : (
            <>
              {!searchResult.length ? (
                <div className="flex flex-col gap-3 items-center justify-center h-[395px] text-gray-400">
                  <img src={emptyImage} alt="IMAGE" width="100" />
                  Data Not found
                </div>
              ) : (
                content(searchResult, handleClose)
              )}
            </>
          )}
        </PopoverWrapper>
      }>
      <TextInput
        className="text-input"
        icon={icon}
        id="search"
        name="search"
        type="search"
        placeholder={placeholderText}
        onChange={e => setTextKeyword(e.target.value)}
        value={textKeyword}
        autoComplete="off"
      />
    </Popover>
  );
}

const PopoverWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background: white;
  box-shadow: -2px 5px 10px -6px rgba(0, 0, 0, 0.35);
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 395px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`;
