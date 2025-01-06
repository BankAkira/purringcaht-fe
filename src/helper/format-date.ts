import moment, { MomentInput } from 'moment';

const formatDate = (
  date: MomentInput,
  formatString = 'DD/MM/YYYY, HH:mm:ss'
) => {
  return moment(date).format(formatString);
};

const isToday = (dateString: Date | string | undefined) => {
  if (!dateString) return false;
  const givenDate = new Date(dateString);
  const today = new Date();

  return (
    givenDate.getDate() === today.getDate() &&
    givenDate.getMonth() === today.getMonth() &&
    givenDate.getFullYear() === today.getFullYear()
  );
};

export { formatDate, isToday };
