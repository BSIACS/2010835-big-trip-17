import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateFormat } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

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

const getOffersTemplate = (availableOffers, checkedOffersIDs, type, isDisabled) => {
  let template = '';

  if(!availableOffers || availableOffers.length === 0){
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
        <input class="event__offer-checkbox  visually-hidden" id="${type}-${element.id}" type="checkbox" name="event-offer-luggage" ${isChecked} ${isDisabled}>
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

const getDestinationsListTemplate = (destinations, selectedId = 2, isDisabled) => {
  let count = 0;
  const options = destinations.map((destination) => (`<option value="${count}" ${count++ === Number(selectedId) ? 'selected' : ''}>${destination.name}</option>`));
  return `
    <select class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"list="destination-list-1" ${isDisabled}>
      ${options}
    </select>`;
};

const getButtonRollupTemplate = () => `
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
`;

const editPointTemplate = (data, availableOffers, types, availableDestinations, isAddView) => {
  const {dateFrom, dateTo, destination, offers, type, basePrice, isSaving, isDeleting} = data;
  let eventResetBtnTextContent = isAddView ? 'Cancel' : 'Delete';
  const saveBtnTextContent = isSaving ? 'Saving...' : 'Save';
  eventResetBtnTextContent = isDeleting && !isAddView ? 'Deleting...' : eventResetBtnTextContent;
  const isDisabled = data.isDisabled ? 'disabled' : '';
  const description = availableDestinations[data.destination].description;
  const eventAvailableOffers = availableOffers.find((element) => element.type === data.type).offers;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled}>
            ${getEventTypeListTemplate(type, types)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            ${getDestinationsListTemplate(availableDestinations, data.destination, isDisabled)}

          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateFormat(dateFrom, EVENT_TIME_FORMAT)}" ${isDisabled}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateFormat(dateTo, EVENT_TIME_FORMAT)}" ${isDisabled}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled}>${saveBtnTextContent}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled}>${eventResetBtnTextContent}</button>
          ${isAddView ? '' : getButtonRollupTemplate()}
        </header>
        <section class="event__details">
          ${getOffersTemplate(eventAvailableOffers, offers, type, isDisabled)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${getPhotosTemplate(availableDestinations[destination].pictures)}
          </section>
        </section>
      </form>
    </li>`;
};

export default class EditPointView extends AbstractStatefulView{
  #availableOffers = null;
  #types = null;
  #isAddView = null;
  #availableDestinations = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(point, availableOffers, destinations, isAddView = false){
    super();

    this.#availableOffers = availableOffers;
    this.#isAddView = isAddView;
    this.#availableDestinations = destinations;
    this.#types = this.#availableOffers.map((element) => element.type);
    point = isAddView === true ? this.#getDefaultPoint() : point;
    this._state = this.parsePointToState(point);
    this.setInnerHandlers();
    this.#setDatepickers();
  }

  get template(){
    return editPointTemplate(this._state, this.#availableOffers, this.#types, this.#availableDestinations, this.#isAddView);
  }

  #getDefaultPoint = () => ({
    basePrice: 0,
    dateFrom: dayjs().toISOString(),
    dateTo: dayjs().add(1, 'hour').toISOString(),
    destination: this.#availableDestinations[0],
    isFavorite: false,
    offers: [],
    type: this.#types[0],
  });

  parsePointToState = (point) => {
    let destinationId = null;

    for (let i = 0; i < this.#availableDestinations.length; i++) {
      const element = this.#availableDestinations[i];
      if (point.destination.name === element.name){
        destinationId = i;
        break;
      }
    }

    const pointData = {...point,
      destination: destinationId,
      isDisabled: false,
      isSaving: false,
      isDeleting:  false,
    };

    return pointData;
  };

  parseStateToPoint = () => {
    const point = {...this._state,
      basePrice: Number(this._state.basePrice),
      destination: this.#availableDestinations[this._state.destination]
    };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

  reset = (point) => {
    this.updateElement(this.parsePointToState(point));
  };

  setRollupButtonClickHandler(callback){
    if(callback){
      this._callback.rollupButtonClick = callback;
    }
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  }

  setFormSubmitHandler(callback){
    if(callback){
      this._callback.formSubmit = callback;
    }
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  setDeleteButtonClickHandler = (callback) => {
    if(callback){
      this._callback.deleteButtonClick = callback;
    }
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  };

  #dateFromCloseHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToCloseHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  removeElement = () => {
    super.removeElement();

    if(this.#dateFromPicker){
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if(this.#dateToPicker){
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  #setDatepickers = () => {
    if(this._state.dateFrom){
      this.#dateFromPicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'y/m/d H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          enableTime: true,
          onClose: this.#dateFromCloseHandler,
        }
      );
    }
    if(this._state.dateTo){
      this.#dateToPicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'y/m/d H:i',
          defaultDate: this._state.dateTo,
          minDate:  this._state.dateFrom,
          enableTime: true,
          onClose: this.#dateToCloseHandler,
        }
      );
    }
  };

  setInnerHandlers = () => {
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputClickHandler);

    const availableOffersElement = this.element.querySelector('.event__available-offers');
    if(availableOffersElement){
      availableOffersElement.addEventListener('click', this.#availableOffersClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('change', this.#basePriceChangeHandler);

    const elements = this.element.querySelectorAll('.event__type-item');
    elements.forEach((element) => {
      element.addEventListener('click', this.#eventTypeItemClickHandler);
    });
  };

  unsetRollupButtonClickHandler(){
    if(this._callback.rollupButtonClick){
      this.element.querySelector('.event__rollup-btn').removeEventListener('click', this.#rollupButtonClickHandler);
    }
  }

  unsetFormSubmitHandler(){
    if(this._callback.formSubmit){
      this.element.querySelector('.event--edit').removeEventListener('submit', this.#formSubmitHandler);
    }
  }

  #rollupButtonClickHandler = () => {
    this._callback.rollupButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.parseStateToPoint(this._state));
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick(this.parseStateToPoint());
  };

  #destinationInputClickHandler = (evt) => {
    evt.preventDefault();
    const index = document.querySelector('.event__input--destination').value;
    this.updateElement({
      destination: index
    });
  };

  #availableOffersClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT'){
      const targetId = Number(evt.target.id[evt.target.id.length - 1]);
      const offers = [...this._state.offers];

      if(offers.includes(targetId)){
        const index = this._state.offers.indexOf(targetId);

        if(index !== -1){
          offers.splice(index, 1);
        }
      }
      else{
        offers.push(targetId);
        offers.sort();
      }
      this._setState({
        offers: offers
      });
    }
  };

  #basePriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
  };

  #eventTypeItemClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.textContent.toLowerCase(),
      offers: []
    });
  };

  _restoreHandlers = () => {
    this.setInnerHandlers();
    if(!this.#isAddView){
      this.setRollupButtonClickHandler();
    }
    this.setFormSubmitHandler();
    this.setDeleteButtonClickHandler();
    this.#setDatepickers();
  };
}
