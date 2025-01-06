// import (Internal imports)
import classNames from 'classnames';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// react-icons
import { FaBug } from 'react-icons/fa6';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive.ts';
import { Logger } from '../../../helper/logger.ts';

// type definitions
import { BugBountyPayload } from '../../../type/bug-bounty.ts';

// @shares
import {
  blockStyleFn,
  customInlineStyles,
} from '../../@shares/custom-styles/CustomInlineStyles.tsx';

// draft-js and draft-js-export-html
import { convertFromRaw } from 'draft-js';
import { stateToHTML, Options } from 'draft-js-export-html';
import { isToday } from '../../../helper/format-date.ts';

const log = new Logger('PostBugSection');

type Props = {
  post: BugBountyPayload;
};

export default function PostBugSection({ post }: Props) {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useResponsive();

  const goToDetailPostBug = () => {
    navigate(`/bug-bounty/detail/${post.id}`);
  };

  // const isToday = (date: Date) => {
  //   const today = new Date();
  //   return (
  //     date.getDate() === today.getDate() &&
  //     date.getMonth() === today.getMonth() &&
  //     date.getFullYear() === today.getFullYear()
  //   );
  // };

  const updatedDate = new Date(post.updatedAt);
  const formattedDate = updatedDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  let postDetail = '';

  try {
    if (post.detail.startsWith('{') && post.detail.endsWith('}')) {
      const parsedDetail = JSON.parse(post.detail);
      const contentState = convertFromRaw(parsedDetail);

      const customOptions: Options = {
        inlineStyles: customInlineStyles,
        blockStyleFn: blockStyleFn,
      };

      postDetail = stateToHTML(contentState, customOptions);
    } else {
      postDetail = post.detail;
    }
  } catch (error) {
    log.error('Error parsing or converting post detail:', error);
    postDetail = post.detail;
  }

  return (
    <section>
      <div
        className={classNames('flex flex-row items-start gap-3 border-b', {
          'p-4': isTabletOrMobile,
          'px-10 py-5': !isTabletOrMobile,
        })}>
        <FaBug className="min-h-[18px] min-w-[18px] h-5 w-5 m-1" />
        <div className="flex flex-col justify-center items-start gap-3 w-full">
          <div className="flex flex-col items-start self-stretch gap-2">
            <div
              className="flex justify-between items-center self-stretch flex-wrap"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              <p className="text-[#111928] text-lg font-bold line-clamp-1">
                {post.title}
              </p>
              <span className="text-[#6B7280] text-sm font-normal">
                {isToday(updatedDate)
                  ? `Latest update ${formattedDate}`
                  : formattedDate}
              </span>
            </div>
            <p
              className="line-clamp-2"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: postDetail }}></p>
            <div className="flex justify-end self-stretch">
              <p
                className="text-[#4B99F1] text-base font-normal underline cursor-pointer hover:opacity-70"
                onClick={goToDetailPostBug}>
                View Detail
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
