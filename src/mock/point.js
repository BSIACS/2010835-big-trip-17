import dayjs from 'dayjs';
import {getRandomArrayElement, getRandomInt, getRandomUniqueIntegersArray} from '../utils.js';
import { getAvailableOffers } from './offer.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DISCRIPTIONS = [
  'Is a beautiful city, a true pearl, with crowded streets.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
];
const CITIES = ['Chamonix', 'Geneva', 'Amsterdam', 'Barcelona', 'Kioto', 'Moscow'];

const EVENTS_TIME_DURATION_IN_MINUTES = {
  'taxi': {
    min: 0.5 * 60,
    max: 2 * 60,
  },
  'bus':{
    min: 4 * 60,
    max: 12 * 60,
  },
  'train': {
    min: 2 * 60,
    max: 24 * 60,
  },
  'ship': {
    min: 4 * 60,
    max: 24 * 60,
  },
  'drive': {
    min: 0.5 * 60,
    max: 12 * 60,
  },
  'flight': {
    min: 4 * 60,
    max: 12 * 60,
  },
  'check-in': {
    min: 24 * 60,
    max: 72 * 60,
  },
  'sightseeing': {
    min: 1 * 60,
    max: 6 * 60,
  },
  'restaurant': {
    min: 1 * 60,
    max: 4 * 60,
  },
};

const generateDestination = () => ({
  description: getRandomArrayElement(DISCRIPTIONS),
  name: getRandomArrayElement(CITIES),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInt()}`,
      description: 'Lorem ipsum dolor sit amet'
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInt()}`,
      description: 'Lorem ipsum dolor sit amet'
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInt()}`,
      description: 'Lorem ipsum dolor sit amet'
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInt()}`,
      description: 'Lorem ipsum dolor sit amet'
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInt()}`,
      description: 'Lorem ipsum dolor sit amet'
    }
  ]
});

let destinations = null;

const generateDestinations = (length = 10) => {
  if(destinations !== null){
    return destinations;
  }
  else{
    destinations = Array.from({length}, generateDestination);
    return destinations;
  }
};

const generateOffersIDs = (type) => {
  let IDs = null;
  const offer = getAvailableOffers().find((element) => element.type === type);
  const minValue = 1;
  const maxValue = offer.offers.length;

  if(offer.offers.length > 0){
    IDs = getRandomUniqueIntegersArray(minValue, maxValue, maxValue).sort();
  }

  return IDs;
};

const generatePoints = (points = null) => {
  let dateFrom = null;
  let dateTo = null;
  const type = getRandomArrayElement(TYPES);

  if(points === null){
    points = [];
    dateFrom = dayjs().add(getRandomInt(-72, 48), 'hour');
    dateTo = dateFrom.add(getRandomInt(EVENTS_TIME_DURATION_IN_MINUTES[type].min, EVENTS_TIME_DURATION_IN_MINUTES[type].max), 'minute');
  }
  else{
    dateFrom = dayjs(points[points.length - 1].dateTo);
    dateTo = dateFrom.add(getRandomInt(EVENTS_TIME_DURATION_IN_MINUTES[type].min, EVENTS_TIME_DURATION_IN_MINUTES[type].max), 'minute');
  }

  if(points.length < 7){
    points.push({
      basePrice: getRandomInt(200, 2000),
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      destination: destinations[getRandomInt(0, destinations.length - 1)],
      id: points.length + 1,
      isFavorite: getRandomInt(0, 1) === 0 ? 'false' : 'true',
      offers: generateOffersIDs(type),
      type,
    });

    generatePoints(points);
  }

  return points;
};

export { generatePoints, generateDestinations };
