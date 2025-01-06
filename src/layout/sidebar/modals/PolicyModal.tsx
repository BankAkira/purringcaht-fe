// import { useDispatch, useSelector } from '../redux';
// import { initializeAccountSuccess } from '../redux/account';

import { Modal } from 'flowbite-react';
import { useDispatch, useSelector } from '../../../redux';
import { updateUserPolicy } from '../../../rest-api/user.ts';
import { User } from '../../../type/auth.ts';
import { initializeAccountSuccess } from '../../../redux/account.ts';
import { Logger } from '../../../helper/logger.ts';
import Button from '../../../component/button/Button.tsx';

const log = new Logger('PolicyModal');

type ModalPolicyProps = {
  show: boolean;
};

function PolicyModal({ show }: ModalPolicyProps) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.account);
  //   dispatch(initializeAccountSuccess({ user: { ...user!, isPolicy: true } }));

  const handleClickAgree = async () => {
    try {
      const resp = await updateUserPolicy();
      if (user && resp?.id) {
        const userInfo: User = {
          ...user,
          isPolicy: resp?.isPolicy,
        };
        dispatch(initializeAccountSuccess({ user: userInfo }));
      }
    } catch (error) {
      log.error(error);
    }
  };

  return (
    <Modal show={show}>
      <Modal.Header className="text-center">
        <span className="text-3xl">Purring Chat Policy</span>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            At Purring Chat, we respect your privacy and ensure that no personal
            data is stored. All messages and information are end-to-end
            encrypted (E2EE), allowing you to remain anonymous and express
            yourself freely.
            <br />
            <br />
            However, please do not use Purring Chat for{' '}
            <span className="text-red-700">
              {' '}
              illegal activities or anything against good morals.{' '}
            </span>{' '}
            Misuse can lead to consequences, and you will be responsible for
            your actions. Enjoy your freedom responsibly.
          </p>{' '}
        </div>
      </Modal.Body>
      <Modal.Footer className=" justify-center">
        <Button
          className="!flex items-center justify-center gap-2 !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none !text-lg h-[38px] !px-[28px]"
          onClick={handleClickAgree}
          label="I accept"
        />
      </Modal.Footer>
    </Modal>
  );
}

export default PolicyModal;
