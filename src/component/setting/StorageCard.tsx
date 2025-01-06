import { Card } from 'flowbite-react';
import { FaCheck } from 'react-icons/fa6';
import Button from '../button/Button';
import classNames from 'classnames';

type Props = {
  type: 'FREE' | 'BASIC' | 'PREMIUM' | 'PRO';
};

export default function StorageCard({ type }: Props) {
  return (
    <Card
      className={classNames(
        type === 'BASIC' ? ' border-[#FE7601] border-[4px] ' : ' ',
        ' text-center w-full rounded-[16px]'
      )}>
      <span className="text-2xl font-semibold">
        {type === 'FREE'
          ? 'FREE'
          : type === 'BASIC'
            ? 'BASIC'
            : type === 'PREMIUM'
              ? 'PREMIUM'
              : 'PRO'}
      </span>
      <div className="leading-none text-5xl font-extrabold my-4">
        {type === 'BASIC'
          ? '$3'
          : type === 'PREMIUM'
            ? '$15'
            : type === 'PRO'
              ? '$30'
              : '0'}{' '}
        <span className="text-lg font-medium text-gray-500">/Yearly</span>
      </div>
      {type === 'BASIC' ? (
        <Button
          className="flex items-center justify-center gap-2 text-white bg-gradient-to-br from-pink-500 to-orange-400"
          label="Get started"
          onClick={() => {}}
          variant="primary"
          size="lg"
        />
      ) : (
        <Button
          className="flex items-center justify-center gap-2"
          label="Get started"
          borderGradient={{
            fromColor: '#fd4077',
            toColor: '#fe7601',
            rounded: '9999px',
          }}
          onClick={() => {}}
        />
      )}

      <div className="text-[14px] font-normal flex items-center gap-2 mt-4">
        <FaCheck className="text-green-500" />{' '}
        <div className="text-left">
          Private Storage Space :{' '}
          <span className="font-semibold">
            {type === 'BASIC'
              ? '2 GB'
              : type === 'PREMIUM'
                ? '10 GB'
                : type === 'PRO'
                  ? '100 GB'
                  : '500 MB'}
          </span>
        </div>
      </div>
      <div className="text-[14px] font-normal flex items-center gap-2">
        <FaCheck className="text-green-500" />{' '}
        <div className="text-left">
          ค่าธรรมเนียม ซื้อ Point :{' '}
          <span className="font-semibold">
            {type === 'BASIC'
              ? '0.75'
              : type === 'PREMIUM'
                ? '0.5'
                : type === 'PRO'
                  ? '0.25'
                  : '1'}
            %
          </span>
        </div>
      </div>
      <div className="text-[14px] font-normal flex items-center gap-2">
        <FaCheck className="text-green-500" />{' '}
        <div className="text-left">
          Announcement :{' '}
          <span className="font-semibold">
            {type === 'FREE' || type === 'BASIC' ? 'Gas' : 'No Gas'}{' '}
          </span>
        </div>
      </div>
      <div className="text-[14px] font-normal flex items-center gap-2">
        <FaCheck className="text-green-500" />{' '}
        <div className="text-left">
          Revenue fee :{' '}
          <span className="font-semibold">
            {type === 'BASIC'
              ? '7'
              : type === 'PREMIUM'
                ? '5'
                : type === 'PRO'
                  ? '3'
                  : '10'}
            %
          </span>
        </div>
      </div>
    </Card>
  );
}
