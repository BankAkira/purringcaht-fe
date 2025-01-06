import { useState } from 'react';
import Avatar from '../../../component/avatar/Avatar';
import Button from '../../../component/button/Button.tsx';
import { defaultImages } from '../../../constant/default-images.ts';

import { useNavigate } from 'react-router-dom';
import { followUser } from '../../../rest-api/follow.ts';
import { SuggestUser } from '../../../type/user.ts';
import { useDispatch } from '../../../redux/index.ts';
import { getSuggestUser } from '../../../redux/follow.ts';
import { Logger } from '../../../helper/logger.ts';
const log = new Logger('UserSuggest');

type PromptUserSuggest = {
  person: SuggestUser;
};

export default function UserSuggest({ person }: PromptUserSuggest) {
  const [isFollow, setIsFollow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const follow = async () => {
    if (!person.id) return;
    try {
      setIsFollow(!isFollow);
      const res = await followUser({ followingUserId: person.id });
      if (res) {
        dispatch(getSuggestUser());
        setIsFollow(false);
      }
    } catch (error) {
      log.error('error', error);
    }
  };

  const goToProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <div className="flex items-start gap-[10px] self-stretch">
        <div className="cursor-pointer" onClick={() => goToProfile(person.id)}>
          <Avatar size="xs" img={person.picture || defaultImages.noProfile} />
        </div>
        <div
          className="flex flex-col items-start gap-[1px] cursor-pointer"
          style={{ flex: '1 0 0' }}>
          <p
            className="text-gray-900 text-base font-semibold"
            onClick={() => goToProfile(person.id)}>
            {person.displayName || 'anonymous'}
          </p>
          <span className="self-stretch text-gray-500 text-xs font-normal">
            Following:{' '}
            {(person?._count?.followingUser || 0) + (isFollow ? 1 : 0)}
          </span>
        </div>
        <Button
          onClick={() => follow()}
          label={
            <p className="text-gray-900 text-[12px] font-medium">
              {isFollow ? 'Following' : 'Follow'}
            </p>
          }
        />
      </div>
    </div>
  );
}
