import { useNavigate } from 'react-router-dom';
import Button from '../../component/button/Button';
import { FaChevronLeft } from 'react-icons/fa6';
import '../../asset/css/circle.scss';
import { Table } from 'flowbite-react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { defaultImages } from '../../constant/default-images';
import { PiLinkSimple } from 'react-icons/pi';
import { FaTwitter } from 'react-icons/fa6';
import { AiFillFacebook } from 'react-icons/ai';

export default function PluginDetail() {
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="py-6 px-4 flex flex-col gap-5 min-h-full overflow-auto bg-white">
      <div>
        <Button
          className="flex items-center justify-center gap-2 "
          label="Back"
          iconLeftSide={<FaChevronLeft />}
          borderGradient={{
            fromColor: '#fd4077',
            toColor: '#fe7601',
            rounded: '9999px',
            width: '100px',
          }}
          onClick={() => onBack()}
        />
      </div>
      <div
        className="min-h-[480px] rounded-xl flex justify-around items-center max-lg:min-h-[200px]"
        style={{
          background: 'rgb(254,118,1)',
          backgroundImage:
            'linear-gradient(90deg, rgba(254,118,1,1) 0%, rgba(253,64,119,1) 65%, rgba(200,63,155,1) 98%)',
        }}>
        <div className="flex flex-col gap-6 -translate-x-12 max-lg:transform-none text-center">
          <div className="text-[62px] font-bold text-white max-lg:text-[40px] max-md:text-[28px]">
            Plugin
          </div>
          <div className="text-lg text-white max-w-[250px]">
            Cool plugin that does some really useful stuff.
          </div>
        </div>
        <div className="circle-container max-lg:hidden">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>

      <Table>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 !border-0">
            <Table.Cell className="!p-0 !w-[35px]">
              <img
                src={defaultImages.logoSB}
                width="35px"
                height="35px"
                // delete bg-black p-1 grayscale brightness-[2] later
                className="rounded-lg bg-black p-1 grayscale brightness-[2]"
                alt=""
              />
            </Table.Cell>
            <Table.Cell className="!p-0 !px-2 !max-w-[250px]">
              <div className="pt-1.5 ps-2">
                <div className="text-2xl text-gray-900 font-semibold pb-1 max-lg:text-lg">
                  Background Check by Social Bureau
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="!p-0 w-[120px]">
              <div className="flex justify-center">
                <Button
                  className="!flex items-center justify-center gap-2 !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none"
                  label="Activate"
                  onClick={() => {}}
                />
              </div>
            </Table.Cell>
            <Table.Cell className="!p-0 max-lg:hidden">
              <div className="flex justify-center">
                <HiOutlineDotsHorizontal />
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <div className="text-sm pb-6 border-b">
        {' '}
        Allows you to verify the social credibility and crime report status of
        users and their associated wallets. This proactive approach to digital
        interaction ensures a safer and more reliable communication experience.
      </div>

      <div className="flex md:flex-wrap w-full items-start justify-between max-md:flex-col">
        <div className="md:w-1/2 flex flex-col gap-6 w-full">
          <span className="font-semibold">Version history</span>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">
              Version 3 on April 13, 2020
            </span>
            <span className="text-sm">Release notes</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">
              Version 2 on April 12, 2020
            </span>
            <span className="text-sm">Release notes</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">
              Version 1 on April 11, 2020
            </span>
            <span className="text-sm">Release notes</span>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col gap-6 w-full max-md:mt-5">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Publisher</span>
            <div className="flex gap-3 items-center">
              <img
                src={defaultImages.noProfile}
                height="32px"
                width="32px"
                className="rounded-full"
                alt=""
              />
              <span className="text-sm">Your Name</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Share</span>
            <span className="text-sm flex gap-2 items-center cursor-pointer hover:text-gray-500 transition">
              <PiLinkSimple className="text-[18px] -mt-[2px]" /> Copy link
            </span>
            <span className="text-sm flex gap-2 items-center cursor-pointer hover:text-gray-500 transition">
              <FaTwitter className="text-[18px] -mt-[2px]" />
              Share on Twitter
            </span>
            <span className="text-sm flex gap-2 items-center cursor-pointer hover:text-gray-500 transition">
              <AiFillFacebook className="text-[18px] -mt-[2px]" />
              Share on Facebook
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Tags</span>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm border rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
                tagname
              </span>
              <span className="text-sm border rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
                tagname
              </span>
              <span className="text-sm border rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
                tagname
              </span>
              <span className="text-sm border rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
                tagname
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Details</span>
            <span className="text-sm max-w-[200px]">
              Last updated 4 hours ago Support: email@email.com
            </span>
          </div>
          <span className="text-sm text-gray-400 mt-4">
            Flag as inappropriate...
          </span>
        </div>
      </div>
    </div>
  );
}
