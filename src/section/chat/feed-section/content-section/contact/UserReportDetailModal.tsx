import { Modal, Pagination } from 'flowbite-react';
import {
  UserReportFromSB,
  UserReportFromSB_Resp,
} from '../../../../../type/auth';
import { IoClose } from 'react-icons/io5';
import { formatDate } from '../../../../../helper/format-date';
import { MdOutlineAccessTime } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';

type Props = {
  reports: UserReportFromSB_Resp | null;
  currentPage: number;
  openModal: boolean;
  onCloseModal: () => void;
  setCurrentPage: (page: number) => void;
};

export default function UserReportDetailModal({
  reports,
  openModal,
  currentPage,
  setCurrentPage,
  onCloseModal,
}: Props) {
  const reportComponent = (reportsData: UserReportFromSB) => {
    return (
      <div className="border rounded-lg">
        <div className="border-b px-3 py-4 flex flex-wrap items-center justify-between">
          <span className="leading-none text-base font-medium">
            {reportsData?.violationPointName}
          </span>
          <span className="text-sm font-normal text-gray-400 flex gap-1.5 items-center">
            <MdOutlineAccessTime className="-mt-[3px] text-[16px]" />{' '}
            {formatDate(reportsData?.createdAt)}
          </span>
        </div>
        <div className="px-3 py-4 text-base font-normal text-gray-500 break-all">
          {reportsData?.annotation ? reportsData?.annotation : '-'}
        </div>
      </div>
    );
  };

  return (
    <Modal
      show={openModal}
      size={'2xl'}
      onClose={() => onCloseModal()}
      dismissible>
      <Modal.Header>
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-gray-900 text-lg font-semibold">Reported</div>
          <IoClose
            className="-mt-[1px] text-gray-500 cursor-pointer hover:text-gray-400 transition"
            onClick={() => onCloseModal()}
          />
        </div>
      </Modal.Header>
      <Modal.Body className="!min-h-[70vh]">
        <div className="flex flex-col gap-3">
          {!!reports &&
          !!reports?.data?.results &&
          reports?.data?.results?.length ? (
            <>
              {reports?.data?.results?.map((item, index) => (
                <div key={index}>{reportComponent(item)}</div>
              ))}
            </>
          ) : (
            <div className="flex flex-col min-h-[60vh] items-center justify-center text-gray-500">
              <FaRegCheckCircle className="text-[80px] mb-3 text-gray-400" />
              This user has not been reported yet.
            </div>
          )}
        </div>
      </Modal.Body>
      {!!reports &&
        !!reports?.data?.results?.length &&
        reports?.data?.totalPages > 1 && (
          <Modal.Footer className="!px-5 !py-4 !pt-2">
            <div className="w-full flex justify-center sm:justify-end">
              <Pagination
                layout="pagination"
                currentPage={currentPage}
                totalPages={reports?.data?.totalPages || 0}
                onPageChange={e => {
                  setCurrentPage(e);
                }}
                previousLabel=""
                nextLabel=""
                showIcons
                className="pagination-custom"
                theme={{
                  pages: {
                    selector: {
                      active: '!text-orange-500 !bg-orange-100',
                    },
                  },
                }}
              />
            </div>
          </Modal.Footer>
        )}
    </Modal>
  );
}
