
import dayjs from 'dayjs';

const getRandomInt = (min = 0, max = 100) => {
  if(min >= max){
    throw new Error('Аргумент функции "min" не может быть больше или равен аргументу функции "max".');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

const getRandomUniqueIntegersArray = (min, max, count) => {
  const values = [];

  for(let i = 0; i < count; i++){
    const randomValue = getRandomInt(min, max);

    if(!values.includes(randomValue)){
      values.push(randomValue);
    }
  }

  return values;
};

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


export {getRandomArrayElement, getRandomInt, humanizeDateFormat,  getTimeDuration, getRandomUniqueIntegersArray, isEscapeKey};
