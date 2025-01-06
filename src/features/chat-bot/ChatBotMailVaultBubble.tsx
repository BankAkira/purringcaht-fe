import {
  ContentMessageChatBotMailVault,
  MessagePayload,
} from '../../type/message';
import { useDispatch } from '../../redux';
import {
  handleOpenModalDeleteMailVault,
  handleVerifyAlive,
} from '../../redux/chatbot-mail-vault';
import axios from '../../helper/axios';
import environment from '../../environment';
import { useEffect, useState } from 'react';
type BubbleProps = {
  message: MessagePayload;
  isSender?: boolean;
  isLoading?: boolean;
  onOpenLightbox?: (index: number) => void;
  index?: number;
  content: ContentMessageChatBotMailVault;
  data?: any;
};

export default function ChatBotMailVaultBubble({ content }: BubbleProps) {
  const [img, setImg] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const dispatch = useDispatch();
  const isRecipe = content.data?.participant.filter(
    (item: any) => item.isOwner === false
  )[0];

  useEffect(() => {
    if (isRecipe) {
      imageAvatar(isRecipe.userId);
    }

    async function imageAvatar(id: string) {
      const url = `${environment.apiUrl}/users/${id}`;
      const { data } = await axios.get(url);
      // console.log(data);

      setRecipeName(data.displayName);
      setImg(data.picture);
    }
  }, [isRecipe]);

  return (
    <>
      {/* Buttons */}
      <div className=" mb-3">
        <div className="flex pr-2 ">
          <div className="flex-1">
            <div className="text-lg font-semibold mb-2">How are you doing?</div>
            <div className="text-sm">
              From: MailVault
              <br />
              To: {recipeName}
              <br />
            </div>
          </div>
          <div className="flex-none items-center">
            {img && (
              <img src={img} alt="avatar" className="w-16 h-16 rounded-full" />
            )}
          </div>
        </div>
        <div className="text-sm">
          Subject:{' '}
          {content.data && (
            <span className="font-semibold">
              {content.data.mailConversationMessage[0].subject}
            </span>
          )}
          <br />
          {content?.data?.mailConversationMessage[0].memo && (
            <>
              Memo:{' '}
              {content.data && (
                <span className="font-semibold">
                  {content.data.mailConversationMessage[0].memo}
                </span>
              )}
              <br />
            </>
          )}
          Please click{' '}
          <span className="font-bold text-white"> 'I'm fine' </span> to
          acknowledge.
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => dispatch(handleVerifyAlive(`I'm fine`, content))}
          className="bg-white text-pink-500 rounded-full py-2 px-6 hover:bg-pink-600 hover:text-white transition">
          I'm fine
        </button>
        <button
          onClick={() =>
            dispatch(
              handleOpenModalDeleteMailVault('Delete this mail?', content)
            )
          }
          className="border border-white rounded-full py-2 px-4 text-white hover:bg-white hover:text-orange-400 transition">
          Delete this mail
        </button>
      </div>
    </>
  );
}
