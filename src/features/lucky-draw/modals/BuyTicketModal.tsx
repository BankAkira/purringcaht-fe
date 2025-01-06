// flowbite-react
import { Button, Modal } from 'flowbite-react';

// redux
import { useSelector } from '../../../redux';
import { useState } from 'react';

// import CoinsCat from '../../../asset/icon/icons/coin-cat.png';
import PurrPointsToken from '../../../asset/icon/icons/PurrPointsToken.svg';

// images
import BallotTickets from '../../../asset/images/lucky-draw/ballot-tickets.svg';
import Swap from '../../../asset/images/lucky-draw/swap.svg';
import MinusSquare from '../../../asset/images/lucky-draw/minus-square.svg';
import AddSquare from '../../../asset/images/lucky-draw/add-square.svg';
import styled from 'styled-components';

type Props = {
  openModal: boolean;
  onCloseModal: () => void;
  onBuyTicket: (value: number) => void;
};

const priceTicket = 0.01;

export default function BuyTicketModal({
  openModal,
  onCloseModal,
  onBuyTicket,
}: Props) {
  const { points } = useSelector(state => state.userPoint);

  const [value, setValue] = useState(0);

  const increment = () => {
    if (Math.round(value * 100) >= Math.round(points * 100)) return;
    setValue(prevValue => prevValue + priceTicket);
  };

  const decrement = () => {
    setValue(prevValue =>
      prevValue > priceTicket ? prevValue - priceTicket : 0
    );
  };

  const handleMin = () => {
    setValue(0);
  };

  const handleMax = () => {
    setValue(points);
  };

  const handleBuyTicket = () => {
    onBuyTicket(Math.round(value * 100));
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
        <Modal.Header>Redeem Ballots</Modal.Header>
        <Modal.Body>
          <div className="h-[94px] w-[100%] p-5 bg-gradient-to-l from-[#ffecf1] to-[#fff1e6] rounded-[20px] shadow justify-between items-center inline-flex">
            <p>Your PurrPoints balance</p>
            <div className=" justify-between items-center inline-flex gap-2">
              <img
                src={PurrPointsToken}
                width={65}
                height={65}
                alt="COINS_CAT"
              />
              <p className="text-[#111928] text-2xl font-bold">
                {points.toFixed(3)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center self-stretch gap-2 mt-4">
            <img src={BallotTickets} alt="BALLOT_TICKETS" />
            <p className="text-5xl font-extrabold inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              x {Math.round(value * 100)}
            </p>
          </div>
          <div className="text-center">
            <span className="text-gray-500 text-sm">You can redeem </span>
            <span className="text-[#f05252] text-sm">
              {' '}
              {Math.round(points / priceTicket).toLocaleString()} ballots
            </span>
          </div>
          <div className="flex justify-center my-5">
            <img src={Swap} alt="SWAP" />
          </div>
          <div className="flex justify-center my-5">
            <img
              src={MinusSquare}
              alt="MINUS_SQUARE"
              className="hover:scale-110 cursor-pointer"
              onClick={decrement}
            />
            <InputStyle>
              <input
                type="number"
                className="w-[100px] text-center text-[20px] border-none focus:outline-none"
                value={parseFloat(value.toFixed(2))}
                disabled
              />
            </InputStyle>
            <img
              onClick={increment}
              src={AddSquare}
              alt="ADD_SQUARE"
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
            disabled={value <= 0}
            pill
            onClick={handleBuyTicket}
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
