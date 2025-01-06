import { useState } from 'react';
import { Button, Modal, Label } from 'flowbite-react';

import TextArea from '../../../component/text-area/TextArea';
import { toast } from 'react-toastify';
import { RiEdit2Line } from 'react-icons/ri';

import ConfirmModal from '../../../component/@share/ConfirmModal';
import Select from '../../../component/select/Select';
import { Dispute, ResultDisputeForm } from '../../../type/dispute';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';

type Props = {
  openModal: boolean;
  onCloseModal: () => void;
  onResultDispute: (data: ResultDisputeForm) => void;
  dispute: Dispute;
};

export default function DisputeResolutionModal({
  openModal,
  onCloseModal,
  onResultDispute,
  dispute,
}: Props) {
  const [formData, setFormData] = useState<ResultDisputeForm>({
    disputeId: '',
    disputeInformationId: '',
    resultDisputeId: '',
    date: new Date().toDateString(),
    detail: {
      result: '',
      reason: '',
      consequence: '',
    },
    userWonId: '',
  });

  const [winterOption, setWinterOption] = useState<
    { value: string; label: string }[]
  >([]);

  useDeepEffect(() => {
    if (dispute && dispute?.disputeInformations?.length) {
      setWinterOption([
        { value: '', label: 'Select Winter' },
        {
          value: dispute.plaintiffId,
          label: 'in favor of ' + dispute.plaintiff?.displayName || 'Plaintiff',
        },
        {
          value: dispute.defendantId,
          label: 'in favor of ' + dispute.defendant?.displayName || 'Defendant',
        },
        { value: 'draw', label: 'in favor of both' },
      ]);

      setFormData(prevData => ({
        ...prevData,
        disputeId: dispute.id,
        disputeInformationId:
          dispute.disputeInformations[dispute.disputeInformations.length - 1]
            .id,
        date: new Date().toDateString(),
        resultDisputeId:
          dispute.ResultDispute[dispute.ResultDispute.length - 1].id,
      }));
    }
  }, [dispute]);

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const openConfirmModal = () => {
    setIsOpenConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const keys = name.split('.');
      if (keys.length > 1) {
        const [outerKey, innerKey] = keys;
        return {
          ...prevData,
          [outerKey]: {
            ...(prevData[outerKey as keyof ResultDisputeForm] as object),
            [innerKey]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.userWonId === 'draw') delete formData.userWonId;
    if (
      !formData.resultDisputeId ||
      !formData.detail.consequence ||
      !formData.detail.result ||
      !formData.detail.reason
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    openConfirmModal();
  };

  const handleConfirmDispute = async () => {
    try {
      onResultDispute(formData);
      onCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        onClose={onCloseModal}
        size="2xl"
        className="custom-modal">
        <Modal.Header>
          Dispute Resolution Summary
          <p
            className="text-sm text-gray-500 mt-1"
            style={{
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#6B7280',
            }}>
            Dispute Resolution Summary from the admin.
          </p>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div className="flex flex-col w-full gap-2">
                <Label className="text-gray-900" value="Winner Selection" />
                <Select
                  className="select-custom"
                  style={{
                    borderRadius: '100px',
                    height: '40px',
                    padding: '10px 16px',
                  }}
                  color={''}
                  options={winterOption}
                  value={formData.userWonId}
                  name="userWonId"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Label htmlFor="result" value="Result" />
                <TextArea
                  className="textarea-custom"
                  icon={RiEdit2Line}
                  color={''}
                  placeholder="e.g., I would instruct the seller to provide a refund or send a replacement box of coffee capsules containing the correct number of undamaged capsules."
                  value={formData.detail.result}
                  name="detail.result"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Label htmlFor="reason" value="Reason" />
                <TextArea
                  className="textarea-custom"
                  icon={RiEdit2Line}
                  color={''}
                  placeholder="e.g., I would also remind the seller that customer satisfaction and trust are crucial for their business and that handling such issues fairly is important."
                  value={formData.detail.reason}
                  name="detail.reason"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Label htmlFor="consequences" value="Consequences" />
                <TextArea
                  className="textarea-custom"
                  icon={RiEdit2Line}
                  color={''}
                  placeholder="e.g., I would instruct the seller to provide a refund or send a replacement box of coffee capsules containing the correct number of undamaged capsules."
                  value={formData.detail.consequence}
                  name="detail.consequence"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-end">
            <Button pill color="gray" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              disabled={!formData.userWonId}
              pill
              className="bg-orange-500 hover:bg-orange-600"
              type="submit">
              Send
            </Button>
            <ConfirmModal
              onConfirm={handleConfirmDispute}
              openModal={isOpenConfirmModal}
              onCloseModal={closeConfirmModal}
              title=""
              color="red"
              description={`Are you sure you want to dispute this conversation? If you file a dispute, this conversation will be frozen for inspection. During this time, you will not be able to delete, send, or receive further messages, except for the dispute result.`}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
