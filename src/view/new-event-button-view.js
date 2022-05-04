import {createElement} from '../render.js';

const newEventButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewEventButtonView{
  #element = null;

  get template(){
    return newEventButtonTemplate();
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
