import moment, { MomentInput } from 'moment';

const chatFormatDate = (date: MomentInput): string => {
  // Get the current time
  const currentTime = moment();

  const momentDate = moment(date);

  const minutesDiff = momentDate.diff(currentTime, 'minutes');

  if (minutesDiff < -60) {
    return momentDate.format('DD/MM/YYYY, HH:mm:ss');
  } else if (minutesDiff < 0) {
    return momentDate.format('HH:mm');
  } else {
    return momentDate.fromNow();
  }
};

export default chatFormatDate;
