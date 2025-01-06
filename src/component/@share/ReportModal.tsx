// import (Internal imports)
import { ChangeEvent, useEffect, useState } from 'react';

// flowbite-react
import { Button, Label, Modal, Radio, Textarea } from 'flowbite-react';

// react-icons
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FaRegCircleCheck } from 'react-icons/fa6';

// react-toastify
import { toast } from 'react-toastify';

// type definitions
import { reportUserPayload, User } from '../../type/auth';
import { MessageContentType, MessagePayload } from '../../type/message';
import { ConversationType } from '../../type/conversation';

// helper functions
import { errorFormat } from '../../helper/error-format';
// import { Logger } from '../../helper/logger';
import { Profile } from '../../helper/hook/useConversationProfile';

// redux
import { useDispatch, useSelector } from '../../redux';
import { toggleIsShowLoader } from '../../redux/layout';

// APIs
import { reportUserApi } from '../../rest-api/user-report';
import { pointPurrKit } from '../../helper/point';

export type ReportCategory =
  | 'Unethical Actions'
  | 'Harmful Expressions/Content'
  | 'Disregard for Ethics and Privacy'
  | 'Others';

export type ReportOption = {
  title: string;
  type: string;
  point: number;
  description?: string;
  category: ReportCategory;
};

type Props = {
  openModal: boolean;
  closeModal: () => void;
  profile?: Profile | User | null;
  groupId?: string;
  groupName?: string;
  type: ConversationType | MessageContentType;
  message?: MessagePayload;
};

const category: ReportCategory[] = [
  'Unethical Actions',
  'Harmful Expressions/Content',
  'Disregard for Ethics and Privacy',
  'Others',
];

// const log = new Logger('ReportPostModal');

const ReportModal = ({
  openModal,
  closeModal,
  profile,
  groupId,
  groupName,
  type,
  message,
}: Props) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.account);
  const { violationPointConfig } = useSelector(state => state.violationPoint);

  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [selectedOptionCategory, setSelectedOptionCategory] = useState<
    ReportCategory | undefined
  >(undefined);
  const [reportOptions, setReportOptions] = useState<
    ReportOption[] | undefined
  >([]);

  const handleActive = (event?: string) => {
    if (event) {
      const selectedValue = event;
      setSelectedOption(
        selectedValue && selectedValue !== selectedOption ? selectedValue : ''
      );
    }
  };

  const handleActiveCategory = (event?: ReportCategory) => {
    if (event) {
      const selectedValue = event;
      setSelectedOptionCategory(
        selectedValue && selectedValue !== selectedOptionCategory
          ? selectedValue
          : undefined
      );
      setSelectedOption(undefined);
    }
  };

  const handleDescriptionChange = (
    event?: ChangeEvent<HTMLTextAreaElement>,
    type?: string
  ) => {
    if (event && type !== undefined) {
      setReportOptions(prevOptions => {
        return prevOptions?.map(option => {
          if (option.type === type || option.category === type) {
            return {
              ...option,
              description: event.target.value,
            };
          }
          return option;
        });
      });
    }
  };

  const resetReportModalData = () => {
    fetchViolationPointConfig();
    setSelectedOption(undefined);
    setSelectedOptionCategory(undefined);
  };

  const fetchViolationPointConfig = async () => {
    const sortPointConfig = [...(violationPointConfig ?? [])].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setReportOptions(sortPointConfig.length ? sortPointConfig : undefined);
  };

  const handleReport = async (
    violationPointConfigId?: string,
    typeReport?: string,
    description?: string
  ) => {
    closeModal();
    dispatch(toggleIsShowLoader(true));
    if (
      profile &&
      ((profile as Profile).userId || (profile as User).id || groupId)
    ) {
      try {
        if (user && user?.id) {
          const payload: reportUserPayload = {
            fromUserId: user?.id,
            toUserId:
              type !== ConversationType.GROUP
                ? (profile as Profile).userId || (profile as User).id
                : groupId || '',
            annotation: description || '',
            violationPointId: violationPointConfigId || '',
            violationPointName: typeReport || '',
            type: type,
            message: message,
          };
          const resp = await reportUserApi(payload);
          if (!resp) {
            throw resp;
          }
          toast.success(
            `${type !== ConversationType.GROUP ? (profile as Profile).name || (profile as User).displayName : groupName} has been reported`
          );
        }
      } catch (error) {
        toast.error(errorFormat(error).message);
      } finally {
        resetReportModalData();
        dispatch(toggleIsShowLoader(false));
      }
    }
  };

  useEffect(() => {
    fetchViolationPointConfig();
  }, [violationPointConfig]);

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => {
          resetReportModalData();
          closeModal();
        }}>
        <Modal.Header className="p-5 pb-4 rounded-t-lg">
          <div className="flex max-md:text-base text-lg">
            Please select the topic you want to report.
          </div>
        </Modal.Header>
        <Modal.Body className="px-0">
          <div className="pb-3 max-sm:px-0 px-6">
            <span className="text-gray-500 text-xs md:text-sm leading-normal block">
              If someone is in urgent danger Please ask for help before
              reporting it to us
            </span>
          </div>
          <div className="h-full max-sm:px-0 px-6 max-sm:pb-2">
            {category.map((category, index) => (
              <div key={index}>
                <div
                  className={
                    (selectedOptionCategory &&
                    category === selectedOptionCategory
                      ? 'bg-orange-500 hover:bg-orange-600 '
                      : 'bg-gray-100 hover:bg-gray-200 ') +
                    'py-3 transition-all px-4 mt-2 rounded-lg cursor-pointer relative'
                  }
                  onClick={() => handleActiveCategory(category)}>
                  <span
                    className={
                      (selectedOptionCategory &&
                      category === selectedOptionCategory
                        ? 'text-white '
                        : 'text-gray-600 ') +
                      ' text-xs md:text-sm flex justify-between gap-1 items-center'
                    }>
                    <span className="flex justify-center items-center gap-2 ">
                      <FaRegCircleCheck
                        className={
                          (category === selectedOptionCategory
                            ? 'w-[14px]'
                            : 'w-0') + ' mt-[-2px] transition-all'
                        }
                      />
                      {category}
                    </span>
                    {category === selectedOptionCategory ? (
                      <IoIosArrowDown className="mt-[-2px] text-[18px]" />
                    ) : (
                      <IoIosArrowForward className="mt-[-2px] text-[18px]" />
                    )}
                  </span>
                </div>

                <div
                  className={
                    (category === 'Harmful Expressions/Content'
                      ? category === selectedOptionCategory
                        ? reportOptions?.some(
                            item =>
                              item.type === selectedOption &&
                              item.category === selectedOptionCategory
                          )
                          ? 'h-[310px] md:h-[340px]'
                          : 'h-[200px] md:h-[200px]'
                        : 'h-0'
                      : category === selectedOptionCategory
                        ? reportOptions?.some(
                            item =>
                              item.type === selectedOption &&
                              item.category === selectedOptionCategory
                          )
                          ? 'h-[260px] md:h-[290px]'
                          : 'h-[150px] md:h-[150px]'
                        : 'h-0') +
                    ' transition-all overflow-hidden flex gap-4 items-start ps-5 relative flex-col '
                  }>
                  {category === 'Others' ? (
                    // Render Textarea directly if category is Others
                    <Textarea
                      maxLength={500}
                      rows={4}
                      className="w-full z-[3] resize-none transition text-area-report max-md:p-2 max-md:!text-xs mt-4"
                      placeholder="You can fill in additional details here"
                      onChange={e => handleDescriptionChange(e, 'Others')}
                    />
                  ) : (
                    <>
                      {reportOptions
                        ?.filter(value => value.category === category)
                        .map((item, index) => (
                          <div
                            key={index}
                            className={
                              (index === 0 ? 'mt-5 ' : '') +
                              ' relative flex items-center justify-center gap-2 pe-8'
                            }>
                            <Radio
                              style={{
                                backgroundColor:
                                  item.type === selectedOption ? '#ff5a1f' : '',
                              }}
                              className="cursor-pointer z-[2]"
                              value={item.type}
                              onChange={() => handleActive(item.type)}
                              checked={item.type === selectedOption}
                            />
                            <Label
                              onClick={() => handleActive(item.type)}
                              className={
                                (selectedOption === item.type
                                  ? 'text-orange-500'
                                  : 'text-gray-500') +
                                ' text-[11px] sm:text-xs md:text-[13px] transition mt-0 cursor-pointer'
                              }>
                              <p className="font-bold text-gray-900 text-nowrap">
                                {item.title}
                              </p>
                              <p className="text-gray-400 text-[11px] text-nowrap">
                                <span className="max-[350px]:hidden inline-block">
                                  This report
                                </span>{' '}
                                will be deducted{' '}
                                <b>{`(${pointPurrKit(item.point)} Points)`}</b>
                              </p>
                            </Label>
                            <div
                              className={
                                (selectedOption && item.type === selectedOption
                                  ? 'border-l-orange-500 border-b-orange-500 '
                                  : 'border-l-gray-200 border-b-gray-200 ') +
                                (selectedOption === item.type
                                  ? 'z-[1] '
                                  : ' ') +
                                ' absolute w-[20px] h-[200%] border-transparent border-[2px] rounded-b-md -left-[10px] bottom-[14px]'
                              }
                            />
                            <div
                              className={
                                (selectedOption && item.type === selectedOption
                                  ? ' '
                                  : 'hidden  ') +
                                (selectedOption === item.type
                                  ? 'z-[1] '
                                  : ' ') +
                                ' border-l-orange-500 absolute w-[20px] h-[300px] border-transparent border-[2px] -left-[10px] top-[-300px] z-[1]'
                              }
                            />
                          </div>
                        ))}

                      {reportOptions
                        ?.filter(value => value.type === selectedOption)
                        .map((item, index) => (
                          <div key={index} className="w-full mt-1">
                            <Textarea
                              maxLength={500}
                              rows={4}
                              className={
                                (item.description
                                  ? 'border-orange-500'
                                  : 'border') +
                                ' w-full z-[3] resize-none transition text-area-report max-md:p-2 max-md:!text-xs'
                              }
                              value={item.description}
                              placeholder="You can fill in additional details here"
                              onChange={e =>
                                handleDescriptionChange(e, item.type)
                              }
                            />
                            <div className="flex flex-col w-full pt-1 pb-6 relative">
                              {item.description && (
                                <span className="absolute right-1 bottom-[5px] text-gray-400 text-xs">
                                  {item.description.length}/500
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            disabled={
              !selectedOption &&
              !(
                selectedOptionCategory === 'Others' &&
                (reportOptions?.find(option => option.category === 'Others')
                  ?.description?.length ?? 0) > 0
              )
            }
            pill
            className="bg-orange-500 hover:bg-orange-600 sm:min-w-[140px]"
            onClick={() => {
              // Ensure annotation is a ReportOption or use a fallback ReportOption
              const annotation: ReportOption = reportOptions?.find(
                item =>
                  item.type === selectedOption || item.category === 'Others'
              ) || {
                title: 'Others',
                type: 'Others',
                point: 20,
                category: 'Others',
              };

              // Get the ID of the "Others" category
              const violationPointId =
                annotation.category === 'Others'
                  ? annotation.type
                  : selectedOption;

              handleReport(
                violationPointId,
                annotation.title,
                annotation.description
              );
            }}>
            Report
          </Button>
          <Button
            color="gray"
            pill
            className="sm:min-w-[100px]"
            onClick={() => {
              resetReportModalData();
              closeModal();
            }}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReportModal;
