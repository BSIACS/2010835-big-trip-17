import Observable from '../framework/observable.js';

export default class NewEventButtonModelModel extends Observable {
  #isPressed = null;

  constructor(){
    super();
    this.#isPressed = false;
  }

  get isPressed() {
    return this.#isPressed;
  }

  set isPressed(value){
    this.#isPressed = value;
    this._notify(this.#isPressed);
  }
}
