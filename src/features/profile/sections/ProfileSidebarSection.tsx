// helper functions
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';

// redux
import { useSelector, useDispatch } from '../../../redux';
import { getSuggestUser } from '../../../redux/follow.ts';

// constants
import { defaultImages } from '../../../constant/default-images.ts';

// components
import Avatar from '../../../component/avatar/Avatar';
import UserSuggest from '../components/UserSuggest.tsx';

// images
import CatAvatar1 from '../../../asset/images/cat-avatar/cat-avatar-1.png';
import CatAvatar2 from '../../../asset/images/cat-avatar/cat-avatar-2.png';
import CatAvatar3 from '../../../asset/images/cat-avatar/cat-avatar-3.png';
import CatAvatar4 from '../../../asset/images/cat-avatar/cat-avatar-4.png';

const mockData = [
  {
    displayName: 'Bonnie',
    picture: CatAvatar1,
  },
  {
    displayName: 'Jese',
    picture: CatAvatar2,
  },
  {
    displayName: 'Thomas',
    picture: CatAvatar3,
  },
  {
    displayName: 'Jame',
    picture: CatAvatar4,
  },
];

export default function ProfileSidebarSection() {
  const { suggestUsers } = useSelector(state => state.follow);
  const dispatch = useDispatch();

  useDeepEffect(() => {
    dispatch(getSuggestUser());
  }, [suggestUsers]);

  return (
    <div
      className="flex flex-col items-center w-full h-screen gap-6 overflow-y-auto bg-[#FFF] py-8 px-5 sticky top-0"
      style={{ scrollbarWidth: 'none' }}>
      <div className="flex flex-col items-start gap-6 p-5 self-stretch rounded-2xl border-[1px] border-gray-200 bg-white">
        <p className="self-stretch text-gray-900 text-base font-bold">
          Who to follow
        </p>
        {suggestUsers.map((person, index) => (
          <UserSuggest key={index} person={person} />
        ))}
      </div>

      <div className="flex flex-col items-start gap-6 p-5 self-stretch rounded-2xl border-[1px] border-gray-200 bg-white">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <p className="self-stretch text-gray-900 text-ms font-bold">
            Top Ranking
          </p>
          <span className="self-stretch text-[#9CA3AF] text-base font-normal">
            reliability ranking
          </span>
          <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-xs font-medium text-transparent sm:text-ms">
            (This feature will be available soon.)
          </span>
        </div>
        <div className="flex flex-col h-5 p-0 justify-between items-start self-stretch">
          <div className="flex p-0 justify-between items-start self-stretch">
            <p className="text-[#9CA3AF] text-[13px] font-semibold">USER</p>
            <p className="text-[#9CA3AF] text-[13px] font-semibold">
              CONTRIBUTION
            </p>
          </div>
        </div>
        {mockData.map((person, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="">
                <Avatar
                  size="xs"
                  img={person.picture || defaultImages.noProfile}
                />
              </div>
              <div
                className="flex p-0 flex-col items-start gap-[1px]"
                style={{ flex: '1 0 0' }}>
                <p className="text-gray-900 text-base font-semibold">
                  {person.displayName || 'anonymous'}
                </p>
              </div>
              <p className="text-gray-900 text-xs font-medium">$100</p>
            </div>
          </div>
        ))}
        <p className="text-[#4B99F1] text-sm font-medium hover:!text-blue-700 cursor-pointer">
          Show more
        </p>
      </div>
    </div>
  );
}
