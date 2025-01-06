// import (Internal imports)
import React, { useState } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

// react-draft-wysiwyg
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// react-dropzone
import { useDropzone } from 'react-dropzone';

// react-icons
import { FaUpload } from 'react-icons/fa6';
import { LuAlertTriangle } from 'react-icons/lu';
import { RiEdit2Line } from 'react-icons/ri';

// flowbite-react
import { Button, Modal, Label } from 'flowbite-react';

// helper functions
import useBoolean from '../../../helper/hook/useBoolean.ts';
import { Logger } from '../../../helper/logger';

// type definitions
import { CreatePostBugForm } from '../../../type/bug-bounty';

// redux
import { useDispatch } from '../../../redux';
import { addPost } from '../../../redux/bug-bounty';

// constant
import { convertFileToBase64 } from '../../../constant/file-utils';

// components
import TextInput from '../../../component/text-input/TextInput';
import ConfirmModal from '../../../component/@share/ConfirmModal';
import FullScreenLoader from '../../../component/FullScreenLoader.tsx';

import SliderFile from '../components/slider-file/SliderFile.tsx';

// APIs
import { createPostBugBountyApi } from '../../../rest-api/bug-bounty';

const log = new Logger('PostBugModal');

type Props = {
  openModal: boolean;
  onCloseModal: () => void;
  onPostBug: (data: CreatePostBugForm) => Promise<void>;
};

type AxiosError = {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
};

export default function PostBugModal({
  openModal,
  onCloseModal,
  onPostBug,
}: Props) {
  const dispatch = useDispatch();

  const [isLoading, loadingStart, loadingDone] = useBoolean(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [formData, setFormData] = useState<CreatePostBugForm>({
    title: '',
    detail: '',
    files: [],
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const openConfirmModal = () => {
    setIsOpenConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const hasTextContent = (contentState: ContentState) => {
    const blocks = convertToRaw(contentState).blocks;
    return blocks.some(block => block.text.trim() !== '');
  };

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);

    const contentState = state.getCurrentContent();
    if (hasTextContent(contentState)) {
      const detail = JSON.stringify(convertToRaw(contentState));
      setFormData(prevData => ({
        ...prevData,
        detail,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        detail: '',
      }));
    }
  };

  // DropFile //
  const onDrop = async (acceptedFiles: File[]) => {
    if (formData.files.length + acceptedFiles.length > 5) {
      setErrorModalMessage('You can only upload up to 5 files.');
      setIsOpenErrorModal(true);
      return;
    }

    const base64Files = await Promise.all(
      acceptedFiles.map(async file => {
        const base64 = await convertFileToBase64(file);
        return {
          base64,
          optional: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            lastModified: file.lastModified,
          },
        };
      })
    );

    setFormData(prevData => ({
      ...prevData,
      files: [...prevData.files, ...base64Files],
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  // DeleteFile //
  const handleDeleteFile = (fileNameToDelete: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      files: prevFormData.files.filter(file => {
        if ('base64' in file) {
          return file.optional.fileName !== fileNameToDelete;
        } else {
          return file.name !== fileNameToDelete;
        }
      }),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openConfirmModal();
  };

  const handleConfirmPostBug = async () => {
    try {
      loadingStart();
      const response = await createPostBugBountyApi(formData);
      if (response) {
        log.debug('Bug report created successfully', response);
        dispatch(addPost(response));
        await onPostBug(formData);

        // Reset form
        setFormData({
          title: '',
          detail: '',
          files: [],
        });

        setEditorState(EditorState.createEmpty());
        closeConfirmModal();
        onCloseModal();
      }
    } catch (error: unknown) {
      loadingDone();
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        if (status === 403) {
          setErrorModalMessage(data.message);
        } else {
          setErrorModalMessage(
            'An error occurred while creating the bug report.'
          );
        }
      } else {
        setErrorModalMessage('An unknown error occurred.');
      }
      setIsOpenErrorModal(true);
    } finally {
      loadingDone();
    }
  };

  const displayEditor = () => {
    return (
      <CustomEditor>
        <Editor
          wrapperClassName="custom-editor-wrapper"
          editorClassName="custom-editor"
          toolbarClassName="custom-toolbar"
          placeholder={'Provide a detailed description here...'}
          toolbar={{
            options: ['inline', 'colorPicker', 'emoji'],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            colorPicker: {
              colors: [
                'rgb(97,189,109)',
                'rgb(26,188,156)',
                'rgb(84,172,210)',
                'rgb(44,130,201)',
                'rgb(147,101,184)',
                'rgb(71,85,119)',
                'rgb(204,204,204)',
                'rgb(65,168,95)',
                'rgb(0,168,133)',
                'rgb(61,142,185)',
                'rgb(41,105,176)',
                'rgb(85,57,130)',
                'rgb(40,50,78)',
                'rgb(0,0,0)',
                'rgb(247,218,100)',
                'rgb(251,160,38)',
                'rgb(235,107,86)',
                'rgb(226,80,65)',
                'rgb(163,143,132)',
                'rgb(239,239,239)',
                'rgb(255,255,255)',
                'rgb(250,197,28)',
                'rgb(243,121,52)',
                'rgb(209,72,65)',
                'rgb(184,49,47)',
                'rgb(124,112,107)',
                'rgb(209,213,216)',
              ],
            },
          }}
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
        />
      </CustomEditor>
    );
  };

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Modal
          show={openModal}
          onClose={onCloseModal}
          size="2xl"
          className="custom-modal">
          <Modal.Header>Create a Report or Suggestion</Modal.Header>
          <form onSubmit={handleSubmit}>
            <Modal.Body style={{ scrollbarColor: 'auto' }}>
              <div className="space-y-4">
                <div className="flex flex-col w-full gap-2">
                  <Label className="text-gray-900" value="Title" />
                  <TextInput
                    icon={RiEdit2Line}
                    color=""
                    placeholder="Write a brief title here..."
                    value={formData.title}
                    name="title"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="detail" value="Description" />
                  {displayEditor()}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="files" value="Attachments" />
                  <div
                    {...getRootProps()}
                    className="flex h-38 w-full cursor-pointer flex-col items-center justify-center rounded-[1rem] border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-2 pb-6 pt-5">
                      <FaUpload className="w-5 h-5 text-[#6B7280]" />
                      <p className="text-gray-500 text-sm font-normal mb-2 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        or drag and drop
                      </p>
                    </div>
                  </div>
                  <Label className="flex justify-between items-center text-gray-500 text-sm font-normal">
                    <p>Such as Videos, Images, File Document</p>
                    <span
                      className={classNames({
                        'text-red-500 font-bold': formData.files?.length === 5,
                        'text-orange-500': formData.files?.length === 4,
                        'text-yellow-500': formData.files?.length === 3,
                        'text-green-500': formData.files?.length === 2,
                        'text-blue-500': formData.files?.length === 1,
                      })}>
                      limit {formData.files?.length}/5
                    </span>
                  </Label>
                  {formData.files?.length > 0 && (
                    <SliderFile
                      files={formData.files}
                      handleDeleteFile={handleDeleteFile}
                    />
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
              <Button pill color="gray" onClick={onCloseModal}>
                Cancel
              </Button>
              <Button
                disabled={!formData.title || !formData.detail}
                pill
                className="bg-pink-orange hover:opacity-70"
                type="submit">
                Submit
              </Button>
              <ConfirmModal
                onConfirm={() => {
                  handleConfirmPostBug();
                  closeConfirmModal();
                }}
                openModal={isOpenConfirmModal}
                onCloseModal={closeConfirmModal}
                title="Confirm Submission"
                color="red"
                description="Are you sure you want to submit this report?"
              />
              <ErrorModal
                message={errorModalMessage}
                openModal={isOpenErrorModal}
                onCloseModal={() => setIsOpenErrorModal(false)}
              />
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </>
  );
}

// ErrorModal Component
type ErrorModalProps = {
  message: string;
  openModal: boolean;
  onCloseModal: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
  openModal,
  onCloseModal,
}) => {
  return (
    <Modal show={openModal} onClose={onCloseModal} size="md">
      <Modal.Header className="border-none">
        <div className="text-red-600 flex justify-center items-center text-2xl">
          <LuAlertTriangle className="!text-[50px] -mt-1" />
        </div>
      </Modal.Header>
      <Modal.Body className="!pt-0 text-center">
        <p className="text-gray-600 pt-6">{message}</p>
      </Modal.Body>
      <Modal.Footer className="flex justify-center border-none pt-4 pb-6">
        <Button
          pill
          className="w-[50%] bg-red-500 hover:bg-red-600"
          onClick={onCloseModal}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const CustomEditor = styled.div`
  .custom-editor-wrapper {
    border: 1px solid #e5e7eb;
    border-radius: 1rem !important;
    padding: 0 16px;
  }

  .custom-editor {
    min-height: 100px;
    max-height: 100px;
    overflow-y: auto;
    cursor: text;
  }

  .custom-toolbar {
    border-top: 1px solid #e5e7eb;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 8px;
  }
`;
