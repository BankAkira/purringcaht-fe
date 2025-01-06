import { ChangeEvent, useState } from 'react';
import { Button, Modal, Label, FileInput } from 'flowbite-react';
import { CryptoECIES } from '../../../helper/rsa-crypto';
import { ethers } from 'ethers';

import Datepicker from '../../../component/datepicker/Datepicker';
import Select from '../../../component/select/Select';
import TextInput from '../../../component/text-input/TextInput';
import TextArea from '../../../component/text-area/TextArea';

import { RiEdit2Line } from 'react-icons/ri';
//constant
import { topicOption } from '../../../constant/option-select';

import ConfirmDisputeModal from './ConfirmDisputeModal';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import RadioGroup from '../../../component/radio-group/RadioGroup';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { Dispute, DisputeForm } from '../../../type/dispute';

import { Logger } from '../../../helper/logger';
import { getAdminPlatform } from '../../../rest-api/user';
import { useSelector } from '../../../redux';
import { createDispute } from '../../../rest-api/dispute';
import { SelectedFileDispute } from '../../../type/message';
import { getFileOptional, getPdfPageCount } from '../../../helper/file';
import { fileToBase64 } from '../../../helper/crypto';
import { toast } from 'react-toastify';
import FullScreenLoader from '../../../component/FullScreenLoader';

const log = new Logger('DisputeModal');

type Props = {
  openModal: boolean;
  onCloseModal: () => void;
  onDispute: (data: Dispute) => void;
  conversationId: string;
  platform?: string;
};

const radios = [
  {
    id: '1',
    title: 'Accept the decision of the Admin as final and binding.',
    value: 'accept',
    defaultChecked: false,
  },
];

export default function DisputeModal({
  openModal,
  onCloseModal,
  onDispute,
  conversationId,
  platform,
}: Props) {
  const [fileDispute, setFileDispute] = useState<SelectedFileDispute[] | []>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const { chatSecret } = useSelector(state => state.message);

  const [formData, setFormData] = useState<DisputeForm>({
    topic: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    userAdminDisputes: [
      {
        adminSecretKey: '',
        adminId: '',
      },
    ],
  });
  const [isTopicOther, setTopicOther] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isHaveAdmin, setIsHaveAdmin] = useState(false);
  const openConfirmModal = () => {
    setIsOpenConfirmModal(true);
  };

  const setAdminSecretKey = (
    newSecretKey: string,
    adminId: string,
    index: number
  ) => {
    setFormData(prevFormData => {
      if (!prevFormData.userAdminDisputes) {
        return prevFormData;
      }
      const updatedUserAdminDisputes = [...prevFormData.userAdminDisputes];
      updatedUserAdminDisputes[index] = {
        ...updatedUserAdminDisputes[index],
        adminSecretKey: newSecretKey,
        adminId,
      };
      return {
        ...prevFormData,
        userAdminDisputes: updatedUserAdminDisputes,
      };
    });
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
  };

  const getAdmin = async (platform = 'SB') => {
    try {
      const res = await getAdminPlatform(platform);
      if (res && chatSecret) {
        if (res.results.length > 0) setIsHaveAdmin(true);
        res.results.forEach((admin, index) => {
          const adminEncrypt = admin.encryptedUserSecrets[0];

          const adminPublicKey = Buffer.from(
            (adminEncrypt.publicKeyPrefix ? '02' : '03') +
              adminEncrypt.publicKeyX.slice(2),
            'hex'
          );

          const chatSecretEncryptedForAdmin = CryptoECIES.encrypt(
            adminPublicKey.toString('hex'),
            Buffer.from(chatSecret, 'hex')
          );

          const adminSecretKey = ethers.utils.hexlify(
            chatSecretEncryptedForAdmin
          );

          setAdminSecretKey(adminSecretKey, admin.id, index);
        });
      }
    } catch (error) {
      setIsHaveAdmin(false);
      log.error('get admin error', error);
    }
  };

  useDeepEffect(() => {
    getAdmin(platform);
  }, []);

  const closeConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeTopic = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (value === 'Others') {
      setTopicOther(true);
    } else {
      setTopicOther(false);
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      const filesArray = Array.from(files);

      const filesMap = filesArray.map(async (item: File) => {
        const count = await getPdfPageCount(item);
        const fileInfo: SelectedFileDispute = {
          base64: (await fileToBase64(item)).toString(),
          // base64: await fileToBase64(item).then(
          //   (data: string) => data.split(',')[1]
          // ),
          optional: { ...getFileOptional(item), pageCount: count },
        };

        return fileInfo;
      });
      const resolvedFiles = await Promise.all(filesMap);
      setFileDispute(prevFiles => [...prevFiles, ...resolvedFiles]);
    }
  };

  const handleDeleteFile = (index: number) => {
    setFileDispute(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleChangeStart = (date: Date) => {
    setFormData(prevData => ({
      ...prevData,
      startDate: date.toISOString(),
    }));
  };

  const handleChangeEnd = (date: Date) => {
    setFormData(prevData => ({
      ...prevData,
      endDate: date.toISOString(),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !selectedRadio ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.title ||
      !formData.description ||
      !formData.topic ||
      !isHaveAdmin
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      files: fileDispute,
    }));
    openConfirmModal();
  };

  const handleConfirmDispute = async () => {
    setIsLoading(true);
    try {
      const resCreateDispute = await createDispute(conversationId, formData);
      onDispute(resCreateDispute);
      onCloseModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <FullScreenLoader />;

  return (
    <>
      <Modal
        show={openModal}
        onClose={onCloseModal}
        size="2xl"
        className="custom-modal">
        <Modal.Header>
          Dispute
          {isHaveAdmin ? (
            <p
              className="text-sm text-gray-500 mt-1"
              style={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#6B7280',
              }}>
              Please provide your information clearly to ensure the review
              process goes smoothly and without confusion.
            </p>
          ) : (
            <p
              className="text-sm text-gray-500 mt-1"
              style={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#d73810',
              }}>
              Sorry, we can't find any admin.
            </p>
          )}
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div className="flex flex-col w-full gap-2">
                <Label className="text-gray-900" value="Topic to dispute" />
                <Select
                  className="select-custom"
                  style={{
                    borderRadius: '100px',
                    height: '40px',
                    padding: '10px 16px',
                  }}
                  color={''}
                  options={topicOption}
                  name="topic"
                  onChange={handleChangeTopic}
                  required
                />
                {isTopicOther && (
                  <TextInput
                    icon={RiEdit2Line}
                    color={''}
                    placeholder="Write topic other"
                    name="topic"
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
              <div className="flex flex-col w-full gap-2">
                <Label className="text-gray-900" value="Title of the dispute" />
                <TextInput
                  icon={RiEdit2Line}
                  color={''}
                  placeholder="Write title of the dispute"
                  value={formData.title}
                  name="title"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Label
                  htmlFor="description"
                  value="Description of the dispute"
                />
                <TextArea
                  className="textarea-custom"
                  icon={RiEdit2Line}
                  color={''}
                  placeholder="Write additional detail here ..."
                  value={formData.description}
                  name="description"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-col w-full gap-2">
                  <Label
                    htmlFor="startDate"
                    value="Start time of the incident"
                  />
                  <Datepicker
                    style={{
                      borderRadius: '100px',
                      height: '40px',
                      padding: '10px 16px',
                    }}
                    id="startDate"
                    onChange={handleChangeStart}
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="endDate" value="End time of the incident" />
                  <Datepicker
                    style={{
                      borderRadius: '100px',
                      height: '40px',
                      padding: '10px 16px',
                    }}
                    id="endDate"
                    onChange={handleChangeEnd}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <Label htmlFor="endDate" value="Evidenced file" />
                <Label className="flex h-38 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                  <FileInput
                    multiple
                    id="dropzone-file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
                <Label
                  className="text-gray-500"
                  style={{
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '17.5px',
                    color: '#6B7280',
                  }}>
                  Such as Videos, Images, File Document
                </Label>
                {fileDispute.length > 0 && (
                  <div className="flex flex-col w-full gap-2 bg-orange-300/15 p-3">
                    {fileDispute.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between w-full mt-2">
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold">
                            {file.optional?.fileName}
                          </p>
                          <p className="text-xs text-gray-500">{`${file.optional?.fileType} - ${((file.optional?.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB`}</p>
                        </div>
                        <button
                          className="ml-2 px-2 py-1 bg-red-500/60 text-white rounded hover:bg-red-600"
                          onClick={() => handleDeleteFile(index)}>
                          <MdOutlineDeleteOutline className="text-[16px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <RadioGroup
                radios={radios}
                name="accept"
                onChange={handleRadioChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-end">
            <Button pill color="gray" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              pill
              className="bg-orange-500 hover:bg-orange-600"
              disabled={!selectedRadio || !isHaveAdmin}
              type="submit">
              Send
            </Button>
            <ConfirmDisputeModal
              onConfirm={handleConfirmDispute}
              openModal={isOpenConfirmModal}
              onCloseModal={closeConfirmModal}
              color="red"
              size="md"
              title={{
                label: 'Are you sure you want to dispute this conversation?',
                className:
                  'font-semibold text-lg leading-6 text-red-500 text-center',
              }}
              description={{
                label:
                  'If you file a dispute, this conversation will be frozen for inspection. During this time,',
                className: 'font-normal text-sm leading-6 text-gray-500',
              }}
              subDescription={{
                label:
                  'you will not be able to delete, send, or receive further messages, except for the dispute result.',
                className: 'font-normal text-sm leading-6 text-red-500',
              }}
              buttons={{
                yes: {
                  label: 'Yes, I’m sure',
                  onClick: () => alert('Yes button clicked'),
                  className: 'text-white-500 border-red-500',
                },
                no: {
                  label: 'No, cancel',
                  onClick: () => alert('Yes button clicked'),
                  className: 'text-gray-500 border-gray-500',
                },
              }}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
