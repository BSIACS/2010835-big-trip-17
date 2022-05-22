import { SortKeys } from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const sortTemplate = () => `
<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort="day" checked>
    <label class="trip-sort__btn" for="sort-day" data-sort="day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort="time">
    <label class="trip-sort__btn" for="sort-time" data-sort="time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort="price">
    <label class="trip-sort__btn" for="sort-price" data-sort="price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`;

export default class SortView extends AbstractView{
  #tripSortInputs = null;

  constructor(){
    super();
    this.#tripSortInputs = this.element.querySelectorAll('.trip-sort__input');
  }

  get template(){
    return sortTemplate();
  }

  setSortButtonClickHandler = (callback) => {
    this._callback.sortButtonClick = callback;
    this.element.addEventListener('click', this.#sortButtonClickHandler);
  };

  #sortButtonClickHandler = (evt) => {
    evt.preventDefault();

    if(!evt.target.tagName === 'LABEL'){
      return;
    }

    this.#setSelectedInputChecked(evt.target.dataset.sort);
    this._callback.sortButtonClick(evt.target.dataset.sort);
  };

  #setSelectedInputChecked = (sortKey) => {
    if(Object.values(SortKeys).includes(sortKey)){
      this.#tripSortInputs.forEach((input) => {
        if(input.dataset.sort === sortKey){
          input.checked = true;
        }
      });
    }
  };
}
