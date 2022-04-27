import {createElement} from '../render.js';

const newEventButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewEventButtonView{
  getTemplate(){
    return newEventButtonTemplate();
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
