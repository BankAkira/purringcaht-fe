import { Button, Modal } from 'flowbite-react';
import { IoClose } from 'react-icons/io5';
import TextInput from '../../../../../component/text-input/TextInput';
import { RiEdit2Line } from 'react-icons/ri';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useBoolean from '../../../../../helper/hook/useBoolean';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../../../helper/error-format';
import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';
import {
  createUserNickname,
  updateUserNickname,
} from '../../../../../rest-api/contact';
import { ContactPayload } from '../../../../../type/contact';
import { useDispatch } from '../../../../../redux';
import {
  loadResultsAction,
  startLoadingAction,
} from '../../../../../redux/contact';

type NickNameFormType = {
  nickname?: string;
};

const nickNameFormValidationSchema = yup.object<NickNameFormType>().shape({
  nickname: yup.string().nullable().optional(),
});

type Props = {
  contact: ContactPayload | null;
  isOpen: boolean;
  handleClose: () => void;
  onSave: () => Promise<void>;
};

export default function NickNameModal({
  contact,
  isOpen,
  handleClose,
  onSave,
}: Props) {
  const dispatch = useDispatch();
  const nickNameFormInitialValues: NickNameFormType = {
    nickname: '',
  };

  const formik = useFormik({
    initialValues: nickNameFormInitialValues,
    validationSchema: nickNameFormValidationSchema,
    onSubmit: values => {
      handleForMikSubmit(values);
    },
  });
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;

  const [isSubmitting, trueIsSubmitting, falseIsSubmitting] = useBoolean(false);
  const handleForMikSubmit = async (values: NickNameFormType) => {
    try {
      trueIsSubmitting();
      if (contact) {
        let resp;
        if (contact?.userNickname) {
          resp = await updateUserNickname(contact?.userId, values.nickname);
        } else {
          resp = await createUserNickname(contact?.userId, values.nickname);
        }
        if (resp) {
          toast.success('Save nick name successfully');
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      dispatch(startLoadingAction());
      dispatch(loadResultsAction());
      await onSave();
      onClose();
      falseIsSubmitting();
    }
  };

  const onClose = () => {
    resetForm();
    handleClose();
  };

  useDeepEffect(() => {
    setFieldValue('nickname', contact?.userNickname);
  }, [isOpen]);

  return (
    <Modal show={isOpen} size={'md'} onClose={() => !isSubmitting && onClose()}>
      <Modal.Header>
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-gray-900 text-lg font-semibold">Nick name</div>
          <IoClose
            className="-mt-[1px] text-gray-500 cursor-pointer hover:text-gray-400 transition"
            onClick={() => !isSubmitting && onClose()}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col w-full py-2">
          <TextInput
            icon={RiEdit2Line}
            placeholder="You can set a nickname here"
            disabled={isSubmitting}
            value={values.nickname || ''}
            name="nickname"
            onChange={handleChange}
            autoFocus={false}
            onBlur={handleBlur}
            color={!!touched?.nickname && !!errors?.nickname ? 'failure' : ''}
            helperText={touched?.nickname && errors?.nickname}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="!py-3">
        <Button
          color="gray"
          onClick={() => onClose()}
          fullSized
          pill
          disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400"
          onClick={() => handleSubmit()}
          fullSized
          pill
          disabled={isSubmitting}
          isProcessing={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
