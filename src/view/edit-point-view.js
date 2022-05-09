import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateFormat } from '../utils.js';

const EVENT_TIME_FORMAT = 'YY/MM/DD HH:mm';

const getEventTypeItemTemplate = (eventType, checkedType) => {
  const isChecked = eventType === checkedType ? 'checked' : '';
  eventType = eventType.split('');
  eventType[0] = eventType[0].toUpperCase();
  let textContent = eventType;
  textContent = textContent.join('');

  return `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${textContent}</label>
    </div>`;
};

const getEventTypeListTemplate = (checkedType, types) => {
  let template = '';
  types.forEach((eventType) => (template += getEventTypeItemTemplate(eventType, checkedType)));

  return `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${template}
    </fieldset>
  </div>
`;};

const getOffersTemplate = (availableOffers, checkedOffersIDs, type) => {
  let template = '';

  if(!checkedOffersIDs || checkedOffersIDs.length === 0){
    return template;
  }

  template += `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">`;

  availableOffers.forEach((element) => {
    let isChecked = '';

    if(checkedOffersIDs.some((id) => id === element.id)){
      isChecked = 'checked';
    }

    template += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${type}-${element.id}" type="checkbox" name="event-offer-luggage" ${isChecked}>
        <label class="event__offer-label" for="${type}-${element.id}">
          <span class="event__offer-title">${element.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${element.price}</span>
        </label>
      </div>
    `;
  });

  template += `
    </div></section>
  `;

  return template;
};

const getPhotosTemplate = (pictures) => {
  let template = '';

  if(!pictures || pictures.length === 0){
    return template;
  }

  template += '<div class="event__photos-container"><div class="event__photos-tape">';

  pictures.forEach((element) => {
    template += `<img class="event__photo" src=${element.src} alt="lorem">`;
  });

  template += '</div></div>';

  return template;
};

const editPointTemplate = (point, availableOffers, isAddView) => {
  const {dateFrom, dateTo, destination, offers, type} = point;

  const eventResetBtnTextContent = isAddView ? 'Cancel' : 'Delete';
  const description = destination.description;

  const types = availableOffers.map((element) => element.type);
  availableOffers = availableOffers.find((element) => element.type === type).offers;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${getEventTypeListTemplate(type, types)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateFormat(dateFrom, EVENT_TIME_FORMAT)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateFormat(dateTo, EVENT_TIME_FORMAT)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${eventResetBtnTextContent}</button>
          <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${getOffersTemplate(availableOffers, offers, type)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${getPhotosTemplate(destination.pictures)}
          </section>
        </section>
      </form>
    </li>`;
};

export default class PointView extends AbstractView{

  constructor(point, offers, isAddView = false){
    super();
    this.point = point;
    this.offers = offers;
    this.isAddView = isAddView;
  }

  get template(){
    return editPointTemplate(this.point, this.offers, this.isAddView);
  }

  setRollupButtonClickHandler(handler){
    this.element.querySelector('.event__rollup-btn').addEventListener('click', handler);
  }

  setFormSubmitHandler(handler){
    this.element.querySelector('.event--edit').addEventListener('submit', handler);
  }

  unsetRollupButtonClickHandler(handler){
    this.element.querySelector('.event__rollup-btn').removeEventListener('click', handler);
  }

  unsetFormSubmitHandler(handler){
    this.element.querySelector('.event--edit').removeEventListener('submit', handler);
  }
}
