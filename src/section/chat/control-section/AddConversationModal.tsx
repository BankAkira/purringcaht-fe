import { Modal } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';
import TextInput from '../../../component/text-input/TextInput';
import { useState } from 'react';
import { useDebounceText } from '../../../helper/hook/useDebounceText';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import ChatSkeleton from '../../../component/chat-skeleton/ChatSkeleton';
import TabWrapper from '../../../component/TabWrapper';
import Avatar from '../../../component/avatar/Avatar';
import trimAddress from '../../../helper/trim-address';
import { defaultImages } from '../../../constant/default-images';
import { ContactPayload } from '../../../type/contact';
import { useNavigate } from 'react-router-dom';
import useBoolean from '../../../helper/hook/useBoolean';
import { GlobalSearchType } from '../../../type/chat';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../helper/error-format';
import { queryParamsToString } from '../../../helper/query-param';
import { globalSearchApi } from '../../../rest-api/user';
import { ConversationMenuTab } from '../../../type/conversation';
import emptyContactImage from '../../../asset/images/empty-img/empty-user.svg';
import { useDispatch } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddConversationModal({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const [textKeyword, setTextKeyword] = useState('');
  const finalText = useDebounceText(textKeyword);
  const navigate = useNavigate();
  const [contacts, setContact] = useState(Array<ContactPayload>());
  const [isSearching, searchingStart, searchingDone] = useBoolean(true);

  useDeepEffect(() => {
    (async () => {
      if (open) {
        try {
          searchingStart();
          const queryParams = {
            page: 1,
            limit: 10,
            text: finalText,
            type: GlobalSearchType.CONTACT,
          };
          const search = await globalSearchApi<ContactPayload>(
            queryParamsToString(queryParams)
          );
          if (search?.results) {
            setContact(search?.results);
          }
        } catch (error) {
          toast.error(errorFormat(error).message);
        } finally {
          searchingDone();
        }
      }
    })();
  }, [finalText, open]);

  const onClickContact = (contact: ContactPayload) => {
    dispatch(toggleMobileControlSidebarAction());
    if (contact.conversation) {
      navigate(
        `/chat/${ConversationMenuTab.DIRECT}/${contact.conversation.id}`
      );
    } else {
      navigate(`/chat/${ConversationMenuTab.CONTACTS}/${contact.id}`);
    }

    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      dismissible
      className="modal-responsive"
      show={open}
      onClose={handleClose}
      size={'xl'}>
      <div className="items-center p-3 border-b border-gray-300 hide-close-btn-modal mb-1">
        <div className="text-lg font-bold text-gray-900 max-md:text-base">
          Your contacts
        </div>
        <small className="text-xs font-thin text-gray-400 text-muted">
          You can select your contacts and start a conversation.
        </small>
      </div>
      <Modal.Body className="!p-3">
        <div className="h-[50px]">
          <TextInput
            icon={HiSearch}
            id="search"
            name="search"
            type="search"
            placeholder="Search"
            onChange={e => setTextKeyword(e.target.value)}
            value={textKeyword}
          />
        </div>
        <p className="mb-3 mt-1 text-gray-500 font-normal">Friends</p>
        <div className="overflow-y-auto h-[32vh]" id="content-container">
          {isSearching ? (
            <SkeletonLoader />
          ) : (
            <>
              {!contacts.length && (
                <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400">
                  <img src={emptyContactImage} width={62} alt="empty chat" />
                  <div className="text-center px-4">
                    <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                      No Contacts
                    </p>
                    {/* <p className="text-sm font-normal text-[#9CA3AF] max-w-[280px]">Tap the '+' icon to add contact</p> */}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-start">
                {[...contacts].map((result, i) => (
                  <TabWrapper
                    key={result.id + i}
                    onClick={() => onClickContact(result)}
                    size="sm">
                    <Avatar
                      img={result.user.picture || defaultImages.noProfile}
                      name={
                        result.user.displayName ||
                        trimAddress(result.user.walletAddress)
                      }
                    />
                  </TabWrapper>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-1 ">
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
    </div>
  );
}
