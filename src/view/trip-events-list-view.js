import {createElement} from '../render.js';

const tripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventsListView{
  #element = null;

  get template(){
    return tripEventsListTemplate();
  }

  get element(){
    if(this.#element){
      return this.#element;
    }

    return (this.#element = createElement(this.template));
  }

  removeElement(){
    this.#element = null;
  }
}
