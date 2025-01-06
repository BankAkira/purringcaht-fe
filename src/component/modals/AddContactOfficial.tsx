import React, { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5'; // Close button icon
import { useDeepEffect } from '../../helper/hook/useDeepEffect';
import { MessageContentType, UserAdmin } from '../../type';
import { getUserOfficial } from '../../rest-api/user';
import { defaultImages } from '../../constant/default-images';
import OfficialIcon from '../../asset/icon/official/official-icon.png';
import {
  CryptoAES256,
  CryptoECIES,
  generateSecret,
} from '../../helper/rsa-crypto';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from '../../redux';
import { encryptMessage } from '../../helper/crypto';
import { setIsOpenAddOfficialModal } from '../../redux/layout';
import { addConversationOfficial } from '../../rest-api/conversation';

const OfficialAccountModal: React.FC = () => {
  const { isOpenAddOfficialModal } = useSelector(state => state.layout);
  const [officialAccounts, setOfficialAccounts] = useState<
    UserAdmin | undefined
  >();
  const { user, userScheme } = useSelector(state => state.account);
  const dispatch = useDispatch();
  useDeepEffect(() => {
    if (isOpenAddOfficialModal) fetchUserOfficial();
  }, [isOpenAddOfficialModal]);

  const fetchUserOfficial = async () => {
    try {
      const official = await getUserOfficial();
      if (official) setOfficialAccounts(official);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddOffice = async () => {
    const chatSecret = generateSecret();

    try {
      if (officialAccounts) {
        const officialEncrypt = officialAccounts.encryptedUserSecrets[0];

        const officialPublicKey = Buffer.from(
          (officialEncrypt.publicKeyPrefix ? '02' : '03') +
            officialEncrypt.publicKeyX.slice(2),
          'hex'
        );
        const chatSecretEncryptedForOfficial = CryptoECIES.encrypt(
          officialPublicKey.toString('hex'),
          chatSecret
        );
        const officialSecretChatKey = ethers.utils.hexlify(
          chatSecretEncryptedForOfficial
        );
        const chatSecretEncryptedForMe = ethers.utils.hexlify(
          userScheme!.encrypt(chatSecret)
        );
        const textHello = 'Hello, ' + user?.displayName + '!';
        const chatScheme = new CryptoAES256(chatSecret);

        const content = await encryptMessage(
          textHello,
          MessageContentType.TEXT,
          chatScheme
        );

        const dataTemp = {
          myEncryptedChatSecret: chatSecretEncryptedForMe,
          peerEncryptedChatSecret: officialSecretChatKey,
          peerUserId: officialAccounts.id,
          officialId: officialAccounts.id,
          content: content,
        };
        const conversation = await addConversationOfficial(dataTemp);
        if (conversation) {
          console.log('conversation official', conversation);
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      dispatch(setIsOpenAddOfficialModal(false));
    }
  };

  return (
    isOpenAddOfficialModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => dispatch(setIsOpenAddOfficialModal(false))}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <IoCloseSharp size={24} />
          </button>

          {/* Avatar and Account Information */}
          <div className="flex flex-col items-center">
            <img
              src={officialAccounts?.picture || defaultImages.noProfile} // Replace with the actual avatar URL
              alt="PurringChat Official"
              className="w-24 h-24 rounded-full mb-4"
            />
            <div className="flex gap-2 align-middle items-center">
              <img src={OfficialIcon} width={20} alt="official" />
              <h2 className="text-xl font-bold text-gray-900">
                {officialAccounts?.displayName}
              </h2>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <span className="mr-2">ID: {officialAccounts?.displayId}</span>
            </div>
          </div>

          {/* Add Official Account Button */}
          <div className="mt-6">
            <button
              onClick={handleAddOffice}
              className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-600">
              Add official Accounts
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default OfficialAccountModal;
