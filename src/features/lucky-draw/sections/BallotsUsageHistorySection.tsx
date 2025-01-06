// import (Internal imports)
import { useCallback, useState, useEffect } from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// flowbite-react
import { Table } from 'flowbite-react';

// helper functions
// import useResponsive from '../../../helper/hook/useResponsive.ts';
import { formatDate } from '../../../helper/format-date.ts';
import { Logger } from '../../../helper/logger.ts';

// redux
import { useSelector } from '../../../redux';

// types
import { RedeemPointLog, Ticket } from '../../../type/lucky-draw.ts';

// APIs
import {
  getRedeemPointLogs,
  getTicketsMe,
} from '../../../rest-api/lucky-draw.ts';

// images
import TicketStar from '../../../asset/images/lucky-draw/icons/ticket-star.svg';
import emptyMediaImage from '../../../asset/images/empty-img/empty-media.svg';

const log = new Logger('BallotsUsageHistorySection');

const tabs = [
  {
    id: 'redeemed',
    title: 'Redeemed ballots',
  },
  {
    id: 'used',
    title: 'Used ballots',
  },
];

export default function BallotsUsageHistorySection() {
  // const { isTabletOrMobile } = useResponsive();
  const { points } = useSelector(state => state.userPoint);
  const { tickets } = useSelector(state => state.luckyDraw);

  const [activeTab, setActiveTab] = useState<string>('redeemed');

  const [historyRedeemedTickets, setHistoryRedeemedTickets] = useState<
    RedeemPointLog[] | []
  >([]);
  const [historyUsedTickets, setHistoryUsedTickets] = useState<Ticket[] | []>(
    []
  );
  const [hasMoreRedeemed, setHasMoreRedeemed] = useState<boolean>(true);
  const [hasMoreUsed, setHasMoreUsed] = useState<boolean>(true);

  const [pageRedeemed, setPageRedeemed] = useState(1);
  const [pageUsed, setPageUsed] = useState(1);

  useEffect(() => {
    if (activeTab === 'redeemed') {
      resetRedeemedData();
      fetchHistoryRedeemed(1);
    }
  }, [activeTab, points]);

  useEffect(() => {
    if (activeTab === 'used') {
      resetUsedData();
      fetchHistoryUsedTickets(1);
    }
  }, [activeTab, tickets]);

  const resetRedeemedData = () => {
    setHistoryRedeemedTickets([]);
    setPageRedeemed(1);
    setHasMoreRedeemed(true);
  };

  const resetUsedData = () => {
    setHistoryUsedTickets([]);
    setPageUsed(1);
    setHasMoreUsed(true);
  };

  const fetchHistoryRedeemed = async (page = 1) => {
    try {
      const res = await getRedeemPointLogs({ page });
      if (res) {
        setHistoryRedeemedTickets(prev => [...prev, ...res.results]);
        setHasMoreRedeemed(
          res.results.length + (page - 1) * res.limit < res.totalResults
        );
        setPageRedeemed(page);
      }
    } catch (error) {
      log.error('Error fetching redeemed tickets:', error);
    }
  };

  const fetchHistoryUsedTickets = async (page = 1) => {
    try {
      const res = await getTicketsMe({ page, isUsed: true });
      if (res) {
        setHistoryUsedTickets(prev => [...prev, ...res.results]);
        setHasMoreUsed(
          res.results.length + (page - 1) * res.limit < res.totalResults
        );
        setPageUsed(page);
      }
    } catch (error) {
      log.error('Error fetching used tickets:', error);
    }
  };

  const fetchMoreDataRedeemed = useCallback(() => {
    if (hasMoreRedeemed) {
      fetchHistoryRedeemed(pageRedeemed + 1);
    }
  }, [pageRedeemed, hasMoreRedeemed]);

  const fetchMoreDataUsed = useCallback(() => {
    if (hasMoreUsed) {
      fetchHistoryUsedTickets(pageUsed + 1);
    }
  }, [pageUsed, hasMoreUsed]);

  const renderTable = (
    data: RedeemPointLog[] | Ticket[],
    fetchMoreData: () => void,
    hasMore: boolean
  ) => (
    <TableStyled>
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p className="text-center py-2">Loading...</p>}
        endMessage={
          data.length ? (
            <p className="text-center py-2">No more data to load.</p>
          ) : (
            <></>
          )
        }>
        <Table>
          <Table.Head>
            <Table.HeadCell className="w-[70%] xl:w-[80%]">
              Ballots
            </Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
          </Table.Head>
          {data.length ? (
            <Table.Body className="divide-dashed">
              {data.map((item, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <div className="flex items-center gap-4">
                      <img
                        src={TicketStar}
                        className="w-5 h-5"
                        alt="TICKET_START"
                      />
                      <div className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {activeTab === 'redeemed'
                          ? 'Redeemed ballots'
                          : 'Used ballots'}{' '}
                        <span className="font-extrabold inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                          {activeTab === 'redeemed'
                            ? `x${(item as RedeemPointLog).ticketLog?.amount}`
                            : 'x1'}
                        </span>
                        {activeTab === 'used' && (
                          <p className="text-[#9CA3AF] text-[10px]">
                            {item.id}
                          </p>
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(
                      activeTab === 'redeemed'
                        ? (item as RedeemPointLog)?.createdAt
                        : (item as Ticket)?.usedAfterDate || new Date(),
                      'DD/MM/YYYY, HH:mm'
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          ) : null}
        </Table>
      </InfiniteScroll>
      {data.length === 0 ? (
        <div className="h-screen w-full flex flex-col items-center gap-2 bg-white text-center pt-36">
          <img src={emptyMediaImage} width={60} alt="No Data" />
          <span className="text-sm font-normal text-gray-500">
            No {activeTab === 'redeemed' ? 'redeemed ballots' : 'used ballots'}{' '}
            available
          </span>
          <span className="text-[10px] font-light text-gray-400 max-w-[250px]">
            No data available at this time
          </span>
        </div>
      ) : null}
    </TableStyled>
  );
  return (
    <section>
      <div className="flex flex-col gap-5 pb-5">
        <p className="text-[#111928] text-2xl font-bold">Ballots history</p>

        <div>
          <div className="flex pb-3 mt-4 mb-3 max-lg:mt-0">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={classNames(
                  'flex justify-center items-center gap-2 border-b py-3 cursor-pointer text-base text-[#9CA3AF] border-[#D1D5DB] w-full',
                  {
                    '!border-[#FE7601] !text-[#FE7601]': activeTab === tab.id,
                  }
                )}>
                <span className="max-md:text-[11px]">{tab.title}</span>
              </div>
            ))}
          </div>

          {activeTab === 'used' &&
            renderTable(historyUsedTickets, fetchMoreDataUsed, hasMoreUsed)}
          {activeTab === 'redeemed' &&
            renderTable(
              historyRedeemedTickets,
              fetchMoreDataRedeemed,
              hasMoreRedeemed
            )}
        </div>
      </div>
    </section>
  );
}

const TableStyled = styled.div`
  border-radius: 16px;
  background: linear-gradient(274deg, #ffecf1 1.97%, #fff1e6 100%);
  overflow-x: auto;

  /* shadow-md */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.05);

  .divide-dashed > :not([hidden]) {
    border-bottom: 1px dashed rgba(145, 158, 171, 0.2);
  }
`;
