import { useState } from 'react';

// flowbite
import { Avatar, Button } from 'flowbite-react';

// icons
import { IoIosMore } from 'react-icons/io';

import IconRePurrGray from '../../asset/icon/icons/share-all-outline-gray.svg';
import IconFootPetPinkOrange from '../../asset/icon/icons/foot-pet-pink-orange.svg';
import IconFootPetHover from '../../asset/icon/icons/foot-pet-hover.svg';
import IconFootPetGray from '../../asset/icon/icons/foot-pet-gray.svg';
import IconCommentGray from '../../asset/icon/icons/message-text-gray.svg';
import IconCommentOrane from '../../asset/icon/icons/message-text-orange.svg';
import IconRepeatGray from '../../asset/icon/icons/repeat-gray.svg';
import IconRepeatOrane from '../../asset/icon/icons/repeat-orange.svg';
import IconEyeGray from '../../asset/icon/icons/eye-gray.svg';
import IconBookmarkGray from '../../asset/icon/icons/bookmark-gray.svg';
import IconBookmarkHover from '../../asset/icon/icons/bookmark-hover.svg';
import IconBookmarkPinkOrange from '../../asset/icon/icons/bookmark-pink-orange.svg';
import IconShareGray from '../../asset/icon/icons/share-gray.svg';
import IconShareOrange from '../../asset/icon/icons/share-all-outline-orange.svg';

// hook
import useResponsive from '../../helper/hook/useResponsive.ts';

// constant
import { defaultImages } from '../../constant/default-images';

// mock data
import MockData from './MockData';

export default function Post() {
  const { isTabletOrMobile } = useResponsive();

  const [hoveredItems, setHoveredItems] = useState<Record<string, boolean>>({});

  const handleHover = (item: string) => {
    setHoveredItems(prevState => ({ ...prevState, [item]: true }));
  };

  const handleMouseLeave = (item: string) => {
    setHoveredItems(prevState => ({ ...prevState, [item]: false }));
  };

  return (
    <>
      {MockData.map((post, index) => (
        <div
          key={index}
          className={
            (isTabletOrMobile ? 'px-4' : 'px-7') +
            ' flex flex-col items-start self-stretch gap-5 py-5 border-b cursor-pointer hover:bg-[#F9FAFB]'
          }>
          <div className="flex flex-col items-center gap-1 self-stretch p-0">
            {post.toRePurr.isToRePurr && (
              <div className="flex items-center self-stretch gap-[6px] pl-[54px]">
                <img src={IconRePurrGray} alt="ICON_DOUBLE_SHARE" />
                <p className="text-[#9CA3AF] text-sm font-normal self-stretch hover:underline">
                  {post.toRePurr.userName} RePurr
                </p>
              </div>
            )}
            <div className="flex justify-between items-start self-stretch p-0">
              <div className="flex justify-end items-start gap-3 flex-1">
                <Avatar img={post.avatar} size="md" alt="AVATAR" rounded />
                <div className="flex flex-col justify-center items-start gap-2 flex-1">
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-3">
                      <p className="text-[#111928] text-xl font-bold hover:underline">
                        {post.userName}
                      </p>
                      {!post.isFollow && (
                        <Button pill color="light" size="xs">
                          Follow
                        </Button>
                      )}
                      <p className="text-[#6B7280] text-base font-normal">
                        • {post.date}
                      </p>
                    </div>
                    <Button
                      pill
                      size="xs"
                      color="light"
                      className="border-none px-[1px] py-1">
                      <IoIosMore color="gray" size={16} />
                    </Button>
                  </div>
                  <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
                    (This feature will be available soon.)
                  </span>
                  <p className="text-[#111928] text-base font-normal self-stretch">
                    {post.post}
                  </p>
                  <span className="text-[#9CA3AF] text-sm font-normal underline hover:text-[#6B7280]">
                    Translate Post
                  </span>
                  <div className="flex flex-col items-start self-stretch gap-3">
                    {post.image && (
                      <div className="flex max-w-[500px] max-h-[500px]">
                        <img
                          src={post.image || defaultImages.errorImage}
                          className="object-cover border rounded-[16px]"
                          alt="IMAGE"
                        />
                      </div>
                    )}
                    {post.toRePurr.isToRePurr && (
                      <div className="flex flex-col items-start self-stretch gap-5 p-5 border rounded-[16px] hover:bg-[#F1F1F1]">
                        <div className="flex flex-col items-start gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              img={post.toRePurr.avatar}
                              size={isTabletOrMobile ? 'xs' : 'sm'}
                              alt="AVATAR"
                              rounded
                            />
                            <p
                              className={
                                (isTabletOrMobile ? 'text-lg' : 'text-xl') +
                                ' text-[#111928] font-bold'
                              }>
                              {post.toRePurr.userName}
                            </p>
                            <p
                              className={
                                (isTabletOrMobile ? 'text-sm' : 'text-base') +
                                ' text-[#6B7280] font-normal'
                              }>
                              • {post.toRePurr.date}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            {post.toRePurr.image && (
                              <div className="flex max-w-[100px] max-h-[100px]">
                                <img
                                  src={
                                    post.toRePurr.image ||
                                    defaultImages.errorImage
                                  }
                                  className="!max-w-[100px] h-[100px] object-cover rounded-[16px]"
                                  alt="IMAGE"
                                />
                              </div>
                            )}
                            <p
                              className={
                                (isTabletOrMobile ? 'text-sm' : 'text-base') +
                                ' text-[#6B7280] font-normal leading-5 self-stretch line-clamp-5'
                              }>
                              {post.toRePurr.post}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center self-stretch flex-1">
                    <div className="grid grid-cols-4 items-center w-full">
                      <div className="button-purr">
                        <button
                          className={`flex !items-center text-sm font-medium hover:text-red-500 ${post.purr.isPurr ? 'text-red-500' : 'text-[#9CA3AF]'}`}
                          onMouseEnter={() => handleHover(`purr-${index}`)}
                          onMouseLeave={() =>
                            handleMouseLeave(`purr-${index}`)
                          }>
                          {post.purr.isPurr ? (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={IconFootPetPinkOrange}
                              alt="ICON_FOOT_PET_PURR"
                            />
                          ) : (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={
                                hoveredItems[`purr-${index}`]
                                  ? IconFootPetHover
                                  : IconFootPetGray
                              }
                              alt="ICON_FOOT_PET"
                            />
                          )}
                          {post.purr.hasPurr}
                        </button>
                      </div>
                      <div className="button-comment">
                        <button
                          className={`flex !items-center text-sm font-medium hover:text-red-500 ${post.comment.isComment ? 'text-red-500' : 'text-[#9CA3AF]'}`}
                          onMouseEnter={() => handleHover(`comment-${index}`)}
                          onMouseLeave={() =>
                            handleMouseLeave(`comment-${index}`)
                          }>
                          {post.comment.isComment ? (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={IconCommentOrane}
                              alt="ICON_COMMENT"
                            />
                          ) : (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={
                                hoveredItems[`comment-${index}`]
                                  ? IconCommentOrane
                                  : IconCommentGray
                              }
                              alt="ICON_COMMENT"
                            />
                          )}
                          {post.comment.hasComment}
                        </button>
                      </div>
                      <div className="button-repurr">
                        <button
                          className={`flex !items-center text-sm font-medium hover:text-red-500 ${post.rePurr.isRePurr ? 'text-red-500' : 'text-[#9CA3AF]'}`}
                          onMouseEnter={() => handleHover(`rePurr-${index}`)}
                          onMouseLeave={() =>
                            handleMouseLeave(`rePurr-${index}`)
                          }>
                          {post.rePurr.isRePurr ? (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={IconRepeatOrane}
                              alt="ICON_REPEAT"
                            />
                          ) : (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={
                                hoveredItems[`rePurr-${index}`]
                                  ? IconRepeatOrane
                                  : IconRepeatGray
                              }
                              alt="ICON_REPEAT"
                            />
                          )}
                          {post.rePurr.hasRePurr}
                        </button>
                      </div>
                      <div className="button-view">
                        <button
                          className={`flex !items-center text-sm font-medium hover:text-red-500 ${post.view.isView ? 'text-red-500' : 'text-[#9CA3AF]'}`}
                          onMouseEnter={() => handleHover(`view-${index}`)}
                          onMouseLeave={() =>
                            handleMouseLeave(`view-${index}`)
                          }>
                          {post.view.isView ? (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={IconEyeGray}
                              alt="ICON_EYE"
                            />
                          ) : (
                            <img
                              className="p-2 rounded-full hover:bg-[#FFF8F1] hover:scale-90 transition"
                              src={
                                hoveredItems[`view-${index}`]
                                  ? IconEyeGray
                                  : IconEyeGray
                              }
                              alt="ICON_EYE"
                            />
                          )}
                          {post.view.hasView}
                        </button>
                      </div>
                    </div>
                    <div
                      className="grid justify-items-end items-center gap-1 w-full"
                      style={{ gridTemplateColumns: '9fr 1fr 1fr' }}>
                      {post.catTreats.isCatTreats ? (
                        <Button pill size="xs" className="bg-pink-orange">
                          <p className="hover:text-red-800">
                            ${post.catTreats.treats} Cat Treats
                          </p>
                        </Button>
                      ) : (
                        <Button
                          pill
                          outline
                          size="xs"
                          gradientDuoTone="pinkToOrange"
                          className="bg-pink-orange">
                          <p className="text-red-500 hover:text-white">
                            + Give Cat Treats
                          </p>
                        </Button>
                      )}
                      <button
                        className="p-1 hover:bg-[#FFF8F1] hover:rounded-full"
                        onMouseEnter={() => handleHover(`bookmark-${index}`)}
                        onMouseLeave={() =>
                          handleMouseLeave(`bookmark-${index}`)
                        }>
                        {post.bookmark.isBookmark ? (
                          <img
                            className="hover:scale-90 transition"
                            src={IconBookmarkPinkOrange}
                            alt="ICON_BOOKMARK"
                          />
                        ) : (
                          <img
                            className="hover:scale-90 transition"
                            src={
                              hoveredItems[`bookmark-${index}`]
                                ? IconBookmarkHover
                                : IconBookmarkGray
                            }
                            alt="ICON_BOOKMARK"
                          />
                        )}
                      </button>
                      <button
                        className="p-1 hover:bg-[#FFF8F1] hover:rounded-full"
                        onMouseEnter={() => handleHover(`share-${index}`)}
                        onMouseLeave={() => handleMouseLeave(`share-${index}`)}>
                        {post.share.isShare ? (
                          <img
                            className="h-[20px] w-[20px] hover:scale-90 transition"
                            src={IconShareOrange}
                            alt="ICON_SHARE"
                          />
                        ) : (
                          <img
                            className="h-[20px] w-[20px] hover:scale-90 transition"
                            src={
                              hoveredItems[`share-${index}`]
                                ? IconShareOrange
                                : IconShareGray
                            }
                            alt="ICON_SHARE"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style>
            {`
              .line-clamp-5 {
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
                overflow: hidden;
                }
            `}
          </style>
        </div>
      ))}
    </>
  );
}
