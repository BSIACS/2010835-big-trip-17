import {createElement} from '../render.js';

const tripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventsListView{
  getTemplate(){
    return tripEventsListTemplate();
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
