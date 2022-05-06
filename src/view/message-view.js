import {createElement} from '../render.js';

const messageTemplate = () => `
  <p class="trip-events__msg">Click New Event to create your first point</p>
`;

export default class MessageView{
  #element = null;

  get template(){
    return messageTemplate();
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
