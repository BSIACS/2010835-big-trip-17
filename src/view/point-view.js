import {createElement} from '../render.js';
import {humanizeDateFormat, getTimeDuration} from '../utils.js';

const EVENT_TIME_FORMAT = 'HH:mm';
const EVENT_DATE_FORMAT = 'DD MMM';

const createPointsOffersTemplate = (offersIDs, availableOffers) => {
  let template = '';

  if(!offersIDs){
    return template;
  }

  offersIDs.forEach((offerID) => {
    const offer = availableOffers.find((element) => element.id === offerID);

    template += `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
    `;
  });

  return template;
};

const createPointTemplate = (point, availableOffers) => {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = point;

  const favoriteBtnActiveClassName = isFavorite === 'true' ? 'event__favorite-btn--active' : '';

  const typeAvailableOffers = availableOffers.find((element) => element.type === type ).offers;

  const eventDuration = getTimeDuration(dateFrom, dateTo);

  return `
    <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-19">${humanizeDateFormat(dateFrom, EVENT_DATE_FORMAT)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-19T18:00">${humanizeDateFormat(dateFrom, EVENT_TIME_FORMAT)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-19T19:00">${humanizeDateFormat(dateTo, EVENT_TIME_FORMAT)}</time>
        </p>
        <p class="event__duration">${eventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createPointsOffersTemplate(offers, typeAvailableOffers)}
      </ul>
      <button class="event__favorite-btn ${favoriteBtnActiveClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>
  `;
};

export default class PointView{
  constructor(point, offers){
    this.point = point;
    this.offers = offers;
  }

  getTemplate(){
    return createPointTemplate(this.point, this.offers);
  }

  getElement(){
    if(this.element){
      return this.element;
    }

    return (this.element = createElement(this.getTemplate()));
  }

  removeElement(){
    this.element = null;
  }
}
