// import (Internal imports)

import classNames from 'classnames';

// react-icons
import { CgArrowsExchangeAltV } from 'react-icons/cg';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { IoInformationCircle } from 'react-icons/io5';

// flowbite-react
import { Badge, Table, Tooltip } from 'flowbite-react';

// helper functions
import useResponsive from '../../helper/hook/useResponsive.ts';

// components
import IconButton from '../../component/icon-button/IconButton';

const mockData = [
  {
    invoiceId: `#${(Math.random() * 10000000).toFixed(0)}`,
    date: '01 May 2023',
    amount: '$9,99',
    status: 'PENDING',
  },
  {
    invoiceId: `#${(Math.random() * 10000000).toFixed(0)}`,
    date: '01 Apr 2023',
    amount: '$9,99',
    status: 'PAID',
  },
  {
    invoiceId: `#${(Math.random() * 10000000).toFixed(0)}`,
    date: '01 Mar 2023',
    amount: '$9,99',
    status: 'PAID',
  },
  {
    invoiceId: `#${(Math.random() * 10000000).toFixed(0)}`,
    date: '01 Jan 2023',
    amount: '$9,99',
    status: 'PAID',
  },
];

const statusTagComponent = (status: string) => {
  if (status === 'PENDING') {
    return (
      <Badge color="warning" className="text-[#723B13] text-center" size="xs">
        Pending
      </Badge>
    );
  } else {
    return (
      <Badge
        color="success"
        className="text-[#0E9F6E] capitalize text-center"
        size="xs">
        Paid
      </Badge>
    );
  }
};

export default function Billing() {
  const { isTabletOrMobile } = useResponsive();

  return (
    <div
      className={classNames('h-screen flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 max-lg:text-xl flex-wrap">
        Billing history{' '}
        <Tooltip content="Review your payment history" placement="right">
          <IconButton
            color="#9CA3AF"
            height={18}
            icon={IoInformationCircle}
            onClick={() => {}}
            width={18}
          />
        </Tooltip>
        <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
          (This feature will be available soon.)
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-[#FFF1E6]">INVOICE ID</Table.HeadCell>
            <Table.HeadCell className="bg-[#FFF1E6]">
              <div className="flex items-center gap-1">
                DATE{' '}
                <CgArrowsExchangeAltV className="text-[14px] -mt-[2px] cursor-pointer" />
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#FFF1E6]">
              <div className="flex items-center gap-1">
                AMOUNT{' '}
                <CgArrowsExchangeAltV className="text-[14px] -mt-[2px] cursor-pointer" />
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#FFF1E6]">
              <div className="flex items-center gap-1">
                STATUS{' '}
                <CgArrowsExchangeAltV className="text-[14px] -mt-[2px] cursor-pointer" />
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#FFF1E6]">
              <span className="sr-only">
                <HiOutlineDotsHorizontal />
              </span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {mockData.map((item, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.invoiceId}
                </Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.amount}</Table.Cell>
                <Table.Cell>
                  <div className="flex">{statusTagComponent(item.status)}</div>
                </Table.Cell>
                <Table.Cell>
                  <HiOutlineDotsHorizontal className="p-1 rounded-full text-[24px] hover:bg-gray-100 transition cursor-pointer" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
