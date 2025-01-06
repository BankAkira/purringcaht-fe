import { Table } from 'flowbite-react';
// import { FaTimes } from 'react-icons/fa';
// import { FaCheck } from 'react-icons/fa6';

const Lists = [
  {
    title: 'Private Storage Space',
    free: '500 MB',
    basic: '2 GB',
    premium: '10 GB',
    pro: '100 GB',
  },
  {
    title: 'ค่าธรรมเนียม ซื้อ Points',
    free: '1%',
    basic: '0.75%',
    premium: '0.5%',
    pro: '0.25%',
  },
  {
    title: 'Announcement',
    free: 'Gas',
    basic: 'Gas',
    premium: 'No Gas',
    pro: 'No Gas',
  },
  {
    title: 'Revenue fee',
    free: '10%',
    basic: '7%',
    premium: '5%',
    pro: '3%',
  },
];

export default function StorageTable() {
  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <Table.Head>
          <Table.HeadCell className="bg-gray-200">List</Table.HeadCell>
          <Table.HeadCell className="bg-gray-200">Free</Table.HeadCell>
          <Table.HeadCell className="bg-gray-200">Basic</Table.HeadCell>
          <Table.HeadCell className="bg-gray-200">Premium</Table.HeadCell>
          <Table.HeadCell className="bg-gray-200">Pro</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {Lists.map((item, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell> {item.title}</Table.Cell>
              <Table.Cell>{item.free}</Table.Cell>
              <Table.Cell>{item.basic}</Table.Cell>
              <Table.Cell>{item.premium}</Table.Cell>
              <Table.Cell>{item.pro}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
