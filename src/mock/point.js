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

const generatePoint = (id = 0) => {
  const type = getRandomArrayElement(TYPES);

  return {
    basePrice: getRandomInt(200, 2000),
    dateFrom: '2022-05-04T05:20:00.000Z',
    dateTo: '2022-05-05T17:10:00.000Z',
    destination: generateDestination(),
    id: id,
    isFavorite: getRandomInt(0, 1) === 0 ? 'false' : 'true',
    offers: generateOffersIDs(type),
    type,
  };
};

export { generatePoint };
