import moment from 'moment';
import { useEffect, useState } from 'react';

export default function useMessageDateTime(dateTime?: string) {
  const [time, setTime] = useState('');
  const [day, setDay] = useState(new Date());

  useEffect(() => {
    calculateMessageDateTime();
    const intervalId = setInterval(() => {
      calculateMessageDateTime();
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const calculateMessageDateTime = () => {
    if (!dateTime) return '';
    const currentTime = moment();
    const momentDate = moment(new Date(dateTime));

    // let calculatedDateTime = momentDate.fromNow();
    // if (minutesDiff < -60) {
    //   calculatedDateTime = momentDate.format('DD/MM/YYYY, HH:mm:ss');
    // } else if (minutesDiff < 0) {
    //   calculatedDateTime = momentDate.format('HH:mm');
    // }

    // let calculatedDateTime = momentDate.format('HH:mm');
    // if (minutesDiff < -1) {
    //   calculatedDateTime = momentDate.format('DD/MM/YYYY, HH:mm:ss');
    // }

    // let calculatedDateTime = momentDate.format('DD/MM/YYYY, HH:mm:ss');
    let calculatedDateTime = momentDate.format('HH:mm');

    if (momentDate.isSame(currentTime, 'day')) {
      calculatedDateTime = momentDate.format('HH:mm');
    }

    setTime(calculatedDateTime);
    setDay(moment(momentDate).toDate());
  };

  return { day: day, time: time };
}
