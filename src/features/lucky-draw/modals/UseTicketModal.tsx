// import (Internal imports)
import { useState } from 'react';

import styled from 'styled-components';

// flowbite-react
import { Button, Modal } from 'flowbite-react';

// redux
import { useSelector } from '../../../redux';

// images
import BallotTickets from '../../../asset/images/lucky-draw/ballot-tickets.svg';
import minusSquare from '../../../asset/images/lucky-draw/minus-square.svg';
import addSquare from '../../../asset/images/lucky-draw/add-square.svg';

type Props = {
  openModal: boolean;
  onCloseModal: () => void;
  onUseTickets: (value: number) => void;
};

export default function UseTicketModal({
  openModal,
  onCloseModal,
  onUseTickets,
}: Props) {
  const { tickets } = useSelector(state => state.luckyDraw);

  const [value, setValue] = useState(0);

  const increment = () => {
    if (value >= tickets) return;
    setValue(prevValue => prevValue + 1);
  };

  const decrement = () => {
    setValue(prevValue => (prevValue > 0 ? prevValue - 1 : 0));
  };
  const handleMin = () => {
    setValue(0);
  };

  const handleMax = () => {
    setValue(tickets);
  };

  const handleUseTicket = () => {
    onUseTickets(value);
    setValue(0);
  };

  const handleCancel = () => {
    onCloseModal();
    setValue(0);
  };

  return (
    <>
      <Modal
        show={openModal}
        onClose={onCloseModal}
        size="2xl"
        className="custom-modal">
        <Modal.Header>Play Lucky Draw with Ballots</Modal.Header>
        <Modal.Body>
          <div className="h-[94px] w-[100%] p-5 bg-gradient-to-l from-[#ffecf1] to-[#fff1e6] rounded-[20px] shadow justify-between items-center inline-flex">
            <p>Your Available ballots</p>
            <div className=" justify-between items-center inline-flex gap-2">
              <img src={BallotTickets} alt="BALLOT_TICKETS" />
              <p className="text-5xl font-extrabold inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                x {tickets - value}
              </p>
            </div>
          </div>
          <div className="flex justify-center my-5">
            <img
              src={minusSquare}
              alt="minusSquare"
              className="hover:scale-110 cursor-pointer"
              onClick={decrement}
            />
            <InputStyle>
              <input
                type="number"
                className="w-16 text-center text-[20px] border-none focus:outline-none"
                value={value}
                disabled
              />
            </InputStyle>
            <img
              onClick={increment}
              src={addSquare}
              alt="addSquare"
              className="hover:scale-110 cursor-pointer"
            />
          </div>
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleMax}
              color="gray"
              className="sm:min-w-[80px]">
              Max
            </Button>
            <Button
              onClick={handleMin}
              color="gray"
              className="sm:min-w-[80px]">
              Reset
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            onClick={handleCancel}
            color="gray"
            pill
            className="sm:min-w-[100px]">
            Cancel
          </Button>
          <Button
            pill
            disabled={value <= 0}
            onClick={handleUseTicket}
            className="bg-orange-500 hover:bg-orange-600 sm:min-w-[120px]">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const InputStyle = styled.div`
  input {
    height: 100%;
  }

  input[type='number'] {
    background-color: transparent !important;
  }
`;
