import dayjs from 'dayjs';

const humanizeDateFormat = (dueDate, format) => dayjs(dueDate).format(format);

const getTimeDuration = (dateFrom, dateTo) => {
  dateTo = dayjs(dateTo);
  dateFrom = dayjs(dateFrom);

  let days = dateTo.diff(dateFrom, 'day');
  days = days > 0 ? `${String(days).padStart(2, '0')}D ` : '';
  let hours = dateTo.diff(dateFrom, 'hour') % 24;
  hours = hours > 0 ? `${String(hours).padStart(2, '0')}H ` : '';
  let minutes = dateTo.diff(dateFrom, 'minute') % 60;
  minutes = minutes > 0 ? `${String(minutes).padStart(2, '0')}M` : '';

  return `${days}${hours}${minutes}`;
};

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';


export {humanizeDateFormat,  getTimeDuration, isEscapeKey};
