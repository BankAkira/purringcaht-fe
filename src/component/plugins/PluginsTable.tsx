import { Table } from 'flowbite-react';
import { defaultImages } from '../../constant/default-images';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Button from '../button/Button';
import { useNavigate } from 'react-router-dom';
import useResponsive from '../../helper/hook/useResponsive';

const mockArray = ['1', '2', '3', '4'];

export default function PluginsTable() {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useResponsive();
  return (
    <Table>
      <Table.Body className="divide-y">
        {mockArray.map((_, index) => (
          <Table.Row
            key={index}
            className="bg-white dark:border-gray-700 dark:bg-gray-800 !border-0">
            <Table.Cell className="!p-0 !pb-4 !w-[56px] max-lg:!w-[32px]">
              {!isTabletOrMobile ? (
                <img
                  src={defaultImages.logoSB}
                  width="56px"
                  height="56px"
                  className="rounded-lg bg-black p-1 grayscale brightness-[2]"
                  alt=""
                />
              ) : (
                <img
                  src={defaultImages.logoSB}
                  width="30px"
                  height="30px"
                  className="rounded-lg bg-black p-1 grayscale brightness-[2]"
                  alt=""
                />
              )}
            </Table.Cell>
            <Table.Cell className="!p-0 !pb-4 !px-2 !max-w-[150px]">
              <div
                className="transition cursor-pointer"
                onClick={() => navigate(`/plugins/${'1234'}`)}>
                <div className="text-base font-semibold pb-1 max-lg:text-sm line-clamp-2">
                  Background Check by Social Bureau
                </div>
                <div className="text-xs font-normal text-gray-400 line-clamp-2 hidden lg:block">
                  Allows you to verify the social credibility and crime report
                  status of users and their associated wallets. This proactive
                  approach to digital interaction ensures a safer and more
                  reliable communication experience.
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="!p-0 !pb-4">
              <div className="text-sm font-normal text-gray-400 text-center max-lg:text-[11px]">
                Rating 4.9/5
              </div>
            </Table.Cell>
            <Table.Cell className="!p-0 !pb-4 max-lg:hidden">
              <div className="text-sm font-normal text-gray-400 text-center max-lg:text-[11px]">
                201k used
              </div>
            </Table.Cell>
            <Table.Cell className="!p-0 !pb-4 w-[120px]">
              <div className="flex justify-center">
                <Button
                  className="!flex items-center justify-center gap-2 !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none max-lg:max-w-[80px] max-lg:max-h-[26px] max-lg:!p-2 max-lg:!text-[11px]"
                  label="Activate"
                  onClick={() => {}}
                />
              </div>
            </Table.Cell>
            <Table.Cell className="!p-0 !pb-4 max-lg:hidden">
              <div className="flex justify-center">
                <HiOutlineDotsHorizontal />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
