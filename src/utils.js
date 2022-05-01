
import dayjs from 'dayjs';

const getRandomInt = (min = 0, max = 100) => {
  if(min < 0 || max < 0){
    throw new Error('Аргументы функции не могут быть меньше нуля.');
  }
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

  let hour = dateTo.diff(dateFrom, 'hour');
  hour = hour > 0 ? `${hour}H ` : '';
  let minutes = dateTo.diff(dateFrom, 'minute') % 60;
  minutes = minutes > 0 ? `${String(minutes).padStart(2, '0')}M` : '';

  return `${hour}${minutes}`;
};

export {getRandomArrayElement, getRandomInt, humanizeDateFormat,  getTimeDuration, getRandomUniqueIntegersArray};
